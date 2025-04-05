import { users, programs, reports, reportComments } from "@shared/schema";
import type { 
  User, InsertUser, Program, InsertProgram, 
  Report, InsertReport, ReportComment, InsertReportComment 
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserReputation(id: number, reputation: number): Promise<User | undefined>;

  // Program methods
  getProgram(id: number): Promise<Program | undefined>;
  getAllPrograms(): Promise<Program[]>;
  getProgramsByOrganization(organizationId: number): Promise<Program[]>;
  createProgram(program: InsertProgram): Promise<Program>;
  updateProgramStatus(id: number, status: string): Promise<Program | undefined>;
  searchPrograms(query: string): Promise<Program[]>;

  // Report methods
  getReport(id: number): Promise<Report | undefined>;
  getReportsByProgram(programId: number): Promise<Report[]>;
  getReportsByHacker(hackerId: number): Promise<Report[]>;
  createReport(report: InsertReport): Promise<Report>;
  updateReportStatus(id: number, status: string, triageNotes?: string): Promise<Report | undefined>;
  assignReward(id: number, amount: number): Promise<Report | undefined>;

  // Comment methods
  getReportComments(reportId: number): Promise<ReportComment[]>;
  createReportComment(comment: InsertReportComment): Promise<ReportComment>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private programs: Map<number, Program>;
  private reports: Map<number, Report>;
  private reportComments: Map<number, ReportComment>;
  
  private userCurrentId: number;
  private programCurrentId: number;
  private reportCurrentId: number;
  private commentCurrentId: number;

  constructor() {
    this.users = new Map();
    this.programs = new Map();
    this.reports = new Map();
    this.reportComments = new Map();
    
    this.userCurrentId = 1;
    this.programCurrentId = 1;
    this.reportCurrentId = 1;
    this.commentCurrentId = 1;

    // Add some sample data
    this.addSampleData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase(),
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase(),
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const reputation = 0;
    const user: User = { ...insertUser, id, reputation };
    this.users.set(id, user);
    return user;
  }

  async updateUserReputation(id: number, reputation: number): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;
    
    const updatedUser: User = { ...user, reputation };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Program methods
  async getProgram(id: number): Promise<Program | undefined> {
    return this.programs.get(id);
  }

  async getAllPrograms(): Promise<Program[]> {
    return Array.from(this.programs.values());
  }

  async getProgramsByOrganization(organizationId: number): Promise<Program[]> {
    return Array.from(this.programs.values()).filter(
      (program) => program.organizationId === organizationId,
    );
  }

  async createProgram(insertProgram: InsertProgram): Promise<Program> {
    const id = this.programCurrentId++;
    const createdAt = new Date();
    const updatedAt = new Date();
    const program: Program = { ...insertProgram, id, createdAt, updatedAt };
    this.programs.set(id, program);
    return program;
  }

  async updateProgramStatus(id: number, status: string): Promise<Program | undefined> {
    const program = await this.getProgram(id);
    if (!program) return undefined;
    
    const updatedProgram: Program = { 
      ...program, 
      status: status as any, // Type assertion needed for string -> enum
      updatedAt: new Date() 
    };
    this.programs.set(id, updatedProgram);
    return updatedProgram;
  }

  async searchPrograms(query: string): Promise<Program[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.programs.values()).filter(program => 
      program.title.toLowerCase().includes(lowercaseQuery) ||
      program.description.toLowerCase().includes(lowercaseQuery) ||
      (program.industry && program.industry.toLowerCase().includes(lowercaseQuery))
    );
  }

  // Report methods
  async getReport(id: number): Promise<Report | undefined> {
    return this.reports.get(id);
  }

  async getReportsByProgram(programId: number): Promise<Report[]> {
    return Array.from(this.reports.values()).filter(
      (report) => report.programId === programId,
    );
  }

  async getReportsByHacker(hackerId: number): Promise<Report[]> {
    return Array.from(this.reports.values()).filter(
      (report) => report.hackerId === hackerId,
    );
  }

  async createReport(insertReport: InsertReport): Promise<Report> {
    const id = this.reportCurrentId++;
    const createdAt = new Date();
    const updatedAt = new Date();
    const report: Report = { ...insertReport, id, createdAt, updatedAt, rewardAmount: null, triageNotes: null };
    this.reports.set(id, report);
    return report;
  }

  async updateReportStatus(id: number, status: string, triageNotes?: string): Promise<Report | undefined> {
    const report = await this.getReport(id);
    if (!report) return undefined;
    
    const updatedReport: Report = { 
      ...report, 
      status: status as any, // Type assertion needed for string -> enum
      updatedAt: new Date(),
      triageNotes: triageNotes || report.triageNotes
    };
    this.reports.set(id, updatedReport);
    return updatedReport;
  }

  async assignReward(id: number, amount: number): Promise<Report | undefined> {
    const report = await this.getReport(id);
    if (!report) return undefined;
    
    const updatedReport: Report = { 
      ...report, 
      rewardAmount: amount,
      updatedAt: new Date()
    };
    this.reports.set(id, updatedReport);
    return updatedReport;
  }

  // Comment methods
  async getReportComments(reportId: number): Promise<ReportComment[]> {
    return Array.from(this.reportComments.values()).filter(
      (comment) => comment.reportId === reportId,
    );
  }

  async createReportComment(insertComment: InsertReportComment): Promise<ReportComment> {
    const id = this.commentCurrentId++;
    const createdAt = new Date();
    const comment: ReportComment = { ...insertComment, id, createdAt };
    this.reportComments.set(id, comment);
    return comment;
  }

  private addSampleData() {
    // Sample users (orgs and hackers)
    const orgUser: InsertUser = {
      username: 'techcorp',
      password: '$2a$10$XlYYlmxcH1yD.OmKr.VZDePQR9YnBUUut1oND2eoGYj1hrzuaFKXu', // 'password'
      email: 'security@techcorp.com',
      name: 'TechCorp Security',
      role: 'organization',
      companyName: 'TechCorp Inc.',
      companyUrl: 'https://techcorp.example.com',
      industry: 'Technology',
      bio: 'We build secure enterprise software solutions.',
      profilePicture: 'https://ui-avatars.com/api/?name=TechCorp',
      skills: null
    };

    const hackerUser: InsertUser = {
      username: 'securityhunter',
      password: '$2a$10$XlYYlmxcH1yD.OmKr.VZDePQR9YnBUUut1oND2eoGYj1hrzuaFKXu', // 'password'
      email: 'hunter@example.com',
      name: 'Security Hunter',
      role: 'hacker',
      bio: 'Experienced security researcher with a focus on web application security.',
      profilePicture: 'https://ui-avatars.com/api/?name=Security+Hunter',
      skills: ['Web Security', 'API Testing', 'Mobile Security'],
      reputation: 150,
      companyName: null,
      companyUrl: null,
      industry: null
    };

    this.createUser(orgUser).then(org => {
      // Create sample program
      const program: InsertProgram = {
        organizationId: org.id,
        title: 'TechCorp Security Program',
        description: 'Looking for vulnerabilities in our cloud infrastructure and customer-facing web applications.',
        scope: 'All production web applications and APIs at *.techcorp.example.com',
        outOfScope: 'Social engineering, physical attacks, and DoS attacks',
        rules: 'Please follow responsible disclosure practices. No automated scanning without permission.',
        status: 'active',
        rewards: {
          critical: 5000,
          high: 2000,
          medium: 500,
          low: 100,
          informational: 0
        },
        logo: 'https://ui-avatars.com/api/?name=TC&background=E53935&color=fff',
        industry: 'Technology',
        technologies: ['Node.js', 'React', 'AWS']
      };
      
      this.createProgram(program);
    });

    this.createUser(hackerUser);
  }
}

export const storage = new MemStorage();
