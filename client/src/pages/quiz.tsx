import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle, XCircle, RotateCcw } from "lucide-react";

interface Question {
  question: string;
  options: string[];
  answer: number;
}

interface Quiz {
  id: string;
  title: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  questions: Question[];
}

const sampleQuizzes: Quiz[] = [
  // Mathematics
  {
    id: "math1",
    title: "Algebra Basics",
    category: "mathematics",
    difficulty: "easy",
    questions: [
      { question: "What is 2x + 3 when x = 2?", options: ["5", "7", "9", "6"], answer: 1 },
      { question: "Simplify: 3(2 + 4)", options: ["18", "12", "14", "20"], answer: 0 }
    ]
  },
  {
    id: "math2",
    title: "Geometry Essentials",
    category: "mathematics",
    difficulty: "medium",
    questions: [
      { question: "How many degrees are in a triangle?", options: ["90", "180", "270", "360"], answer: 1 },
      { question: "Area of a circle = ?", options: ["πr²", "2πr", "r²", "πd"], answer: 0 }
    ]
  },

  // Science
  {
    id: "science1",
    title: "Physics Basics",
    category: "science",
    difficulty: "easy",
    questions: [
      { question: "What force keeps us on the ground?", options: ["Magnetism", "Gravity", "Friction", "Inertia"], answer: 1 },
      { question: "Speed = ?", options: ["Mass/Time", "Distance/Time", "Force/Area", "Work/Energy"], answer: 1 }
    ]
  },
  {
    id: "science2",
    title: "Chemistry Elements",
    category: "science",
    difficulty: "medium",
    questions: [
      { question: "H2O is the formula for?", options: ["Oxygen", "Hydrogen", "Water", "Helium"], answer: 2 },
      { question: "Atomic number of Carbon?", options: ["6", "8", "12", "14"], answer: 0 }
    ]
  },

  // History
  {
    id: "history1",
    title: "World War II Events",
    category: "history",
    difficulty: "medium",
    questions: [
      { question: "When did WWII begin?", options: ["1939", "1914", "1945", "1920"], answer: 0 },
      { question: "Which countries were part of the Axis Powers?", options: ["UK, USA, USSR", "Germany, Italy, Japan", "France, China, USSR", "USA, Canada, UK"], answer: 1 }
    ]
  },
  {
    id: "history2",
    title: "Ancient Civilizations",
    category: "history",
    difficulty: "easy",
    questions: [
      { question: "The pyramids are in?", options: ["Rome", "Greece", "Egypt", "China"], answer: 2 },
      { question: "Who was the first Emperor of Rome?", options: ["Julius Caesar", "Augustus", "Nero", "Marcus Aurelius"], answer: 1 }
    ]
  },

  // Literature
  {
    id: "lit1",
    title: "Shakespeare Works",
    category: "literature",
    difficulty: "medium",
    questions: [
      { question: "Who wrote Hamlet?", options: ["Charles Dickens", "William Shakespeare", "Mark Twain", "Homer"], answer: 1 },
      { question: "Romeo and Juliet is a?", options: ["Comedy", "Tragedy", "Poem", "Novel"], answer: 1 }
    ]
  },
  {
    id: "lit2",
    title: "Poetry Basics",
    category: "literature",
    difficulty: "easy",
    questions: [
      { question: "A 14-line poem is called?", options: ["Haiku", "Sonnet", "Ode", "Limerick"], answer: 1 },
      { question: "Who wrote The Raven?", options: ["Poe", "Shakespeare", "Frost", "Wordsworth"], answer: 0 }
    ]
  },

  // Programming
  {
    id: "prog1",
    title: "Python Basics",
    category: "programming",
    difficulty: "easy",
    questions: [
      { question: "Which keyword defines a function in Python?", options: ["func", "def", "function", "lambda"], answer: 1 },
      { question: "Which is a list in Python?", options: ["{1,2,3}", "[1,2,3]", "(1,2,3)", "<1,2,3>"], answer: 1 }
    ]
  },
  {
    id: "prog2",
    title: "Web Development",
    category: "programming",
    difficulty: "medium",
    questions: [
      { question: "HTML stands for?", options: ["Hyperlinks Text Markup Language", "Hyper Text Markup Language", "High Text Modern Language", "Home Tool Markup Language"], answer: 1 },
      { question: "Which is a CSS framework?", options: ["Django", "React", "Tailwind", "Node"], answer: 2 }
    ]
  }
];

export default function Quizzes() {
  const [, navigate] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [answers, setAnswers] = useState<{ [quizId: string]: number[] }>({});
  const [scores, setScores] = useState<{ [quizId: string]: number }>({});

  const categories = [
    { value: "all", label: "All" },
    { value: "mathematics", label: "Mathematics" },
    { value: "science", label: "Science" },
    { value: "history", label: "History" },
    { value: "literature", label: "Literature" },
    { value: "programming", label: "Programming" }
  ];

  const difficulties = [
    { value: "all", label: "All" },
    { value: "easy", label: "Easy" },
    { value: "medium", label: "Medium" },
    { value: "hard", label: "Hard" }
  ];

  const filteredQuizzes = sampleQuizzes.filter(
    (quiz) =>
      (selectedCategory === "all" || quiz.category === selectedCategory) &&
      (selectedDifficulty === "all" || quiz.difficulty === selectedDifficulty)
  );

  const handleAnswer = (quizId: string, questionIndex: number, optionIndex: number) => {
    const quiz = sampleQuizzes.find((q) => q.id === quizId);
    if (!quiz) return;

    const currentAnswers = answers[quizId] || [];
    if (currentAnswers[questionIndex] !== undefined) return; // prevent changing answer

    const isCorrect = quiz.questions[questionIndex].answer === optionIndex;

    setAnswers({
      ...answers,
      [quizId]: { ...currentAnswers, [questionIndex]: optionIndex },
    });

    setScores({
      ...scores,
      [quizId]: (scores[quizId] || 0) + (isCorrect ? 1 : 0),
    });
  };

  const retryQuiz = (quizId: string) => {
    const newAnswers = { ...answers };
    const newScores = { ...scores };
    delete newAnswers[quizId];
    delete newScores[quizId];
    setAnswers(newAnswers);
    setScores(newScores);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate("/")}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Chat
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Quiz Hub</h1>
                <p className="text-sm text-gray-600">Test your knowledge with interactive quizzes</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap gap-3 mb-6">
          {categories.map((cat) => (
            <Badge
              key={cat.value}
              variant={selectedCategory === cat.value ? "default" : "secondary"}
              className="cursor-pointer"
              onClick={() => setSelectedCategory(cat.value)}
            >
              {cat.label}
            </Badge>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          {difficulties.map((diff) => (
            <Badge
              key={diff.value}
              variant={selectedDifficulty === diff.value ? "default" : "secondary"}
              className="cursor-pointer"
              onClick={() => setSelectedDifficulty(diff.value)}
            >
              {diff.label}
            </Badge>
          ))}
        </div>

        {/* Quiz Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz) => (
            <Card key={quiz.id} className="p-4 shadow hover:shadow-lg transition relative">
              <CardHeader className="flex justify-between items-center">
                <CardTitle>{quiz.title}</CardTitle>
                <RotateCcw
                  className="h-5 w-5 text-gray-500 cursor-pointer hover:text-black"
                  onClick={() => retryQuiz(quiz.id)}
                />
              </CardHeader>
              <CardContent>
                <p className="text-xs mb-2 text-gray-500">
                  {quiz.category} • {quiz.difficulty}
                </p>
                {quiz.questions.map((q, qi) => (
                  <div key={qi} className="mb-4">
                    <p className="text-sm font-medium mb-2">{q.question}</p>
                    <div className="space-y-2">
                      {q.options.map((opt, oi) => {
                        const selected = answers[quiz.id]?.[qi] === oi;
                        const correct = q.answer === oi;
                        return (
                          <Button
                            key={oi}
                            variant="outline"
                            className={`w-full justify-start text-left text-sm transition ${
                              selected
                                ? correct
                                  ? "bg-green-100 border-green-500"
                                  : "bg-red-100 border-red-500"
                                : ""
                            }`}
                            onClick={() => handleAnswer(quiz.id, qi, oi)}
                          >
                            {opt}
                            {selected && correct && <CheckCircle className="ml-2 h-4 w-4 text-green-600" />}
                            {selected && !correct && <XCircle className="ml-2 h-4 w-4 text-red-600" />}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                ))}
                {scores[quiz.id] !== undefined && (
                  <p className="mt-4 text-sm font-semibold">Score: {scores[quiz.id]} / {quiz.questions.length}</p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
