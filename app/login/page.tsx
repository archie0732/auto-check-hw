'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AppStore } from '@/store/app';
import { Loader2, User, LogIn, Shield, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';

interface StudentData {
  id: string;
  intro: string;
  avatar: string;
  hw: string[];
  name: string;
  root: boolean;
}

interface ProfileResponse {
  success: boolean;
  data: {
    student: StudentData;
  }
}

export default function Page() {
  const { userID, setUserID, setAvatar, setUserName } = AppStore();
  const [studentID, setStudentID] = useState('');
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setLoading(true);
    if (studentID === '') {
      toast.warning('請輸入學號', { description: '你輸入的學號為空' });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/profile/${studentID}`);

      if (!res.ok) {
        toast.error(`登入失敗，未找到使用者: ${studentID}`, { description: '請確認輸入學號是否正確，如果還是錯誤請來507找我' });
        setLoading(false);
        return;
      }

      const response = await res.json() as ProfileResponse;

      if (!response.success || !response.data) {
        toast.error('登入失敗，資料格式錯誤', { description: '請稍後再試或聯繫管理員' });
        setLoading(false);
        return;
      }

      const student = response.data.student;

      toast.success('登入成功!');
      setAvatar(student.avatar);
      setUserID(student.id);
      setUserName(student.name);
      setLoading(false);
    } catch (error) {
      console.error('Login error:', error);
      toast.error('登入失敗，請稍後再試');
      setLoading(false);
    }
  };

  if (userID !== 'none') {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden">
        {/* 科幻背景動畫 */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-emerald-900/30 to-teal-900/20"></div>
          <div className="absolute inset-0 cyber-grid opacity-5"></div>

          {/* 動態粒子 */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            <div className="particle text-green-400 top-20 left-10 animate-matrix" style={{ animationDelay: '0s' }}></div>
            <div className="particle text-emerald-400 top-40 right-20 animate-matrix" style={{ animationDelay: '1s' }}></div>
            <div className="particle text-teal-400 top-60 left-1/4 animate-matrix" style={{ animationDelay: '2s' }}></div>
            <div className="particle text-cyan-400 top-80 right-1/3 animate-matrix" style={{ animationDelay: '0.5s' }}></div>
          </div>

          {/* 掃描線效果 */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent animate-scan opacity-30"></div>
          <div className="absolute top-1/3 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-scan opacity-20" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <div className="group relative max-w-md w-full">
            <div className="absolute -inset-1 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
            <div className="relative bg-black/80 backdrop-blur-xl rounded-3xl p-8 border border-green-500/30">
              <div className="text-center mb-6">
                <div className="relative inline-block mb-4">
                  <div className="absolute -inset-2 bg-green-500 rounded-full blur opacity-50 animate-pulse"></div>
                  <CheckCircle className="relative w-16 h-16 text-green-400 animate-glow" />
                </div>
                <div className="text-2xl font-bold text-green-400 neon-text mb-2">已成功登入</div>
                <div className="text-gray-300">歡迎回來，同學！</div>
              </div>

              <div className="space-y-4">
                <Link href="/profile/[id]" as={`/profile/${userID}`} className="group/btn relative block">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-50 group-hover/btn:opacity-75 transition duration-300"></div>
                  <div className="relative bg-black/60 backdrop-blur-sm rounded-2xl p-4 border border-blue-500/30 hover:border-blue-400/60 transition-all duration-300 hover:scale-105 cyber-button">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="absolute -inset-1 bg-blue-500 rounded-full blur opacity-30 animate-pulse"></div>
                          <User className="relative w-6 h-6 text-blue-400" />
                        </div>
                        <span className="text-white font-medium">查看個人資料</span>
                      </div>
                      <ArrowRight className="w-5 h-5 text-blue-400 group-hover/btn:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>

                <Link href="/" className="group/btn relative block">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-50 group-hover/btn:opacity-75 transition duration-300"></div>
                  <div className="relative bg-black/60 backdrop-blur-sm rounded-2xl p-4 border border-purple-500/30 hover:border-purple-400/60 transition-all duration-300 hover:scale-105 cyber-button">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="absolute -inset-1 bg-purple-500 rounded-full blur opacity-30 animate-pulse"></div>
                          <Shield className="relative w-6 h-6 text-purple-400" />
                        </div>
                        <span className="text-white font-medium">返回首頁</span>
                      </div>
                      <ArrowRight className="w-5 h-5 text-purple-400 group-hover/btn:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* 科幻背景動畫 */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/30 to-cyan-900/20"></div>
        <div className="absolute inset-0 cyber-grid opacity-5"></div>

        {/* 動態粒子 */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="particle text-blue-400 top-20 left-10 animate-matrix" style={{ animationDelay: '0s' }}></div>
          <div className="particle text-purple-400 top-40 right-20 animate-matrix" style={{ animationDelay: '1s' }}></div>
          <div className="particle text-cyan-400 top-60 left-1/4 animate-matrix" style={{ animationDelay: '2s' }}></div>
          <div className="particle text-indigo-400 top-80 right-1/3 animate-matrix" style={{ animationDelay: '0.5s' }}></div>
          <div className="particle text-pink-400 top-32 right-1/4 animate-matrix" style={{ animationDelay: '2.5s' }}></div>
        </div>

        {/* 掃描線效果 */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-scan opacity-30"></div>
        <div className="absolute top-1/3 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-scan opacity-20" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-2/3 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scan opacity-25" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="group relative max-w-md w-full">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
          <div className="relative bg-black/80 backdrop-blur-xl rounded-3xl p-8 border border-blue-500/30">
            {/* 標題區域 */}
            <div className="text-center mb-6">
              <div className="relative inline-block mb-4">
                <div className="absolute -inset-2 bg-blue-500 rounded-full blur opacity-50 animate-pulse"></div>
                <LogIn className="relative w-16 h-16 text-blue-400 animate-glow" />
              </div>
              <div className="text-2xl font-bold text-blue-400 neon-text mb-2">系統登入</div>
              <div className="text-gray-300 text-sm">請輸入您的學號進行身份驗證</div>
            </div>

            {/* 輸入區域 */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-blue-300 mb-2 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  學號
                </label>
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg blur opacity-30"></div>
                  <Input
                    placeholder="請輸入您的學號"
                    value={studentID}
                    onChange={(e) => setStudentID(e.target.value)}
                    className="relative bg-black/60 backdrop-blur-sm border-blue-500/30 text-white placeholder-gray-400 focus:border-blue-400/60 transition-all duration-300"
                    onKeyPress={(e) => e.key === 'Enter' && !loading && login()}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg blur opacity-50 group-hover:opacity-75 transition duration-300"></div>
                  <Button
                    onClick={() => void login()}
                    disabled={loading}
                    className="relative bg-black/60 backdrop-blur-sm border-green-500/30 hover:border-green-400/60 text-green-400 hover:text-green-300 transition-all duration-300 cyber-button"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <LogIn className="w-4 h-4 mr-2" />
                        登入系統
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* 注意事項 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-yellow-400">
                <AlertTriangle className="w-5 h-5 animate-pulse" />
                <span className="font-medium text-sm">重要提醒</span>
              </div>
              <div className="space-y-2 text-xs text-gray-400">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span>一台電腦只能登入一個人的帳號！不要在自己的電腦登入別人的帳號！</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span>不要用自己的電腦登其他人的帳號，抓到直接0分！</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span>有任何問題請至主顧507找我</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span>本次廢除遲交扣分問題，只要於計算總分前繳交都不扣分</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span>使用AI或參考其他人的程式碼，只要通過都算過</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
