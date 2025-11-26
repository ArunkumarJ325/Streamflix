import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { extractMovieMetadata } from "./gemini";
import { insertProfileSchema } from "@shared/schema";
import * as fs from "fs";
import * as path from "path";

// Supported video file extensions
const VIDEO_EXTENSIONS = [".mp4", ".mkv", ".avi", ".mov", ".wmv", ".flv", ".webm", ".m4v"];

// Movies directory path
const MOVIES_DIR = path.join(process.cwd(), "movies");

export async function registerRoutes(app: Express): Promise<Server> {
  // ============ PROFILE ROUTES ============
  
  // Get all profiles
  app.get("/api/profiles", async (req: Request, res: Response) => {
    try {
      const profiles = await storage.getProfiles();
      res.json(profiles);
    } catch (error) {
      console.error("Error fetching profiles:", error);
      res.status(500).json({ error: "Failed to fetch profiles" });
    }
  });

  // Get single profile
  app.get("/api/profiles/:id", async (req: Request, res: Response) => {
    try {
      const profile = await storage.getProfile(req.params.id);
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      console.error("Error fetching profile:", error);
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  // Create profile
  app.post("/api/profiles", async (req: Request, res: Response) => {
    try {
      const parsed = insertProfileSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid profile data", details: parsed.error });
      }
      
      const profiles = await storage.getProfiles();
      if (profiles.length >= 5) {
        return res.status(400).json({ error: "Maximum 5 profiles allowed" });
      }
      
      const profile = await storage.createProfile(parsed.data);
      res.status(201).json(profile);
    } catch (error) {
      console.error("Error creating profile:", error);
      res.status(500).json({ error: "Failed to create profile" });
    }
  });

  // Update profile
  app.put("/api/profiles/:id", async (req: Request, res: Response) => {
    try {
      const parsed = insertProfileSchema.partial().safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: "Invalid profile data", details: parsed.error });
      }
      
      const profile = await storage.updateProfile(req.params.id, parsed.data);
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ error: "Failed to update profile" });
    }
  });

  // Delete profile
  app.delete("/api/profiles/:id", async (req: Request, res: Response) => {
    try {
      const deleted = await storage.deleteProfile(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Profile not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting profile:", error);
      res.status(500).json({ error: "Failed to delete profile" });
    }
  });

  // ============ MOVIE ROUTES ============
  
  // Get all movies
  app.get("/api/movies", async (req: Request, res: Response) => {
    try {
      const movies = await storage.getMovies();
      res.json(movies);
    } catch (error) {
      console.error("Error fetching movies:", error);
      res.status(500).json({ error: "Failed to fetch movies" });
    }
  });

  // Get single movie
  app.get("/api/movies/:id", async (req: Request, res: Response) => {
    try {
      const movie = await storage.getMovie(req.params.id);
      if (!movie) {
        return res.status(404).json({ error: "Movie not found" });
      }
      res.json(movie);
    } catch (error) {
      console.error("Error fetching movie:", error);
      res.status(500).json({ error: "Failed to fetch movie" });
    }
  });

  // Scan movies directory
  app.post("/api/movies/scan", async (req: Request, res: Response) => {
    try {
      // Create movies directory if it doesn't exist
      if (!fs.existsSync(MOVIES_DIR)) {
        fs.mkdirSync(MOVIES_DIR, { recursive: true });
      }

      const files = fs.readdirSync(MOVIES_DIR);
      const videoFiles = files.filter((file) => {
        const ext = path.extname(file).toLowerCase();
        return VIDEO_EXTENSIONS.includes(ext);
      });

      const processedMovies = [];

      for (const fileName of videoFiles) {
        // Check if movie already exists
        const existing = await storage.getMovieByFileName(fileName);
        if (existing) {
          processedMovies.push(existing);
          continue;
        }

        // Extract metadata using Gemini
        const metadata = await extractMovieMetadata(fileName);
        
        const movie = await storage.createMovie({
          fileName,
          filePath: path.join(MOVIES_DIR, fileName),
          title: metadata.title,
          year: metadata.year,
          genre: metadata.genre,
          ageRating: metadata.ageRating,
          description: metadata.description,
          duration: null, // Would need ffprobe to extract
          contentWarnings: metadata.contentWarnings,
          posterUrl: null, // Could be extracted from video or fetched from TMDB
          isProcessed: true,
        });

        processedMovies.push(movie);
      }

      res.json({
        message: "Scan complete",
        totalFiles: videoFiles.length,
        movies: processedMovies,
      });
    } catch (error) {
      console.error("Error scanning movies:", error);
      res.status(500).json({ error: "Failed to scan movies directory" });
    }
  });

  // Stream movie
  app.get("/api/movies/:id/stream", async (req: Request, res: Response) => {
    try {
      const movie = await storage.getMovie(req.params.id);
      if (!movie) {
        return res.status(404).json({ error: "Movie not found" });
      }

      const filePath = movie.filePath;
      
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "Movie file not found" });
      }

      const stat = fs.statSync(filePath);
      const fileSize = stat.size;
      const range = req.headers.range;

      if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
        const chunkSize = end - start + 1;

        const file = fs.createReadStream(filePath, { start, end });
        const ext = path.extname(filePath).toLowerCase();
        const mimeType = getMimeType(ext);

        res.writeHead(206, {
          "Content-Range": `bytes ${start}-${end}/${fileSize}`,
          "Accept-Ranges": "bytes",
          "Content-Length": chunkSize,
          "Content-Type": mimeType,
        });

        file.pipe(res);
      } else {
        const ext = path.extname(filePath).toLowerCase();
        const mimeType = getMimeType(ext);

        res.writeHead(200, {
          "Content-Length": fileSize,
          "Content-Type": mimeType,
        });

        fs.createReadStream(filePath).pipe(res);
      }
    } catch (error) {
      console.error("Error streaming movie:", error);
      res.status(500).json({ error: "Failed to stream movie" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

function getMimeType(ext: string): string {
  const mimeTypes: Record<string, string> = {
    ".mp4": "video/mp4",
    ".mkv": "video/x-matroska",
    ".avi": "video/x-msvideo",
    ".mov": "video/quicktime",
    ".wmv": "video/x-ms-wmv",
    ".flv": "video/x-flv",
    ".webm": "video/webm",
    ".m4v": "video/x-m4v",
  };
  return mimeTypes[ext] || "application/octet-stream";
}
