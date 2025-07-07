import { createGitHubAPI } from '@/lib/github';

export async function POST(request: Request) {
  try {
    const { action, path, content, message, branch } = await request.json();
    
    const github = createGitHubAPI();
    
    switch (action) {
      case 'updateFile':
        const result = await github.updateFile(path, content, message, branch);
        return Response.json({ success: true, data: result });
        
      case 'getFile':
        const fileContent = await github.getFile(path, branch);
        return Response.json({ success: true, data: fileContent });
        
      case 'createBranch':
        const branchResult = await github.createBranch(path, branch);
        return Response.json({ success: true, data: branchResult });
        
      default:
        return Response.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('GitHub API error:', error);
    return Response.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const github = createGitHubAPI();
    const repoInfo = await github.getRepo();
    return Response.json({ success: true, data: repoInfo });
  } catch (error) {
    console.error('GitHub API error:', error);
    return Response.json({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
} 