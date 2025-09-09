import React from 'react';
import { AspectRatioOption } from '../types';
import { ImageIcon } from './icons/ImageIcon';

interface ImageDisplayProps {
  isLoading: boolean;
  error: string | null;
  imageUrl: string | null;
  aspectRatio: AspectRatioOption;
}

const getAspectRatioClass = (ratio: AspectRatioOption) => {
  switch (ratio) {
    case '16:9':
      return 'aspect-video';
    case '9:16':
      return 'aspect-[9/16]';
    case '4:3':
      return 'aspect-[4/3]';
    case '3:4':
      return 'aspect-[3/4]';
    case '1:1':
    default:
      return 'aspect-square';
  }
};

const ImageDisplay: React.FC<ImageDisplayProps> = ({ isLoading, error, imageUrl, aspectRatio }) => {
  const aspectRatioClass = getAspectRatioClass(aspectRatio);

  const containerClasses = `relative w-full ${aspectRatioClass} bg-gray-800/50 border-2 border-dashed border-gray-600 rounded-lg flex items-center justify-center p-4 transition-all duration-300 ease-in-out`;

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center text-gray-400">
          <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-2 text-lg">Generating your masterpiece...</p>
        </div>
      );
    }
    if (error) {
      return (
        <div className="text-center text-red-400">
          <p className="font-semibold">Image Generation Failed</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      );
    }
    if (imageUrl) {
      return (
        <img
          src={imageUrl}
          alt="Generated image"
          className="object-contain w-full h-full rounded-md shadow-lg"
        />
      );
    }
    return (
      <div className="text-center text-gray-500">
        <ImageIcon />
        <p className="mt-2 text-lg font-medium">Your generated image will appear here</p>
        <p className="text-sm">Enter a prompt and click "Generate" to start</p>
      </div>
    );
  };

  return (
    <div className={containerClasses}>
      {renderContent()}
    </div>
  );
};

export default ImageDisplay;
