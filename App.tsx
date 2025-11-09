
import React, { useState, useCallback } from 'react';
import ScriptInput from './components/ScriptInput';
import StoryboardDisplay from './components/StoryboardDisplay';
import ChatWidget from './components/ChatWidget';
import { generateStoryboardPanels } from './services/geminiService';
import type { StoryboardPanelData } from './types';

function App() {
  const [script, setScript] = useState('');
  const [storyboardPanels, setStoryboardPanels] = useState<StoryboardPanelData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleGenerateStoryboard = useCallback(async () => {
    if (!script.trim()) {
      setError('Script cannot be empty.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setStoryboardPanels([]);

    try {
      setLoadingMessage('Analyzing script and preparing scenes...');
      const panels = await generateStoryboardPanels(script, (progressMessage) => {
        setLoadingMessage(progressMessage);
      });
      setStoryboardPanels(panels);
    } catch (err) {
      console.error(err);
      setError('Failed to generate storyboard. Please check your script or API key and try again.');
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [script]);

  return (
    <div className="min-h-screen bg-dark-bg text-dark-text-primary font-sans">
      <header className="bg-dark-surface p-4 shadow-md border-b border-dark-border">
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-brand-primary to-brand-secondary text-transparent bg-clip-text">
          Storyboard AI Studio
        </h1>
        <p className="text-center text-dark-text-secondary mt-1">
          Bring your stories to life. Upload a script to generate a visual storyboard.
        </p>
      </header>

      <main className="p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="lg:sticky top-8 self-start">
             <ScriptInput
                script={script}
                setScript={setScript}
                onGenerate={handleGenerateStoryboard}
                isLoading={isLoading}
              />
          </div>
         
          <div className="min-h-[60vh]">
            <StoryboardDisplay
              panels={storyboardPanels}
              isLoading={isLoading}
              loadingMessage={loadingMessage}
              error={error}
            />
          </div>
        </div>
      </main>

      <ChatWidget />
    </div>
  );
}

export default App;
