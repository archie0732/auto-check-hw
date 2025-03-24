import { fetchRemoteData } from '../_model/_lib/utils';

export const GET = async () => {
  const { content } = await fetchRemoteData('data/auto-check.json');

  if (!content) {
    return Response.json({ conetent: 'fetch data error' }, { status: 500 });
  }

  return Response.json({ yannami: content.hw_list }, { status: 200 });
};
