'use client';

import Image from 'next/image';
import { FaCode, FaClock, FaUser, FaGraduationCap, FaHeart, FaStar } from 'react-icons/fa';
import { Code, Clock, User, GraduationCap, Heart, Star, MessageCircle, MapPin } from 'lucide-react';

export default function AboutTA() {
  const programmingLanguages = [
    { name: 'C/C++', level: 'Advanced', color: 'from-blue-500 to-cyan-500' },
    { name: 'Java', level: 'Advanced', color: 'from-orange-500 to-red-500' },
    { name: 'PHP', level: 'Intermediate', color: 'from-purple-500 to-pink-500' },
    { name: 'JavaScript', level: 'Advanced', color: 'from-yellow-500 to-orange-500' },
    { name: 'TypeScript', level: 'Advanced', color: 'from-blue-600 to-indigo-600' },
    { name: 'Python', level: 'Intermediate', color: 'from-green-500 to-emerald-500' },
  ];

  const tutoringHours = [
    { day: 'Monday', time: '12:00 - 13:00', icon: <Clock className="w-4 h-4" /> },
    { day: 'Wednesday', time: '12:00 - 13:00', icon: <Clock className="w-4 h-4" /> },
    { day: 'Thursday', time: '12:00 - 16:00', icon: <Clock className="w-4 h-4" /> },
    { day: 'Friday', time: '12:00 - 13:00', icon: <Clock className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* 背景圖片 */}
      <div className="absolute inset-0">
        <Image
          src="/tosakarin.jpg"
          alt="Background"
          fill
          style={{ objectFit: 'cover' }}
          priority
          quality={85}
          sizes="100vw"
        />
        {/* 深色遮罩層 */}
        <div className="absolute inset-0 bg-black/70"></div>
      </div>

      {/* 科幻背景動畫 */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-pink-900/15 to-blue-900/10"></div>
        <div className="absolute inset-0 cyber-grid opacity-3"></div>

        {/* 動態粒子 */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="particle text-purple-400 top-20 left-10 animate-matrix" style={{ animationDelay: '0s' }}></div>
          <div className="particle text-pink-400 top-40 right-20 animate-matrix" style={{ animationDelay: '1s' }}></div>
          <div className="particle text-blue-400 top-60 left-1/4 animate-matrix" style={{ animationDelay: '2s' }}></div>
          <div className="particle text-cyan-400 top-80 right-1/3 animate-matrix" style={{ animationDelay: '0.5s' }}></div>
          <div className="particle text-indigo-400 top-32 right-1/4 animate-matrix" style={{ animationDelay: '2.5s' }}></div>
          <div className="particle text-emerald-400 top-72 left-1/3 animate-matrix" style={{ animationDelay: '0.8s' }}></div>
        </div>

        {/* 掃描線效果 */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-scan opacity-20"></div>
        <div className="absolute top-1/3 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-400 to-transparent animate-scan opacity-15" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-2/3 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-scan opacity-18" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
            <div className="relative bg-black/80 backdrop-blur-xl rounded-3xl overflow-hidden border border-purple-500/30">

              {/* Profile Header */}
              <div className="relative h-80 w-full">
                <div className="absolute inset-0">
                  <Image
                    src="/wallpaper.jpg"
                    alt="Header Background"
                    fill
                    style={{ objectFit: 'cover' }}
                    priority
                    quality={100}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                </div>
                <div className="absolute -bottom-20 left-8">
                  <div className="relative group">
                    <div className="absolute -inset-2 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 rounded-full blur opacity-50 animate-pulse"></div>
                    <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-purple-400/50 group-hover:border-purple-400 transition-colors">
                      <Image
                        src="/avatar.jpg"
                        alt="TA Profile"
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  </div>
                </div>

                {/* 狀態指示器 */}
                <div className="absolute top-6 right-6">
                  <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1 border border-green-500/30">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-sm font-medium">在線</span>
                  </div>
                </div>
              </div>

              {/* Profile Content */}
              <div className="pt-24 pb-8 px-8">
                <div className="mb-8">
                  <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                    <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent neon-text">
                      Archie
                    </span>
                    <div className="relative">
                      <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full blur opacity-30 animate-pulse"></div>
                      <Star className="relative w-6 h-6 text-yellow-400" />
                    </div>
                  </h1>
                  <p className="text-gray-300 text-lg mb-4 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-purple-400" />
                    你好，有任何程式問題都可以問我。也可以來聊動漫，本人特別喜歡fate系列
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-purple-400" />
                      <span>主顧507</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <GraduationCap className="w-4 h-4 text-blue-400" />
                      <span>資工系TA</span>
                    </div>
                  </div>
                </div>

                {/* Programming Skills */}
                <div className="mb-8">
                  <div className="flex items-center mb-6">
                    <div className="relative mr-3">
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur opacity-30 animate-pulse"></div>
                      <Code className="relative w-6 h-6 text-blue-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Programming Skills</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {programmingLanguages.map((lang, index) => (
                      <div key={lang.name} className="group relative">
                        <div className={`absolute -inset-1 bg-gradient-to-r ${lang.color} rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-300`}></div>
                        <div className="relative bg-black/60 backdrop-blur-sm p-4 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300 hover:scale-105">
                          <h3 className="font-bold text-white mb-1">{lang.name}</h3>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-400">{lang.level}</p>
                            <div className="flex gap-1">
                              {[...Array(3)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-2 h-2 rounded-full ${i < (lang.level === 'Advanced' ? 3 : 2)
                                    ? 'bg-gradient-to-r from-yellow-400 to-orange-400'
                                    : 'bg-gray-600'
                                    }`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tutoring Hours */}
                <div>
                  <div className="flex items-center mb-6">
                    <div className="relative mr-3">
                      <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full blur opacity-30 animate-pulse"></div>
                      <Clock className="relative w-6 h-6 text-green-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Tutoring Hours</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tutoringHours.map((schedule, index) => (
                      <div key={schedule.day} className="group relative">
                        <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
                        <div className="relative bg-black/60 backdrop-blur-sm p-4 rounded-xl border border-gray-700/50 hover:border-green-500/50 transition-all duration-300 hover:scale-105">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <div className="absolute -inset-1 bg-green-500 rounded-full blur opacity-30 group-hover:opacity-50 transition duration-300"></div>
                                <span className="relative text-green-400 group-hover:text-green-300 transition-colors">
                                  {schedule.icon}
                                </span>
                              </div>
                              <span className="font-bold text-white">{schedule.day}</span>
                            </div>
                            <span className="text-gray-400 font-mono">{schedule.time}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 聯繫方式 */}
                <div className="mt-8 pt-6 border-t border-purple-500/20">
                  <div className="text-center">
                    <p className="text-gray-400 mb-4">有任何問題歡迎隨時聯繫！</p>
                    <div className="flex items-center justify-center gap-2 text-purple-400">
                      <Heart className="w-5 h-5 animate-pulse" />
                      <span className="text-sm">Fate系列愛好者</span>
                      <Heart className="w-5 h-5 animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
