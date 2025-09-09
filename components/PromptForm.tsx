import React, { useState, useEffect } from 'react';
import { AspectRatioOption } from '../types';
import { ASPECT_RATIO_OPTIONS } from '../constants';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { UploadIcon } from './icons/UploadIcon';
import { XIcon } from './icons/XIcon';
import { SparklesIcon } from './icons/SparklesIcon';

interface PromptFormProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  aspectRatio: AspectRatioOption;
  setAspectRatio: (aspectRatio: AspectRatioOption) => void;
  onSubmit: () => void;
  isLoading: boolean;
  uploadedFile: File | null;
  setUploadedFile: (file: File | null) => void;
  onSuggest: () => void;
  isSuggesting: boolean;
  suggestions: string[];
  setSuggestions: (suggestions: string[]) => void;
}

const PromptForm: React.FC<PromptFormProps> = ({
  prompt,
  setPrompt,
  aspectRatio,
  setAspectRatio,
  onSubmit,
  isLoading,
  uploadedFile,
  setUploadedFile,
  onSuggest,
  isSuggesting,
  suggestions,
  setSuggestions,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!uploadedFile) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(uploadedFile);
    setPreviewUrl(objectUrl);

    // Cleanup function to revoke the object URL
    return () => URL.revokeObjectURL(objectUrl);
  }, [uploadedFile]);
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading) {
      onSubmit();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setUploadedFile(file);
    }
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setUploadedFile(null);
    const input = document.getElementById('image-upload') as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  };
  
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setUploadedFile(file);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion);
    setSuggestions([]); // Clear suggestions after one is selected
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6 bg-gray-800 p-6 rounded-lg shadow-lg">
      <div>
        <div className="flex justify-between items-center mb-2">
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-300">
              Prompt
            </label>
            <button
              type="button"
              onClick={onSuggest}
              disabled={isLoading || isSuggesting || !prompt.trim()}
              className="flex items-center px-2 py-1 text-xs font-semibold text-purple-400 rounded-md hover:bg-purple-500/10 disabled:text-gray-500 disabled:cursor-not-allowed transition-all"
              aria-label="Get prompt suggestions"
            >
              {isSuggesting ? (
                <SpinnerIcon className="animate-spin h-4 w-4 text-purple-400" />
              ) : (
                <SparklesIcon />
              )}
              <span className="ml-1.5">{isSuggesting ? 'Thinking...' : 'Improve'}</span>
            </button>
        </div>
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

      {suggestions.length > 0 && (
          <div className="space-y-2 animate-fade-in">
              <h4 className="text-sm font-medium text-gray-300">Suggestions</h4>
              <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion, index) => (
                      <button
                          key={index}
                          type="button"
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="px-3 py-1.5 bg-gray-700 text-gray-200 text-xs rounded-full hover:bg-purple-600 hover:text-white transition-colors text-left"
                      >
                          {suggestion}
                      </button>
                  ))}
              </div>
          </div>
      )}

      <div className={`transition-opacity ${uploadedFile ? 'opacity-50' : 'opacity-100'}`}>
        <label htmlFor="aspect-ratio" className="block text-sm font-medium text-gray-300 mb-2">
          Aspect Ratio
        </label>
        <select
          id="aspect-ratio"
          name="aspect-ratio"
          className="block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm text-white focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition disabled:cursor-not-allowed"
          value={aspectRatio}
          onChange={(e) => setAspectRatio(e.target.value as AspectRatioOption)}
          disabled={isLoading || !!uploadedFile}
        >
          {ASPECT_RATIO_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {uploadedFile && <p className="text-xs text-gray-400 mt-1">Aspect ratio is determined by the uploaded image.</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Edit an Image <span className="text-gray-400">(Optional)</span>
        </label>
        {previewUrl && uploadedFile ? (
          <div className="relative group">
            <img src={previewUrl} alt={uploadedFile.name} className="w-full rounded-md object-cover max-h-60 border border-gray-600" />
            <button
              type="button"
              onClick={handleRemoveFile}
              className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1.5 hover:bg-black/75 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
              aria-label="Remove image"
            >
              <XIcon />
            </button>
          </div>
        ) : (
          <div
            className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md cursor-pointer hover:border-purple-500 transition-colors bg-gray-700/50"
            onDragOver={onDragOver}
            onDrop={onDrop}
            onClick={() => document.getElementById('image-upload')?.click()}
          >
            <div className="space-y-1 text-center">
              <UploadIcon />
              <div className="flex text-sm text-gray-400">
                <p className="pl-1">Drag & drop or <span className="font-semibold text-purple-400">browse</span></p>
              </div>
              <p className="text-xs text-gray-500">Only image files are supported</p>
            </div>
            <input id="image-upload" name="image-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading || !prompt}
        className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors"
      >
        {isLoading ? (
          <>
            <SpinnerIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
            {uploadedFile ? 'Editing...' : 'Generating...'}
          </>
        ) : (
          uploadedFile ? 'Generate Edit' : 'Generate'
        )}
      </button>
    </form>
  );
};

export default PromptForm;