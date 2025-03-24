
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Bell, 
  ThumbsUp, 
  MessageSquare, 
  Share2, 
  Calendar, 
  BookOpen, 
  Trophy,
  Users,
  Pin,
  Globe,
  Filter
} from 'lucide-react';
import { toast } from 'sonner';

// Mock newsfeed data
interface NewsPost {
  id: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    role: string;
  };
  content: string;
  image?: string;
  postedAt: Date;
  likes: number;
  comments: number;
  category: 'announcement' | 'event' | 'club' | 'academic' | 'general';
  isPinned?: boolean;
  hasLiked?: boolean;
}

const mockPosts: NewsPost[] = [
  {
    id: 'post1',
    author: {
      id: 'admin1',
      name: 'SFU Administration',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SFU',
      role: 'Administrator'
    },
    content: 'Important: Registration for Spring 2024 semester begins next Monday. Make sure to check your registration time on the student portal.',
    postedAt: new Date('2023-10-05T09:30:00'),
    likes: 24,
    comments: 5,
    category: 'announcement',
    isPinned: true
  },
  {
    id: 'post2',
    author: {
      id: 'club1',
      name: 'Basketball Club',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Basketball',
      role: 'Club'
    },
    content: 'Join us this Friday for our friendly match against UBC! Everyone is welcome to come cheer for our team.',
    image: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    postedAt: new Date('2023-10-04T14:20:00'),
    likes: 42,
    comments: 8,
    category: 'club'
  },
  {
    id: 'post3',
    author: {
      id: 'faculty1',
      name: 'Computer Science Department',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=CompSci',
      role: 'Department'
    },
    content: 'The Annual Hackathon is scheduled for November 10-12. Registration opens next week. Stay tuned for more details!',
    postedAt: new Date('2023-10-03T11:15:00'),
    likes: 67,
    comments: 12,
    category: 'academic'
  },
  {
    id: 'post4',
    author: {
      id: 'user1',
      name: 'Alex Johnson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
      role: 'Student'
    },
    content: 'Just aced my calculus midterm! Who needs help with differential equations?',
    postedAt: new Date('2023-10-02T16:45:00'),
    likes: 15,
    comments: 3,
    category: 'general'
  },
  {
    id: 'post5',
    author: {
      id: 'org1',
      name: 'Student Union',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Union',
      role: 'Organization'
    },
    content: 'Reminder: The Fall Festival is happening this weekend. Join us for food, music, and fun activities on the main campus quad!',
    image: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60',
    postedAt: new Date('2023-10-01T08:30:00'),
    likes: 89,
    comments: 15,
    category: 'event'
  }
];

const NewsfeedPage = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<NewsPost[]>(mockPosts);
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Filter posts based on category
  const filteredPosts = selectedCategory === 'all'
    ? posts
    : posts.filter(post => post.category === selectedCategory);
  
  // Sort posts: pinned first, then by date
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b.postedAt.getTime() - a.postedAt.getTime();
  });
  
  // Handle post submission
  const handleSubmitPost = () => {
    if (!newPostContent.trim()) return;
    
    const newPost: NewsPost = {
      id: `post_${Date.now()}`,
      author: {
        id: user?.id || '',
        name: user?.name || '',
        avatar: user?.avatar || '',
        role: 'Student'
      },
      content: newPostContent,
      postedAt: new Date(),
      likes: 0,
      comments: 0,
      category: 'general',
      hasLiked: false
    };
    
    setPosts([newPost, ...posts]);
    setNewPostContent('');
    toast.success('Your post has been published!');
  };
  
  // Handle post like
  const handleLikePost = (postId: string) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const hasLiked = post.hasLiked || false;
        return {
          ...post,
          likes: hasLiked ? post.likes - 1 : post.likes + 1,
          hasLiked: !hasLiked
        };
      }
      return post;
    }));
  };
  
  // Category filters
  const categories = [
    { id: 'all', name: 'All Posts', icon: Globe },
    { id: 'announcement', name: 'Announcements', icon: Bell },
    { id: 'event', name: 'Events', icon: Calendar },
    { id: 'club', name: 'Clubs', icon: Users },
    { id: 'academic', name: 'Academic', icon: BookOpen },
    { id: 'general', name: 'General', icon: Globe }
  ];
  
  // Get category icon
  const getCategoryIcon = (category: string) => {
    const found = categories.find(c => c.id === category);
    return found ? found.icon : Globe;
  };
  
  return (
    <div className="animate-page-transition-in">
      <h1 className="text-3xl font-bold mb-8">Newsfeed</h1>
      
      {/* Category Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map(category => {
          const CategoryIcon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center ${
                selectedCategory === category.id
                  ? 'bg-primary text-white'
                  : 'bg-secondary hover:bg-secondary/80'
              }`}
            >
              <CategoryIcon className="w-4 h-4 mr-2" />
              {category.name}
            </button>
          );
        })}
      </div>
      
      {/* New Post Form */}
      <div className="glass-card rounded-lg overflow-hidden mb-8">
        <div className="p-6">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <img 
                src={user?.avatar} 
                alt={user?.name} 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="flex-1">
              <textarea
                placeholder="What's on your mind?"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                rows={3}
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={handleSubmitPost}
                  disabled={!newPostContent.trim()}
                  className="btn-primary py-2"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Posts */}
      <div className="space-y-6">
        {sortedPosts.length > 0 ? (
          sortedPosts.map(post => {
            const CategoryIcon = getCategoryIcon(post.category);
            return (
              <div 
                key={post.id} 
                className={`glass-card rounded-lg overflow-hidden ${
                  post.isPinned ? 'border-2 border-primary' : ''
                }`}
              >
                <div className="p-6">
                  {/* Post Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                        <img 
                          src={post.author.avatar} 
                          alt={post.author.name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div>
                        <div className="flex items-center">
                          <h3 className="font-semibold">{post.author.name}</h3>
                          {post.isPinned && (
                            <div className="ml-2 text-primary">
                              <Pin size={14} />
                            </div>
                          )}
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <span className="mr-2">{post.author.role}</span>
                          <span>•</span>
                          <span className="ml-2">{formatPostDate(post.postedAt)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${
                      getCategoryColor(post.category)
                    }`}>
                      <CategoryIcon className="w-3 h-3 mr-1" />
                      <span className="capitalize">{post.category}</span>
                    </div>
                  </div>
                  
                  {/* Post Content */}
                  <div className="mb-4">
                    <p className="mb-4 whitespace-pre-line">{post.content}</p>
                    {post.image && (
                      <div className="rounded-md overflow-hidden max-h-80">
                        <img 
                          src={post.image} 
                          alt="Post attachment" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                  
                  {/* Post Actions */}
                  <div className="flex items-center pt-3 border-t border-border/40">
                    <button
                      onClick={() => handleLikePost(post.id)}
                      className={`flex items-center mr-4 transition-colors ${
                        post.hasLiked ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      <span>{post.likes}</span>
                    </button>
                    <button className="flex items-center mr-4 text-muted-foreground hover:text-foreground transition-colors">
                      <MessageSquare className="w-4 h-4 mr-1" />
                      <span>{post.comments}</span>
                    </button>
                    <button className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
                      <Share2 className="w-4 h-4 mr-1" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 glass-card rounded-lg">
            <Bell className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No posts found</h3>
            <p className="text-muted-foreground">
              Try selecting a different category filter
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to format post date
function formatPostDate(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays}d ago`;
  }
  
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
}

// Helper function to get category color
function getCategoryColor(category: string): string {
  switch (category) {
    case 'announcement':
      return 'bg-red-100 text-red-700';
    case 'event':
      return 'bg-purple-100 text-purple-700';
    case 'club':
      return 'bg-blue-100 text-blue-700';
    case 'academic':
      return 'bg-green-100 text-green-700';
    default:
      return 'bg-secondary text-foreground';
  }
}

export default NewsfeedPage;
