import { NextRequest } from 'next/server';
import { existsSync, readFileSync } from 'fs';
import { join, resolve } from 'path';
import { QuestionDetailAPI } from '../../_model/apitype';
import axios from 'axios';
import { GitHubFileResponse } from '../../anno/_model/apitype';

type Params = Readonly<{
  params: Promise<{ slug: string }>;
}>;

function getFile(slug: string) {
  const dataFolder = resolve('data', slug);

  if (!existsSync(dataFolder)) {
    return null;
  }

  const content = readFileSync(join(dataFolder, 'readme.md'), 'utf-8');
  const detail = JSON.parse(readFileSync(join(dataFolder, 'info.json'), 'utf-8')) as QuestionDetailAPI;
  detail.slug = slug;
  detail.url = `/hw/${slug}`;
  return { content, detail };
}

export async function GET(req: NextRequest, { params }: Params) {
  const slug = (await params).slug;

  const content = await fetchGithubMD(slug);
  const detail = await fetchGithubInfo(slug);

  // const data = getFile(slug);

  if (!content || !detail) {
    return Response.json('data not found', { status: 404 });
  }

  return Response.json({ content, detail }, { status: 200 });
}

const fetchGithubMD = async (slug: string) => {
  const url = `https://api.github.com/repos/${process.env.OWNER}/${process.env.REPO}/contents/data/auto-check/${slug}/readme.md`;

  console.log('url: ', url);
  try {
    const { data } = await axios.get<GitHubFileResponse>(url, {
      headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` },
    });

    const rowContent = data.content.replace(/\n/g, '');
    const rowstring = Buffer.from(rowContent, 'base64').toString('utf-8');

    return rowstring;
  }
  catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status == 404) {
      return null;
    }

    throw error;
  }
};

const fetchGithubInfo = async (slug: string) => {
  const url = `https://api.github.com/repos/${process.env.OWNER}/${process.env.REPO}/contents/data/auto-check/${slug}/info.json`;

  console.log('url: ', url);
  try {
    const { data } = await axios.get<GitHubFileResponse>(url, {
      headers: { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` },
    });

    const rowContent = data.content.replace(/\n/g, '');
    const rowstring = Buffer.from(rowContent, 'base64').toString('utf-8');
    const decodedContent = JSON.parse(rowstring) as QuestionDetailAPI;

    return decodedContent;
  }
  catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status == 404) {
      return { content: null, sha: null };
    }

    throw error;
  }
};

void getFile;
