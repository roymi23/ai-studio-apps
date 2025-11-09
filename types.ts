
export interface StoryboardPanelData {
  description: string;
  imagePrompt: string;
  imageBase64: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

export interface SceneData {
  description: string;
  image_prompt: string;
}
