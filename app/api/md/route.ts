import { createGitHubAPI } from '@/lib/github';
import { 
  createSuccessResponse, 
  createInternalErrorResponse,
  validateEnvVars 
} from '@/lib/api-utils';

export const GET = async () => {
  try {
    const missingVars = validateEnvVars(['AUTOCHECKAPI_GITHUB', 'GITHUB_REPO_OWNER', 'GITHUB_REPO_NAME', 'SEMESTER']);
    if (missingVars.length > 0) {
      return createInternalErrorResponse(
        new Error(`Missing environment variables: ${missingVars.join(', ')}`)
      );
    }

    const github = createGitHubAPI();
    const semester = process.env.SEMESTER;
    
    const contents = await github.getDirectoryContents(`hw/${semester}`);
    
    const folders = contents.filter((item: any) => item.type === 'dir');
    
    const folderNames = folders.map((folder: any) => folder.name);

    return createSuccessResponse({
      semester: semester,
      hw_list: folderNames,
      count: folderNames.length
    });
  } catch (error) {
    return createInternalErrorResponse(error);
  }
};

export interface HwList {
  semester: string;
  hw_list: string[];
  count: number;
}
