
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, Clock, Trophy, ArrowLeft, Brain } from "lucide-react";
import { useLocation } from "wouter";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  timeLimit: number;
  questions: Question[];
}

export default function Quiz() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const sampleQuizzes: Quiz[] = [
    {
      id: "1",
      title: "Basic Mathematics",
      description: "Test your knowledge of fundamental math concepts",
      category: "Mathematics",
      difficulty: "Easy",
      timeLimit: 300, // 5 minutes
      questions: [
        {
          id: 1,
          question: "What is 15 + 27?",
          options: ["40", "42", "45", "47"],
          correctAnswer: 1,
          explanation: "15 + 27 = 42"
        },
        {
          id: 2,
          question: "What is the square root of 64?",
          options: ["6", "7", "8", "9"],
          correctAnswer: 2,
          explanation: "√64 = 8 because 8 × 8 = 64"
        }
      ]
    },
    {
      id: "2",
      title: "World History",
      description: "Test your knowledge of major historical events",
      category: "History",
      difficulty: "Medium",
      timeLimit: 600, // 10 minutes
      questions: [
        {
          id: 1,
          question: "In which year did World War II end?",
          options: ["1944", "1945", "1946", "1947"],
          correctAnswer: 1,
          explanation: "World War II ended in 1945"
        }
      ]
    }
  ];

  const startQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setTimeLeft(quiz.timeLimit);
  };

  const selectAnswer = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const nextQuestion = () => {
    if (currentQuestion < selectedQuiz!.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const calculateScore = () => {
    if (!selectedQuiz) return 0;
    let correct = 0;
    selectedQuiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / selectedQuiz.questions.length) * 100);
  };

  const resetQuiz = () => {
    setSelectedQuiz(null);
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
  };

  if (!selectedQuiz) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "var(--light-bg)" }}>
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => navigate('/')}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Chat
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--gradient)" }}>
                      <Brain className="h-5 w-5 text-white" />
                    </div>
                    <span>Quiz Hub</span>
                  </h1>
                  <p className="text-sm text-gray-600">Test your knowledge with interactive quizzes</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quiz Selection */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleQuizzes.map((quiz) => (
              <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{quiz.title}</span>
                    <Badge variant={quiz.difficulty === 'Easy' ? 'secondary' : quiz.difficulty === 'Medium' ? 'default' : 'destructive'}>
                      {quiz.difficulty}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{quiz.description}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Category:</span>
                      <Badge variant="outline">{quiz.category}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Questions:</span>
                      <span>{quiz.questions.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Time Limit:</span>
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {Math.floor(quiz.timeLimit / 60)} min
                      </span>
                    </div>
                  </div>
                  <Button
                    onClick={() => startQuiz(quiz)}
                    className="w-full"
                    style={{ background: "var(--gradient)" }}
                  >
                    Start Quiz
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const correctAnswers = selectedQuiz.questions.filter((q, i) => selectedAnswers[i] === q.correctAnswer).length;

    return (
      <div className="min-h-screen" style={{ backgroundColor: "var(--light-bg)" }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: "var(--gradient)" }}>
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Quiz Complete!</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold mb-2" style={{ color: score >= 70 ? "#10B981" : score >= 50 ? "#F59E0B" : "#EF4444" }}>
                {score}%
              </div>
              <p className="text-gray-600 mb-6">
                You got {correctAnswers} out of {selectedQuiz.questions.length} questions correct
              </p>
              
              <div className="space-y-4 mb-6">
                {selectedQuiz.questions.map((question, index) => (
                  <div key={question.id} className="text-left border rounded-lg p-4">
                    <div className="flex items-start space-x-2 mb-2">
                      {selectedAnswers[index] === question.correctAnswer ? (
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{question.question}</p>
                        <p className="text-sm text-gray-600 mt-1">{question.explanation}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex space-x-4 justify-center">
                <Button onClick={resetQuiz} variant="outline">
                  Back to Quizzes
                </Button>
                <Button onClick={() => startQuiz(selectedQuiz)} style={{ background: "var(--gradient)" }}>
                  Retake Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const question = selectedQuiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / selectedQuiz.questions.length) * 100;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--light-bg)" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{selectedQuiz.title}</h2>
              <Button variant="outline" onClick={resetQuiz}>
                Exit Quiz
              </Button>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Question {currentQuestion + 1} of {selectedQuiz.questions.length}</span>
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">{question.question}</h3>
              <div className="space-y-3">
                {question.options.map((option, index) => (
                  <Button
                    key={index}
                    variant={selectedAnswers[currentQuestion] === index ? "default" : "outline"}
                    className="w-full text-left justify-start h-auto py-3 px-4"
                    onClick={() => selectAnswer(index)}
                  >
                    <span className="mr-3 font-bold">{String.fromCharCode(65 + index)}.</span>
                    {option}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>
              <Button
                onClick={nextQuestion}
                disabled={selectedAnswers[currentQuestion] === undefined}
                style={{ background: "var(--gradient)" }}
              >
                {currentQuestion === selectedQuiz.questions.length - 1 ? "Finish Quiz" : "Next Question"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
