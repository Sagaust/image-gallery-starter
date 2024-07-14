// components/Accordion.tsx
import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-4">
      <button
        className="flex items-center justify-between w-full p-4 text-left bg-gray-800 text-white rounded-lg focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{title}</span>
        {isOpen ? (
          <ChevronUpIcon className="w-5 h-5" />
        ) : (
          <ChevronDownIcon className="w-5 h-5" />
        )}
      </button>
      {isOpen && (
        <div className="p-4 bg-gray-900 text-white rounded-lg">
          {children}
        </div>
      )}
    </div>
  );
};

export default Accordion;
