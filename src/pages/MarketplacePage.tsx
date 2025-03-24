
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  ShoppingBag, 
  Search, 
  Grid, 
  List, 
  Filter,
  Tag,
  MessageSquare,
  Heart,
  Share2
} from 'lucide-react';

// Mock marketplace data
interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  seller: {
    id: string;
    name: string;
    avatar: string;
  };
  category: string;
  condition: 'New' | 'Like New' | 'Good' | 'Fair' | 'Poor';
  postedDate: Date;
}

const mockItems: MarketplaceItem[] = [
  {
    id: 'item1',
    title: 'Calculus Textbook (8th Edition)',
    description: 'Excellent condition. No highlights or markings.',
    price: 45,
    image: 'https://images.unsplash.com/photo-1590615370581-265ae19a053b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    seller: {
      id: 'user1',
      name: 'Alex Johnson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'
    },
    category: 'Books',
    condition: 'Like New',
    postedDate: new Date('2023-09-30')
  },
  {
    id: 'item2',
    title: 'Scientific Calculator (TI-84)',
    description: 'Works perfectly. Minor scratches on the case.',
    price: 65,
    image: 'https://images.unsplash.com/photo-1564350888578-6482d8f8f995?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    seller: {
      id: 'user2',
      name: 'Jamie Smith',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jamie'
    },
    category: 'Electronics',
    condition: 'Good',
    postedDate: new Date('2023-10-01')
  },
  {
    id: 'item3',
    title: 'Desk Lamp',
    description: 'Adjustable LED desk lamp. USB powered.',
    price: 25,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    seller: {
      id: 'user3',
      name: 'Morgan Lee',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Morgan'
    },
    category: 'Furniture',
    condition: 'New',
    postedDate: new Date('2023-10-02')
  },
  {
    id: 'item4',
    title: 'Psychology 101 Textbook',
    description: 'Some highlighting on a few pages, otherwise in good condition.',
    price: 30,
    image: 'https://images.unsplash.com/photo-1592375701773-c5bcf35c855f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    seller: {
      id: 'user4',
      name: 'Casey Williams',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Casey'
    },
    category: 'Books',
    condition: 'Good',
    postedDate: new Date('2023-10-03')
  },
  {
    id: 'item5',
    title: 'Bicycle - Mountain Bike',
    description: '21-speed mountain bike. Recently serviced. Great for campus commuting.',
    price: 120,
    image: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    seller: {
      id: 'user5',
      name: 'Taylor Brown',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor'
    },
    category: 'Sports',
    condition: 'Good',
    postedDate: new Date('2023-10-04')
  },
  {
    id: 'item6',
    title: 'Computer Science Notes Bundle',
    description: 'Complete notes for Data Structures, Algorithms, and Operating Systems courses.',
    price: 15,
    image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
    seller: {
      id: 'user1',
      name: 'Alex Johnson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'
    },
    category: 'Notes',
    condition: 'New',
    postedDate: new Date('2023-10-05')
  }
];

// Categories
const categories = [
  'All',
  'Books',
  'Electronics',
  'Furniture',
  'Notes',
  'Sports',
  'Clothing',
  'Other'
];

const MarketplacePage = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [items] = useState<MarketplaceItem[]>(mockItems);
  
  // Filter items based on search and category
  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  return (
    <div className="animate-page-transition-in">
      <h1 className="text-3xl font-bold mb-8">Marketplace</h1>
      
      {/* Search and Filters */}
      <div className="glass-card rounded-lg overflow-hidden mb-8">
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <input
                type="text"
                placeholder="Search for items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 pl-10 pr-4 rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md ${
                  viewMode === 'grid' ? 'bg-primary text-white' : 'bg-secondary hover:bg-secondary/80'
                }`}
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md ${
                  viewMode === 'list' ? 'bg-primary text-white' : 'bg-secondary hover:bg-secondary/80'
                }`}
              >
                <List size={18} />
              </button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-full text-sm transition-colors ${
                  selectedCategory === category 
                    ? 'bg-primary text-white' 
                    : 'bg-secondary hover:bg-secondary/80'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Item Grid/List */}
      {filteredItems.length > 0 ? (
        <div className={`grid gap-6 ${
          viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
        }`}>
          {filteredItems.map(item => (
            <div 
              key={item.id} 
              className="glass-card rounded-lg overflow-hidden card-hover"
            >
              {viewMode === 'grid' ? (
                // Grid View
                <div>
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold">{item.title}</h3>
                      <p className="text-lg font-bold text-primary">${item.price}</p>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{item.description}</p>
                    
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                          <img 
                            src={item.seller.avatar} 
                            alt={item.seller.name} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <span className="text-sm">{item.seller.name}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {timeAgo(item.postedDate)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <div className="flex items-center space-x-1">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary">
                          {item.condition}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {item.category}
                        </span>
                      </div>
                      
                      <button className="text-primary hover:text-primary/80 transition-colors">
                        <MessageSquare size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                // List View
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-48 h-48 md:h-auto overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold">{item.title}</h3>
                      <p className="text-lg font-bold text-primary">${item.price}</p>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                    
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary">
                        {item.condition}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        {item.category}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full overflow-hidden mr-2">
                          <img 
                            src={item.seller.avatar} 
                            alt={item.seller.name} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <span className="text-sm">{item.seller.name}</span>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <span className="text-xs text-muted-foreground">
                          {timeAgo(item.postedDate)}
                        </span>
                        <button className="text-primary hover:text-primary/80 transition-colors">
                          <MessageSquare size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 glass-card rounded-lg">
          <ShoppingBag className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No items found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or category filters
          </p>
        </div>
      )}
    </div>
  );
};

// Helper function to format time ago
function timeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  
  return Math.floor(seconds) + " seconds ago";
}

export default MarketplacePage;
