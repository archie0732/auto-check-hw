'use client'

import { useState, useEffect, useRef } from 'react';
import { QuestionDetailAPI, QuestionDetailData } from '../api/_model/apitype';

export default function CommandPage() {
  const [command, setCommand] = useState('');
  const [output, setOutput] = useState<string[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const findDifferences = (str1: string, str2: string): string[] => {
    const differences: string[] = [];
    const maxLength = Math.max(str1.length, str2.length);
    
    for (let i = 0; i < maxLength; i++) {
      if (str1[i] !== str2[i]) {
        const start = Math.max(0, i - 10);
        const end = Math.min(maxLength, i + 10);
        differences.push(
          '----------------------------------------',
          `Position ${i}:`,
          `Expected: ...${str1.slice(start, end)}...`,
          `Got:      ...${str2.slice(start, end)}...`,
          '----------------------------------------'
        );
        break;
      }
    }
    
    return differences;
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmedCommand = command.trim();
      
      if (!isAuthenticated) {
        if (trimmedCommand === 'archie') {
          setIsAuthenticated(true);
          setOutput(prev => [...prev, '> ' + trimmedCommand, 'Authentication successful']);
        } else {
          setOutput(prev => [...prev, '> ' + trimmedCommand, 'Please authenticate with password']);
        }
      } else {
        setOutput(prev => [...prev, '> ' + trimmedCommand]);
        
        if (trimmedCommand.startsWith('gethw ')) {
          const hwNumber = trimmedCommand.split(' ')[1];
          if (!hwNumber) {
            setOutput(prev => [...prev, 'Error: Please specify homework number']);
            return;
          }

          try {
            const response = await fetch(`/api/md/${hwNumber}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });

            // 檢查響應狀態
            if (!response.ok) {
              const errorText = await response.text();
              setOutput(prev => [...prev, `Error: HTTP ${response.status} - ${errorText}`]);
              return;
            }

            // 嘗試解析 JSON
            let data;
            try {
              data = await response.json() as QuestionDetailData;
              
            } catch (parseError) {
              setOutput(prev => [...prev, 'Error: Invalid JSON response from server']);
              return;
            }

            if (!data || !data.detail.check_output) {
              setOutput(prev => [...prev, 'Error: No check_output in response']);
              return;
            }

            setOutput(prev => [...prev, JSON.stringify(data.detail.check_output)]);
          } catch (err) {
            setOutput(prev => [...prev, `Error: ${err instanceof Error ? err.message : 'An error occurred'}`]);
          }
        } else if (trimmedCommand.startsWith('comp ')) {
          const [_, hwNumber, token] = trimmedCommand.split(' ');
          if (!hwNumber || !token) {
            setOutput(prev => [...prev, 'Error: Please provide both homework number and token']);
            return;
          }

          try {
            // 獲取作業的 check_output
            const response = await fetch(`/api/md/${hwNumber}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });

            if (!response.ok) {
              const errorText = await response.text();
              setOutput(prev => [...prev, `Error: HTTP ${response.status} - ${errorText}`]);
              return;
            }

            const data = await response.json() as QuestionDetailData;
            const checkOutput = JSON.stringify(data.detail.check_output);

            // 解碼 token
            let decodedToken;
            try {
              const buffer = Buffer.from(token, 'base64');
              decodedToken = buffer.toString('utf8');
            } catch (decodeError) {
              setOutput(prev => [...prev, 'Error: Invalid base64 token']);
              return;
            }

            // 比較結果
            const isMatch = decodedToken === checkOutput;
            setOutput(prev => [
              ...prev,
              'Token:',
              decodedToken,
              'Check Output:',
              checkOutput,
              `Result: ${isMatch ? '✅ Match' : '❌ Not Match'}`
            ]);

            // 如果不匹配，顯示差異
            if (!isMatch) {
              const differences = findDifferences(checkOutput, decodedToken);
              setOutput(prev => [...prev, 'Differences:', ...differences]);
            }
          } catch (err) {
            setOutput(prev => [...prev, `Error: ${err instanceof Error ? err.message : 'An error occurred'}`]);
          }
        } else if (trimmedCommand === 'clear') {
          setOutput([]);
        } else if (trimmedCommand === 'help') {
          setOutput(prev => [...prev, 
            'Available commands:',
            '  gethw <hw_number> - Get check_output for specified homework',
            '  comp <hw_number> <token> - Compare homework check_output with base64 token',
            '  clear - Clear the console',
            '  help - Show this help message'
          ]);
        } else {
          setOutput(prev => [...prev, 'Unknown command. Type "help" for available commands']);
        }
      }
      
      setCommand('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-green-400 p-4 font-mono">
      <div className="max-w-3xl mx-auto">
        <div className="mb-4">
          {output.map((line, index) => (
            <div key={index} className="whitespace-pre-wrap">{line}</div>
          ))}
        </div>
        <div className="flex items-center">
          <span className="mr-2">{'>'}</span>
          <input
            ref={inputRef}
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-transparent border-none outline-none flex-1 text-green-400"
            placeholder={isAuthenticated ? "Type command..." : "Enter password to authenticate"}
          />
        </div>
      </div>
    </div>
  );
}
