import { NextRequest } from 'next/server';
import { existsSync, readFileSync } from 'fs';
import { join, resolve } from 'path';
import { QuestionDetailAPI } from '../../_model/apitype';

type Params = Readonly<{
  params: Promise<{ slug: string }>;
}>;

export function getFile(slug: string) {
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

  const data = getFile(slug);

  if (data == null) {
    return Response.json('data not found', { status: 404 });
  }

  return Response.json(data, { status: 200 });
}
