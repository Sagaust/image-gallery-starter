// components/ControlPanel.tsx
import { ChevronLeftIcon, ChevronRightIcon, PauseIcon, PlayIcon } from '@heroicons/react/24/outline'; // Ensure this path is correct

interface ControlPanelProps {
  autoPlay: boolean;
  handlePreviousImage: () => void;
  handleNextImage: () => void;
  handleToggleAutoPlay: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  autoPlay,
  handlePreviousImage,
  handleNextImage,
  handleToggleAutoPlay,
}) => {
  return (
    <div className="flex items-center justify-center space-x-4">
      <button onClick={handlePreviousImage}>
        <ChevronLeftIcon className="w-6 h-6 text-gray-500 hover:text-gray-700" />
      </button>
      <button onClick={handleToggleAutoPlay}>
        {autoPlay ? (
          <PauseIcon className="w-6 h-6 text-gray-500 hover:text-gray-700" />
        ) : (
          <PlayIcon className="w-6 h-6 text-gray-500 hover:text-gray-700" />
        )}
      </button>
      <button onClick={handleNextImage}>
        <ChevronRightIcon className="w-6 h-6 text-gray-500 hover:text-gray-700" />
      </button>
    </div>
  );
};

export default ControlPanel;
