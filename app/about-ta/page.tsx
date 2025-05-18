'use client';

import Image from 'next/image';
import { FaCode, FaClock } from 'react-icons/fa';

export default function AboutTA() {
  const programmingLanguages = [
    { name: 'C/C++', level: 'Advanced' },
    { name: 'Java', level: 'Advanced' },
    { name: 'PHP', level: 'Intermediate' },
    { name: 'JavaScript', level: 'Advanced' },
    { name: 'TypeScript', level: 'Advanced' },
    { name: 'Python', level: 'Intermediate' },
  ];

  const tutoringHours = [
    { day: 'Monday', time: '12:00 - 13:00' },
    { day: 'Wednesday', time: '12:00 - 13:00' },
    { day: 'Thursday', time: '12:00 - 16:00' },
    { day: 'Friday', time: '12:00 - 13:00' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Profile Header */}
          <div className="relative h-64 w-full">
            <div className="absolute inset-0">
              <Image
                src="/wallpaper.jpg"
                alt="Header Background"
                fill
                style={{ objectFit: 'cover' }}
                priority
                quality={100}
              />
              <div className="absolute inset-0 bg-black/40" />
            </div>
            <div className="absolute -bottom-16 left-8">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white">
                <Image
                  src="/avatar.jpg"
                  alt="TA Profile"
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>

          {/* Profile Content */}
          <div className="pt-20 pb-8 px-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Archie</h1>
            <p className="text-gray-600 mb-8">你好，有任何程式問題都可以問我。也可以來聊動漫，本人特別喜歡fate系列</p>

            {/* Programming Skills */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <FaCode className="text-blue-500 text-xl mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">Programming Skills</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {programmingLanguages.map((lang) => (
                  <div key={lang.name} className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900">{lang.name}</h3>
                    <p className="text-sm text-gray-600">{lang.level}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tutoring Hours */}
            <div>
              <div className="flex items-center mb-4">
                <FaClock className="text-blue-500 text-xl mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">Tutoring Hours</h2>
              </div>
              <div className="space-y-3">
                {tutoringHours.map((schedule) => (
                  <div key={schedule.day} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                    <span className="font-medium text-gray-900">{schedule.day}</span>
                    <span className="text-gray-600">{schedule.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
