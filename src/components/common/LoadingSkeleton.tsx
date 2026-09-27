import React from 'react';

interface LoadingSkeletonProps {
  type?: 'card' | 'hero' | 'row' | 'detail';
  count?: number;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  type = 'card',
  count = 3
}) => {
  if (type === 'hero') {
    return (
      <div className="w-full bg-neutral-900 border-2 border-neutral-800 p-6 md:p-8 animate-pulse mb-8">
        <div className="flex gap-2 mb-4">
          <div className="h-6 w-24 bg-neutral-800" />
          <div className="h-6 w-32 bg-neutral-800" />
        </div>
        <div className="h-10 w-3/4 bg-neutral-800 mb-4" />
        <div className="h-4 w-full bg-neutral-800 mb-2" />
        <div className="h-4 w-2/3 bg-neutral-800 mb-6" />
        <div className="flex gap-4 items-center">
          <div className="h-10 w-32 bg-red-600/30" />
          <div className="h-10 w-10 bg-neutral-800" />
        </div>
      </div>
    );
  }

  if (type === 'row') {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 p-4 bg-neutral-900 border-2 border-neutral-800 animate-pulse"
          >
            <div className="h-14 w-14 bg-neutral-800 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 bg-neutral-800" />
              <div className="h-3 w-1/2 bg-neutral-800/60" />
            </div>
            <div className="h-6 w-16 bg-neutral-800" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-neutral-900 border-2 border-neutral-800 overflow-hidden animate-pulse flex flex-col"
        >
          <div className="h-48 w-full bg-neutral-800" />
          <div className="p-5 flex-1 flex flex-col space-y-3 bg-neutral-950">
            <div className="flex justify-between items-center">
              <div className="h-5 w-24 bg-neutral-800" />
              <div className="h-4 w-16 bg-neutral-800" />
            </div>
            <div className="h-6 w-5/6 bg-neutral-800" />
            <div className="h-4 w-full bg-neutral-800" />
            <div className="h-4 w-4/5 bg-neutral-800" />
            <div className="pt-4 mt-auto flex justify-between items-center border-t border-neutral-800">
              <div className="h-4 w-20 bg-neutral-800" />
              <div className="h-8 w-8 bg-neutral-800" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
