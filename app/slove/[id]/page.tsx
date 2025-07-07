'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ArrowLeft,
  Code2,
  Zap,
  FileText,
  AlertCircle,
  ExternalLink,
  Clock,
  User
} from 'lucide-react';
import Link from 'next/link';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface ProblemData {
  type: string;
  problemId: string;
  content: string;
  sha: string;
  path: string;
}

export default function ProblemPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [problemData, setProblemData] = useState<ProblemData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const problemId = params.id as string;
  const type = searchParams.get('type') as 'leetcode' | 'codeforce';

  useEffect(() => {
    if (!problemId || !type) {
      setError('Missing problem ID or type');
      setLoading(false);
      return;
    }

    fetchProblemData();
  }, [problemId, type]);

  const fetchProblemData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/slove/${problemId}?type=${type}`);
      const result = await response.json();

      if (result.success) {
        setProblemData(result.data);
      } else {
        setError(result.error || 'Failed to fetch problem data');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const decodedProblemId = decodeURIComponent(problemId);

  const renderMarkdown = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactElement[] = [];
    let inCodeBlock = false;
    let codeBlockContent: string[] = [];
    let codeBlockLanguage = '';
    let inNoteBlock = false;
    let noteBlockContent: string[] = [];

    // 支援 note/important/tip
    const calloutTypes = [
      { key: 'note', color: 'blue', label: 'NOTE' },
      { key: 'important', color: 'red', label: 'IMPORTANT' },
      { key: 'tip', color: 'green', label: 'TIP' }
    ];

    let calloutType: typeof calloutTypes[number] | null = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Callout block start
      const calloutMatch = line.match(/^>\[!([a-zA-Z]+)\]/);
      if (calloutMatch) {
        const typeKey = calloutMatch[1].toLowerCase();
        calloutType = calloutTypes.find(t => t.key === typeKey) || null;
        if (calloutType) {
          inNoteBlock = true;
          noteBlockContent = [];
          continue;
        }
      }
      if (inNoteBlock && line.startsWith('>')) {
        noteBlockContent.push(line.replace(/^>\s?/, ''));
        continue;
      }
      if (inNoteBlock && !line.startsWith('>')) {
        inNoteBlock = false;
        if (calloutType) {
          elements.push(
            <div
              key={`note-${i}`}
              className={`bg-${calloutType.color}-900/20 border border-${calloutType.color}-500/30 rounded-lg p-4 my-4`}
            >
              <div className="flex items-center space-x-2 mb-2">
                <div className={`w-2 h-2 bg-${calloutType.color}-400 rounded-full`}></div>
                <span className={`text-${calloutType.color}-300 font-medium text-sm`}>
                  {calloutType.label}
                </span>
              </div>
              <div className={`text-${calloutType.color}-100 text-sm`}>
                {noteBlockContent.map((t, idx) => <div key={idx}>{t}</div>)}
              </div>
            </div>
          );
        }
        calloutType = null;
        // 不要忘記這一行還要繼續往下判斷
      }

      // Blockquote 支援
      if (line.startsWith('>') && !line.match(/^>\[!([a-zA-Z]+)\]/)) {
        elements.push(
          <blockquote
            key={`blockquote-${i}`}
            className="border-l-4 border-blue-400 pl-4 italic text-blue-200 my-2"
          >
            {line.replace(/^>\s?/, '')}
          </blockquote>
        );
        continue;
      }

      // Handle code blocks
      if (line.startsWith('```')) {
        if (!inCodeBlock) {
          // Start of code block
          inCodeBlock = true;
          codeBlockLanguage = line.substring(3).trim();
          codeBlockContent = [];
        } else {
          // End of code block
          inCodeBlock = false;
          elements.push(
            <div key={`code-${i}`} className="my-4">
              {codeBlockLanguage && (
                <div className="text-xs text-blue-300 bg-gray-900 px-2 py-1 rounded-t-md border-b border-gray-700 w-fit font-mono mb-0">
                  {codeBlockLanguage}
                </div>
              )}
              <SyntaxHighlighter
                language={codeBlockLanguage || 'text'}
                style={vscDarkPlus}
                customStyle={{
                  borderRadius: codeBlockLanguage ? '0 0 0.5rem 0.5rem' : '0.5rem',
                  margin: 0,
                  fontSize: '1rem',
                  paddingTop: codeBlockLanguage ? 0 : undefined
                }}
              >
                {codeBlockContent.join('\n')}
              </SyntaxHighlighter>
            </div>
          );
        }
        continue;
      }
      if (inCodeBlock) {
        codeBlockContent.push(line);
        continue;
      }

      // Handle images
      const imageMatch = line.match(/!\[([^\]]*)\]\(([^)]+)\)/);
      if (imageMatch) {
        const [, alt, src] = imageMatch;
        elements.push(
          <div key={`img-${i}`} className="my-4">
            <img
              src={src}
              alt={alt}
              className="max-w-full h-auto rounded-lg border border-gray-600"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            {alt && (
              <p className="text-gray-400 text-sm mt-2 text-center">{alt}</p>
            )}
          </div>
        );
        continue;
      }

      // Handle headers
      if (line.startsWith('# ')) {
        elements.push(
          <h1 key={`h1-${i}`} className="text-2xl font-bold text-white mb-4 mt-6">
            {line.substring(2)}
          </h1>
        );
        continue;
      }
      if (line.startsWith('## ')) {
        elements.push(
          <h2 key={`h2-${i}`} className="text-xl font-bold text-white mb-3 mt-5">
            {line.substring(3)}
          </h2>
        );
        continue;
      }
      if (line.startsWith('### ')) {
        elements.push(
          <h3 key={`h3-${i}`} className="text-lg font-bold text-blue-300 mb-2 mt-4">
            {line.substring(4)}
          </h3>
        );
        continue;
      }

      // Handle inline code
      if (line.includes('`')) {
        const parts = line.split('`');
        elements.push(
          <p key={`inline-code-${i}`} className="text-white/80 mb-2">
            {parts.map((part, j) =>
              j % 2 === 0 ? part : <code key={j} className="bg-gray-800 px-1 rounded text-green-300">{part}</code>
            )}
          </p>
        );
        continue;
      }

      // Handle lists
      if (line.startsWith('- ') || line.startsWith('* ')) {
        elements.push(
          <li key={`list-${i}`} className="text-white/80 mb-1 ml-4">
            {line.substring(2)}
          </li>
        );
        continue;
      }

      // Handle numbered lists
      if (line.match(/^\d+\.\s/)) {
        elements.push(
          <li key={`num-list-${i}`} className="text-white/80 mb-1 ml-4">
            {line.replace(/^\d+\.\s/, '')}
          </li>
        );
        continue;
      }

      // Handle links
      if (line.includes('[') && line.includes('](') && line.includes(')')) {
        const linkMatch = line.match(/\[([^\]]+)\]\(([^)]+)\)/);
        if (linkMatch) {
          const [, text, url] = linkMatch;
          elements.push(
            <p key={`link-${i}`} className="text-white/80 mb-2">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                {text}
              </a>
            </p>
          );
          continue;
        }
      }

      // Handle empty lines
      if (line.trim() === '') {
        elements.push(<div key={`empty-${i}`} className="h-2"></div>);
        continue;
      }

      // Regular paragraphs
      elements.push(
        <p key={`p-${i}`} className="text-white/80 mb-2 leading-relaxed">
          {line}
        </p>
      );
    }

    return elements;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20">
        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="mb-6">
            <Skeleton className="h-8 w-48 bg-gray-700" />
          </div>
          <Card className="bg-gray-800/30 border-gray-700">
            <CardHeader>
              <Skeleton className="h-6 w-3/4 bg-gray-700" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full bg-gray-700" />
              <Skeleton className="h-4 w-5/6 bg-gray-700" />
              <Skeleton className="h-4 w-4/5 bg-gray-700" />
              <Skeleton className="h-4 w-full bg-gray-700" />
              <Skeleton className="h-4 w-3/4 bg-gray-700" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20">
        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="mb-6">
            <Link href="/slove">
              <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Problems
              </Button>
            </Link>
          </div>
          <Card className="bg-red-900/20 border-red-500/30">
            <CardContent className="p-6 text-center">
              <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-red-200 mb-2">Error Loading Problem</h2>
              <p className="text-red-100 mb-4">{error}</p>
              <Button onClick={fetchProblemData} variant="outline" className="border-red-500/30 text-red-200 hover:bg-red-500/20">
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!problemData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <Link href="/slove">
            <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Problems
            </Button>
          </Link>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-full ${type === 'leetcode'
                ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                : 'bg-gradient-to-r from-orange-500 to-red-500'
                }`}>
                {type === 'leetcode' ? (
                  <Code2 className="w-6 h-6 text-white" />
                ) : (
                  <Zap className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">
                  {decodedProblemId.charAt(0).toUpperCase() + decodedProblemId.slice(1)}
                </h1>
                <div className="flex items-center space-x-4 mt-2">
                  <div className="flex items-center space-x-2 text-white/60">
                    <FileText className="w-4 h-4" />
                    <span className="text-sm capitalize">{type}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-white/60">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">Problem #{decodedProblemId}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-white/60 text-sm">Repository</p>
                <a
                  href="https://github.com/archie0732/2025-icpc-practice"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white text-sm font-medium hover:underline"
                >
                  archie0732/2025-icpc-practice
                </a>
              </div>
              <ExternalLink className="w-5 h-5 text-white/40" />
            </div>
          </div>
        </div>

        {/* Problem Content */}
        <Card className="bg-gray-800/30 border-gray-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <FileText className="w-5 h-5 text-blue-400" />
              <span>Problem Description</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none">
            <div className="markdown-content">
              {renderMarkdown(problemData.content)}
            </div>
          </CardContent>
        </Card>

        {/* Footer Info */}
        <div className="mt-6 flex items-center justify-between text-sm text-white/50">
          <div className="flex items-center space-x-4">
            <span>SHA: {problemData.sha.substring(0, 8)}...</span>
            <a
              href={`https://github.com/archie0732/2025-icpc-practice/${encodeURIComponent(problemData.type)}/${encodeURIComponent(problemData.problemId)}/readme.md`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline text-blue-300"
            >
              Path: {problemData.path}
            </a>
          </div>
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4" />
            <span>archie0732</span>
          </div>
        </div>
      </div>
    </div>
  );
}
