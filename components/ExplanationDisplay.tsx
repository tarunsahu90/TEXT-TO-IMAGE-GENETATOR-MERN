import React from 'react';

interface ExplanationDisplayProps {
  isLoading: boolean;
  error: string | null;
  explanation: string | null;
}

const ExplanationDisplay: React.FC<ExplanationDisplayProps> = ({ isLoading, error, explanation }) => {
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center text-gray-400">
          <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p>Generating explanation...</p>
        </div>
      );
    }
    if (error) {
      return (
        <div className="text-center text-red-400">
          <p className="font-semibold">Explanation Failed</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      );
    }
    if (explanation) {
      // Replace newlines with <br> tags for rendering, and handle code blocks
      const formattedExplanation = explanation
        .split('```')
        .map((part, index) => {
          if (index % 2 === 1) { // This is a code block
            const lang = part.split('\n')[0];
            const code = part.substring(lang.length + 1);
            return `<pre class="bg-gray-900/50 p-4 rounded-md my-4 text-sm overflow-x-auto"><code class="language-${lang}">${code.trim()}</code></pre>`;
          }
          return part.replace(/\n/g, '<br />');
        })
        .join('');

      return (
        <div 
          className="text-gray-300 space-y-4 prose prose-invert prose-p:text-gray-300"
          dangerouslySetInnerHTML={{ __html: formattedExplanation }}
        />
      );
    }
    return (
      <div className="text-center text-gray-500">
        <p>Your explanation will appear here.</p>
      </div>
    );
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg min-h-[150px] flex flex-col justify-center">
        <h2 className="text-xl font-bold text-gray-100 mb-4">Explanation</h2>
        {renderContent()}
    </div>
  );
};

export default ExplanationDisplay;
