import { NextRequest } from "next/server";
import { 
  createSuccessResponse, 
  createBadRequestResponse, 
  createInternalErrorResponse 
} from "@/lib/api-utils";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'leetcode' or 'codeforce'
    const { id: problemId } = await params;
    
    if (!type || (type !== 'leetcode' && type !== 'codeforce')) {
      return createBadRequestResponse('Invalid type parameter. Must be "leetcode" or "codeforce"');
    }

    if (!problemId) {
      return createBadRequestResponse('Problem ID is required');
    }

    // Create GitHub API instance for the target repository
    const github = new (await import('@/lib/github')).GitHubAPI({
      token: process.env.AUTOCHECKAPI_GITHUB!,
      owner: 'archie0732',
      repo: '2025-icpc-practice'
    });

    // Construct the path to the README.md file
    const readmePath = `${type}/${problemId}/readme.md`;
    
    try {
      // Get the README.md file content
      const fileContent = await github.getFile(readmePath);
      
      // Decode the base64 content
      const decodedContent = Buffer.from(fileContent.content, 'base64').toString('utf-8');
      
      return createSuccessResponse({
        type,
        problemId,
        content: decodedContent,
        sha: fileContent.sha,
        path: readmePath
      });
      
    } catch (fileError) {
      // If README.md doesn't exist, try README.md (case insensitive)
      try {
        const alternativePath = `${type}/${problemId}/README.md`;
        const fileContent = await github.getFile(alternativePath);
        const decodedContent = Buffer.from(fileContent.content, 'base64').toString('utf-8');
        
        return createSuccessResponse({
          type,
          problemId,
          content: decodedContent,
          sha: fileContent.sha,
          path: alternativePath
        });
      } catch (altError) {
        return createBadRequestResponse(`README.md not found for problem ${problemId} in ${type}`);
      }
    }

  } catch (error) {
    return createInternalErrorResponse(error);
  }
}
