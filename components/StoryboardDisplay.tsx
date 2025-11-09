
import React from 'react';
import type { StoryboardPanelData } from '../types';
import Loader from './Loader';

interface StoryboardPanelProps {
    panel: StoryboardPanelData;
}

const StoryboardPanel: React.FC<StoryboardPanelProps> = ({ panel }) => (
    <div className="bg-dark-surface rounded-lg overflow-hidden shadow-lg border border-dark-border transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl flex flex-col">
        <img 
            src={`data:image/jpeg;base64,${panel.imageBase64}`} 
            alt={panel.imagePrompt} 
            className="w-full h-48 object-cover" 
        />
        <div className="p-4 flex-grow flex flex-col">
            <p className="text-sm text-dark-text-secondary flex-grow">{panel.description}</p>
        </div>
    </div>
);

interface StoryboardDisplayProps {
  panels: StoryboardPanelData[];
  isLoading: boolean;
  loadingMessage: string;
  error: string | null;
}

const StoryboardDisplay: React.FC<StoryboardDisplayProps> = ({ panels, isLoading, loadingMessage, error }) => {
  if (isLoading) {
    return <Loader message={loadingMessage} />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-dark-surface p-8 rounded-lg border border-red-500/50">
        <svg className="w-16 h-16 text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <h3 className="text-xl font-semibold text-red-400">An Error Occurred</h3>
        <p className="text-dark-text-secondary mt-2 text-center">{error}</p>
      </div>
    );
  }

  if (panels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-dark-surface p-8 rounded-lg border-2 border-dashed border-dark-border">
        <svg className="w-16 h-16 text-dark-text-secondary mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
        <h3 className="text-xl font-semibold text-dark-text-primary">Your Storyboard Awaits</h3>
        <p className="text-dark-text-secondary mt-2 text-center">Enter a script and click "Generate" to see your vision come to life.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {panels.map((panel, index) => (
        <StoryboardPanel key={index} panel={panel} />
      ))}
    </div>
  );
};

export default StoryboardDisplay;
