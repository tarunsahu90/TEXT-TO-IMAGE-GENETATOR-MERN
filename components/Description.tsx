import React, { useState } from 'react';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

const Description: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mt-6 bg-gray-800 rounded-lg shadow-lg">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 text-left font-medium text-gray-300 hover:bg-gray-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500"
        aria-expanded={isOpen}
        aria-controls="description-content"
      >
        <span>How does it work?</span>
        <ChevronDownIcon className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div id="description-content" className="p-4 pt-0 text-gray-400 text-sm">
          <p className="mb-2">
            <strong>Generate from Text:</strong> Simply type a description of the image you want to create in the prompt box, select your desired aspect ratio, and click "Generate". Our AI will bring your vision to life.
          </p>
          <p>
            <strong>Edit an Image:</strong> Upload your own image using the drag-and-drop area. Then, provide a prompt describing the changes you want to make (e.g., "add a hat to the person," "change the background to a beach"). Click "Generate Edit" to see the magic happen.
          </p>
        </div>
      )}
    </div>
  );
};

export default Description;
