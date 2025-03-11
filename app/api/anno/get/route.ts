import { fetchRemoteData } from '../../_model/_lib/utils';
import { AnnoGetAPI } from '../_model/apitype';

export const GET = async () => {
  const { content } = await fetchRemoteData('data/auto-check.json');

  if (!content) {
    return Response.json({ conetent: 'fetch data error' }, { status: 500 });
  }

  return Response.json({ yanami: content.annonument } as AnnoGetAPI, { status: 200 });
};
