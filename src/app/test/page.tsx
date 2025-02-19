'use client';

import { Button } from '@/components/ui/button';
import { useState } from 'react';

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
    <div>
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
  );
}
