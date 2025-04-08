import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { generateWebsite, updateWebsiteCode } from "./openai";
import { insertWebsiteSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // sets up /api/register, /api/login, /api/logout, /api/user
  setupAuth(app);

  // Middleware to check if user is authenticated
  const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Unauthorized" });
  };

  // Website generation endpoint
  app.post("/api/websites/generate", isAuthenticated, async (req, res) => {
    try {
      const { description, name } = req.body;
      
      if (!description) {
        return res.status(400).json({ message: "Description is required" });
      }
      
      const websiteData = await generateWebsite({ description, name });
      
      // Create website in storage
      const website = await storage.createWebsite({
        userId: req.user.id,
        name: websiteData.name,
        description: description,
        htmlContent: websiteData.html,
        cssContent: websiteData.css,
        jsContent: websiteData.js || "",
      });
      
      res.status(201).json(website);
    } catch (error) {
      console.error("Error generating website:", error);
      res.status(500).json({ message: `Error generating website: ${error.message}` });
    }
  });

  // Get all websites for current user
  app.get("/api/websites", isAuthenticated, async (req, res) => {
    try {
      const websites = await storage.getWebsites(req.user.id);
      res.json(websites);
    } catch (error) {
      res.status(500).json({ message: `Error fetching websites: ${error.message}` });
    }
  });

  // Get a specific website
  app.get("/api/websites/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const website = await storage.getWebsite(id);
      
      if (!website) {
        return res.status(404).json({ message: "Website not found" });
      }
      
      // Check if the website belongs to the user
      if (website.userId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      res.json(website);
    } catch (error) {
      res.status(500).json({ message: `Error fetching website: ${error.message}` });
    }
  });

  // Update website
  app.patch("/api/websites/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const website = await storage.getWebsite(id);
      
      if (!website) {
        return res.status(404).json({ message: "Website not found" });
      }
      
      // Check if the website belongs to the user
      if (website.userId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      const { instruction, htmlContent, cssContent, jsContent, name, description } = req.body;
      
      // If direct code updates or AI instruction was provided
      if (instruction || htmlContent || cssContent || jsContent) {
        // Update via AI if instruction is provided
        if (instruction) {
          const updatedCode = await updateWebsiteCode(id, {
            instruction,
            currentWebsite: website
          });
          
          // Apply the updates from AI
          const updatedWebsite = await storage.updateWebsite(id, {
            htmlContent: updatedCode.html || website.htmlContent,
            cssContent: updatedCode.css || website.cssContent,
            jsContent: updatedCode.js || website.jsContent,
            name: name || website.name,
            description: description || website.description
          });
          
          return res.json(updatedWebsite);
        }
        
        // Direct code update
        const updatedWebsite = await storage.updateWebsite(id, {
          htmlContent: htmlContent || website.htmlContent,
          cssContent: cssContent || website.cssContent,
          jsContent: jsContent || website.jsContent,
          name: name || website.name,
          description: description || website.description
        });
        
        return res.json(updatedWebsite);
      }
      
      // Simple metadata update
      if (name || description) {
        const updatedWebsite = await storage.updateWebsite(id, {
          name: name || website.name,
          description: description || website.description
        });
        
        return res.json(updatedWebsite);
      }
      
      // No changes provided
      res.status(400).json({ message: "No changes provided" });
    } catch (error) {
      res.status(500).json({ message: `Error updating website: ${error.message}` });
    }
  });

  // Delete website
  app.delete("/api/websites/:id", isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const website = await storage.getWebsite(id);
      
      if (!website) {
        return res.status(404).json({ message: "Website not found" });
      }
      
      // Check if the website belongs to the user
      if (website.userId !== req.user.id) {
        return res.status(403).json({ message: "Forbidden" });
      }
      
      await storage.deleteWebsite(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: `Error deleting website: ${error.message}` });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
