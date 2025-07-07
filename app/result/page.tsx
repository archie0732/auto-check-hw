'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function ResultPage({ searchParams }: { searchParams: Promise<{ t: string; token?: string }> }) {
  const [getToken, setGetToken] = useState('');
  const [decodedToken, setDecodedToken] = useState('');
  const [error, setError] = useState('');
  const [t, setT] = useState('');
  const [pic, setPic] = useState('/result/01.png'); // 預設圖片

  useEffect(() => {
    const getSearchParams = async () => {
      const params = await searchParams;
      setT(params.t);
      // 從 URL 中提取 token= 後面的所有內容
      const url = window.location.href;
      const tokenIndex = url.indexOf('token=');
      if (tokenIndex !== -1) {
        const fullToken = url.substring(tokenIndex + 6); // 6 是 'token=' 的長度
        setGetToken(fullToken);
        // 解碼 token
        try {
          const decoded = Buffer.from(fullToken, 'base64').toString('utf-8');
          setDecodedToken(decoded);
        } catch (e) {
          setError('Failed to decode token');
        }
      }
    };
    getSearchParams();
  }, [searchParams]);

  // 初始化時隨機選擇圖片
  useEffect(() => {
    const randomPic = t === 'su' ? `/result/0${Math.floor(Math.random() * 5) + 1}.png` : `/fail/0${Math.floor(Math.random() * 5) + 1}.png`;
    setPic(randomPic);
  }, [t]);

  const handleCopy = () => {
    navigator.clipboard.writeText(getToken)
      .catch(() => setError('Failed to copy token'));
  };

  const handleDownloadUrl = () => {
    const url = window.location.href;
    const blob = new Blob([url], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'url.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="mt-10 flex flex-col items-center">
      <div className="flex flex-col items-center">
        <span className="mb-2 text-center text-9xl">
          {t === 'su' ? 'SUCCESS!' : 'FAIL!'}
        </span>
        {pic && <Image src={pic} width={400} height={400} alt="suc-img" />}
      </div>

      <div className="mt-6 p-4 bg-gray-900 text-white rounded-lg w-96 font-mono">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg">Token Info</h3>
            <button
              onClick={handleDownloadUrl}
              className="px-2 py-1 text-xs bg-blue-700 rounded hover:bg-blue-600 focus:outline-none"
            >
              下載網址
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm text-gray-400">Token:</label>
                <button
                  onClick={handleCopy}
                  className="px-2 py-1 text-xs bg-gray-700 rounded hover:bg-gray-600 focus:outline-none"
                >
                  複製
                </button>
              </div>
              <input
                type="text"
                value={getToken}
                disabled
                className="w-full px-2 py-1 bg-gray-800 rounded border border-gray-700 text-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-400">Decoded Result:</label>
              <div className="w-full px-2 py-1 bg-gray-800 rounded border border-gray-700 text-gray-400">
                {decodedToken}
              </div>
            </div>
          </div>
        </div>
        {error && (
          <div className="text-red-500 mb-2 text-sm">
            <span className="text-gray-400">Error:</span> {error}
          </div>
        )}
      </div>
    </div>
  );
}
