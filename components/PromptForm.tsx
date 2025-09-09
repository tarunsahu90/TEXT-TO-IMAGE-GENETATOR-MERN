import React from 'react';
import { AspectRatioOption } from '../types';
import { ASPECT_RATIO_OPTIONS } from '../constants';
import { SpinnerIcon } from './icons/SpinnerIcon';

interface PromptFormProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  aspectRatio: AspectRatioOption;
  setAspectRatio: (aspectRatio: AspectRatioOption) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const PromptForm: React.FC<PromptFormProps> = ({
  prompt,
  setPrompt,
  aspectRatio,
  setAspectRatio,
  onSubmit,
  isLoading,
}) => {
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading) {
      onSubmit();
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6 bg-gray-800 p-6 rounded-lg shadow-lg">
      <div>
        <label htmlFor="prompt" className="block text-sm font-medium text-gray-300 mb-2">
          Prompt
        </label>
        <textarea
          id="prompt"
          name="prompt"
          rows={5}
          className="block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm placeholder-gray-400 text-white focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition"
          placeholder="e.g., A futuristic cityscape at sunset, with flying cars"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="aspect-ratio" className="block text-sm font-medium text-gray-300 mb-2">
          Aspect Ratio
        </label>
        <select
          id="aspect-ratio"
          name="aspect-ratio"
          className="block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm text-white focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition"
          value={aspectRatio}
          onChange={(e) => setAspectRatio(e.target.value as AspectRatioOption)}
          disabled={isLoading}
        >
          {ASPECT_RATIO_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={isLoading || !prompt}
        className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? (
          <>
            <SpinnerIcon />
            Generating...
          </>
        ) : (
          'Generate'
        )}
      </button>
    </form>
  );
};

export default PromptForm;
