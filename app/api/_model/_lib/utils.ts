import { GitHubFileResponse } from '@/app/api/anno/_model/apitype';
import axios from 'axios';
import type { AutoCheckAPI } from '../apitype';

export const fetchRemoteData = async (FILE_PATH: string) => {
  const url = `https://api.github.com/repos/${process.env.OWNER}/${process.env.REPO}/contents/${FILE_PATH}`;

  console.log('url: ', url);
  try {
    const { data } = await axios.get<GitHubFileResponse>(url, {
      headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` },
    });

    const rowContent = data.content.replace(/\n/g, '');
    const rowstring = Buffer.from(rowContent, 'base64').toString('utf-8');
    const decodedContent = JSON.parse(rowstring) as AutoCheckAPI;

    return { content: decodedContent, sha: data.sha };
  }
  catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status == 404) {
      return { content: null, sha: null };
    }

    throw error;
  }
};

export async function updateGitHubFile(content: string, sha: string | null, FILE_PATH: string): Promise<void> {
  try {
    await axios.put(
      `https://api.github.com/repos/${process.env.OWNER}/${process.env.REPO}/contents/${FILE_PATH}`,
      {
        message: `${Date.now()} update favorite.json`,
        content: Buffer.from(content).toString('base64'),
        sha: sha ?? undefined,
        branch: 'main',
      },
      {
        headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` },
      },
    );

    console.log('sucess sync to  GitHub。');
  }
  catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('GitHub API error:', error.response?.data || error.message);
    }
    else {
      console.error('unknow error:', error);
    }
  }
}
