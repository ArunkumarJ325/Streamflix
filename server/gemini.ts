import { GoogleGenAI } from "@google/genai";

// DON'T DELETE THIS COMMENT
// Follow these instructions when using this blueprint:
// - Note that the newest Gemini model series is "gemini-2.5-flash"

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

interface MovieMetadata {
  title: string;
  year: number | null;
  genre: string[];
  ageRating: string;
  description: string;
  contentWarnings: string[];
}

export async function extractMovieMetadata(fileName: string): Promise<MovieMetadata> {
  try {
    const systemPrompt = `You are a movie metadata expert. Given a video file name, extract or infer the movie details.

IMPORTANT: You must determine the appropriate age rating based on the movie:
- "G" for General Audiences - suitable for all ages
- "PG" for Parental Guidance - some material may not be suitable for young children
- "PG-13" for Parents Strongly Cautioned - some material may be inappropriate for children under 13
- "R" for Restricted - children under 17 require accompanying parent or adult guardian
- "NC-17" for Adults Only - no one 17 and under admitted
- "Unrated" if you cannot determine

For genres, use these categories: Action, Adventure, Animation, Comedy, Crime, Documentary, Drama, Family, Fantasy, Horror, Mystery, Romance, Sci-Fi, Thriller

For content warnings, list any applicable: Violence, Language, Sexual Content, Drug Use, Frightening Scenes, Gore

Clean up the file name to extract the actual movie title. Remove file extensions, release years in brackets, quality indicators (1080p, 720p, etc.), codec info (x264, x265, etc.), and other metadata.

Respond with JSON only.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            title: { type: "string" },
            year: { type: "number", nullable: true },
            genre: { type: "array", items: { type: "string" } },
            ageRating: { type: "string" },
            description: { type: "string" },
            contentWarnings: { type: "array", items: { type: "string" } },
          },
          required: ["title", "genre", "ageRating", "description", "contentWarnings"],
        },
      },
      contents: `Extract movie metadata from this file name: "${fileName}"`,
    });

    const rawJson = response.text;

    if (rawJson) {
      const data: MovieMetadata = JSON.parse(rawJson);
      return {
        title: data.title || cleanFileName(fileName),
        year: data.year || null,
        genre: data.genre || ["Unknown"],
        ageRating: data.ageRating || "Unrated",
        description: data.description || "No description available.",
        contentWarnings: data.contentWarnings || [],
      };
    }

    throw new Error("Empty response from Gemini");
  } catch (error) {
    console.error("Error extracting movie metadata:", error);
    // Return default metadata if Gemini fails
    return {
      title: cleanFileName(fileName),
      year: null,
      genre: ["Unknown"],
      ageRating: "Unrated",
      description: "Metadata extraction failed. Please update manually.",
      contentWarnings: [],
    };
  }
}

function cleanFileName(fileName: string): string {
  // Remove file extension
  let title = fileName.replace(/\.[^/.]+$/, "");

  // Remove common patterns
  title = title
    .replace(/\[(.*?)\]/g, "") // Remove brackets content
    .replace(/\((.*?)\)/g, "") // Remove parentheses content
    .replace(/\{(.*?)\}/g, "") // Remove braces content
    .replace(/\b(1080p|720p|480p|2160p|4k|hdr|bluray|brrip|dvdrip|webrip|web-dl|hdtv|x264|x265|h264|h265|aac|ac3|dts|subs?|eng?|dubbed)\b/gi, "")
    .replace(/[-._]/g, " ") // Replace separators with spaces
    .replace(/\s+/g, " ") // Collapse multiple spaces
    .trim();

  // Capitalize first letter of each word
  return title
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export async function analyzeMoviePoster(posterPath: string): Promise<string> {
  // This function could be used to analyze poster images if available
  // For now, we'll just return a placeholder
  return "";
}
