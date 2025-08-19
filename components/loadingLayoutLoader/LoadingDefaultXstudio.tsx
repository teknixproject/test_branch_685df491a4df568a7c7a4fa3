'use client';
import { Flex, Skeleton, Typography } from 'antd';
import { useEffect, useState } from 'react';

const { Title } = Typography;

export default function LoadingDefaultXstudio() {
  const [dots, setDots] = useState('');
  const [pulseIntensity, setPulseIntensity] = useState(0);

  // Animated dots effect
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Pulse animation for gradient
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseIntensity(prev => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative !z-0 h-screen overflow-hidden">
      {/* Animated Background Gradient */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 animate-pulse"
        style={{
          backgroundSize: '400% 400%',
          animation: 'gradientShift 8s ease infinite'
        }}
      />

      {/* Floating Orbs */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-400/20 rounded-full blur-xl animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
        <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-purple-400/20 rounded-full blur-xl animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-20 h-20 bg-indigo-400/20 rounded-full blur-xl animate-bounce" style={{ animationDelay: '2s', animationDuration: '2.5s' }}></div>
      </div>

      {/* Shimmer Effect Overlay */}
      <div className="absolute inset-0 opacity-30">
        <div className="h-full w-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
      </div>

      {/* Main Content */}
      <Flex className="relative z-10 h-full justify-center items-center">
        <div className="backdrop-blur-md bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8 max-w-2xl w-full mx-4">

          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="relative mb-6">
              {/* Rotating Ring */}
              <div className="w-20 h-20 mx-auto border-4 border-blue-400/30 border-t-blue-400 rounded-full animate-spin"></div>
              <div className="absolute inset-2 w-16 h-16 mx-auto border-2 border-purple-400/30 border-b-purple-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
              <div className="absolute inset-4 w-12 h-12 mx-auto border border-indigo-400/30 border-l-indigo-400 rounded-full animate-spin" style={{ animationDuration: '0.8s' }}></div>
            </div>

            <Title
              level={2}
              className="!text-white !mb-2 font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent animate-pulse"
            >
              Đang Tải Xuống{dots}
            </Title>
            <p className="text-blue-200 text-lg font-medium animate-fade-in-out">
              Chuẩn bị trải nghiệm tuyệt vời
            </p>
          </div>

          {/* Loading Content Grid */}
          <div className="space-y-6">
            {/* Main Content Skeleton */}
            <div className="bg-white/5 rounded-2xl p-6 backdrop-blur-sm border border-white/10">
              <Skeleton
                active={true}
                avatar={{ size: 'large', shape: 'circle' }}
                title={{ width: '60%' }}
                paragraph={{ rows: 3, width: ['100%', '85%', '70%'] }}
                className="custom-skeleton"
              />
            </div>

            {/* Interactive Elements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
                <Skeleton.Avatar
                  active={true}
                  size="large"
                  shape="square"
                  className="mb-3"
                />
                <Skeleton.Input active={true} size="large" className="w-full" />
              </div>

              <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300">
                <Skeleton.Button
                  active={true}
                  size="large"
                  shape="round"
                  className="w-full mb-3"
                />
                <Skeleton.Image active={true} className="w-full h-20" />
              </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-white/5 rounded-xl p-4 backdrop-blur-sm border border-white/10">
              <div className="flex justify-between items-center mb-2">
                <span className="text-blue-200 font-medium">Tiến Trình</span>
                <span className="text-purple-300 font-bold">{Math.floor(pulseIntensity)}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-full transition-all duration-300 relative"
                  style={{ width: `${pulseIntensity}%` }}
                >
                  <div className="absolute inset-0 bg-white/30 animate-shimmer-fast"></div>
                </div>
              </div>
            </div>

            {/* Feature Cards */}
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((item, index) => (
                <div
                  key={item}
                  className="bg-white/5 rounded-lg p-3 backdrop-blur-sm border border-white/10 hover:scale-105 transition-all duration-300"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <Skeleton.Avatar active={true} size="small" className="mb-2 mx-auto block" />
                  <Skeleton.Input active={true} size="small" className="w-full" />
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <div className="flex justify-center space-x-2 mb-4">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-bounce"
                  style={{
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: '1s'
                  }}
                ></div>
              ))}
            </div>
            <p className="text-indigo-200/80 text-sm font-light">
              Powered by X-Studio ✨
            </p>
          </div>
        </div>
      </Flex>

      <style jsx>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50% }
          50% { background-position: 100% 50% }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%) }
          100% { transform: translateX(200%) }
        }
        
        @keyframes shimmer-fast {
          0% { transform: translateX(-100%) }
          100% { transform: translateX(100%) }
        }
        
        @keyframes fade-in-out {
          0%, 100% { opacity: 0.7 }
          50% { opacity: 1 }
        }
        
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
        
        .animate-shimmer-fast {
          animation: shimmer-fast 1s infinite;
        }
        
        .animate-fade-in-out {
          animation: fade-in-out 2s infinite;
        }
        
        :global(.custom-skeleton .ant-skeleton-content .ant-skeleton-title) {
          background: linear-gradient(90deg, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        
        :global(.custom-skeleton .ant-skeleton-content .ant-skeleton-paragraph > li) {
          background: linear-gradient(90deg, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        
        :global(.ant-skeleton-avatar) {
          background: linear-gradient(90deg, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  );
}