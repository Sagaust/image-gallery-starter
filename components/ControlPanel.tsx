// components/ControlPanel.tsx
// components/ControlPanel.tsx
import { ChevronLeftIcon, ChevronRightIcon, PauseIcon, PlayIcon } from '@heroicons/react/24/outline'; // Changed to 'outline'

interface ControlPanelProps {
  autoPlay: boolean;
  toggleAutoPlay: () => void;
  handleNextImage: () => void;
  handlePreviousImage: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ autoPlay, toggleAutoPlay, handleNextImage, handlePreviousImage }) => {
  return (
    <div className="control-panel flex items-center space-x-4">
      <button onClick={handlePreviousImage} className="p-2 bg-gray-800 text-white rounded-lg shadow hover:bg-gray-700">
        <ChevronLeftIcon className="h-6 w-6" />
      </button>
      <button onClick={toggleAutoPlay} className="p-2 bg-gray-800 text-white rounded-lg shadow hover:bg-gray-700">
        {autoPlay ? <PauseIcon className="h-6 w-6" /> : <PlayIcon className="h-6 w-6" />}
      </button>
      <button onClick={handleNextImage} className="p-2 bg-gray-800 text-white rounded-lg shadow hover:bg-gray-700">
        <ChevronRightIcon className="h-6 w-6" />
      </button>
    </div>
  );
};

export default ControlPanel;
