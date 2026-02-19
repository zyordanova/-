import { GoogleGenAI, Type } from "@google/genai";
import { Question, Difficulty } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getPromptForDifficulty = (difficulty: Difficulty) => {
  let constraint = "";
  if (difficulty === Difficulty.EASY) {
    constraint = "Use simple numbers (1-20). Avoid complex sentence structures.";
  } else if (difficulty === Difficulty.MEDIUM) {
    constraint = "Use numbers up to 50.";
  } else {
    constraint = "Use numbers up to 100. The problem can be slightly more complex (two steps).";
  }

  return `
    Generate a creative math word problem for a 2nd grade student in Bulgarian. 
    ${constraint}
    The problem should involve either multiplication or division.
    The story should be engaging (e.g., about animals, space, magic, or school).
    Provide 3 multiple choice options. One is correct.
  `;
};

export const generateStoryProblem = async (difficulty: Difficulty = Difficulty.MEDIUM): Promise<Question | null> => {
  try {
    const prompt = getPromptForDifficulty(difficulty);

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            questionText: { type: Type.STRING, description: "The word problem text in standard Bulgarian (Cyrillic)." },
            options: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING },
              description: "Three possible answers as strings (e.g. '15 ябълки')."
            },
            correctIndex: { type: Type.INTEGER, description: "The index (0-2) of the correct answer." },
            explanation: { type: Type.STRING, description: "A simple, correct grammatical explanation of the solution in standard Bulgarian." }
          },
          required: ["questionText", "options", "correctIndex", "explanation"],
        },
      },
    });

    const data = JSON.parse(response.text || "{}");

    if (!data.questionText) return null;

    return {
      id: Date.now().toString(),
      text: data.questionText,
      options: data.options,
      correctAnswerIndex: data.correctIndex,
      explanation: data.explanation,
      type: 'story'
    };
  } catch (error) {
    console.error("Error generating story problem:", error);
    return null;
  }
};

export const getEncouragement = async (isCorrect: boolean): Promise<string> => {
  try {
    // Strict pedagogical prompt for standard Bulgarian
    const prompt = `
      Ти си опитен начален учител в България.
      Твоята задача е да дадещ кратка обратна връзка на ученик от 2-ри клас.
      
      Ситуация: Ученикът отговори ${isCorrect ? 'ВЯРНО' : 'ГРЕШНО'} на задача.
      
      Изисквания:
      1. Използвай само книжовен български език (кирилица).
      2. Без жаргон, без английски думи, без правописни грешки.
      3. Максимум 6 думи.
      4. ${isCorrect 
            ? 'Фразата трябва да е похвала (напр. "Отлично се справи!", "Поздравления за успеха!", "Чудесен резултат!").' 
            : 'Фразата трябва да е мотивираща корекция (напр. "Опитай отново.", "Помисли още малко.", "Не се отказвай!").'}
      
      Върни само текста.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text?.trim() || (isCorrect ? "Отлично се справи!" : "Опитай отново!");
  } catch (e) {
    return isCorrect ? "Поздравления!" : "Пробвай пак!";
  }
};