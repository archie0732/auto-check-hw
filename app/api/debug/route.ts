import { createSuccessResponse, createInternalErrorResponse } from "@/lib/api-utils";

export async function GET() {
  try {
    const debugInfo = {
      timestamp: new Date().toISOString(),
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        AUTOCHECKAPI_GITHUB: process.env.AUTOCHECKAPI_GITHUB ? '***SET***' : 'NOT_SET',
        GITHUB_REPO_OWNER: process.env.GITHUB_REPO_OWNER,
        GITHUB_REPO_NAME: process.env.GITHUB_REPO_NAME,
        SEMESTER: process.env.SEMESTER,
        GITHUB_TOKEN: process.env.GITHUB_TOKEN ? '***SET***' : 'NOT_SET',
      },
      github: {
        url: `https://api.github.com/repos/${process.env.GITHUB_REPO_OWNER}/${process.env.GITHUB_REPO_NAME}/contents/hw/${process.env.SEMESTER}`,
        hasToken: !!process.env.AUTOCHECKAPI_GITHUB,
      }
    };

    return createSuccessResponse(debugInfo);
  } catch (error) {
    return createInternalErrorResponse(error);
  }
} 