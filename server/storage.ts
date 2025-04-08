import { websites, users, type User, type InsertUser, type Website, type InsertWebsite } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Website operations
  getWebsites(userId: number): Promise<Website[]>;
  getWebsite(id: number): Promise<Website | undefined>;
  createWebsite(website: InsertWebsite): Promise<Website>;
  updateWebsite(id: number, website: Partial<InsertWebsite>): Promise<Website | undefined>;
  deleteWebsite(id: number): Promise<boolean>;
  
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private websites: Map<number, Website>;
  sessionStore: session.SessionStore;
  currentUserId: number;
  currentWebsiteId: number;

  constructor() {
    this.users = new Map();
    this.websites = new Map();
    this.currentUserId = 1;
    this.currentWebsiteId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });
  }

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
    const createdAt = new Date();
    const user: User = { ...insertUser, id, createdAt };
    this.users.set(id, user);
    return user;
  }
  
  async getWebsites(userId: number): Promise<Website[]> {
    return Array.from(this.websites.values()).filter(
      (website) => website.userId === userId,
    );
  }
  
  async getWebsite(id: number): Promise<Website | undefined> {
    return this.websites.get(id);
  }
  
  async createWebsite(insertWebsite: InsertWebsite): Promise<Website> {
    const id = this.currentWebsiteId++;
    const createdAt = new Date();
    const updatedAt = new Date();
    const website: Website = { ...insertWebsite, id, createdAt, updatedAt };
    this.websites.set(id, website);
    return website;
  }
  
  async updateWebsite(id: number, updates: Partial<InsertWebsite>): Promise<Website | undefined> {
    const website = this.websites.get(id);
    if (!website) {
      return undefined;
    }
    
    const updatedWebsite: Website = {
      ...website,
      ...updates,
      updatedAt: new Date(),
    };
    
    this.websites.set(id, updatedWebsite);
    return updatedWebsite;
  }
  
  async deleteWebsite(id: number): Promise<boolean> {
    return this.websites.delete(id);
  }
}

export const storage = new MemStorage();
