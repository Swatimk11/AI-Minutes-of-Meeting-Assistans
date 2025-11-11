
import { GoogleGenAI, Type } from "@google/genai";
import { Meeting } from '../types';

const meetingSchema = {
  type: Type.OBJECT,
  properties: {
    title: {
      type: Type.STRING,
      description: "A concise, descriptive title for the meeting. e.g., 'Q1 Campaign Results & Product Planning'",
    },
    attendees: {
      type: Type.ARRAY,
      description: "A list of people or teams who attended the meeting.",
      items: { type: Type.STRING },
    },
    summary: {
      type: Type.STRING,
      description: "A detailed, well-structured summary of the meeting discussion points in markdown format.",
    },
    actionItems: {
      type: Type.ARRAY,
      description: "A list of action items from the meeting.",
      items: {
        type: Type.OBJECT,
        properties: {
          owner: { type: Type.STRING, description: "The person or team responsible for the action item." },
          task: { type: Type.STRING, description: "The specific task to be completed." },
          dueDate: { type: Type.STRING, description: "The due date for the task, if mentioned (e.g., 'next Friday'). Can be null." },
        },
        required: ["owner", "task"],
      },
    },
  },
  required: ["title", "attendees", "summary", "actionItems"],
};

export const generateMeetingMinutes = async (rawText: string, apiKey: string): Promise<Omit<Meeting, 'id' | 'date'>> => {
  if (!apiKey) {
    throw new Error("API key is not configured.");
  }
  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Based on the following meeting summary, please extract the key details in the requested JSON format. Identify the title, attendees, a comprehensive summary, and any specific action items with their owners and due dates if available.

Meeting Summary:
---
${rawText}
---`,
      config: {
        responseMimeType: "application/json",
        responseSchema: meetingSchema,
      },
    });

    const jsonText = response.text.trim();
    const parsedData = JSON.parse(jsonText);
    
    // Basic validation
    if (!parsedData.title || !parsedData.attendees || !parsedData.summary) {
        throw new Error("Generated data is missing required fields.");
    }

    return {
        title: parsedData.title,
        attendees: parsedData.attendees || [],
        summary: parsedData.summary,
        actionItems: parsedData.actionItems || [],
    };

  } catch (error) {
    console.error("Error generating meeting minutes:", error);
    throw new Error("Failed to generate meeting minutes from the summary. Please check the console for details.");
  }
};
