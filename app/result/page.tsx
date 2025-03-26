// 'use client'

import Image from 'next/image';

type Props = Readonly<{
  searchParams: Promise<{
    t: string;
  }>;
}>;

export default async function ({ searchParams }: Props) {
  const search = await searchParams;
  const { t } = search;

  const pic = t === 'su' ? `/result/0${Math.floor(Math.random() * 5) + 1}.png` : `/fail/0${Math.floor(Math.random() * 5) + 1}.png`;

  if (t === 'su') {
    return (
      <div className="mt-10 flex justify-center">
        <div className="flex flex-col">
          <span className="mb-2 text-center text-9xl">SUCCESS!</span>
          <Image src={pic} width={400} height={400} alt="suc-img" />
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10 flex justify-center">
      <div className="flex flex-col">
        <span className="mb-2 text-center text-9xl">FAIL!</span>
        <Image src={pic} width={400} height={400} alt="suc-img" />
      </div>
    </div>
  );
}
