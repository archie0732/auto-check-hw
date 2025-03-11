'use client';

import { Button } from '../../components/ui/button';
import { useState } from 'react';

import { AppStore } from '../../store/app';

interface ApiResponse {
  userans?: string;
  error?: string;
  stderr?: string;
}

const code = `#include <iostream> 
              using namespace std; 
              int main() { int x, y; cin >> x >> y; cout << x * y << endl; }`;

export default function Page() {
  const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { setUserID, userID, setAvatar } = AppStore();

  const clickButton = async () => {
    setLoading(true);
    setData(null);
    setError(null);

    try {
      const res = await fetch('/api/cpp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'aaa', code, input: `5 6` }),
      });

      const result = await res.json() as ApiResponse;

      if (!res.ok) {
        setError(result.error ?? result.stderr ?? 'Unknown error');
        return;
      }

      setData(result.userans ?? '');
    }
    catch {
      setError('Network error');
    }
    finally {
      setLoading(false);
    }
  };
  void loading;

  return (
    <div className="flex items-center justify-center gap-2">
      <div className="flex flex-col">
        <Button onClick={() => void clickButton()}>test run cpp</Button>
        {
          loading && (<div>Loading .....</div>)
        }
        {data && (
          <div>
            Output:
            {data}
          </div>
        )}
        {error && (
          <div style={{ color: 'red' }}>
            Error:
            {error}
          </div>
        )}
      </div>

      <div className="flex flex-col">
        {
          userID === 'none' ? (<Button onClick={() => setUserID('archie0732')}>set user</Button>) : <Button onClick={() => setUserID('none')}>clear user</Button>
        }
      </div>

      <div>
        <Button onClick={() => setAvatar('https://i.pinimg.com/550x/76/54/ef/7654efd01209b2189806bc6cc81ed2c3.jpg')}>set avatar</Button>
      </div>
    </div>
  );
}
