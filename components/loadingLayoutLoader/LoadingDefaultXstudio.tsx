/* eslint-disable react-hooks/exhaustive-deps */

'use client';
import { Flex, Image, Typography, Progress } from 'antd';
import { useState, useEffect, useRef } from 'react';

interface LoadingDefaultXstudioProps {
  onLoadingComplete?: () => void;
  duration?: number; // milliseconds
}

export default function LoadingDefaultXstudio({
  onLoadingComplete,
  duration = 10000 // default 10 seconds
}: LoadingDefaultXstudioProps = {}) {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Loading text phases
  const loadingPhases = [
    'Initializing...',
    'Loading components...',
    'Setting up workspace...',
    'Preparing interface...',
    'Almost ready...',
    'Finalizing...'
  ];

  useEffect(() => {
    const startTime = Date.now();
    const incrementInterval = 50; // Update every 50ms for smooth animation

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 95); // Max 95% to avoid completion before actual loading

      setProgress(newProgress);

      // Update loading text based on progress
      const phaseIndex = Math.floor((newProgress / 100) * loadingPhases.length);
      if (phaseIndex < loadingPhases.length) {
        setLoadingText(loadingPhases[phaseIndex]);
      }
    }, incrementInterval);

    // Complete loading after specified duration
    timeoutRef.current = setTimeout(() => {
      setProgress(100);
      setLoadingText('Complete!');

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

          {/* Loading Content */}
          <div className="space-y-6">
            {/* Loading Text */}
            <div className="text-center">
              <Typography.Text className="text-blue-200 text-lg font-medium">
                {loadingText}
              </Typography.Text>
            </div>

            {/* Ant Design Progress Bar */}
            <div className="bg-white/5 rounded-xl p-6 backdrop-blur-sm border border-white/10">
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
                />
              ))}
            </div>
            <Typography.Text className="text-indigo-200/80 text-sm font-light">
              Powered by X-Studio ✨
            </Typography.Text>
          </div>
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