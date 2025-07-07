import { NextRequest } from 'next/server';
import { createGitHubAPI } from '@/lib/github';
import { 
  createSuccessResponse, 
  createNotFoundResponse, 
  createInternalErrorResponse,
  validateEnvVars 
} from '@/lib/api-utils';

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

    const [content, detail] = await Promise.allSettled([
      fetchGithubMD(github, id),
      fetchGithubInfo(github, id)
    ]);

    if (content.status === 'rejected' || detail.status === 'rejected') {
      console.error('Failed to fetch data:', { content: content.status, detail: detail.status });
      return createNotFoundResponse('Data not found');
    }

    if (!content.value || !detail.value) {
      return createNotFoundResponse('Data not found');
    }

    detail.value.slug = id;
    detail.value.url = `/hw/${id}`;

    return createSuccessResponse({ content: content.value, detail: detail.value });
  } catch (error) {
    return createInternalErrorResponse(error);
  }
}

const fetchGithubMD = async (github: any, slug: string) => {
  try {
    const fileData = await github.getFile(`hw/${process.env.SEMESTER}/${slug}/readme.md`);
    const content = Buffer.from(fileData.content, 'base64').toString('utf-8');
    return content;
  } catch (error) {
    if (error instanceof Error && error.message.includes('404')) {
      return null;
    }
    throw error;
  }
};

const fetchGithubInfo = async (github: any, slug: string) => {
  try {
    const fileData = await github.getFile(`hw/${process.env.SEMESTER}/${slug}/info.json`);
    const content = Buffer.from(fileData.content, 'base64').toString('utf-8');
    const decodedContent = JSON.parse(content);
    return decodedContent;
  } catch (error) {
    if (error instanceof Error && error.message.includes('404')) {
      return null;
    }
    throw error;
  }
};

export interface HwDetailData {
  content: string;
  detail: {
    name: string;
    time: string;
    id: number;
    author: string;
    check_input: string;
    check_output: string;
    slug: string;
    url: string;
  };
}
