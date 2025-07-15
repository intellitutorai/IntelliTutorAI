import type { Express } from "express";
import { createServer, type Server } from "http";
import connectDB from "./db-mongo";
import User from "./models/User";
import Chat from "./models/Chat";
import { auth, adminAuth, type AuthRequest } from "./middleware/auth";
import jwt from 'jsonwebtoken';
import { z } from "zod";

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Validation schemas
const registerSchema = z.object({
  username: z.string().min(3).max(30),
  email: z.string().email(),
  password: z.string().min(4),
  role: z.enum(['teacher', 'student']),
  institution: z.string().min(1)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

async function callOpenAI(messages: Array<{role: string, content: string}>) {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    throw new Error("OpenAI API key not configured");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: messages,
      temperature: 0.7,
      max_tokens: 1000,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error: ${response.status} ${error}`);
  }

  const data = await response.json();
  return data.choices[0]?.message?.content || "I apologize, but I couldn't generate a response.";
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Connect to MongoDB
  await connectDB();

  // Auth routes
  app.post('/api/auth/register', async (req, res) => {
    try {
      const validatedData = registerSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await User.findOne({ 
        $or: [
          { email: validatedData.email },
          { username: validatedData.username }
        ]
      });
      
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Create new user
      const user = new User(validatedData);
      await user.save();

      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

      res.status(201).json({
        token,
        user: user.toJSON()
      });
    } catch (error) {
      console.error('Registration error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Validation error', errors: error.errors });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      
      // Find user by email
      const user = await User.findOne({ email: validatedData.email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Check password
      const isMatch = await user.comparePassword(validatedData.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

      res.json({
        token,
        user: user.toJSON()
      });
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Validation error', errors: error.errors });
      }
      res.status(500).json({ message: 'Server error' });
    }
  });

  app.get('/api/auth/user', auth, async (req: AuthRequest, res) => {
    try {
      res.json(req.user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    res.json({ message: 'Logged out successfully' });
  });

  // Chat routes
  app.get('/api/chats', auth, async (req: AuthRequest, res) => {
    try {
      const chats = await Chat.find({ userId: req.user._id })
        .sort({ updatedAt: -1 })
        .select('title createdAt updatedAt');
      res.json(chats);
    } catch (error) {
      console.error("Error fetching chats:", error);
      res.status(500).json({ message: "Failed to fetch chats" });
    }
  });

  app.post('/api/chats', auth, async (req: AuthRequest, res) => {
    try {
      const chat = new Chat({
        userId: req.user._id,
        title: req.body.title || 'New Chat',
        messages: []
      });
      await chat.save();
      res.json(chat);
    } catch (error) {
      console.error("Error creating chat:", error);
      res.status(500).json({ message: "Failed to create chat" });
    }
  });

  app.get('/api/chats/:chatId/messages', auth, async (req: AuthRequest, res) => {
    try {
      const chat = await Chat.findOne({
        _id: req.params.chatId,
        userId: req.user._id
      });
      
      if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
      }
      
      res.json(chat.messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.post('/api/chats/:chatId/messages', auth, async (req: AuthRequest, res) => {
    try {
      const chat = await Chat.findOne({
        _id: req.params.chatId,
        userId: req.user._id
      });
      
      if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
      }

      // Add user message
      const userMessage = {
        content: req.body.content,
        role: 'user' as const
      };
      
      chat.messages.push(userMessage);
      await chat.save();

      try {
        // Prepare messages for AI with educational context
        const aiMessages = chat.messages.map(msg => ({
          role: msg.role === 'user' ? 'user' : 'assistant',
          content: msg.content
        }));

        // Add educational context
        const systemPrompt = {
          role: 'system',
          content: 'You are an educational AI assistant. Provide clear, helpful explanations suitable for students and teachers. Focus on learning and understanding.'
        };

        // Get AI response
        const aiResponse = await callOpenAI([systemPrompt, ...aiMessages]);

        // Add AI response to chat
        const aiMessage = {
          content: aiResponse,
          role: 'assistant' as const
        };
        
        chat.messages.push(aiMessage);
        
        // Update chat title if this is the first user message
        if (chat.messages.length === 2) {
          const title = req.body.content.length > 50 
            ? req.body.content.substring(0, 50) + "..."
            : req.body.content;
          chat.title = title;
        }
        
        await chat.save();

        res.json({ userMessage, aiMessage });
      } catch (aiError) {
        console.error("Error getting AI response:", aiError);
        
        // Add error message
        const errorMessage = {
          content: "I apologize, but I'm having trouble connecting to the AI service right now. Please try again later.",
          role: 'assistant' as const
        };
        
        chat.messages.push(errorMessage);
        await chat.save();

        res.json({ userMessage, aiMessage: errorMessage });
      }
    } catch (error) {
      console.error("Error creating message:", error);
      res.status(500).json({ message: "Failed to create message" });
    }
  });

  app.delete('/api/chats/:chatId', auth, async (req: AuthRequest, res) => {
    try {
      const chat = await Chat.findOneAndDelete({
        _id: req.params.chatId,
        userId: req.user._id
      });
      
      if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting chat:", error);
      res.status(500).json({ message: "Failed to delete chat" });
    }
  });

  // User profile routes
  app.put('/api/user/profile', auth, async (req: AuthRequest, res) => {
    try {
      const { username, email, institution, profileImage } = req.body;
      
      const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { username, email, institution, profileImage },
        { new: true, runValidators: true }
      );
      
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.json(updatedUser);
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ message: 'Failed to update profile' });
    }
  });

  // Admin routes
  app.get('/api/admin/users', adminAuth, async (req: AuthRequest, res) => {
    try {
      const users = await User.find({}).sort({ createdAt: -1 });
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.delete('/api/admin/users/:userId', adminAuth, async (req: AuthRequest, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Also delete user's chats
      await Chat.deleteMany({ userId: req.params.userId });
      
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  // Admin stats endpoint
  app.get('/api/admin/stats', adminAuth, async (req: AuthRequest, res) => {
    try {
      const users = await User.find({});
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
      
      const totalChats = await Chat.countDocuments();
      
      res.json({
        totalUsers,
        activeToday,
        newThisWeek,
        totalChats,
        teacherCount: users.filter(u => u.role === 'teacher').length,
        studentCount: users.filter(u => u.role === 'student').length,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
