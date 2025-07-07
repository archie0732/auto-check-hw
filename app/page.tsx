import Link from 'next/link';
import { Megaphone, BookOpen, User, Code, Settings, ArrowRight, Sparkles, Zap, Target, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

interface NotificationData {
  title: string;
  link: string;
  description: string;
  time: string;
}

interface NotificationResponse {
  success: boolean;
  data: {
    decodedContent: {
      general: NotificationData[];
    };
  };
}

interface HwListResponse {
  success: boolean;
  data: {
    semester: string;
    hw_list: string[];
    count: number;
  }
}

export default async function Home() {
  const notiRes = await fetch(`${process.env.MYURL}/api/notification`);
  const hwRes = await fetch(`${process.env.MYURL}/api/md`);
  let notifications: NotificationData[] = [];
  let hwCount = 0;
  let semester = '';
  if (notiRes.ok) {
    const notiData = await notiRes.json() as NotificationResponse;
    if (notiData.success && notiData.data) notifications = notiData.data.decodedContent.general.reverse();
  }
  if (hwRes.ok) {
    const hwData = await hwRes.json() as HwListResponse;
    if (hwData.success && hwData.data) {
      hwCount = hwData.data.count;
      semester = hwData.data.semester;
    }
  }
  // 假資料
  const finishedCount = Math.floor(hwCount * 0.7);
  const activeUsers = '5k';

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* 科幻背景動畫 */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-purple-900/30 to-blue-900/20"></div>
        <div className="absolute inset-0 cyber-grid opacity-5"></div>

        {/* 動態粒子 */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="particle text-cyan-400 top-20 left-10 animate-matrix" style={{ animationDelay: '0s' }}></div>
          <div className="particle text-purple-400 top-40 right-20 animate-matrix" style={{ animationDelay: '1s' }}></div>
          <div className="particle text-blue-400 top-60 left-1/4 animate-matrix" style={{ animationDelay: '2s' }}></div>
          <div className="particle text-green-400 top-80 right-1/3 animate-matrix" style={{ animationDelay: '0.5s' }}></div>
          <div className="particle text-yellow-400 top-96 left-1/2 animate-matrix" style={{ animationDelay: '1.5s' }}></div>
          <div className="particle text-pink-400 top-32 right-1/4 animate-matrix" style={{ animationDelay: '2.5s' }}></div>
          <div className="particle text-orange-400 top-72 left-1/3 animate-matrix" style={{ animationDelay: '0.8s' }}></div>
          <div className="particle text-indigo-400 top-88 right-1/2 animate-matrix" style={{ animationDelay: '1.8s' }}></div>
        </div>

        {/* 掃描線效果 */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scan opacity-30"></div>
        <div className="absolute top-1/3 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-scan opacity-20" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-2/3 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-scan opacity-25" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* 主要內容 */}
      <div className="relative z-10">
        {/* 歡迎區 - 更科幻的設計 */}
        <div className="container mx-auto px-4 pt-8">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 via-purple-600 to-blue-600 rounded-3xl blur-sm opacity-60 transition"></div>
            <div className="relative bg-black/80 backdrop-blur-xl rounded-3xl p-8 border border-cyan-500/30 overflow-visible">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="relative">
                  <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full blur opacity-50 animate-pulse"></div>
                  <img src="/avatar.jpg" className="relative w-28 h-28 rounded-full border-4 border-cyan-400 shadow-2xl shadow-cyan-400/50" />
                </div>
                <div className="flex-1 text-center lg:text-left">
                  <div className="text-lg text-cyan-300 mb-2 flex items-center justify-center lg:justify-start gap-2">
                    <Sparkles className="w-5 h-5 animate-spin" />
                    <span className="animate-pulse neon-text">connected</span>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                  <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-3 neon-text">
                    Welcome To Auto Check HomeWork
                  </div>
                  <div className="text-lg text-gray-300 flex items-center gap-2">
                    <span>Powered by</span>
                    <span className="font-mono text-cyan-400 animate-pulse">&lt;React.js /&gt;</span>
                    <span className="text-xs text-cyan-300">v2</span>
                  </div>
                </div>
                {/* 角色圖片外層 */}
                <div className="hidden lg:block absolute right-0 bottom-0 h-full w-48 z-20 pointer-events-none overflow-visible">
                  <img
                    src="/girl.png"
                    alt="Character standing"
                    className="absolute h-[240px] object-contain rounded-3xl shadow-2xl"
                    style={{ right: '-22px', bottom: '-6px', margin: 0, padding: 0 }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 統計卡片 - 更靈活的佈局 */}
        <div className="container mx-auto px-4 mt-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl blur opacity-50 group-hover:opacity-75 transition duration-300"></div>
              <div className="relative bg-black/60 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/30 hover:border-cyan-400/60 transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-cyan-400 neon-text animate-float">{hwCount}</div>
                    <div className="text-gray-400 text-sm mt-1">作業總數</div>
                  </div>
                  <div className="relative">
                    <div className="absolute -inset-1 bg-cyan-400 rounded-full blur opacity-30 animate-pulse"></div>
                    <BookOpen className="relative w-8 h-8 text-cyan-400 animate-glow" />
                  </div>
                </div>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-50 group-hover:opacity-75 transition duration-300"></div>
              <div className="relative bg-black/60 backdrop-blur-sm rounded-2xl p-6 border border-green-500/30 hover:border-green-400/60 transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-green-400 neon-text animate-float" style={{ animationDelay: '0.5s' }}>{finishedCount}</div>
                    <div className="text-gray-400 text-sm mt-1">已完成</div>
                  </div>
                  <div className="relative">
                    <div className="absolute -inset-1 bg-green-400 rounded-full blur opacity-30 animate-pulse"></div>
                    <Target className="relative w-8 h-8 text-green-400 animate-glow" />
                  </div>
                </div>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-50 group-hover:opacity-75 transition duration-300"></div>
              <div className="relative bg-black/60 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30 hover:border-purple-400/60 transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-purple-400 neon-text animate-float" style={{ animationDelay: '1s' }}>{activeUsers}</div>
                    <div className="text-gray-400 text-sm mt-1">造訪次數</div>
                  </div>
                  <div className="relative">
                    <div className="absolute -inset-1 bg-purple-400 rounded-full blur opacity-30 animate-pulse"></div>
                    <TrendingUp className="relative w-8 h-8 text-purple-400 animate-glow" />
                  </div>
                </div>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-2xl blur opacity-50 group-hover:opacity-75 transition duration-300"></div>
              <div className="relative bg-black/60 backdrop-blur-sm rounded-2xl p-6 border border-yellow-500/30 hover:border-yellow-400/60 transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold text-yellow-400 neon-text animate-float" style={{ animationDelay: '1.5s' }}>{notifications.length}</div>
                    <div className="text-gray-400 text-sm mt-1">公告數</div>
                  </div>
                  <div className="relative">
                    <div className="absolute -inset-1 bg-yellow-400 rounded-full blur opacity-30 animate-pulse"></div>
                    <Megaphone className="relative w-8 h-8 text-yellow-400 animate-glow" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 功能卡片 - 更動態的佈局 */}
        <div className="container mx-auto px-4 mt-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/hw" className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-50 group-hover:opacity-75 transition duration-300"></div>
              <div className="relative bg-black/60 backdrop-blur-sm rounded-2xl p-8 border border-blue-500/30 hover:border-blue-400/60 transition-all duration-300 hover:scale-105 group-hover:shadow-2xl group-hover:shadow-blue-500/25 cyber-button">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <div className="absolute -inset-2 bg-blue-500 rounded-full blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
                    <BookOpen className="relative w-12 h-12 text-blue-400 group-hover:text-blue-300 transition-colors animate-float" />
                  </div>
                  <span className="text-white font-bold text-lg group-hover:text-blue-300 transition-colors neon-text">作業列表</span>
                  <div className="mt-2 text-gray-400 text-sm">查看所有作業</div>
                </div>
              </div>
            </Link>

            <Link href="/test" className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-50 group-hover:opacity-75 transition duration-300"></div>
              <div className="relative bg-black/60 backdrop-blur-sm rounded-2xl p-8 border border-green-500/30 hover:border-green-400/60 transition-all duration-300 hover:scale-105 group-hover:shadow-2xl group-hover:shadow-green-500/25 cyber-button">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <div className="absolute -inset-2 bg-green-500 rounded-full blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
                    <Code className="relative w-12 h-12 text-green-400 group-hover:text-green-300 transition-colors animate-float" style={{ animationDelay: '0.5s' }} />
                  </div>
                  <span className="text-white font-bold text-lg group-hover:text-green-300 transition-colors neon-text">解題</span>
                  <div className="mt-2 text-gray-400 text-sm">查看比賽題目詳解</div>
                </div>
              </div>
            </Link>

            <Link href="/login" className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-50 group-hover:opacity-75 transition duration-300"></div>
              <div className="relative bg-black/60 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30 hover:border-purple-400/60 transition-all duration-300 hover:scale-105 group-hover:shadow-2xl group-hover:shadow-purple-500/25 cyber-button">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <div className="absolute -inset-2 bg-purple-500 rounded-full blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
                    <User className="relative w-12 h-12 text-purple-400 group-hover:text-purple-300 transition-colors animate-float" style={{ animationDelay: '1s' }} />
                  </div>
                  <span className="text-white font-bold text-lg group-hover:text-purple-300 transition-colors neon-text">登入</span>
                  <div className="mt-2 text-gray-400 text-sm">登入以提交作業</div>
                </div>
              </div>
            </Link>

            <Link href="/setting" className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-yellow-600 rounded-2xl blur opacity-50 group-hover:opacity-75 transition duration-300"></div>
              <div className="relative bg-black/60 backdrop-blur-sm rounded-2xl p-8 border border-orange-500/30 hover:border-orange-400/60 transition-all duration-300 hover:scale-105 group-hover:shadow-2xl group-hover:shadow-orange-500/25 cyber-button">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <div className="absolute -inset-2 bg-orange-500 rounded-full blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
                    <Settings className="relative w-12 h-12 text-orange-400 group-hover:text-orange-300 transition-colors animate-float" style={{ animationDelay: '1.5s' }} />
                  </div>
                  <span className="text-white font-bold text-lg group-hover:text-orange-300 transition-colors neon-text">系統設定</span>
                  <div className="mt-2 text-gray-400 text-sm">調整系統參數</div>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* 公告區域 - 更現代的設計 */}
        <div className="container mx-auto px-4 mt-12 mb-8">
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 rounded-3xl blur opacity-50 group-hover:opacity-75 transition duration-300"></div>
            <div className="relative bg-black/60 backdrop-blur-xl rounded-3xl p-8 border border-yellow-500/30">
              <div className="flex items-center mb-6">
                <div className="relative mr-3">
                  <div className="absolute -inset-1 bg-yellow-500 rounded-full blur opacity-30 animate-pulse"></div>
                  <Megaphone className="relative w-6 h-6 text-yellow-400" />
                </div>
                <span className="text-xl text-white font-bold">系統公告</span>
                <div className="ml-auto">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>
              <div className="space-y-4">
                {notifications.slice(0, 3).map((n, i) => (
                  <Link href={n.link} key={i} className="group/item block">
                    <div className="bg-black/40 rounded-xl p-4 border border-gray-700/50 hover:border-yellow-500/50 transition-all duration-300 hover:bg-black/60">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="text-cyan-300 group-hover/item:text-cyan-200 transition-colors font-medium">
                            {n.title}
                          </div>
                          <div className="text-gray-400 text-sm mt-1">{n.description}</div>
                        </div>
                        <div className="text-xs text-gray-500 ml-4">{n.time}</div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
