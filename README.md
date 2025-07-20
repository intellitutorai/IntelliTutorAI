
# IntelliTutorAI

Your intelligent learning companion for personalized AI tutoring. IntelliTutorAI provides students and teachers with an interactive AI-powered platform for educational assistance, homework help, and collaborative learning.

## 🚀 Features

- **AI-Powered Tutoring**: Get instant help with homework and educational content
- **Personalized Learning**: AI adapts to your learning style and pace
- **Chat Interface**: Interactive conversations with educational AI assistant
- **User Management**: Separate roles for students, teachers, and administrators
- **Profile Management**: Customizable user profiles with institution details
- **Real-time Messaging**: Instant responses and educational guidance
- **Educational Prompts**: Quick-start templates for common learning scenarios

## 📁 Project Structure

```
IntelliTutorAI/
├── client/                     # Frontend React application
│   ├── public/                 # Static assets
│   │   ├── robots.txt         # SEO robots file
│   │   └── sitemap.xml        # SEO sitemap
│   ├── src/
│   │   ├── components/        # Reusable React components
│   │   │   ├── admin/         # Admin-specific components
│   │   │   ├── chat/          # Chat interface components
│   │   │   ├── profile/       # User profile components
│   │   │   └── ui/            # UI library components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── lib/               # Utility libraries
│   │   ├── pages/             # Main application pages
│   │   ├── App.tsx            # Main app component
│   │   ├── index.css          # Global styles
│   │   └── main.tsx           # Application entry point
│   └── index.html             # HTML template
├── server/                    # Backend Node.js/Express application
│   ├── middleware/            # Express middleware
│   ├── models/                # Database models
│   ├── db-mongo.ts           # MongoDB configuration
│   ├── index.ts              # Server entry point
│   ├── routes.ts             # API routes
│   └── storage.ts            # File storage utilities
├── shared/                    # Shared TypeScript schemas
└── Configuration files
```

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT tokens
- **AI Integration**: OpenAI API
- **UI Components**: shadcn/ui
- **State Management**: TanStack Query (React Query)
- **Form Handling**: React Hook Form with Zod validation

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB database (local or cloud)
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd intellitutor-ai
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
PORT=5000
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## 📝 Usage

### For Students
1. Register with your educational institution
2. Start a new chat to ask questions
3. Use educational prompts for quick assistance
4. Get step-by-step explanations and help

### For Teachers
1. Register as a teacher
2. Monitor student progress
3. Access admin features (if applicable)
4. Collaborate with students

### For Administrators
1. Access user management features
2. Monitor platform usage
3. Manage institutional settings

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run type-check` - Run TypeScript type checking

### Making Changes

1. **Frontend changes**: Edit files in `client/src/`
   - Components: `client/src/components/`
   - Pages: `client/src/pages/`
   - Styles: `client/src/index.css`

2. **Backend changes**: Edit files in `server/`
   - API routes: `server/routes.ts`
   - Database models: `server/models/`
   - Middleware: `server/middleware/`

3. **Shared types**: Edit `shared/schema.ts`

### Component Structure

- **Chat Components**: Handle messaging and AI interactions
- **Profile Components**: Manage user profiles and settings
- **Admin Components**: Administrative functions
- **UI Components**: Reusable interface elements

## 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt
- Input validation with Zod schemas
- CORS protection
- Environment variable protection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Chat Endpoints
- `GET /api/chats` - Get user's chats
- `POST /api/chats` - Create new chat
- `GET /api/chats/:id/messages` - Get chat messages
- `POST /api/chats/:id/messages` - Send message

### User Endpoints
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

## 🐛 Troubleshooting

### Common Issues

1. **Port 5000 in use**: Kill the process using port 5000 or change PORT in .env
2. **MongoDB connection failed**: Check MONGODB_URI in .env
3. **OpenAI API errors**: Verify OPENAI_API_KEY is valid

## 📞 Support

For support, please open an issue in the repository or contact the development team.

## 🎯 Roadmap

- [ ] File upload functionality
- [ ] Advanced study plans
- [ ] Progress tracking
- [ ] Multi-language support
- [ ] Mobile app development
- [ ] Integration with learning management systems

---

Built with ❤️ for education
