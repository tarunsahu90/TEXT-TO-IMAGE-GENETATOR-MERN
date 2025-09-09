import React, { useState, useCallback } from 'react';
import { generateImage } from './services/geminiService';
import PromptForm from './components/PromptForm';
import ImageDisplay from './components/ImageDisplay';
import { AspectRatioOption } from './types';
import { ASPECT_RATIO_OPTIONS } from './constants';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('A majestic lion in a field of flowers at sunrise');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<AspectRatioOption>(ASPECT_RATIO_OPTIONS[0].value);

  const handleGenerate = useCallback(async () => {
    if (!prompt) {
      setError('Please enter a prompt.');
      return;
    }

    // Reset states
    setIsLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      const imageResult = await generateImage(prompt, aspectRatio);
      const dataUrl = `data:image/png;base64,${imageResult}`;
      setImageUrl(dataUrl);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      console.error('Image generation failed:', errorMessage);
      setError(`Failed to generate image. ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [prompt, aspectRatio]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-6xl mx-auto">
        <header className="text-center mb-8">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-2">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                    Image Generator
                </span>
            </h1>
          <p className="text-lg text-gray-400">Turn your words into stunning, AI-generated art.</p>
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
            />
          </div>

          <div className="lg:w-2/3 flex flex-col">
            <ImageDisplay 
              isLoading={isLoading} 
              error={error} 
              imageUrl={imageUrl} 
              aspectRatio={aspectRatio} 
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
