import { NextRequest } from 'next/server';
import { existsSync, readFileSync } from 'fs';
import { join, resolve } from 'path';
import { QuestionDetailAPI } from '../../_model/apitype';

type Params = Readonly<{
  params: Promise<{ slug: string }>;
}>;

export async function GET(req: NextRequest, { params }: Params) {
  const slug = (await params).slug;

  const dataFolder = resolve('data', slug);

  if (!existsSync(dataFolder)) {
    return Response.json('data not found', { status: 404 });
  }

  const content = readFileSync(join(dataFolder, 'readme.md'), 'utf-8');
  const detail = JSON.parse(readFileSync(join(dataFolder, 'info.json'), 'utf-8')) as QuestionDetailAPI;
  detail.slug = slug;
  detail.url = `/hw/${slug}`;

  return Response.json({ content, detail }, { status: 200 });
}
