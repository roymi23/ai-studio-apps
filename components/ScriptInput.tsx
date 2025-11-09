
import React from 'react';

interface ScriptInputProps {
  script: string;
  setScript: (script: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

const ScriptInput: React.FC<ScriptInputProps> = ({ script, setScript, onGenerate, isLoading }) => {
  return (
    <div className="bg-dark-surface p-6 rounded-lg shadow-lg border border-dark-border flex flex-col h-full">
      <h2 className="text-2xl font-semibold mb-4 text-dark-text-primary">Your Script</h2>
      <textarea
        value={script}
        onChange={(e) => setScript(e.target.value)}
        placeholder="Paste your script here...&#10;&#10;e.g.&#10;SCENE START&#10;INT. COFFEE SHOP - DAY&#10;JANE sits by the window, sipping her latte. The rain streaks down the glass."
        className="flex-grow w-full p-4 bg-dark-bg border border-dark-border rounded-md resize-none text-dark-text-secondary focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition-colors duration-200 min-h-[300px] lg:min-h-[400px]"
        disabled={isLoading}
      />
      <button
        onClick={onGenerate}
        disabled={isLoading}
        className="mt-4 w-full bg-brand-primary hover:bg-brand-secondary text-white font-bold py-3 px-4 rounded-md transition-all duration-300 ease-in-out disabled:bg-gray-500 disabled:cursor-not-allowed flex items-center justify-center transform hover:scale-105 disabled:scale-100"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </>
        ) : (
          'Generate Storyboard'
        )}
      </button>
    </div>
  );
};

export default ScriptInput;
