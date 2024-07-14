// components/Header.tsx
import Link from 'next/link';
import ControlPanel from './ControlPanel';

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
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <Link href="/">
          <a className="text-xl font-bold">Philos DH Gallery</a>
        </Link>
        <nav>
          <Link href="/">
            <a className="mx-2">Home</a>
          </Link>
          <Link href="/about">
            <a className="mx-2">About</a>
          </Link>
          <Link href="/contact">
            <a className="mx-2">Contact</a>
          </Link>
        </nav>
      </div>
      <ControlPanel
        autoPlay={autoPlay}
        handlePreviousImage={handlePreviousImage}
        handleNextImage={handleNextImage}
        handleToggleAutoPlay={handleToggleAutoPlay}
      />
    </header>
  );
};

export default Header;
