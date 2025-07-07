import { NextRequest } from 'next/server';
import { createGitHubAPI } from '@/lib/github';
import { 
  createSuccessResponse, 
  createBadRequestResponse, 
  createNotFoundResponse,
  createInternalErrorResponse,
  validateEnvVars 
} from '@/lib/api-utils';

interface Student {
  id: string;
  intro: string;
  avatar: string;
  hw: string[];
  name: string;
  root: boolean;
}

interface ProfileData {
  student: Student[];
}

interface AddUserRequest {
  id: string;
  name: string;
}

export async function POST(req: NextRequest) {
  try {
    const missingVars = validateEnvVars(['AUTOCHECKAPI_GITHUB', 'GITHUB_REPO_OWNER', 'GITHUB_REPO_NAME']);
    if (missingVars.length > 0) {
      return createInternalErrorResponse(
        new Error(`Missing environment variables: ${missingVars.join(', ')}`)
      );
    }

    const { id, name } = (await req.json()) as AddUserRequest;

    if (!id || !name) {
      return createBadRequestResponse('Missing required fields: id and name');
    }

    const github = createGitHubAPI();

    try {
      const fileData = await github.getFile('user/profile.json');
      const content = Buffer.from(fileData.content, 'base64').toString('utf-8');
      const profileData = JSON.parse(content) as ProfileData;

      const existingStudent = profileData.student.find((student: Student) => student.id === id);
      if (existingStudent) {
        return createBadRequestResponse('Student ID already exists');
      }

      const newStudent: Student = {
        id: id,
        intro: "",
        avatar: "https://t3.ftcdn.net/jpg/03/53/11/00/360_F_353110097_nbpmfn9iHlxef4EDIhXB1tdTD0lcWhG9.jpg",
        hw: [
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          ""
        ],
        name: name,
        root: false
      };

      profileData.student.push(newStudent);

      const updatedContent = JSON.stringify(profileData, null, 2);
      await github.updateFile(
        'user/profile.json',
        updatedContent,
        `Add new user: ${name} (${id})`,
        'main',
        fileData.sha
      );

      return createSuccessResponse({
        message: 'User added successfully',
        student: newStudent
      });

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

export interface AddUserResponse {
  success: boolean;
  data: {
    message: string;
    student: Student;
  }
}
