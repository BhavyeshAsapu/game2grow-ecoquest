import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlayCircle, Clock, Leaf, Recycle, Zap, Droplets } from 'lucide-react';

const Videos = () => {
  const videoCategories = [
    {
      title: "Climate Change Basics",
      icon: <Leaf className="w-5 h-5" />,
      videos: [
        {
          title: "What is Climate Change?",
          description: "An animated introduction to climate change for all ages",
          duration: "3:45",
          embedId: "EuwNzamUvSs"
        },
        {
          title: "Greenhouse Effect Explained",
          description: "Understanding how greenhouse gases work",
          duration: "4:20",
          embedId: "SN5-DnOHQmE"
        },
        {
          title: "Climate vs Weather",
          description: "Learn the difference between climate and weather patterns",
          duration: "2:55",
          embedId: "e6FcNgOHYoo"
        }
      ]
    },
    {
      title: "Renewable Energy",
      icon: <Zap className="w-5 h-5" />,
      videos: [
        {
          title: "Solar Energy for Kids",
          description: "How solar panels work and why they're important",
          duration: "5:10",
          embedId: "xKxrkht7CpY"
        },
        {
          title: "Wind Power Animation",
          description: "Discover how wind turbines generate clean energy",
          duration: "3:30",
          embedId: "tsZoz2mdYhc"
        },
        {
          title: "Hydroelectric Power",
          description: "Learn about water-powered electricity generation",
          duration: "4:15",
          embedId: "q8HmRLl8lDk"
        }
      ]
    },
    {
      title: "Recycling & Sustainability",
      icon: <Recycle className="w-5 h-5" />,
      videos: [
        {
          title: "The Journey of Recycled Materials",
          description: "Follow recyclables from bin to new products",
          duration: "6:25",
          embedId: "6jQ7y_qQYuA"
        },
        {
          title: "Reduce, Reuse, Recycle",
          description: "The three R's of environmental protection",
          duration: "4:40",
          embedId: "AR4jbIk5I_8"
        },
        {
          title: "Plastic Pollution Solutions",
          description: "Understanding and solving the plastic problem",
          duration: "5:55",
          embedId: "RS7IzU2VJIQ"
        }
      ]
    },
    {
      title: "Water Conservation",
      icon: <Droplets className="w-5 h-5" />,
      videos: [
        {
          title: "Water Cycle Adventure",
          description: "An animated journey through the water cycle",
          duration: "3:20",
          embedId: "al-do-yS3Rg"
        },
        {
          title: "Save Water, Save Life",
          description: "Simple ways kids can conserve water daily",
          duration: "4:05",
          embedId: "ocRzGCfYZ7o"
        },
        {
          title: "Ocean Conservation",
          description: "Protecting our oceans and marine life",
          duration: "5:30",
          embedId: "CqPUTiNTKrE"
        }
      ]
    }
  ];

  const [selectedVideo, setSelectedVideo] = React.useState<string | null>(null);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
          Educational Videos
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover the world of environmental science through engaging animated videos. 
          Perfect for learners of all ages!
        </p>
      </div>

      <div className="space-y-12">
        {videoCategories.map((category, categoryIndex) => (
          <section key={categoryIndex}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                {category.icon}
              </div>
              <h2 className="text-2xl font-bold">{category.title}</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.videos.map((video, videoIndex) => (
                <Card key={videoIndex} className="group hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <CardHeader className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg h-48">
                      {selectedVideo === video.embedId ? (
                        <iframe
                          width="100%"
                          height="100%"
                          src={`https://www.youtube.com/embed/${video.embedId}?autoplay=1`}
                          title={video.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="rounded-t-lg"
                        />
                      ) : (
                        <div 
                          className="relative w-full h-full cursor-pointer group-hover:bg-muted/80 transition-colors"
                          onClick={() => setSelectedVideo(video.embedId)}
                        >
                          <img
                            src={`https://img.youtube.com/vi/${video.embedId}/maxresdefault.jpg`}
                            alt={video.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = `https://img.youtube.com/vi/${video.embedId}/hqdefault.jpg`;
                            }}
                          />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <PlayCircle className="w-16 h-16 text-white group-hover:scale-110 transition-transform" />
                          </div>
                          <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {video.duration}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <CardTitle className="text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {video.title}
                    </CardTitle>
                    <CardDescription className="text-sm line-clamp-3">
                      {video.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-12 p-6 bg-primary/5 rounded-lg border border-primary/20">
        <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
          <Leaf className="w-5 h-5 text-primary" />
          Why Environmental Education Matters
        </h3>
        <p className="text-muted-foreground">
          These videos are carefully selected to inspire environmental awareness and action. 
          Learning about our planet helps us make better choices for a sustainable future. 
          Share these videos with friends and family to spread environmental consciousness!
        </p>
      </div>
    </div>
  );
};

export default Videos;