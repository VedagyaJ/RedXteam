import { 
  users, User, InsertUser, programs, Program, InsertProgram, 
  reports, Report, InsertReport, programTags, ProgramTag, InsertProgramTag,
  resources, Resource, InsertResource, UserType, StatusType, SeverityType
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUsersByType(userType: string): Promise<User[]>;
  getTopHackers(limit: number): Promise<User[]>;
  
  // Program operations
  getProgram(id: number): Promise<Program | undefined>;
  getPrograms(): Promise<Program[]>;
  getProgramsByOrganization(organizationId: number): Promise<Program[]>;
  createProgram(program: InsertProgram): Promise<Program>;
  getPopularPrograms(limit: number): Promise<Program[]>;
  updateProgram(id: number, program: Partial<Program>): Promise<Program | undefined>;
  
  // Report operations
  getReport(id: number): Promise<Report | undefined>;
  getReports(): Promise<Report[]>;
  getReportsByProgram(programId: number): Promise<Report[]>;
  getReportsByHacker(hackerId: number): Promise<Report[]>;
  createReport(report: InsertReport): Promise<Report>;
  updateReport(id: number, report: Partial<Report>): Promise<Report | undefined>;
  
  // Program tags operations
  getProgramTags(programId: number): Promise<ProgramTag[]>;
  createProgramTag(programTag: InsertProgramTag): Promise<ProgramTag>;
  
  // Resource operations
  getResource(id: number): Promise<Resource | undefined>;
  getResources(): Promise<Resource[]>;
  createResource(resource: InsertResource): Promise<Resource>;
  
  // Dashboard operations
  getHackerStats(hackerId: number): Promise<{
    activeHunts: number;
    submissions: number;
    earnings: number;
  }>;
  getOrganizationStats(organizationId: number): Promise<{
    activePrograms: number;
    totalReports: number;
    resolvedReports: number;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private programs: Map<number, Program>;
  private reports: Map<number, Report>;
  private programTags: Map<number, ProgramTag>;
  private resources: Map<number, Resource>;
  
  private currentUserId: number;
  private currentProgramId: number;
  private currentReportId: number;
  private currentProgramTagId: number;
  private currentResourceId: number;

  constructor() {
    this.users = new Map();
    this.programs = new Map();
    this.reports = new Map();
    this.programTags = new Map();
    this.resources = new Map();
    
    this.currentUserId = 1;
    this.currentProgramId = 1;
    this.currentReportId = 1;
    this.currentProgramTagId = 1;
    this.currentResourceId = 1;
    
    // Create some initial data
    this.seedData();
  }

  private seedData() {
    // Seed sample organizations
    const org1 = this.createUser({
      username: "fintechbank",
      password: "securepassword",
      email: "security@fintechbank.com",
      fullName: "FinTech Banking",
      userType: UserType.ORGANIZATION,
      bio: "Leading financial services company",
      avatarUrl: "",
    });
    
    const org2 = this.createUser({
      username: "securecloud",
      password: "securepassword",
      email: "security@securecloud.com",
      fullName: "SecureCloud",
      userType: UserType.ORGANIZATION,
      bio: "Cloud infrastructure provider",
      avatarUrl: "",
    });
    
    const org3 = this.createUser({
      username: "ecommart",
      password: "securepassword",
      email: "security@ecommart.com",
      fullName: "EcomMart",
      userType: UserType.ORGANIZATION,
      bio: "E-commerce platform",
      avatarUrl: "",
    });
    
    // Seed sample hackers
    const hacker1 = this.createUser({
      username: "securityalex",
      password: "securepassword",
      email: "alex@email.com",
      fullName: "Alex Wei",
      userType: UserType.HACKER,
      bio: "Security researcher with 5+ years of experience",
      avatarUrl: "",
      reputation: 95,
    });
    
    const hacker2 = this.createUser({
      username: "zerosec",
      password: "securepassword",
      email: "sarah@email.com",
      fullName: "Sarah Chen",
      userType: UserType.HACKER,
      bio: "Passionate about finding vulnerabilities",
      avatarUrl: "",
      reputation: 88,
    });
    
    const hacker3 = this.createUser({
      username: "secmark",
      password: "securepassword",
      email: "mark@email.com",
      fullName: "Mark Johnson",
      userType: UserType.HACKER,
      bio: "Specialized in API security",
      avatarUrl: "",
      reputation: 82,
    });
    
    // Seed sample programs
    const program1 = this.createProgram({
      title: "FinTech Banking Security Program",
      description: "Help us secure our banking applications",
      organizationId: org1.id,
      minBounty: 500,
      maxBounty: 10000,
      scope: "All web and mobile applications under the fintechbank.com domain",
      rules: "No DOS testing. No social engineering.",
      isActive: true,
      industry: "Financial Services",
      responseTime: 24,
    });
    
    this.createProgramTag({ programId: program1.id, tag: "API" });
    this.createProgramTag({ programId: program1.id, tag: "Web" });
    this.createProgramTag({ programId: program1.id, tag: "Mobile" });
    
    const program2 = this.createProgram({
      title: "SecureCloud Platform Bug Bounty",
      description: "Find vulnerabilities in our cloud infrastructure",
      organizationId: org2.id,
      minBounty: 1000,
      maxBounty: 15000,
      scope: "All cloud services and APIs under securecloud.com",
      rules: "Automated scanning is not allowed. Report responsibly.",
      isActive: true,
      industry: "Cloud Infrastructure",
      responseTime: 48,
    });
    
    this.createProgramTag({ programId: program2.id, tag: "Cloud" });
    this.createProgramTag({ programId: program2.id, tag: "API" });
    this.createProgramTag({ programId: program2.id, tag: "IAM" });
    
    const program3 = this.createProgram({
      title: "EcomMart Security Program",
      description: "Secure our e-commerce platform and payment systems",
      organizationId: org3.id,
      minBounty: 300,
      maxBounty: 5000,
      scope: "All web applications, mobile apps, and payment systems",
      rules: "No testing on production payment systems without approval",
      isActive: true,
      industry: "E-commerce",
      responseTime: 72,
    });
    
    this.createProgramTag({ programId: program3.id, tag: "Web" });
    this.createProgramTag({ programId: program3.id, tag: "Payment" });
    this.createProgramTag({ programId: program3.id, tag: "Mobile" });
    
    // Seed sample reports
    this.createReport({
      title: "Authentication Bypass in Login Form",
      description: "Discovered a way to bypass authentication",
      hackerId: hacker1.id,
      programId: program1.id,
      severity: SeverityType.HIGH,
      status: StatusType.ACCEPTED,
      rewardAmount: 5000,
      stepsToReproduce: "1. Intercept the login request\n2. Modify authentication header\n3. Access restricted area",
      impact: "Unauthorized access to user accounts and sensitive data",
    });
    
    this.createReport({
      title: "SQL Injection in Search Function",
      description: "SQL injection vulnerability in product search",
      hackerId: hacker2.id,
      programId: program3.id,
      severity: SeverityType.CRITICAL,
      status: StatusType.FIXED,
      rewardAmount: 3500,
      stepsToReproduce: "1. Enter specific SQL characters in search\n2. Observe database error\n3. Extract data using UNION statements",
      impact: "Potential access to all customer data and orders",
    });
    
    this.createReport({
      title: "Insecure Direct Object Reference",
      description: "IDOR vulnerability in user profile",
      hackerId: hacker3.id,
      programId: program2.id,
      severity: SeverityType.MEDIUM,
      status: StatusType.PENDING,
      stepsToReproduce: "1. Login to account\n2. Change user ID in URL\n3. Access another user's data",
      impact: "Unauthorized access to other user's information",
    });
    
    // Seed sample resources
    this.createResource({
      title: "Web Application Security Testing Guide",
      description: "Comprehensive guide for web application security testing",
      content: "This guide covers various aspects of web application security testing...",
      authorId: hacker1.id,
      category: "Guides",
    });
    
    this.createResource({
      title: "API Security Best Practices",
      description: "Learn about securing your APIs",
      content: "This guide covers best practices for securing your APIs...",
      authorId: hacker2.id,
      category: "Best Practices",
    });
    
    this.createResource({
      title: "Mobile App Penetration Testing",
      description: "Introduction to mobile app security testing",
      content: "This guide introduces mobile app penetration testing techniques...",
      authorId: hacker3.id,
      category: "Tutorials",
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const now = new Date();
    
    const user: User = { 
      ...insertUser,
      id, 
      createdAt: now,
      reputation: insertUser.reputation || 0,
    };
    
    this.users.set(id, user);
    return user;
  }
  
  async getUsersByType(userType: string): Promise<User[]> {
    return Array.from(this.users.values()).filter(
      (user) => user.userType === userType,
    );
  }
  
  async getTopHackers(limit: number): Promise<User[]> {
    return Array.from(this.users.values())
      .filter((user) => user.userType === UserType.HACKER)
      .sort((a, b) => b.reputation - a.reputation)
      .slice(0, limit);
  }

  // Program operations
  async getProgram(id: number): Promise<Program | undefined> {
    return this.programs.get(id);
  }

  async getPrograms(): Promise<Program[]> {
    return Array.from(this.programs.values());
  }
  
  async getProgramsByOrganization(organizationId: number): Promise<Program[]> {
    return Array.from(this.programs.values()).filter(
      (program) => program.organizationId === organizationId,
    );
  }

  async createProgram(insertProgram: InsertProgram): Promise<Program> {
    const id = this.currentProgramId++;
    const now = new Date();
    
    const program: Program = {
      ...insertProgram,
      id,
      createdAt: now,
      isActive: true,
      responseTime: insertProgram.responseTime || 48,
    };
    
    this.programs.set(id, program);
    return program;
  }
  
  async getPopularPrograms(limit: number): Promise<Program[]> {
    // For this simple implementation, we'll just sort by creation date
    return Array.from(this.programs.values())
      .filter((program) => program.isActive)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }
  
  async updateProgram(id: number, programUpdate: Partial<Program>): Promise<Program | undefined> {
    const program = this.programs.get(id);
    
    if (!program) {
      return undefined;
    }
    
    const updatedProgram = { ...program, ...programUpdate };
    this.programs.set(id, updatedProgram);
    
    return updatedProgram;
  }

  // Report operations
  async getReport(id: number): Promise<Report | undefined> {
    return this.reports.get(id);
  }

  async getReports(): Promise<Report[]> {
    return Array.from(this.reports.values());
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
    const id = this.currentReportId++;
    const now = new Date();
    
    const report: Report = {
      ...insertReport,
      id,
      createdAt: now,
      updatedAt: now,
      status: StatusType.PENDING,
      rewardAmount: insertReport.rewardAmount || 0,
    };
    
    this.reports.set(id, report);
    return report;
  }
  
  async updateReport(id: number, reportUpdate: Partial<Report>): Promise<Report | undefined> {
    const report = this.reports.get(id);
    
    if (!report) {
      return undefined;
    }
    
    const updatedReport = { 
      ...report, 
      ...reportUpdate,
      updatedAt: new Date()
    };
    
    this.reports.set(id, updatedReport);
    
    return updatedReport;
  }

  // Program tags operations
  async getProgramTags(programId: number): Promise<ProgramTag[]> {
    return Array.from(this.programTags.values()).filter(
      (tag) => tag.programId === programId,
    );
  }

  async createProgramTag(insertProgramTag: InsertProgramTag): Promise<ProgramTag> {
    const id = this.currentProgramTagId++;
    
    const programTag: ProgramTag = {
      ...insertProgramTag,
      id,
    };
    
    this.programTags.set(id, programTag);
    return programTag;
  }

  // Resource operations
  async getResource(id: number): Promise<Resource | undefined> {
    return this.resources.get(id);
  }

  async getResources(): Promise<Resource[]> {
    return Array.from(this.resources.values());
  }

  async createResource(insertResource: InsertResource): Promise<Resource> {
    const id = this.currentResourceId++;
    const now = new Date();
    
    const resource: Resource = {
      ...insertResource,
      id,
      createdAt: now,
    };
    
    this.resources.set(id, resource);
    return resource;
  }
  
  // Dashboard operations
  async getHackerStats(hackerId: number): Promise<{
    activeHunts: number;
    submissions: number;
    earnings: number;
  }> {
    const hackerReports = await this.getReportsByHacker(hackerId);
    
    // Calculate total earnings
    const earnings = hackerReports.reduce((total, report) => {
      return total + (report.rewardAmount || 0);
    }, 0);
    
    // Get all active programs
    const allPrograms = await this.getPrograms();
    const activePrograms = allPrograms.filter(program => program.isActive);
    
    return {
      activeHunts: activePrograms.length,
      submissions: hackerReports.length,
      earnings,
    };
  }
  
  async getOrganizationStats(organizationId: number): Promise<{
    activePrograms: number;
    totalReports: number;
    resolvedReports: number;
  }> {
    const orgPrograms = await this.getProgramsByOrganization(organizationId);
    const programIds = orgPrograms.map(program => program.id);
    
    // Get all reports for this organization's programs
    const allReports = await this.getReports();
    const orgReports = allReports.filter(report => programIds.includes(report.programId));
    
    // Count resolved reports
    const resolvedReports = orgReports.filter(
      report => report.status === StatusType.FIXED || report.status === StatusType.ACCEPTED
    ).length;
    
    return {
      activePrograms: orgPrograms.filter(program => program.isActive).length,
      totalReports: orgReports.length,
      resolvedReports,
    };
  }
}

export const storage = new MemStorage();
