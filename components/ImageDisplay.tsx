import React from 'react';
import { AspectRatioOption } from '../types';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { ImageIcon } from './icons/ImageIcon';
import { DownloadIcon } from './icons/DownloadIcon';

interface ImageDisplayProps {
  isLoading: boolean;
  error: string | null;
  imageUrl: string | null;
  aspectRatio: AspectRatioOption;
  prompt: string;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ isLoading, error, imageUrl, aspectRatio, prompt }) => {

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

  const handleDownload = () => {
    if (imageUrl) {
      const link = document.createElement('a');
      link.href = imageUrl;
      // Sanitize prompt for filename
      const fileName = prompt.replace(/[^a-z0-9]/gi, '_').toLowerCase().slice(0, 50) || 'generated-image';
      link.download = `${fileName}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-400">
          <SpinnerIcon className="animate-spin h-12 w-12 text-purple-400" />
          <p className="mt-4 text-lg">Generating your masterpiece...</p>
          <p className="text-sm text-gray-500">This may take a moment.</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-6 bg-red-900/20 border-red-500/50 border rounded-lg">
          <h3 className="text-lg font-semibold text-red-400 mb-2">Oops! Something went wrong.</h3>
          <p className="text-sm text-red-300">{error}</p>
        </div>
      );
    }

    if (imageUrl) {
      return (
        <div className="relative group w-full h-full">
            <img 
                src={imageUrl} 
                alt={prompt} 
                className="w-full h-full object-contain rounded-lg"
            />
            <button
                onClick={handleDownload}
                className="absolute bottom-4 right-4 bg-black/50 text-white rounded-full p-3 hover:bg-black/75 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 flex items-center gap-2"
                aria-label="Download image"
            >
                <DownloadIcon />
            </button>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <ImageIcon />
        <p className="mt-4 text-lg">Your generated image will appear here</p>
        <p className="text-sm">Enter a prompt and click "Generate"</p>
      </div>
    );
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg flex-grow flex items-center justify-center">
      <div className={`w-full max-w-full rounded-lg bg-gray-900/50 overflow-hidden ${getAspectRatioClass(aspectRatio)}`}>
        {renderContent()}
      </div>
    </div>
  );
};

export default ImageDisplay;
