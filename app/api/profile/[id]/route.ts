import { NextRequest } from 'next/server';
import { createGitHubAPI } from '@/lib/github';
import { 
  createSuccessResponse, 
  createNotFoundResponse, 
  createInternalErrorResponse,
  validateEnvVars 
} from '@/lib/api-utils';

interface Student {
  id: string;
  name: string;
}

interface ProfileData {
  student: Student[];
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const missingVars = validateEnvVars(['AUTOCHECKAPI_GITHUB', 'GITHUB_REPO_OWNER', 'GITHUB_REPO_NAME']);
    if (missingVars.length > 0) {
      return createInternalErrorResponse(
        new Error(`Missing environment variables: ${missingVars.join(', ')}`)
      );
    }

    const { id } = await params;
    const github = createGitHubAPI();

    try {
      const fileData = await github.getFile('user/profile.json');
      const content = Buffer.from(fileData.content, 'base64').toString('utf-8');
      const profileData = JSON.parse(content) as ProfileData;

      const student = profileData.student.find((students: Student) => students.id === id);

      if (!student) {
        return createNotFoundResponse('Cannot find the student in list');
      }

      return createSuccessResponse({ student });
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return createNotFoundResponse('Profile data not found');
      }
      throw error;
    }
  } catch (error) {
    return createInternalErrorResponse(error);
  }
}

export interface ProfileResponse {
  success: boolean;
  data: {
      id: string;
      intro: string;
      avatar: string;
      hw: string[];
    name: string;
    root: boolean;
  }
}