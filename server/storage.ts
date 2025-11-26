import { randomUUID } from "crypto";
import type { Profile, InsertProfile, Movie, InsertMovie } from "@shared/schema";

export interface IStorage {
  // Profile operations
  getProfiles(): Promise<Profile[]>;
  getProfile(id: string): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(id: string, profile: Partial<InsertProfile>): Promise<Profile | undefined>;
  deleteProfile(id: string): Promise<boolean>;
  
  // Movie operations
  getMovies(): Promise<Movie[]>;
  getMovie(id: string): Promise<Movie | undefined>;
  getMovieByFileName(fileName: string): Promise<Movie | undefined>;
  createMovie(movie: InsertMovie): Promise<Movie>;
  updateMovie(id: string, movie: Partial<InsertMovie>): Promise<Movie | undefined>;
  deleteMovie(id: string): Promise<boolean>;
  clearMovies(): Promise<void>;
}

export class MemStorage implements IStorage {
  private profiles: Map<string, Profile>;
  private movies: Map<string, Movie>;

  constructor() {
    this.profiles = new Map();
    this.movies = new Map();
    
    // Create a default profile
    const defaultProfile: Profile = {
      id: randomUUID(),
      name: "User",
      avatarIndex: 0,
      isKids: false,
    };
    this.profiles.set(defaultProfile.id, defaultProfile);
  }

  // Profile operations
  async getProfiles(): Promise<Profile[]> {
    return Array.from(this.profiles.values());
  }

  async getProfile(id: string): Promise<Profile | undefined> {
    return this.profiles.get(id);
  }

  async createProfile(insertProfile: InsertProfile): Promise<Profile> {
    const id = randomUUID();
    const profile: Profile = { ...insertProfile, id };
    this.profiles.set(id, profile);
    return profile;
  }

  async updateProfile(id: string, updates: Partial<InsertProfile>): Promise<Profile | undefined> {
    const existing = this.profiles.get(id);
    if (!existing) return undefined;
    
    const updated: Profile = { ...existing, ...updates };
    this.profiles.set(id, updated);
    return updated;
  }

  async deleteProfile(id: string): Promise<boolean> {
    return this.profiles.delete(id);
  }

  // Movie operations
  async getMovies(): Promise<Movie[]> {
    return Array.from(this.movies.values());
  }

  async getMovie(id: string): Promise<Movie | undefined> {
    return this.movies.get(id);
  }

  async getMovieByFileName(fileName: string): Promise<Movie | undefined> {
    return Array.from(this.movies.values()).find(
      (movie) => movie.fileName === fileName
    );
  }

  async createMovie(insertMovie: InsertMovie): Promise<Movie> {
    const id = randomUUID();
    const movie: Movie = { ...insertMovie, id };
    this.movies.set(id, movie);
    return movie;
  }

  async updateMovie(id: string, updates: Partial<InsertMovie>): Promise<Movie | undefined> {
    const existing = this.movies.get(id);
    if (!existing) return undefined;
    
    const updated: Movie = { ...existing, ...updates };
    this.movies.set(id, updated);
    return updated;
  }

  async deleteMovie(id: string): Promise<boolean> {
    return this.movies.delete(id);
  }

  async clearMovies(): Promise<void> {
    this.movies.clear();
  }
}

export const storage = new MemStorage();
