
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Play, Search, Clock, Users, ArrowLeft, BookOpen } from "lucide-react";
import { useLocation } from "wouter";

interface Video {
  id: string;
  title: string;
  channel: string;
  duration: string;
  views: string;
  thumbnail: string;
  category: string;
  description: string;
}

export default function AcademicTube() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { value: "all", label: "All Subjects" },
    { value: "mathematics", label: "Mathematics" },
    { value: "science", label: "Science" },
    { value: "history", label: "History" },
    { value: "literature", label: "Literature" },
    { value: "programming", label: "Programming" }
  ];

  const sampleVideos: Video[] = [
    {
      id: "1",
      title: "Introduction to Calculus - Derivatives Explained",
      channel: "Math Academy",
      duration: "15:30",
      views: "45K",
      thumbnail: "https://via.placeholder.com/320x180/3B82F6/white?text=Calculus",
      category: "mathematics",
      description: "Learn the fundamentals of derivatives in calculus"
    },
    {
      id: "2",
      title: "Photosynthesis Process in Plants",
      channel: "Biology Basics",
      duration: "12:45",
      views: "32K",
      thumbnail: "https://via.placeholder.com/320x180/10B981/white?text=Biology",
      category: "science",
      description: "Understanding how plants convert light into energy"
    },
    {
      id: "3",
      title: "World War II: Key Events Timeline",
      channel: "History Hub",
      duration: "20:15",
      views: "28K",
      thumbnail: "https://via.placeholder.com/320x180/F59E0B/white?text=History",
      category: "history",
      description: "Major events and turning points of WWII"
    },
    {
      id: "4",
      title: "Python Programming Basics",
      channel: "Code Learn",
      duration: "18:22",
      views: "67K",
      thumbnail: "https://via.placeholder.com/320x180/8B5CF6/white?text=Python",
      category: "programming",
      description: "Get started with Python programming language"
    }
  ];

  const filteredVideos = sampleVideos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.channel.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || video.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--light-bg)" }}>
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                    <Play className="h-5 w-5 text-white" />
                  </div>
                  <span>AcademicTube</span>
                </h1>
                <p className="text-sm text-gray-600">Educational videos for learning</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for educational videos..."
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge
                key={category.value}
                variant={selectedCategory === category.value ? "default" : "secondary"}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(category.value)}
              >
                {category.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVideos.map((video) => (
            <Card key={video.id} className="group hover:shadow-lg transition-shadow cursor-pointer">
              <div className="relative">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-t-lg flex items-center justify-center">
                  <Play className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                  {video.duration}
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                  {video.title}
                </h3>
                <p className="text-xs text-gray-600 mb-2">{video.channel}</p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Users className="h-3 w-3" />
                    <span>{video.views} views</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {categories.find(c => c.value === video.category)?.label}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredVideos.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No videos found</h3>
            <p className="text-gray-600">Try adjusting your search or category filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
