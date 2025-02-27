import { NextRequest } from 'next/server';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import { QuestionDetailAPI } from '../../_model/apitype';

type Params = Readonly<{
  params: Promise<{ id: string }>;
}>;

export async function GET(req: NextRequest, { params }: Params) {
  const id = (await params).id;

  if (!existsSync(resolve('data', `${id}.md`))) {
    return Response.json('cannot find the data path', { status: 400 });
  }

  const markdownData = readFileSync(resolve('data', `${id}.md`), 'utf-8');
  const detail = JSON.parse(readFileSync(resolve('data', `${id}.json`), 'utf-8')) as QuestionDetailAPI;

  return Response.json({ content: markdownData, detail }, { status: 200 });
}
