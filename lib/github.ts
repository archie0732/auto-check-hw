interface GitHubConfig {
  token: string;
  owner: string;
  repo: string;
}

export class GitHubAPI {
  private config: GitHubConfig;
  private baseURL = 'https://api.github.com';

  constructor(config: GitHubConfig) {
    this.config = config;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Authorization': `token ${this.config.token}`,
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getFile(path: string, branch: string = 'main') {
    const fullUrl = `${this.baseURL}/repos/${this.config.owner}/${this.config.repo}/contents/${path}?ref=${branch}`;
    console.log('🌐 GitHub API Request URL:', fullUrl);
    return this.request(`/repos/${this.config.owner}/${this.config.repo}/contents/${path}?ref=${branch}`);
  }

  async getDirectoryContents(path: string, branch: string = 'main') {
    return this.request(`/repos/${this.config.owner}/${this.config.repo}/contents/${path}?ref=${branch}`);
  }

  async updateFile(path: string, content: string, message: string, branch: string = 'main', sha?: string) {
    const body: any = {
      message,
      content: Buffer.from(content).toString('base64'),
      branch,
    };

    if (sha) {
      body.sha = sha;
    }

    return this.request(`/repos/${this.config.owner}/${this.config.repo}/contents/${path}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async createBranch(newBranch: string, baseBranch: string = 'main') {
    const baseRef = await this.request(`/repos/${this.config.owner}/${this.config.repo}/git/refs/heads/${baseBranch}`);
    
    return this.request(`/repos/${this.config.owner}/${this.config.repo}/git/refs`, {
      method: 'POST',
      body: JSON.stringify({
        ref: `refs/heads/${newBranch}`,
        sha: baseRef.object.sha,
      }),
    });
  }

  async createPullRequest(title: string, body: string, head: string, base: string = 'main') {
    return this.request(`/repos/${this.config.owner}/${this.config.repo}/pulls`, {
      method: 'POST',
      body: JSON.stringify({
        title,
        body,
        head,
        base,
      }),
    });
  }

  async getRepo() {
    return this.request(`/repos/${this.config.owner}/${this.config.repo}`);
  }
}

export function createGitHubAPI() {
  const token = process.env.AUTOCHECKAPI_GITHUB;
  const owner = process.env.GITHUB_REPO_OWNER;
  const repo = process.env.GITHUB_REPO_NAME;

  if (!token || !owner || !repo) {
    throw new Error('Missing GitHub configuration. Please set AUTOCHECKAPI_GITHUB, GITHUB_REPO_OWNER, and GITHUB_REPO_NAME environment variables.');
  }

  return new GitHubAPI({ token, owner, repo });
} 