import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Play, Search, Users, ArrowLeft, BookOpen } from "lucide-react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";

interface Video {
  id: string;
  title: string;
  channel: string;
  duration: string;
  views: string;
  thumbnail: string;
  category: string;
  description: string;
  url: string; // YouTube watch URL
}

export default function AcademicTube() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);

  // --- Shared search across sub‑pages (URL + localStorage sync) ---
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q") || localStorage.getItem("globalSearchQuery") || "";
    const cat = params.get("cat") || "all";
    setSearchQuery(q);
    setSelectedCategory(cat);
  }, []);

  useEffect(() => {
    localStorage.setItem("globalSearchQuery", searchQuery);
    const params = new URLSearchParams(window.location.search);
    if (searchQuery) params.set("q", searchQuery); else params.delete("q");
    if (selectedCategory && selectedCategory !== "all") params.set("cat", selectedCategory); else params.delete("cat");
    const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`;
    window.history.replaceState({}, "", newUrl);
  }, [searchQuery, selectedCategory]);

  const categories = [
    { value: "all", label: "All Subjects" },
    { value: "mathematics", label: "Mathematics" },
    { value: "science", label: "Science" },
    { value: "history", label: "History" },
    { value: "literature", label: "Literature" },
    { value: "programming", label: "Programming" }
  ];

  // ✅ Two+ vetted videos per subject with working YouTube IDs
  const videos: Video[] = [
    // Mathematics
    {
      id: "math-1",
      title: "Essence of Calculus: The Derivative",
      channel: "3Blue1Brown",
      duration: "15:00",
      views: "9.9M",
      thumbnail: "https://img.youtube.com/vi/WUvTyaaNkzM/hqdefault.jpg",
      category: "mathematics",
      description: "A visual introduction to derivatives that builds true intuition.",
      url: "https://www.youtube.com/watch?v=WUvTyaaNkzM"
    },
    {
      id: "math-2",
      title: "Algebra Basics – What Is Algebra?",
      channel: "mathantics",
      duration: "12:10",
      views: "18M",
      thumbnail: "https://img.youtube.com/vi/NybHckSEQBI/hqdefault.jpg",
      category: "mathematics",
      description: "A clear, friendly overview of variables, expressions, and equations.",
      url: "https://www.youtube.com/watch?v=NybHckSEQBI"
    },

    // Science
    {
      id: "sci-1",
      title: "Photosynthesis (AP Bio Essentials)",
      channel: "Bozeman Science",
      duration: "13:10",
      views: "3.7M",
      thumbnail: "https://img.youtube.com/vi/g78utcLQrJ4/hqdefault.jpg",
      category: "science",
      description: "Paul Andersen explains how plants convert light energy into sugars.",
      url: "https://www.youtube.com/watch?v=g78utcLQrJ4"
    },
    {
      id: "sci-2",
      title: "Explore the Solar System (Nat Geo Kids)",
      channel: "Nat Geo Kids",
      duration: "11:32",
      views: "2.1M",
      thumbnail: "https://img.youtube.com/vi/XVYaz-D2MYE/hqdefault.jpg",
      category: "science",
      description: "Planets, orbits, and fun facts about our solar system.",
      url: "https://www.youtube.com/watch?v=XVYaz-D2MYE"
    },

    // History
    {
      id: "hist-1",
      title: "World War 2, Explained in 5 Minutes!",
      channel: "5 Minutes",
      duration: "5:00",
      views: "371K+",
      thumbnail: "https://img.youtube.com/vi/58XB0OvoGAI/hqdefault.jpg",
      category: "history",
      description: "Short, clear summary of key World War II events.",
      url: "https://www.youtube.com/watch?v=58XB0OvoGAI"
    },
    {
      id: "hist-2",
      title: "World War 2 in 12 Minutes (Extended Edition)",
      channel: "Manny Man Does History",
      duration: "12:00",
      views: "—",
      thumbnail: "https://img.youtube.com/vi/6FmadyxEcBM/hqdefault.jpg",
      category: "history",
      description: "Animated overview of the key events and turning points across both European and Pacific theaters.",
      url: "https://www.youtube.com/watch?v=6FmadyxEcBM"
    },


    // Literature
    {
      id: "lit-1",
      title: "How and Why We Read (Lit #1)",
      channel: "CrashCourse",
      duration: "12:08",
      views: "6.2M",
      thumbnail: "https://img.youtube.com/vi/MSYw502dJNY/hqdefault.jpg",
      category: "literature",
      description: "John Green kicks off Crash Course Literature with close reading skills.",
      url: "https://www.youtube.com/watch?v=MSYw502dJNY"
    },
    {
      id: "lit-2",
      title: "The Poetry of Emily Dickinson (Lit #8)",
      channel: "CrashCourse",
      duration: "10:55",
      views: "2.1M",
      thumbnail: "https://img.youtube.com/vi/R4WwhOdk_Eg/hqdefault.jpg",
      category: "literature",
      description: "Themes, style, and techniques to read Dickinson's poems effectively.",
      url: "https://www.youtube.com/watch?v=R4WwhOdk_Eg"
    },

    // Programming
    {
      id: "code-1",
      title: "Python Full Course for Beginners",
      channel: "Programming with Mosh",
      duration: "6h",
      views: "50M",
      thumbnail: "https://img.youtube.com/vi/_uQrJ0TkZlc/hqdefault.jpg",
      category: "programming",
      description: "Hands-on Python fundamentals: variables, loops, functions, OOP.",
      url: "https://www.youtube.com/watch?v=_uQrJ0TkZlc"
    },
    {
      id: "code-2",
      title: "JavaScript – Full Course for Beginners",
      channel: "freeCodeCamp.org",
      duration: "3h",
      views: "20M",
      thumbnail: "https://img.youtube.com/vi/PkZNo7MFNFg/hqdefault.jpg",
      category: "programming",
      description: "Everything you need to get started with modern JavaScript.",
      url: "https://www.youtube.com/watch?v=PkZNo7MFNFg"
    }
  ];

  const filteredVideos = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return videos.filter((v) => {
      const matchesSearch = !q || [v.title, v.channel, v.description, v.category]
        .join(" ")
        .toLowerCase()
        .includes(q);
      const matchesCategory = selectedCategory === "all" || v.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const embedUrl = (watchUrl: string) => {
    try {
      const url = new URL(watchUrl);
      const v = url.searchParams.get("v");
      const id = v || watchUrl.split("/").pop();
      return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
    } catch {
      return watchUrl;
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--light-bg)" }}>
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => navigate("/")}> 
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
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search any video (title, topic, channel)..."
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <motion.div key={category.value} whileTap={{ scale: 0.96 }}>
                <Badge
                  variant={selectedCategory === category.value ? "default" : "secondary"}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(category.value)}
                >
                  {category.label}
                </Badge>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Video Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.05 } }
          }}
        >
          {filteredVideos.map((video) => (
            <motion.div
              key={video.id}
              variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
              whileHover={{ y: -2 }}
            >
              <Card
                className="group hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => setActiveVideo(video)}
              >
                <div className="relative">
                  <img src={video.thumbnail} alt={video.title} className="w-full h-48 object-cover rounded-t-lg" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors rounded-t-lg flex items-center justify-center">
                    <Play className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-sm mb-2 line-clamp-2">{video.title}</h3>
                  <p className="text-xs text-gray-600 mb-1">{video.channel}</p>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-2">{video.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Users className="h-3 w-3" />
                      <span>{video.views} views</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {categories.find((c) => c.value === video.category)?.label}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {filteredVideos.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No videos found</h3>
            <p className="text-gray-600">Try adjusting your search or category filters.</p>
          </div>
        )}
      </div>

      {/* Responsive Modal Player */}
      <AnimatePresence>
        <Dialog open={!!activeVideo} onOpenChange={(open) => !open && setActiveVideo(null)}>
          <DialogContent className="max-w-3xl w-[95vw] p-0 overflow-hidden">
            {activeVideo && (
              <div>
                <DialogHeader className="px-4 pt-4">
                  <DialogTitle className="text-base sm:text-lg">{activeVideo.title}</DialogTitle>
                  <DialogDescription className="text-xs sm:text-sm">
                    {activeVideo.channel} • {categories.find((c) => c.value === activeVideo.category)?.label}
                  </DialogDescription>
                </DialogHeader>
                <div className="px-4 pb-4">
                  <AspectRatio ratio={16 / 9} className="rounded-lg overflow-hidden">
                    <iframe
                      className="w-full h-full"
                      src={embedUrl(activeVideo.url)}
                      title={activeVideo.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </AspectRatio>
                  <p className="text-xs text-gray-600 mt-3 line-clamp-3">{activeVideo.description}</p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </AnimatePresence>
    </div>
  );
}
