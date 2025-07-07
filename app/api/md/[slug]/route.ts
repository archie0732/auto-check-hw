import { NextRequest } from 'next/server';
import { createGitHubAPI } from '@/lib/github';
import { 
  createSuccessResponse, 
  createNotFoundResponse, 
  createInternalErrorResponse,
  validateEnvVars 
} from '@/lib/api-utils';

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const missingVars = validateEnvVars(['AUTOCHECKAPI_GITHUB', 'GITHUB_REPO_OWNER', 'GITHUB_REPO_NAME']);
    if (missingVars.length > 0) {
      return createInternalErrorResponse(
        new Error(`Missing environment variables: ${missingVars.join(', ')}`)
      );
    }

    const { slug } = await params;
    console.log('🚀 API Request - Slug:', slug);
    console.log('📁 Environment - SEMESTER:', process.env.SEMESTER);
    console.log('🏗️  GitHub Config - Owner:', process.env.GITHUB_REPO_OWNER, 'Repo:', process.env.GITHUB_REPO_NAME);
    
    const github = createGitHubAPI();

    const [content, detail] = await Promise.allSettled([
      fetchGithubMD(github, slug),
      fetchGithubInfo(github, slug)
    ]);

    if (content.status === 'rejected' || detail.status === 'rejected') {
      console.error('Failed to fetch data:', { content: content.status, detail: detail.status });
      return createNotFoundResponse('Data not found');
    }

    if (!content.value || !detail.value) {
      return createNotFoundResponse('Data not found');
    }

    detail.value.slug = slug;
    detail.value.url = `/hw/${slug}`;

    return createSuccessResponse({ content: content.value, detail: detail.value });
  } catch (error) {
    return createInternalErrorResponse(error);
  }
}

const fetchGithubMD = async (github: any, slug: string) => {
  try {
    const path = `hw/${process.env.SEMESTER}/${slug}/readme.md`;
    console.log('🔍 Fetching MD file from path:', path);
    const fileData = await github.getFile(path);
    const content = Buffer.from(fileData.content, 'base64').toString('utf-8');
    console.log('✅ Successfully fetched MD file');
    return content;
  } catch (error) {
    console.log('❌ Failed to fetch MD file:', error);
    if (error instanceof Error && error.message.includes('404')) {
      return null;
    }
    throw error;
  }
};

const fetchGithubInfo = async (github: any, slug: string) => {
  try {
    const path = `hw/${process.env.SEMESTER}/${slug}/info.json`;
    console.log('🔍 Fetching info file from path:', path);
    const fileData = await github.getFile(path);
    const content = Buffer.from(fileData.content, 'base64').toString('utf-8');
    const decodedContent = JSON.parse(content);
    console.log('✅ Successfully fetched info file');
    return decodedContent;
  } catch (error) {
    console.log('❌ Failed to fetch info file:', error);
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
