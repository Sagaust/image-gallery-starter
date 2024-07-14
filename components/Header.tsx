// components/Header.tsx
import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon, PlayIcon, PauseIcon } from '@heroicons/react/24/outline';

interface HeaderProps {
  autoPlay: boolean;
  handlePreviousImage: () => void;
  handleNextImage: () => void;
  handleToggleAutoPlay: () => void;
}

const Header: React.FC<HeaderProps> = ({
  autoPlay,
  handlePreviousImage,
  handleNextImage,
  handleToggleAutoPlay,
}) => {
  return (
    <header className="p-4 bg-gray-800 text-white flex justify-between items-center">
      <div>
        <button onClick={handlePreviousImage} className="mr-2">
          <ChevronLeftIcon className="h-6 w-6" />
        </button>
        <button onClick={handleNextImage} className="mr-2">
          <ChevronRightIcon className="h-6 w-6" />
        </button>
        <button onClick={handleToggleAutoPlay}>
          {autoPlay ? (
            <PauseIcon className="h-6 w-6" />
          ) : (
            <PlayIcon className="h-6 w-6" />
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
