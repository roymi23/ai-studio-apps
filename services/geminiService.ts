
import { GoogleGenAI, Type, Chat } from '@google/genai';
import type { StoryboardPanelData, SceneData, ChatMessage } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
let chat: Chat | null = null;

const SCRIPT_ANALYSIS_SCHEMA = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      description: {
        type: Type.STRING,
        description: 'A brief summary of the action or dialogue in the scene.',
      },
      image_prompt: {
        type: Type.STRING,
        description:
          'A detailed, vivid, and cinematic prompt for an AI image generator, describing characters, setting, lighting, camera angle, and mood.',
      },
    },
    required: ['description', 'image_prompt'],
  },
};

async function getScenesFromScript(script: string): Promise<SceneData[]> {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Analyze the following film script. Your task is to divide it into distinct, visually representable scenes. For each scene, create a JSON object containing: 1. 'description': A brief summary of the action or dialogue in the scene. 2. 'image_prompt': A detailed, vivid, and cinematic prompt for an AI image generator. This prompt should describe the characters, setting, lighting, camera angle, and mood. Ensure your output is a valid JSON array of these objects. Do not include any text outside of the JSON array. Script: \n\n${script}`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: SCRIPT_ANALYSIS_SCHEMA,
    },
  });

  const jsonText = response.text.trim();
  try {
    const scenes = JSON.parse(jsonText);
    if (!Array.isArray(scenes)) {
        throw new Error("Parsed response is not an array.");
    }
    return scenes;
  } catch (e) {
      console.error("Failed to parse JSON from model response:", jsonText);
      throw new Error("Could not parse scenes from the script.");
  }
}

async function generateImage(prompt: string): Promise<string> {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '16:9',
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
        return response.generatedImages[0].image.imageBytes;
    }
    throw new Error('Image generation failed to produce an image.');
}


export async function generateStoryboardPanels(
  script: string,
  onProgress: (message: string) => void
): Promise<StoryboardPanelData[]> {
  onProgress('Analyzing script to identify key scenes...');
  const scenes = await getScenesFromScript(script);

  if (scenes.length === 0) {
    throw new Error('No scenes could be generated from the script.');
  }

  const panelPromises = scenes.map(async (scene, index) => {
    onProgress(`Generating image ${index + 1} of ${scenes.length}: ${scene.description.substring(0, 40)}...`);
    const imageBase64 = await generateImage(scene.image_prompt);
    return {
      description: scene.description,
      imagePrompt: scene.image_prompt,
      imageBase64,
    };
  });

  return Promise.all(panelPromises);
}

function initializeChat() {
  if (!chat) {
    chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: 'You are a helpful assistant for screenwriters and filmmakers. Answer questions about scriptwriting, cinematography, storytelling, or the storyboard generation process.',
      },
    });
  }
}

export async function getChatResponse(history: ChatMessage[], newMessage: string): Promise<string> {
  initializeChat();
  if (!chat) {
      throw new Error("Chat not initialized");
  }

  // Note: A more robust implementation would sync the full history.
  // For this example, we're sending the latest message.
  const response = await chat.sendMessage({ message: newMessage });
  return response.text;
}
