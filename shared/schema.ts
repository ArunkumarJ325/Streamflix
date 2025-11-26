import { z } from "zod";

// Age Rating enum for content classification
export const AgeRating = {
  G: "G",
  PG: "PG", 
  PG13: "PG-13",
  R: "R",
  NC17: "NC-17",
  UNRATED: "Unrated"
} as const;

export type AgeRatingType = typeof AgeRating[keyof typeof AgeRating];

// Kids-safe ratings
export const KIDS_SAFE_RATINGS: AgeRatingType[] = ["G", "PG"];

// Profile schema
export const profileSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(20),
  avatarIndex: z.number().min(0).max(7),
  isKids: z.boolean().default(false),
});

export const insertProfileSchema = profileSchema.omit({ id: true });

export type Profile = z.infer<typeof profileSchema>;
export type InsertProfile = z.infer<typeof insertProfileSchema>;

// Movie metadata schema
export const movieMetadataSchema = z.object({
  id: z.string(),
  fileName: z.string(),
  filePath: z.string(),
  title: z.string(),
  year: z.number().nullable(),
  genre: z.array(z.string()),
  ageRating: z.string(),
  description: z.string(),
  duration: z.number().nullable(), // in minutes
  contentWarnings: z.array(z.string()),
  posterUrl: z.string().nullable(),
  isProcessed: z.boolean().default(false),
});

export type Movie = z.infer<typeof movieMetadataSchema>;
export type InsertMovie = Omit<Movie, "id">;

// Search/Filter params
export const movieFilterSchema = z.object({
  search: z.string().optional(),
  ageRating: z.string().optional(),
  genre: z.string().optional(),
  isKidsMode: z.boolean().optional(),
});

export type MovieFilter = z.infer<typeof movieFilterSchema>;

// Profile avatars - Netflix style colorful avatars
export const PROFILE_AVATARS = [
  { bg: "bg-red-500", icon: "user" },
  { bg: "bg-blue-500", icon: "smile" },
  { bg: "bg-green-500", icon: "star" },
  { bg: "bg-yellow-500", icon: "heart" },
  { bg: "bg-purple-500", icon: "music" },
  { bg: "bg-pink-500", icon: "film" },
  { bg: "bg-orange-500", icon: "gamepad" },
  { bg: "bg-cyan-500", icon: "book" },
];

// Legacy user schema for compatibility
export const users = {
  id: "id",
  username: "username",
  password: "password",
};

export const insertUserSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = InsertUser & { id: string };
