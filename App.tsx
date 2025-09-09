import React, { useState, useCallback } from 'react';
import { generateImage, editImage, getPromptRecommendations } from './services/geminiService';
import PromptForm from './components/PromptForm';
import ImageDisplay from './components/ImageDisplay';
import Description from './components/Description';
import { AspectRatioOption } from './types';
import { ASPECT_RATIO_OPTIONS } from './constants';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('A majestic lion in a field of flowers at sunrise');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<AspectRatioOption>(ASPECT_RATIO_OPTIONS[0].value);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSuggesting, setIsSuggesting] = useState<boolean>(false);

  const fileToBase64 = (file: File): Promise<{ mimeType: string; data: string }> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result !== 'string') {
          return reject(new Error('FileReader result is not a string'));
        }
        const [meta, data] = reader.result.split(',');
        const mimeType = meta.match(/:(.*?);/)?.[1];
        if (!mimeType) {
          return reject(new Error('Could not determine MIME type'));
        }
        resolve({ mimeType, data });
      };
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });

  const handleGenerate = useCallback(async () => {
    if (!prompt) {
      setError('Please enter a prompt.');
      return;
    }

    // Reset states
    setIsLoading(true);
    setError(null);
    setImageUrl(null);
    setSuggestions([]);

    try {
      let imageResult: string;
      if (uploadedFile) {
        const { mimeType, data } = await fileToBase64(uploadedFile);
        imageResult = await editImage(prompt, { mimeType, data });
      } else {
        imageResult = await generateImage(prompt, aspectRatio);
      }
      const dataUrl = `data:image/png;base64,${imageResult}`;
      setImageUrl(dataUrl);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      console.error('Image generation/editing failed:', errorMessage);
      setError(`Failed to process image. ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [prompt, aspectRatio, uploadedFile]);

  const handleSuggest = useCallback(async () => {
    if (!prompt || isSuggesting) return;
    
    setIsSuggesting(true);
    setSuggestions([]); // Clear old suggestions
    setError(null);

    try {
      const recommendations = await getPromptRecommendations(prompt);
      setSuggestions(recommendations);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      console.error('Suggestion generation failed:', errorMessage);
      setError(`Failed to get suggestions. ${errorMessage}`);
    } finally {
      setIsSuggesting(false);
    }
  }, [prompt, isSuggesting]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-6xl mx-auto">
        <header className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-2">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                    Image Generator & Editor
                </span>
            </h1>
          <p className="text-lg text-gray-400">Turn your words and images into stunning, AI-generated art.</p>
        </header>

        <main className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/3">
            <PromptForm
              prompt={prompt}
              setPrompt={setPrompt}
              aspectRatio={aspectRatio}
              setAspectRatio={setAspectRatio}
              onSubmit={handleGenerate}
              isLoading={isLoading}
              uploadedFile={uploadedFile}
              setUploadedFile={setUploadedFile}
              onSuggest={handleSuggest}
              isSuggesting={isSuggesting}
              suggestions={suggestions}
              setSuggestions={setSuggestions}
            />
            <Description />
          </div>

          <div className="lg:w-2/3 flex flex-col">
            <ImageDisplay 
              isLoading={isLoading} 
              error={error} 
              imageUrl={imageUrl} 
              aspectRatio={aspectRatio}
              prompt={prompt}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;