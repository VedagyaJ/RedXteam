import express, { Request, Response } from "express";
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertUserSchema,
  insertProgramSchema,
  insertReportSchema,
  insertProgramTagSchema,
  insertResourceSchema,
  UserType,
  StatusType,
  users,
  programs,
  reports,
  programTags,
  resources,
} from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  const apiRouter = express.Router();

  // Error handling middleware
  const handleErrors = (err: Error, res: Response) => {
    console.error("API Error:", err);
    
    if (err instanceof ZodError) {
      const validationError = fromZodError(err);
      return res.status(400).json({ 
        message: "Validation Error", 
        errors: validationError.details 
      });
    }
    
    res.status(500).json({ message: err.message || "Internal Server Error" });
  };

  // Authentication endpoints
  apiRouter.post("/auth/register", async (req: Request, res: Response) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username already exists
      const existingUsername = await storage.getUserByUsername(userData.username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already taken" });
      }
      
      // Check if email already exists
      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already registered" });
      }
      
      const newUser = await storage.createUser(userData);
      
      // Don't return the password in the response
      const { password, ...userWithoutPassword } = newUser;
      
      res.status(201).json(userWithoutPassword);
    } catch (err) {
      handleErrors(err as Error, res);
    }
  });

  apiRouter.post("/auth/login", async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
      }
      
      const user = await storage.getUserByUsername(username);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      // Don't return the password in the response
      const { password: _, ...userWithoutPassword } = user;
      
      res.status(200).json(userWithoutPassword);
    } catch (err) {
      handleErrors(err as Error, res);
    }
  });

  // User endpoints
  apiRouter.get("/users/:id", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Don't return the password in the response
      const { password, ...userWithoutPassword } = user;
      
      res.status(200).json(userWithoutPassword);
    } catch (err) {
      handleErrors(err as Error, res);
    }
  });

  apiRouter.get("/users/type/:userType", async (req: Request, res: Response) => {
    try {
      const userType = req.params.userType;
      
      if (!Object.values(UserType).includes(userType as any)) {
        return res.status(400).json({ message: "Invalid user type" });
      }
      
      const users = await storage.getUsersByType(userType);
      
      // Remove passwords from response
      const usersWithoutPasswords = users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      
      res.status(200).json(usersWithoutPasswords);
    } catch (err) {
      handleErrors(err as Error, res);
    }
  });

  // Program endpoints
  apiRouter.get("/programs", async (_req: Request, res: Response) => {
    try {
      const programs = await storage.getPrograms();
      
      // Fetch organization details and tags for each program
      const programsWithDetails = await Promise.all(programs.map(async (program) => {
        const tags = await storage.getProgramTags(program.id);
        const organization = await storage.getUser(program.organizationId);
        
        return {
          ...program,
          tags: tags.map(tag => tag.tag),
          organizationName: organization?.fullName || "Unknown Organization"
        };
      }));
      
      res.status(200).json(programsWithDetails);
    } catch (err) {
      handleErrors(err as Error, res);
    }
  });

  apiRouter.get("/programs/popular", async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 3;
      const popularPrograms = await storage.getPopularPrograms(limit);
      
      // Fetch organization details and tags for each program
      const programsWithDetails = await Promise.all(popularPrograms.map(async (program) => {
        const tags = await storage.getProgramTags(program.id);
        const organization = await storage.getUser(program.organizationId);
        
        return {
          ...program,
          tags: tags.map(tag => tag.tag),
          organizationName: organization?.fullName || "Unknown Organization"
        };
      }));
      
      res.status(200).json(programsWithDetails);
    } catch (err) {
      handleErrors(err as Error, res);
    }
  });

  apiRouter.get("/programs/:id", async (req: Request, res: Response) => {
    try {
      const programId = parseInt(req.params.id);
      
      if (isNaN(programId)) {
        return res.status(400).json({ message: "Invalid program ID" });
      }
      
      const program = await storage.getProgram(programId);
      
      if (!program) {
        return res.status(404).json({ message: "Program not found" });
      }
      
      // Fetch tags and organization info
      const tags = await storage.getProgramTags(programId);
      const organization = await storage.getUser(program.organizationId);
      
      const programWithDetails = {
        ...program,
        tags: tags.map(tag => tag.tag),
        organizationName: organization?.fullName || "Unknown Organization"
      };
      
      res.status(200).json(programWithDetails);
    } catch (err) {
      handleErrors(err as Error, res);
    }
  });

  apiRouter.post("/programs", async (req: Request, res: Response) => {
    try {
      const programData = insertProgramSchema.parse(req.body);
      const { tags, ...programDetails } = programData as any;
      
      // Check if organization exists
      const organization = await storage.getUser(programDetails.organizationId);
      if (!organization || organization.userType !== UserType.ORGANIZATION) {
        return res.status(400).json({ message: "Invalid organization ID" });
      }
      
      const newProgram = await storage.createProgram(programDetails);
      
      // Add tags if provided
      if (tags && Array.isArray(tags)) {
        await Promise.all(tags.map(async (tag: string) => {
          await storage.createProgramTag({
            programId: newProgram.id,
            tag
          });
        }));
      }
      
      res.status(201).json(newProgram);
    } catch (err) {
      handleErrors(err as Error, res);
    }
  });

  apiRouter.get("/programs/organization/:organizationId", async (req: Request, res: Response) => {
    try {
      const organizationId = parseInt(req.params.organizationId);
      
      if (isNaN(organizationId)) {
        return res.status(400).json({ message: "Invalid organization ID" });
      }
      
      const programs = await storage.getProgramsByOrganization(organizationId);
      
      // Fetch tags for each program
      const programsWithTags = await Promise.all(programs.map(async (program) => {
        const tags = await storage.getProgramTags(program.id);
        return {
          ...program,
          tags: tags.map(tag => tag.tag)
        };
      }));
      
      res.status(200).json(programsWithTags);
    } catch (err) {
      handleErrors(err as Error, res);
    }
  });

  // Report endpoints
  apiRouter.get("/reports", async (_req: Request, res: Response) => {
    try {
      const reports = await storage.getReports();
      
      // Fetch program and hacker details for each report
      const reportsWithDetails = await Promise.all(reports.map(async (report) => {
        const program = await storage.getProgram(report.programId);
        const hacker = await storage.getUser(report.hackerId);
        
        return {
          ...report,
          programTitle: program?.title || "Unknown Program",
          hackerUsername: hacker?.username || "Unknown Hacker"
        };
      }));
      
      res.status(200).json(reportsWithDetails);
    } catch (err) {
      handleErrors(err as Error, res);
    }
  });

  apiRouter.get("/reports/:id", async (req: Request, res: Response) => {
    try {
      const reportId = parseInt(req.params.id);
      
      if (isNaN(reportId)) {
        return res.status(400).json({ message: "Invalid report ID" });
      }
      
      const report = await storage.getReport(reportId);
      
      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }
      
      // Fetch program and hacker details
      const program = await storage.getProgram(report.programId);
      const hacker = await storage.getUser(report.hackerId);
      
      const reportWithDetails = {
        ...report,
        programTitle: program?.title || "Unknown Program",
        hackerUsername: hacker?.username || "Unknown Hacker"
      };
      
      res.status(200).json(reportWithDetails);
    } catch (err) {
      handleErrors(err as Error, res);
    }
  });

  apiRouter.post("/reports", async (req: Request, res: Response) => {
    try {
      const reportData = insertReportSchema.parse(req.body);
      
      // Check if program and hacker exist
      const program = await storage.getProgram(reportData.programId);
      if (!program) {
        return res.status(400).json({ message: "Invalid program ID" });
      }
      
      const hacker = await storage.getUser(reportData.hackerId);
      if (!hacker || hacker.userType !== UserType.HACKER) {
        return res.status(400).json({ message: "Invalid hacker ID" });
      }
      
      const newReport = await storage.createReport(reportData);
      
      res.status(201).json(newReport);
    } catch (err) {
      handleErrors(err as Error, res);
    }
  });

  apiRouter.put("/reports/:id/status", async (req: Request, res: Response) => {
    try {
      const reportId = parseInt(req.params.id);
      const { status, rewardAmount } = req.body;
      
      if (isNaN(reportId)) {
        return res.status(400).json({ message: "Invalid report ID" });
      }
      
      if (!Object.values(StatusType).includes(status as any)) {
        return res.status(400).json({ message: "Invalid status" });
      }
      
      const report = await storage.getReport(reportId);
      
      if (!report) {
        return res.status(404).json({ message: "Report not found" });
      }
      
      const updateData: any = { status };
      
      // Update reward amount if provided and status is ACCEPTED
      if (status === StatusType.ACCEPTED && rewardAmount !== undefined) {
        updateData.rewardAmount = rewardAmount;
      }
      
      const updatedReport = await storage.updateReport(reportId, updateData);
      
      res.status(200).json(updatedReport);
    } catch (err) {
      handleErrors(err as Error, res);
    }
  });

  apiRouter.get("/reports/program/:programId", async (req: Request, res: Response) => {
    try {
      const programId = parseInt(req.params.programId);
      
      if (isNaN(programId)) {
        return res.status(400).json({ message: "Invalid program ID" });
      }
      
      const reports = await storage.getReportsByProgram(programId);
      
      // Fetch hacker details for each report
      const reportsWithHackerDetails = await Promise.all(reports.map(async (report) => {
        const hacker = await storage.getUser(report.hackerId);
        
        return {
          ...report,
          hackerUsername: hacker?.username || "Unknown Hacker"
        };
      }));
      
      res.status(200).json(reportsWithHackerDetails);
    } catch (err) {
      handleErrors(err as Error, res);
    }
  });

  apiRouter.get("/reports/hacker/:hackerId", async (req: Request, res: Response) => {
    try {
      const hackerId = parseInt(req.params.hackerId);
      
      if (isNaN(hackerId)) {
        return res.status(400).json({ message: "Invalid hacker ID" });
      }
      
      const reports = await storage.getReportsByHacker(hackerId);
      
      // Fetch program details for each report
      const reportsWithProgramDetails = await Promise.all(reports.map(async (report) => {
        const program = await storage.getProgram(report.programId);
        
        return {
          ...report,
          programTitle: program?.title || "Unknown Program"
        };
      }));
      
      res.status(200).json(reportsWithProgramDetails);
    } catch (err) {
      handleErrors(err as Error, res);
    }
  });

  // Resource endpoints
  apiRouter.get("/resources", async (_req: Request, res: Response) => {
    try {
      const resources = await storage.getResources();
      
      // Fetch author details for each resource
      const resourcesWithAuthorDetails = await Promise.all(resources.map(async (resource) => {
        const author = await storage.getUser(resource.authorId);
        
        return {
          ...resource,
          authorName: author?.fullName || "Unknown Author"
        };
      }));
      
      res.status(200).json(resourcesWithAuthorDetails);
    } catch (err) {
      handleErrors(err as Error, res);
    }
  });

  apiRouter.post("/resources", async (req: Request, res: Response) => {
    try {
      const resourceData = insertResourceSchema.parse(req.body);
      
      // Check if author exists
      const author = await storage.getUser(resourceData.authorId);
      if (!author) {
        return res.status(400).json({ message: "Invalid author ID" });
      }
      
      const newResource = await storage.createResource(resourceData);
      
      res.status(201).json(newResource);
    } catch (err) {
      handleErrors(err as Error, res);
    }
  });

  // Dashboard stats endpoints
  apiRouter.get("/stats/hacker/:hackerId", async (req: Request, res: Response) => {
    try {
      const hackerId = parseInt(req.params.hackerId);
      
      if (isNaN(hackerId)) {
        return res.status(400).json({ message: "Invalid hacker ID" });
      }
      
      const hacker = await storage.getUser(hackerId);
      
      if (!hacker || hacker.userType !== UserType.HACKER) {
        return res.status(404).json({ message: "Hacker not found" });
      }
      
      const stats = await storage.getHackerStats(hackerId);
      
      res.status(200).json(stats);
    } catch (err) {
      handleErrors(err as Error, res);
    }
  });

  apiRouter.get("/stats/organization/:organizationId", async (req: Request, res: Response) => {
    try {
      const organizationId = parseInt(req.params.organizationId);
      
      if (isNaN(organizationId)) {
        return res.status(400).json({ message: "Invalid organization ID" });
      }
      
      const organization = await storage.getUser(organizationId);
      
      if (!organization || organization.userType !== UserType.ORGANIZATION) {
        return res.status(404).json({ message: "Organization not found" });
      }
      
      const stats = await storage.getOrganizationStats(organizationId);
      
      res.status(200).json(stats);
    } catch (err) {
      handleErrors(err as Error, res);
    }
  });

  // Leaderboard endpoint
  apiRouter.get("/leaderboard", async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const topHackers = await storage.getTopHackers(limit);
      
      // Calculate additional stats for each hacker
      const hackersWithStats = await Promise.all(topHackers.map(async (hacker) => {
        const reports = await storage.getReportsByHacker(hacker.id);
        
        // Calculate total earnings
        const earnings = reports.reduce((total, report) => {
          return total + (report.rewardAmount || 0);
        }, 0);
        
        // Don't include password in response
        const { password, ...hackerWithoutPassword } = hacker;
        
        return {
          ...hackerWithoutPassword,
          reportsCount: reports.length,
          earnings
        };
      }));
      
      res.status(200).json(hackersWithStats);
    } catch (err) {
      handleErrors(err as Error, res);
    }
  });

  // Register the API router
  app.use("/api", apiRouter);

  const httpServer = createServer(app);

  return httpServer;
}
