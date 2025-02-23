import { NextRequest } from 'next/server';
import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

export async function POST(req: NextRequest) {
  const res = await req.json() as { md: string };

  if (!existsSync(resolve('data', `${res.md}.md`))) {
    return Response.json('cannot find the data path', { status: 400 });
  }

  const data = readFileSync(resolve('data', `${res.md}.md`), 'utf-8');

  return Response.json({ content: data }, { status: 200 });
}
