import { createGitHubAPI } from "@/lib/github";
import { 
  createSuccessResponse, 
  createNotFoundResponse, 
  createInternalErrorResponse,
  validateEnvVars 
} from "@/lib/api-utils";

export async function GET() {
  try {
    const missingVars = validateEnvVars(['AUTOCHECKAPI_GITHUB', 'GITHUB_REPO_OWNER', 'GITHUB_REPO_NAME']);
    if (missingVars.length > 0) {
      return createInternalErrorResponse(
        new Error(`Missing environment variables: ${missingVars.join(', ')}`)
      );
    }

    const github = createGitHubAPI();
    
    try {
      const fileData = await github.getFile('notification.json');
      
      const content = Buffer.from(fileData.content, 'base64').toString('utf-8');
      const decodedContent = JSON.parse(content);

      return createSuccessResponse({
        decodedContent,
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return createNotFoundResponse('File not found or fetch failed');
      }
      throw error;
    }
  } catch (error) {
    return createInternalErrorResponse(error);
  }
}

export interface NotificationAPI {
  general:{
    title: string;
    link: string;
    description: string;
    time: string;
  }[]
}