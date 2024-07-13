// components/Header.tsx
import Head from "next/head";
import Link from "next/link";

const Header: React.FC = () => {
  return (
    <>
      <Head>
        <title>Learning Philosophy through Pictures</title>
      </Head>
      <header className="bg-gray-900 p-4 text-white flex justify-between items-center">
        <div className="text-lg font-bold">Image Gallery</div>
        <nav>
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
        </nav>
      </header>
    </>
  );
};

export default Header;
