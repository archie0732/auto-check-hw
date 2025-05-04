'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

type Props = Readonly<{
  searchParams: Promise<{
    t: string;
    token?: string;
  }>;
}>;

export default function ({ searchParams }: Props) {
  const [showConsole, setShowConsole] = useState(false);
  const [getToken, setGetToken] = useState('');
  const [decodedToken, setDecodedToken] = useState('');
  const [error, setError] = useState('');
  const [t, setT] = useState('');
  const [command, setCommand] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pic, setPic] = useState('/result/01.png'); // 設置默認圖片

  useEffect(() => {
    const getUrlToken = async () => {
      const search = await searchParams;
      setT(search.t);
      // 從 URL 中提取 token= 後面的所有內容
      const url = window.location.href;
      const tokenIndex = url.indexOf('token=');
      if (tokenIndex !== -1) {
        const fullToken = url.substring(tokenIndex + 6); // 6 是 'token=' 的長度
        setGetToken(fullToken);
        // 解碼 token
        try {
          // 使用 Buffer.from 將 base64 轉換為 UTF-8
          const decoded = Buffer.from(fullToken, 'base64').toString('utf-8');
          setDecodedToken(decoded);
        }
        catch (e) {
          void e;
          setError('Failed to decode token');
        }
      }
    };
    void getUrlToken();
  }, [searchParams]);

  // 單獨的 useEffect 處理 ESC 鍵事件
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowConsole((prev) => !prev);
      }
    };

    // 確保在客戶端環境下添加事件監聽器
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, []); // 空依賴數組，只在組件掛載和卸載時執行

  // 初始化時隨機選擇圖片
  useEffect(() => {
    const randomPic = t === 'su' ? `/result/0${Math.floor(Math.random() * 5) + 1}.png` : `/fail/0${Math.floor(Math.random() * 5) + 1}.png`;
    setPic(randomPic);
  }, [t]); // 只在 t 值改變時重新選擇圖片

  const handleAuthenticate = () => {
    if (command === 'gettoken' && password === 'archie') {
      setIsAuthenticated(true);
    }
    else {
      setError('Invalid command or password');
      setIsAuthenticated(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getToken)
      .then(() => {
        const copyButton = document.getElementById('copyButton');
        if (copyButton) {
          copyButton.textContent = 'Copied!';
          setTimeout(() => {
            copyButton.textContent = 'Copy';
          }, 2000);
        }
      })
      .catch((err) => {
        void err;
        setError('Failed to copy token');
      });
  };

  return (
    <div className="mt-10 flex flex-col items-center">
      <div className="flex flex-col items-center">
        <span className="mb-2 text-center text-9xl">
          {t === 'su' ? 'SUCCESS!' : 'FAIL!'}
        </span>
        {pic && <Image src={pic} width={400} height={400} alt="suc-img" />}
      </div>

      {showConsole && (
        <div className="mt-4 p-4 bg-gray-900 text-white rounded-lg w-96 font-mono">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg">Debug Console</h3>
              <span className="text-xs text-gray-400">Press ESC to toggle</span>
            </div>
            {!isAuthenticated
              ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-1 text-gray-400">Command:</label>
                    <input
                      type="text"
                      value={command}
                      onChange={(e) => setCommand(e.target.value)}
                      className="w-full px-2 py-1 bg-gray-800 rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
                      placeholder="Enter command..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1 text-gray-400">Password:</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-2 py-1 bg-gray-800 rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
                      placeholder="Enter password..."
                    />
                  </div>
                  <button
                    onClick={handleAuthenticate}
                    className="w-full px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 focus:outline-none"
                  >
                    Authenticate
                  </button>
                </div>
              )
              : (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-sm text-gray-400">Token:</label>
                      <button
                        id="copyButton"
                        onClick={handleCopy}
                        className="px-2 py-1 text-xs bg-gray-700 rounded hover:bg-gray-600 focus:outline-none"
                      >
                        Copy
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
              )}
          </div>

          {error && (
            <div className="text-red-500 mb-2 text-sm">
              <span className="text-gray-400">Error:</span> {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
