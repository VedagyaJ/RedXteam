import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertUserSchema, insertProgramSchema, 
  insertReportSchema, insertReportCommentSchema 
} from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import MemoryStore from "memorystore";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Setup session
  const MemoryStoreInstance = MemoryStore(session);
  app.use(session({
    secret: process.env.SESSION_SECRET || 'redxteam-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    },
    store: new MemoryStoreInstance({
      checkPeriod: 86400000 // prune expired entries every 24h
    })
  }));

  // Setup passport authentication
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new LocalStrategy(async (username, password, done) => {
    try {
      const user = await storage.getUserByUsername(username);
      
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      
      // In a real app, we'd use bcrypt to compare passwords
      if (user.password !== password) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }));

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // Auth middleware
  const isAuthenticated = (req: Request, res: Response, next: any) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: 'Unauthorized' });
  };

  const isOrganization = (req: Request, res: Response, next: any) => {
    if (req.isAuthenticated() && (req.user as any).role === 'organization') {
      return next();
    }
    res.status(403).json({ message: 'Forbidden: Organization role required' });
  };

  const isHacker = (req: Request, res: Response, next: any) => {
    if (req.isAuthenticated() && (req.user as any).role === 'hacker') {
      return next();
    }
    res.status(403).json({ message: 'Forbidden: Hacker role required' });
  };

  // Error handling middleware
  app.use((err: any, req: Request, res: Response, next: any) => {
    if (err instanceof ZodError) {
      return res.status(400).json({ error: fromZodError(err).message });
    }
    next(err);
  });

  // Authentication routes
  app.post('/api/auth/register', async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if username already exists
      const existingUsername = await storage.getUserByUsername(userData.username);
      if (existingUsername) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      
      // Check if email already exists
      const existingEmail = await storage.getUserByEmail(userData.email);
      if (existingEmail) {
        return res.status(400).json({ message: 'Email already exists' });
      }
      
      // Create user
      const user = await storage.createUser(userData);
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      // Log in the user
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: 'Error during login after registration' });
        }
        return res.status(201).json(userWithoutPassword);
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: fromZodError(error).message });
      }
      return res.status(500).json({ message: 'Error creating user' });
    }
  });

  app.post('/api/auth/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ message: info.message });
      }
      req.login(user, (err) => {
        if (err) {
          return next(err);
        }
        
        // Remove password from response
        const { password, ...userWithoutPassword } = user;
        return res.json(userWithoutPassword);
      });
    })(req, res, next);
  });

  app.post('/api/auth/logout', (req, res) => {
    req.logout(function(err) {
      if (err) { 
        return res.status(500).json({ message: 'Error during logout' });
      }
      res.json({ message: 'Logged out successfully' });
    });
  });

  app.get('/api/auth/session', (req, res) => {
    if (req.isAuthenticated()) {
      const { password, ...userWithoutPassword } = req.user as any;
      return res.json(userWithoutPassword);
    }
    res.status(401).json({ message: 'Not logged in' });
  });

  // Program routes
  app.get('/api/programs', async (req, res) => {
    try {
      const query = req.query.q as string | undefined;
      let programs;
      
      if (query) {
        programs = await storage.searchPrograms(query);
      } else {
        programs = await storage.getAllPrograms();
      }
      
      res.json(programs);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching programs' });
    }
  });

  app.get('/api/programs/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const program = await storage.getProgram(id);
      
      if (!program) {
        return res.status(404).json({ message: 'Program not found' });
      }
      
      res.json(program);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching program' });
    }
  });

  app.post('/api/programs', isOrganization, async (req, res) => {
    try {
      const user = req.user as any;
      const programData = insertProgramSchema.parse({
        ...req.body,
        organizationId: user.id
      });
      
      const program = await storage.createProgram(programData);
      res.status(201).json(program);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: fromZodError(error).message });
      }
      res.status(500).json({ message: 'Error creating program' });
    }
  });

  app.patch('/api/programs/:id/status', isOrganization, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = req.user as any;
      const program = await storage.getProgram(id);
      
      if (!program) {
        return res.status(404).json({ message: 'Program not found' });
      }
      
      if (program.organizationId !== user.id) {
        return res.status(403).json({ message: 'Not authorized to update this program' });
      }
      
      const { status } = z.object({ status: z.enum(['active', 'inactive', 'draft']) }).parse(req.body);
      
      const updatedProgram = await storage.updateProgramStatus(id, status);
      res.json(updatedProgram);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: fromZodError(error).message });
      }
      res.status(500).json({ message: 'Error updating program status' });
    }
  });

  app.get('/api/programs/organization/:orgId', async (req, res) => {
    try {
      const orgId = parseInt(req.params.orgId);
      const programs = await storage.getProgramsByOrganization(orgId);
      res.json(programs);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching organization programs' });
    }
  });

  // Report routes
  app.get('/api/reports/program/:programId', async (req, res) => {
    try {
      const programId = parseInt(req.params.programId);
      const program = await storage.getProgram(programId);
      
      if (!program) {
        return res.status(404).json({ message: 'Program not found' });
      }
      
      // Check if user is authorized
      if (req.isAuthenticated()) {
        const user = req.user as any;
        // Allow if user is the organization that owns the program
        if (user.role === 'organization' && program.organizationId === user.id) {
          const reports = await storage.getReportsByProgram(programId);
          return res.json(reports);
        }
      }
      
      res.status(403).json({ message: 'Not authorized to view these reports' });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching reports' });
    }
  });

  app.get('/api/reports/hacker', isHacker, async (req, res) => {
    try {
      const user = req.user as any;
      const reports = await storage.getReportsByHacker(user.id);
      res.json(reports);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching reports' });
    }
  });

  app.get('/api/reports/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const report = await storage.getReport(id);
      
      if (!report) {
        return res.status(404).json({ message: 'Report not found' });
      }
      
      // Check if user is authorized
      const user = req.user as any;
      // Allow if user is the hacker who submitted the report
      if (user.role === 'hacker' && report.hackerId === user.id) {
        return res.json(report);
      }
      
      // Allow if user is the organization that owns the program
      const program = await storage.getProgram(report.programId);
      if (user.role === 'organization' && program && program.organizationId === user.id) {
        return res.json(report);
      }
      
      res.status(403).json({ message: 'Not authorized to view this report' });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching report' });
    }
  });

  app.post('/api/reports', isHacker, async (req, res) => {
    try {
      const user = req.user as any;
      const reportData = insertReportSchema.parse({
        ...req.body,
        hackerId: user.id
      });
      
      // Verify program exists
      const program = await storage.getProgram(reportData.programId);
      if (!program) {
        return res.status(404).json({ message: 'Program not found' });
      }
      
      // Check if program is active
      if (program.status !== 'active') {
        return res.status(400).json({ message: 'Cannot submit reports to inactive programs' });
      }
      
      const report = await storage.createReport(reportData);
      res.status(201).json(report);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: fromZodError(error).message });
      }
      res.status(500).json({ message: 'Error creating report' });
    }
  });

  app.patch('/api/reports/:id/status', isOrganization, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = req.user as any;
      const report = await storage.getReport(id);
      
      if (!report) {
        return res.status(404).json({ message: 'Report not found' });
      }
      
      // Verify the org owns the program
      const program = await storage.getProgram(report.programId);
      if (!program || program.organizationId !== user.id) {
        return res.status(403).json({ message: 'Not authorized to update this report' });
      }
      
      const { status, triageNotes } = z.object({
        status: z.enum(['pending', 'triaging', 'accepted', 'rejected', 'duplicate', 'fixed']),
        triageNotes: z.string().optional()
      }).parse(req.body);
      
      const updatedReport = await storage.updateReportStatus(id, status, triageNotes);
      
      // Increase hacker reputation if report is accepted
      if (status === 'accepted' && report.status !== 'accepted') {
        const reputationPoints = getReputationPoints(report.severity);
        await storage.updateUserReputation(report.hackerId, reputationPoints);
      }
      
      res.json(updatedReport);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: fromZodError(error).message });
      }
      res.status(500).json({ message: 'Error updating report status' });
    }
  });

  app.post('/api/reports/:id/reward', isOrganization, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = req.user as any;
      const report = await storage.getReport(id);
      
      if (!report) {
        return res.status(404).json({ message: 'Report not found' });
      }
      
      // Verify the org owns the program
      const program = await storage.getProgram(report.programId);
      if (!program || program.organizationId !== user.id) {
        return res.status(403).json({ message: 'Not authorized to reward this report' });
      }
      
      const { amount } = z.object({
        amount: z.number().min(0)
      }).parse(req.body);
      
      const updatedReport = await storage.assignReward(id, amount);
      res.json(updatedReport);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: fromZodError(error).message });
      }
      res.status(500).json({ message: 'Error assigning reward' });
    }
  });

  // Report comments
  app.get('/api/reports/:reportId/comments', isAuthenticated, async (req, res) => {
    try {
      const reportId = parseInt(req.params.reportId);
      const report = await storage.getReport(reportId);
      
      if (!report) {
        return res.status(404).json({ message: 'Report not found' });
      }
      
      // Check if user is authorized
      const user = req.user as any;
      // Allow if user is the hacker who submitted the report
      if (user.role === 'hacker' && report.hackerId === user.id) {
        const comments = await storage.getReportComments(reportId);
        return res.json(comments);
      }
      
      // Allow if user is the organization that owns the program
      const program = await storage.getProgram(report.programId);
      if (user.role === 'organization' && program && program.organizationId === user.id) {
        const comments = await storage.getReportComments(reportId);
        return res.json(comments);
      }
      
      res.status(403).json({ message: 'Not authorized to view these comments' });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching comments' });
    }
  });

  app.post('/api/reports/:reportId/comments', isAuthenticated, async (req, res) => {
    try {
      const reportId = parseInt(req.params.reportId);
      const user = req.user as any;
      const report = await storage.getReport(reportId);
      
      if (!report) {
        return res.status(404).json({ message: 'Report not found' });
      }
      
      // Verify the user is either the hacker or the org
      let authorized = false;
      if (user.role === 'hacker' && report.hackerId === user.id) {
        authorized = true;
      } else {
        const program = await storage.getProgram(report.programId);
        if (user.role === 'organization' && program && program.organizationId === user.id) {
          authorized = true;
        }
      }
      
      if (!authorized) {
        return res.status(403).json({ message: 'Not authorized to comment on this report' });
      }
      
      const commentData = insertReportCommentSchema.parse({
        ...req.body,
        reportId,
        userId: user.id
      });
      
      const comment = await storage.createReportComment(commentData);
      res.status(201).json(comment);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: fromZodError(error).message });
      }
      res.status(500).json({ message: 'Error creating comment' });
    }
  });

  // Helper function to determine reputation points based on severity
  function getReputationPoints(severity: string): number {
    switch (severity) {
      case 'critical': return 50;
      case 'high': return 30;
      case 'medium': return 15;
      case 'low': return 5;
      default: return 1;
    }
  }

  return httpServer;
}
