import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertChatSchema, insertMessageSchema } from "@shared/schema";
import { z } from "zod";

async function callOpenRouter(messages: Array<{role: string, content: string}>) {
  const apiKey = process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_KEY || process.env.API_KEY;
  
  if (!apiKey) {
    throw new Error("OpenRouter API key not configured");
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "X-Title": "AI Chat App"
    },
    body: JSON.stringify({
      model: "anthropic/claude-3.5-sonnet",
      messages: messages,
      temperature: 0.7,
      max_tokens: 1000,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenRouter API error: ${response.status} ${error}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || "I apologize, but I couldn't generate a response.";
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Chat routes
  app.get('/api/chats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const chats = await storage.getUserChats(userId);
      res.json(chats);
    } catch (error) {
      console.error("Error fetching chats:", error);
      res.status(500).json({ message: "Failed to fetch chats" });
    }
  });

  app.post('/api/chats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const chatData = insertChatSchema.parse({ ...req.body, userId });
      const chat = await storage.createChat(chatData);
      res.json(chat);
    } catch (error) {
      console.error("Error creating chat:", error);
      res.status(500).json({ message: "Failed to create chat" });
    }
  });

  app.get('/api/chats/:chatId/messages', isAuthenticated, async (req: any, res) => {
    try {
      const chatId = parseInt(req.params.chatId);
      const chat = await storage.getChat(chatId);
      
      if (!chat || chat.userId !== req.user.claims.sub) {
        return res.status(404).json({ message: "Chat not found" });
      }
      
      const messages = await storage.getChatMessages(chatId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.post('/api/chats/:chatId/messages', isAuthenticated, async (req: any, res) => {
    try {
      const chatId = parseInt(req.params.chatId);
      const chat = await storage.getChat(chatId);
      
      if (!chat || chat.userId !== req.user.claims.sub) {
        return res.status(404).json({ message: "Chat not found" });
      }

      const messageData = insertMessageSchema.parse({
        ...req.body,
        chatId,
        role: 'user'
      });

      // Save user message
      const userMessage = await storage.createMessage(messageData);

      // Get chat history for context
      const chatMessages = await storage.getChatMessages(chatId);
      const openRouterMessages = chatMessages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));

      try {
        // Get AI response
        const aiResponse = await callOpenRouter(openRouterMessages);

        // Save AI response
        const aiMessage = await storage.createMessage({
          chatId,
          content: aiResponse,
          role: 'assistant'
        });

        // Update chat title if this is the first user message
        if (chatMessages.length === 1) {
          const title = req.body.content.length > 50 
            ? req.body.content.substring(0, 50) + "..."
            : req.body.content;
          await storage.updateChatTitle(chatId, title);
        }

        res.json({ userMessage, aiMessage });
      } catch (aiError) {
        console.error("Error getting AI response:", aiError);
        
        // Save error message
        const errorMessage = await storage.createMessage({
          chatId,
          content: "I apologize, but I'm having trouble connecting to the AI service right now. Please try again later.",
          role: 'assistant'
        });

        res.json({ userMessage, aiMessage: errorMessage });
      }
    } catch (error) {
      console.error("Error creating message:", error);
      res.status(500).json({ message: "Failed to create message" });
    }
  });

  app.delete('/api/chats/:chatId', isAuthenticated, async (req: any, res) => {
    try {
      const chatId = parseInt(req.params.chatId);
      const chat = await storage.getChat(chatId);
      
      if (!chat || chat.userId !== req.user.claims.sub) {
        return res.status(404).json({ message: "Chat not found" });
      }
      
      await storage.deleteChat(chatId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting chat:", error);
      res.status(500).json({ message: "Failed to delete chat" });
    }
  });

  // Admin routes
  app.get('/api/admin/users', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const currentUser = await storage.getUser(userId);
      
      if (!currentUser?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  // Admin stats endpoint
  app.get('/api/admin/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const currentUser = await storage.getUser(userId);
      
      if (!currentUser?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      const users = await storage.getAllUsers();
      const totalUsers = users.length;
      
      // Calculate basic stats
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      const activeToday = users.filter(user => 
        user.updatedAt && new Date(user.updatedAt) >= todayStart
      ).length;
      
      const newThisWeek = users.filter(user => 
        user.createdAt && new Date(user.createdAt) >= weekStart
      ).length;
      
      res.json({
        totalUsers,
        activeToday,
        newThisWeek,
        totalChats: 0, // Would need additional query to calculate
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
