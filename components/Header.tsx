// components/Header.tsx
import { ChevronLeftIcon, ChevronRightIcon, PauseIcon, PlayIcon } from '@heroicons/react/24/outline';
import Head from "next/head";
import Link from "next/link";

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
    <>
      <Head>
        <title>Learning Philosophy through Pictures</title>
      </Head>
      <header className="flex justify-between items-center p-4 bg-gray-800 text-white">
        <h1 className="text-xl font-bold">Philos DH Gallery</h1>
        <nav className="flex items-center space-x-4">
          <ul className="flex space-x-4">
            <li>
              <Link href={`/?folder=${process.env.NEXT_PUBLIC_DEFAULT_FOLDER}`} className="hover:text-gray-400">
                Home
              </Link>
            </li>
            <li>
              <Link href={`/?folder=${process.env.NEXT_PUBLIC_FOLDER1}`} className="hover:text-gray-400">
                Philosophy Courses
              </Link>
            </li>
            <li>
              <Link href={`/?folder=${process.env.NEXT_PUBLIC_FOLDER2}`} className="hover:text-gray-400">
                Philosophical Concepts
              </Link>
            </li>
            {/* Add more links as needed */}
          </ul>
          <div className="flex items-center space-x-4">
            <button onClick={handlePreviousImage} className="p-2 bg-gray-700 rounded-lg">
              <ChevronLeftIcon className="h-6 w-6" />
            </button>
            <button onClick={handleNextImage} className="p-2 bg-gray-700 rounded-lg">
              <ChevronRightIcon className="h-6 w-6" />
            </button>
            <button onClick={handleToggleAutoPlay} className="p-2 bg-gray-700 rounded-lg">
              {autoPlay ? <PauseIcon className="h-6 w-6" /> : <PlayIcon className="h-6 w-6" />}
            </button>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Header;
