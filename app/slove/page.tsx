'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { Skeleton } from '@/components/ui/skeleton';
import {
  Code2,
  Zap,
  ExternalLink,
  FolderOpen,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

interface ProblemData {
  type: string;
  folders: string[];
  count: number;
}

export default function SlovePage() {
  const [leetcodeData, setLeetcodeData] = useState<ProblemData | null>(null);
  const [codeforceData, setCodeforceData] = useState<ProblemData | null>(null);
  const [loading, setLoading] = useState({ leetcode: false, codeforce: false });
  const [error, setError] = useState<string | null>(null);

  const fetchProblems = async (type: 'leetcode' | 'codeforce') => {
    setLoading(prev => ({ ...prev, [type]: true }));
    setError(null);

    try {
      const response = await fetch(`/api/slove?type=${type}`);
      const result = await response.json();

      if (result.success) {
        if (type === 'leetcode') {
          setLeetcodeData(result.data);
        } else {
          setCodeforceData(result.data);
        }
      } else {
        setError(result.error || 'Failed to fetch data');
      }
    } catch (err) {
      setError('Network error occurred');
    } finally {
      setLoading(prev => ({ ...prev, [type]: false }));
    }
  };

  useEffect(() => {
    fetchProblems('leetcode');
    fetchProblems('codeforce');
  }, []);

  const ProblemCard = ({
    title,
    count,
    icon: Icon,
    color,
    gradient,
    href
  }: {
    title: string;
    count: number;
    icon: any;
    color: string;
    gradient: string;
    href: string;
  }) => (
    <Card className={`relative overflow-hidden transition-all duration-300 hover:scale-105 group cursor-pointer ${gradient}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <CardHeader className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${color} bg-opacity-20 backdrop-blur-sm`}>
              <Icon className={`w-6 h-6 ${color}`} />
            </div>
            <CardTitle className="text-xl font-bold text-white">{title}</CardTitle>
          </div>
          <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-white/10 text-white border-white/20">
            {count} problems
          </div>
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="flex items-center justify-between">
          <p className="text-white/70 text-sm">
            Browse and solve {title.toLowerCase()} problems
          </p>
          <ExternalLink className="w-4 h-4 text-white/50 group-hover:text-white transition-colors" />
        </div>
      </CardContent>
    </Card>
  );

  const ProblemList = ({
    data,
    isLoading,
    type
  }: {
    data: ProblemData | null;
    isLoading: boolean;
    type: 'leetcode' | 'codeforce';
  }) => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-4">
                <Skeleton className="h-4 w-3/4 mb-2 bg-gray-600" />
                <Skeleton className="h-3 w-1/2 bg-gray-600" />
              </CardContent>
            </Card>
          ))}
        </div>
      );
    }

    if (!data) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <p className="text-white/70">Failed to load {type} problems</p>
            <Button
              onClick={() => fetchProblems(type)}
              variant="outline"
              className="mt-4 border-white/20 text-white hover:bg-white/10"
            >
              Retry
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <CheckCircle2 className="w-5 h-5 text-green-400" />
            <span className="text-white font-medium">
              {data.count} problems available
            </span>
          </div>
          <Button
            onClick={() => fetchProblems(type)}
            variant="ghost"
            size="sm"
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            <Zap className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.folders.map((folder, index) => (
            <Link key={folder} href={`/slove/${folder}?type=${type}`}>
              <Card
                className="group cursor-pointer bg-gray-800/30 border-gray-700 hover:border-blue-400/50 transition-all duration-300 hover:scale-105"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FolderOpen className="w-5 h-5 text-blue-400" />
                      <div>
                        <h3 className="font-medium text-white group-hover:text-blue-300 transition-colors">
                          {folder}
                        </h3>
                        <p className="text-sm text-white/50">
                          Problem #{index + 1}
                        </p>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-white/30 group-hover:text-white transition-colors" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
              <Code2 className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Problem Browser
            </h1>
          </div>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Explore and solve algorithmic challenges from LeetCode and CodeForces
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="mb-6 bg-red-900/20 border-red-500/30">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="text-red-200">{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Platform Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <ProblemCard
            title="LeetCode"
            count={leetcodeData?.count || 0}
            icon={Code2}
            color="text-green-400"
            gradient="bg-gradient-to-br from-green-900/30 to-emerald-900/30 border-green-500/30"
            href="/leetcode"
          />
          <ProblemCard
            title="CodeForces"
            count={codeforceData?.count || 0}
            icon={Zap}
            color="text-orange-400"
            gradient="bg-gradient-to-br from-orange-900/30 to-red-900/30 border-orange-500/30"
            href="/codeforce"
          />
        </div>

        {/* Problem Lists */}
        <Tabs defaultValue="leetcode" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-gray-800/50 border border-gray-700">
            <TabsTrigger
              value="leetcode"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white"
            >
              <Code2 className="w-4 h-4 mr-2" />
              LeetCode
            </TabsTrigger>
            <TabsTrigger
              value="codeforce"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white"
            >
              <Zap className="w-4 h-4 mr-2" />
              CodeForces
            </TabsTrigger>
          </TabsList>

          <TabsContent value="leetcode" className="space-y-4">
            <ProblemList
              data={leetcodeData}
              isLoading={loading.leetcode}
              type="leetcode"
            />
          </TabsContent>

          <TabsContent value="codeforce" className="space-y-4">
            <ProblemList
              data={codeforceData}
              isLoading={loading.codeforce}
              type="codeforce"
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
