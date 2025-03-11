import { fetchRemoteData, updateGitHubFile } from '@/app/api/_model/_lib/utils';
import { NextRequest } from 'next/server';

type Params = Readonly<{
  params: Promise<{ id: string }>;
}>;
export const POST = async (req: NextRequest, { params }: Params) => {
  const id = (await params).id;
  const edit = await req.json() as { type: 'name' | 'intro' | 'avatar' | 'hw'; uploadData: string; hw?: number };

  if (!edit.type) {
    return Response.json('lost some params', { status: 400, statusText: 'lost some params' });
  }
  const { content, sha } = (await fetchRemoteData('data/auto-check.json'));
  if (!content) {
    return Response.json('fetch remote data fail', { status: 500, statusText: 'fetch remote data fail' });
  }

  const student = content.student.find((students) => students.id === id);

  if (!student) {
    return Response.json('cannot find this student id in list', { status: 500, statusText: 'cannot find student id inm list' });
  }

  if (edit.type === 'hw' && typeof edit.hw === 'number') {
    student.hw[edit.hw] = '1';
  }
  else if (edit.type === 'hw') {
    return Response.json('request params fail', { status: 400, statusText: 'request params fail' });
  }
  else {
    student[edit.type] = edit.uploadData;
  }

  await updateGitHubFile(JSON.stringify(content, null, 2), sha, 'data/auto-check.json');

  return Response.json('update profile success!', { status: 200 });
};
