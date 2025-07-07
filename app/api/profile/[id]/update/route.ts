import { NextRequest } from 'next/server';
import { createGitHubAPI } from '@/lib/github';
import { 
  createSuccessResponse, 
  createBadRequestResponse, 
  createNotFoundResponse,
  createInternalErrorResponse,
  validateEnvVars 
} from '@/lib/api-utils';

type Params = Readonly<{
  params: Promise<{ id: string }>;
}>;

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

interface UpdateRequest {
  type: 'name' | 'intro' | 'avatar' | 'hw';
  uploadData: string;
  hw?: number | string; // 允許數字或字符串，因為 JSON 可能將數字轉換為字符串
}

export const POST = async (req: NextRequest, { params }: Params) => {
  try {
    const missingVars = validateEnvVars(['AUTOCHECKAPI_GITHUB', 'GITHUB_REPO_OWNER', 'GITHUB_REPO_NAME']);
    if (missingVars.length > 0) {
      return createInternalErrorResponse(
        new Error(`Missing environment variables: ${missingVars.join(', ')}`)
      );
    }

    const { id } = await params;
    const edit = (await req.json()) as UpdateRequest & { hw?: string[] };
    
    console.log('📝 Received update request:', {
      studentId: id,
      editType: edit.type,
      hwType: typeof edit.hw,
      hwValue: edit.hw,
      uploadData: edit.uploadData
    });

    // 支援批次更新 hw 陣列
    if (Array.isArray(edit.hw)) {
      const github = createGitHubAPI();
      try {
        const fileData = await github.getFile('user/profile.json');
        const content = Buffer.from(fileData.content, 'base64').toString('utf-8');
        const profileData = JSON.parse(content) as ProfileData;
        const student = profileData.student.find((students: Student) => students.id === id);
        if (!student) {
          return createNotFoundResponse('Cannot find this student ID in list');
        }
        student.hw = edit.hw;
        const updatedContent = JSON.stringify(profileData, null, 2);
        await github.updateFile(
          'user/profile.json',
          updatedContent,
          `Batch update hw for user: ${student.name} (${id})`,
          'main',
          fileData.sha
        );
        return createSuccessResponse({
          message: 'Profile updated successfully',
          student: student
        });
      } catch (error) {
        if (error instanceof Error && error.message.includes('404')) {
          return createNotFoundResponse('Profile data not found');
        }
        throw error;
      }
    }

    if (!edit.type) {
      return createBadRequestResponse('Missing required field: type');
    }

    const github = createGitHubAPI();

    try {
      const fileData = await github.getFile('user/profile.json');
      const content = Buffer.from(fileData.content, 'base64').toString('utf-8');
      const profileData = JSON.parse(content) as ProfileData;

      const student = profileData.student.find((students: Student) => students.id === id);

      if (!student) {
        return createNotFoundResponse('Cannot find this student ID in list');
      }

      if (edit.type === 'hw' && (typeof edit.hw === 'number' || typeof edit.hw === 'string')) {
        const hwIndex = typeof edit.hw === 'string' ? parseInt(edit.hw) : edit.hw;
        
        console.log('📝 Updating homework status in GitHub:', {
          studentId: id,
          hwIndex: hwIndex,
          oldValue: student.hw[hwIndex],
          newValue: edit.uploadData,
          hwArray: student.hw
        });
        student.hw[hwIndex] = edit.uploadData;
      }
      else if (edit.type === 'hw') {
        return createBadRequestResponse('Missing hw index parameter');
      }
      else {
        (student as any)[edit.type] = edit.uploadData;
      }

      const updatedContent = JSON.stringify(profileData, null, 2);
      await github.updateFile(
        'user/profile.json',
        updatedContent,
        `Update ${edit.type} for user: ${student.name} (${id})`,
        'main',
        fileData.sha
      );

      return createSuccessResponse({
        message: 'Profile updated successfully',
        student: student
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
};

export interface UpdateProfileResponse {
  success: boolean;
  data: {
    message: string;
    student: Student;
  }
}
