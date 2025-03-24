import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Users, 
  Dumbbell, 
  Palette, 
  BadgePlus, 
  Eye, 
  ArrowLeft,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner';

// Mock club data
interface ClubMember {
  id: string;
  name: string;
  avatar: string;
  role: 'coordinator' | 'member';
}

interface Club {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  coordinator: ClubMember;
  members: ClubMember[];
  joinRequests: ClubMember[];
}

const mockClubs: Club[] = [
  {
    id: 'club1',
    name: 'Basketball Club',
    icon: Dumbbell, // Changed from Basketball to Dumbbell icon
    description: 'Join us for weekly basketball games and training sessions. All skill levels welcome!',
    coordinator: {
      id: 'mem1',
      name: 'Coach Davis',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Davis',
      role: 'coordinator'
    },
    members: [
      {
        id: 'mem2',
        name: 'Jamie Smith',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jamie',
        role: 'member'
      },
      {
        id: 'mem3',
        name: 'Alex Johnson',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
        role: 'member'
      }
    ],
    joinRequests: []
  },
  {
    id: 'club2',
    name: 'Art Club',
    icon: Palette,
    description: 'Express yourself through various art forms. We host weekly workshops and exhibitions.',
    coordinator: {
      id: 'mem4',
      name: 'Morgan Lee',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Morgan',
      role: 'coordinator'
    },
    members: [
      {
        id: 'mem5',
        name: 'Taylor Brown',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor',
        role: 'member'
      }
    ],
    joinRequests: []
  },
  {
    id: 'club3',
    name: 'Badminton Club',
    icon: Users, // Using Users as a placeholder for badminton
    description: 'Weekly badminton sessions for all skill levels. Join us for fun and fitness!',
    coordinator: {
      id: 'mem6',
      name: 'Casey Williams',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Casey',
      role: 'coordinator'
    },
    members: [],
    joinRequests: []
  }
];

const ClubPage = () => {
  const { user } = useAuth();
  const [clubs, setClubs] = useState<Club[]>(mockClubs);
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [viewMode, setViewMode = useState<'list' | 'details' | 'members' | 'requests'>('list');

  // Check if current user is a member or coordinator of the selected club
  const getUserRole = (club: Club) => {
    if (club.coordinator.id === user?.id) return 'coordinator';
    if (club.members.some(member => member.id === user?.id)) return 'member';
    if (club.joinRequests.some(request => request.id === user?.id)) return 'pending';
    return 'none';
  };

  // Handle join request
  const handleJoinRequest = (club: Club) => {
    if (getUserRole(club) !== 'none') return;
    
    const updatedClub = {
      ...club,
      joinRequests: [
        ...club.joinRequests,
        {
          id: user?.id || '',
          name: user?.name || '',
          avatar: user?.avatar || '',
          role: 'member' as const
        }
      ]
    };
    
    setClubs(clubs.map(c => c.id === club.id ? updatedClub : c));
    setSelectedClub(updatedClub);
    toast.success('Join request sent successfully');
  };

  // Handle approve/reject request (for coordinators)
  const handleRequestAction = (requestId: string, action: 'approve' | 'reject') => {
    if (!selectedClub) return;
    
    const requestMember = selectedClub.joinRequests.find(req => req.id === requestId);
    if (!requestMember) return;
    
    let updatedClub: Club;
    
    if (action === 'approve') {
      updatedClub = {
        ...selectedClub,
        members: [...selectedClub.members, requestMember],
        joinRequests: selectedClub.joinRequests.filter(req => req.id !== requestId)
      };
      toast.success(`${requestMember.name} has been added to the club`);
    } else {
      updatedClub = {
        ...selectedClub,
        joinRequests: selectedClub.joinRequests.filter(req => req.id !== requestId)
      };
      toast.info(`Request has been rejected`);
    }
    
    setClubs(clubs.map(c => c.id === selectedClub.id ? updatedClub : c));
    setSelectedClub(updatedClub);
  };

  // Back button handler
  const handleBack = () => {
    if (viewMode === 'details') {
      setSelectedClub(null);
      setViewMode('list');
    } else if (viewMode === 'members' || viewMode === 'requests') {
      setViewMode('details');
    }
  };

  // Club Card Component
  const ClubCard = ({ club }: { club: Club }) => {
    const Icon = club.icon;
    const userRole = getUserRole(club);
    
    return (
      <div className="glass-card rounded-lg overflow-hidden card-hover">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="bg-primary/10 text-primary rounded-full p-3 mr-4">
              <Icon className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold">{club.name}</h3>
          </div>
          
          <p className="text-muted-foreground mb-6">{club.description}</p>
          
          <div className="flex items-center mb-4">
            <div className="w-8 h-8 rounded-full overflow-hidden mr-3">
              <img 
                src={club.coordinator.avatar} 
                alt={club.coordinator.name} 
                className="w-full h-full object-cover" 
              />
            </div>
            <div>
              <p className="text-sm font-medium">{club.coordinator.name}</p>
              <p className="text-xs text-muted-foreground">Coordinator</p>
            </div>
          </div>
          
          <div className="flex space-x-2 mt-4">
            <button
              onClick={() => {
                setSelectedClub(club);
                setViewMode('details');
              }}
              className="flex-1 btn-secondary"
            >
              <Eye className="w-4 h-4 mr-2" />
              View Club
            </button>
            
            {userRole === 'none' && (
              <button
                onClick={() => handleJoinRequest(club)}
                className="flex-1 btn-primary"
              >
                <BadgePlus className="w-4 h-4 mr-2" />
                Join Club
              </button>
            )}
            
            {userRole === 'pending' && (
              <button disabled className="flex-1 btn-secondary opacity-50">
                Request Pending
              </button>
            )}
            
            {userRole === 'member' && (
              <button disabled className="flex-1 btn-secondary opacity-50">
                Member
              </button>
            )}
            
            {userRole === 'coordinator' && (
              <button
                onClick={() => {
                  setSelectedClub(club);
                  setViewMode('requests');
                }}
                className="flex-1 btn-primary"
              >
                Manage Requests
                {club.joinRequests.length > 0 && (
                  <span className="ml-2 bg-white text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {club.joinRequests.length}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="animate-page-transition-in">
      {/* Header with Back Button */}
      {viewMode !== 'list' && (
        <button
          onClick={handleBack}
          className="mb-6 flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>
      )}
      
      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-6">
        {viewMode === 'list' && 'Clubs'}
        {viewMode === 'details' && selectedClub?.name}
        {viewMode === 'members' && `${selectedClub?.name} - Members`}
        {viewMode === 'requests' && `${selectedClub?.name} - Join Requests`}
      </h1>
      
      {/* Club List View */}
      {viewMode === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map(club => (
            <ClubCard key={club.id} club={club} />
          ))}
        </div>
      )}
      
      {/* Club Details View */}
      {viewMode === 'details' && selectedClub && (
        <div className="glass-card rounded-lg overflow-hidden p-6">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3">
              <div className="text-center">
                <div className="bg-primary/10 text-primary rounded-full p-6 inline-block mb-4">
                  <selectedClub.icon className="w-12 h-12" />
                </div>
                <h2 className="text-2xl font-bold mb-2">{selectedClub.name}</h2>
                <p className="text-muted-foreground mb-6">{selectedClub.description}</p>
                
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground mb-1">Coordinator</p>
                  <div className="flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                      <img 
                        src={selectedClub.coordinator.avatar} 
                        alt={selectedClub.coordinator.name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <p className="font-medium">{selectedClub.coordinator.name}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <button
                    onClick={() => setViewMode('members')}
                    className="btn-secondary w-full"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    View Members ({selectedClub.members.length})
                  </button>
                  
                  {getUserRole(selectedClub) === 'none' && (
                    <button
                      onClick={() => handleJoinRequest(selectedClub)}
                      className="btn-primary w-full"
                    >
                      <BadgePlus className="w-4 h-4 mr-2" />
                      Join Club
                    </button>
                  )}
                  
                  {getUserRole(selectedClub) === 'pending' && (
                    <button disabled className="btn-secondary w-full opacity-50">
                      Request Pending
                    </button>
                  )}
                  
                  {getUserRole(selectedClub) === 'coordinator' && (
                    <button
                      onClick={() => setViewMode('requests')}
                      className="btn-primary w-full"
                    >
                      Manage Requests
                      {selectedClub.joinRequests.length > 0 && (
                        <span className="ml-2 bg-white text-primary rounded-full w-5 h-5 flex items-center justify-center text-xs">
                          {selectedClub.joinRequests.length}
                        </span>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="glass-card rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">About the Club</h3>
                <p className="mb-6">
                  Join our vibrant community of students passionate about {selectedClub.name.toLowerCase().replace(' club', '')}. 
                  Whether you're a beginner or experienced, we welcome all skill levels.
                </p>
                
                <h4 className="font-medium mb-2">What we offer:</h4>
                <ul className="list-disc list-inside space-y-1 mb-6">
                  <li>Weekly practice sessions</li>
                  <li>Skill development workshops</li>
                  <li>Competitions and events</li>
                  <li>Social gatherings</li>
                </ul>
                
                <div className="border-t border-border/40 pt-4">
                  <h4 className="font-medium mb-2">Club Status</h4>
                  {getUserRole(selectedClub) === 'member' && (
                    <p className="text-green-600 flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      You are a member of this club
                    </p>
                  )}
                  {getUserRole(selectedClub) === 'coordinator' && (
                    <p className="text-primary flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      You are the coordinator of this club
                    </p>
                  )}
                  {getUserRole(selectedClub) === 'pending' && (
                    <p className="text-yellow-600 flex items-center">
                      <span className="w-2 h-2 bg-yellow-600 rounded-full mr-2"></span>
                      Your request to join is pending
                    </p>
                  )}
                  {getUserRole(selectedClub) === 'none' && (
                    <p className="text-muted-foreground">
                      You are not a member of this club
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Club Members View */}
      {viewMode === 'members' && selectedClub && (
        <div className="glass-card rounded-lg overflow-hidden">
          <div className="p-6">
            <p className="text-muted-foreground mb-6">
              {selectedClub.members.length === 0 
                ? 'No members have joined yet' 
                : `${selectedClub.members.length} member${selectedClub.members.length === 1 ? '' : 's'}`}
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center p-4 border border-border/40 rounded-md bg-secondary/30">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                  <img 
                    src={selectedClub.coordinator.avatar} 
                    alt={selectedClub.coordinator.name} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div>
                  <h3 className="font-medium">{selectedClub.coordinator.name}</h3>
                  <p className="text-sm text-primary">Coordinator</p>
                </div>
              </div>
              
              {selectedClub.members.map(member => (
                <div key={member.id} className="flex items-center p-4 border border-border/40 rounded-md hover:bg-secondary/30 transition-colors">
                  <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                    <img 
                      src={member.avatar} 
                      alt={member.name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">Member</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Join Requests View (Coordinators Only) */}
      {viewMode === 'requests' && selectedClub && getUserRole(selectedClub) === 'coordinator' && (
        <div className="glass-card rounded-lg overflow-hidden">
          <div className="p-6">
            <p className="text-muted-foreground mb-6">
              {selectedClub.joinRequests.length === 0 
                ? 'No pending join requests' 
                : `${selectedClub.joinRequests.length} pending request${selectedClub.joinRequests.length === 1 ? '' : 's'}`}
            </p>
            
            <div className="space-y-4">
              {selectedClub.joinRequests.length === 0 ? (
                <div className="text-center py-8">
                  <p>No pending requests at this time</p>
                </div>
              ) : (
                selectedClub.joinRequests.map(request => (
                  <div key={request.id} className="flex items-center justify-between p-4 border border-border/40 rounded-md hover:bg-secondary/30 transition-colors">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                        <img 
                          src={request.avatar} 
                          alt={request.name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div>
                        <h3 className="font-medium">{request.name}</h3>
                        <p className="text-sm text-muted-foreground">Requested to join</p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleRequestAction(request.id, 'approve')}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                      >
                        <CheckCircle className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleRequestAction(request.id, 'reject')}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClubPage;
