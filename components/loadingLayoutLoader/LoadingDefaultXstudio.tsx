'use client';
import { Flex, Image, Progress } from 'antd';
import { useState, useEffect, useRef } from 'react';

interface LoadingDefaultXstudioProps {
  onLoadingComplete?: () => void;
  duration?: number;
}

export default function LoadingDefaultXstudio({
  onLoadingComplete,
  duration = 10000 // default 10 seconds
}: LoadingDefaultXstudioProps = {}) {
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const startTime = Date.now();
    const incrementInterval = 50; // Update every 50ms for smooth animation

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 95); // Max 95% to avoid completion before actual loading

      setProgress(newProgress);

    }, incrementInterval);

    // Complete loading after specified duration
    timeoutRef.current = setTimeout(() => {
      setProgress(100);
      // Small delay before calling completion callback
      setTimeout(() => {
        onLoadingComplete?.();
      }, 500);
    }, duration);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [duration, onLoadingComplete]);

  return (
    <div className="relative !z-0 h-screen overflow-hidden">
      {/* Animated Background Gradient */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900"
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

      {/* Main Content */}
      <Flex className="relative z-10 h-full justify-center items-center">
        <div className="backdrop-blur-md bg-white/10 rounded-3xl border border-white/20 shadow-2xl p-8 max-w-2xl w-full mx-4">

          {/* Header Section */}
          <div className="text-center mb-8">
            <Image
              width={200}
              src='https://componentx-studio-l8y4.vercel.app/logo.png'
              alt='logo-xstudio'
              preview={false}
            />
          </div>

          <Progress
            percent={Math.floor(progress)}
            strokeColor={{
              '0%': '#3b82f6',
              '50%': '#8b5cf6',
              '100%': '#6366f1',
            }}
            trailColor="rgba(255, 255, 255, 0.1)"
            strokeWidth={8}
            format={(percent) => (
              <span className="text-purple-300 font-bold text-sm">
                {percent}%
              </span>
            )}
            style={{
              fontSize: '14px'
            }}
          />
        </div>
      </Flex>

      <style jsx>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50% }
          50% { background-position: 100% 50% }
        }
        
        @keyframes shimmer-fast {
          0% { transform: translateX(-300%) }
          100% { transform: translateX(400%) }
        }
        
        .animate-shimmer-fast {
          animation: shimmer-fast 2s infinite;
        }
      `}</style>
    </div>
  );
}