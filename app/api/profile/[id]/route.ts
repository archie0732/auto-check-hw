import { NextRequest } from 'next/server';
import { fetchRemoteData } from '../../_model/_lib/utils';

type Params = Readonly<{
  params: Promise<{ id: string }>;
}>;
export const GET = async (req: NextRequest, { params }: Params) => {
  const id = (await params).id;
  const { content } = await fetchRemoteData('data/auto-check.json');

  if (!content) {
    return Response.json('fetch remote data fail', { status: 500, statusText: 'fetch remote data fail' });
  }

  const student = content.student.find((students) => students.id === id);

  if (!student) {
    return Response.json('cannot find the student in list', { status: 400, statusText: 'cannot find the student in list' });
  }

  return Response.json({ student });
};
