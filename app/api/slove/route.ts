import { NextRequest } from "next/server";
import { createGitHubAPI } from "@/lib/github";
import { 
  createSuccessResponse, 
  createBadRequestResponse, 
  createInternalErrorResponse 
} from "@/lib/api-utils";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'leetcode' or 'codeforce'
    
    if (!type || (type !== 'leetcode' && type !== 'codeforce')) {
      return createBadRequestResponse('Invalid type parameter. Must be "leetcode" or "codeforce"');
    }

    // Create GitHub API instance for the target repository
    const github = new (await import('@/lib/github')).GitHubAPI({
      token: process.env.AUTOCHECKAPI_GITHUB!,
      owner: 'archie0732',
      repo: '2025-icpc-practice'
    });

    // Get directory contents for the specified type
    const contents = await github.getDirectoryContents(type);
    
    // Filter for directories only and extract folder names
    const folders = contents
      .filter((item: any) => item.type === 'dir')
      .map((item: any) => item.name);

    return createSuccessResponse({
      type,
      folders,
      count: folders.length
    });

  } catch (error) {
    return createInternalErrorResponse(error);
  }
}