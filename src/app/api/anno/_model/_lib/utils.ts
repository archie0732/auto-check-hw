import axios from 'axios';
import { Annonument, GitHubFileResponse } from '../apitype';

export const fetchRemoteData = async (FILE_PATH: string) => {
  const url = `https://api.github.com/repos/${process.env.OWNER}/${process.env.REPO}/contents/${FILE_PATH}`;

  console.log('url: ', url);
  try {
    const { data } = await axios.get<GitHubFileResponse>(url, {
      headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` },
    });

    const rowContent = data.content.replace(/\n/g, '');
    const rowstring = Buffer.from(rowContent, 'base64').toString('utf-8');
    console.log(rowstring);

    const decodedContent = JSON.parse(rowstring) as Annonument;

    return { content: decodedContent, sha: data.sha };
  }
  catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status == 404) {
      return { content: null, sha: null };
    }

    throw error;
  }
};
