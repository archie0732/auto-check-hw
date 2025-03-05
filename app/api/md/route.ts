import { NextRequest } from 'next/server';
import { existsSync, readdirSync, readFileSync } from 'fs';
import { join, resolve } from 'path';
import { QuestionDetailAPI } from '../_model/apitype';

export function GET(req: NextRequest) {
  let n = Number(req.nextUrl.searchParams.get('n') ?? 20);
  if (Number.isNaN(n) || !Number.isSafeInteger(n)) n = 20;
  n = Math.max(0, Math.min(n, 100));

  let skip = Number(req.nextUrl.searchParams.get('skip'));
  if (Number.isNaN(skip) || !Number.isSafeInteger(skip)) skip = 0;

  const dataPath = resolve('data');
  if (!existsSync(dataPath)) {
    return Response.json('data not found', { status: 404 });
  }

  const folders = readdirSync(dataPath).slice(skip, n);
  const data: QuestionDetailAPI[] = [];

  for (const slug of folders) {
    const infoPath = join(dataPath, slug, 'info.json');
    if (!existsSync(infoPath)) continue;

    const info = JSON.parse(readFileSync(infoPath, 'utf-8')) as QuestionDetailAPI;
    info.slug = slug;
    info.url = `/hw/${slug}`;

    data.push(info);
  }

  return Response.json(data, { status: 200 });
}
