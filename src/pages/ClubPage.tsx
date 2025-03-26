
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, Info, ChevronRight, CheckCircle, XCircle } from 'lucide-react';

// Types
interface Club {
  id: string;
  name: string;
  description: string;
  coordinator: string;
  coordinatorId: string;
  memberCount: number;
  imageUrl: string;
}

interface JoinRequest {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface ClubMember {
  id: string;
  name: string;
  avatar: string;
  joinedDate: Date;
  role: 'coordinator' | 'member';
}

// Mock data
const mockClubs: Club[] = [
  {
    id: 'club-1',
    name: 'Basketball Club',
    description: 'Join our basketball club to improve your skills, participate in tournaments and make new friends who share your passion for the game.',
    coordinator: 'Alex Johnson',
    coordinatorId: 'user-1',
    memberCount: 24,
    imageUrl: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: 'club-2',
    name: 'Art Club',
    description: 'Express yourself through various art forms, learn new techniques, and showcase your creativity in campus exhibitions and events.',
    coordinator: 'Maya Wilson',
    coordinatorId: 'user-2',
    memberCount: 18,
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=1000'
  },
  {
    id: 'club-3',
    name: 'Badminton Club',
    description: 'Whether you\'re a beginner or advanced player, our badminton club offers regular practice sessions, coaching, and competitive opportunities.',
    coordinator: 'James Lee',
    coordinatorId: 'user-3',
    memberCount: 32,
    imageUrl: 'https://images.unsplash.com/photo-1599926011168-3b063548cefb?auto=format&fit=crop&q=80&w=1000'
  },
];

const mockMembers: Record<string, ClubMember[]> = {
  'club-1': [
    { id: 'user-1', name: 'Alex Johnson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', joinedDate: new Date('2023-01-15'), role: 'coordinator' },
    { id: 'user-4', name: 'Sarah Miller', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', joinedDate: new Date('2023-02-03'), role: 'member' },
    { id: 'user-5', name: 'David Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David', joinedDate: new Date('2023-02-20'), role: 'member' },
  ],
  'club-2': [
    { id: 'user-2', name: 'Maya Wilson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya', joinedDate: new Date('2023-01-10'), role: 'coordinator' },
    { id: 'user-6', name: 'Emma Thompson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma', joinedDate: new Date('2023-03-05'), role: 'member' },
    { id: 'user-7', name: 'Michael Brown', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael', joinedDate: new Date('2023-03-12'), role: 'member' },
  ],
  'club-3': [
    { id: 'user-3', name: 'James Lee', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James', joinedDate: new Date('2023-01-05'), role: 'coordinator' },
    { id: 'user-8', name: 'Olivia Davis', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia', joinedDate: new Date('2023-02-15'), role: 'member' },
    { id: 'user-9', name: 'Daniel Kim', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Daniel', joinedDate: new Date('2023-03-20'), role: 'member' },
  ],
};

const mockJoinRequests: Record<string, JoinRequest[]> = {
  'club-1': [
    { id: 'req-1', userId: 'user-10', userName: 'Sophie Garcia', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie', status: 'pending' },
    { id: 'req-2', userId: 'user-11', userName: 'Thomas Wright', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Thomas', status: 'pending' },
  ],
  'club-2': [
    { id: 'req-3', userId: 'user-12', userName: 'Ava Martinez', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ava', status: 'pending' },
  ],
  'club-3': [
    { id: 'req-4', userId: 'user-13', userName: 'Noah Wilson', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Noah', status: 'pending' },
    { id: 'req-5', userId: 'user-14', userName: 'Isabella Jones', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Isabella', status: 'pending' },
    { id: 'req-6', userId: 'user-15', userName: 'Ethan Smith', userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ethan', status: 'pending' },
  ],
};

const ClubPage = () => {
  const { user } = useAuth();
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [showingMembers, setShowingMembers] = useState(false);
  const [showingRequests, setShowingRequests] = useState(false);
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
  const [clubMembers, setClubMembers] = useState<ClubMember[]>([]);
  const [isCoordinator, setIsCoordinator] = useState(false);
  const [joinRequestSent, setJoinRequestSent] = useState(false);
  const [currentMember, setCurrentMember] = useState(false);

  useEffect(() => {
    if (selectedClub) {
      setClubMembers(mockMembers[selectedClub.id] || []);
      setJoinRequests(mockJoinRequests[selectedClub.id] || []);
      
      // Check if current user is the coordinator
      setIsCoordinator(selectedClub.coordinatorId === user?.id);
      
      // Check if user has a pending request
      const hasPendingRequest = (mockJoinRequests[selectedClub.id] || []).some(
        req => req.userId === user?.id && req.status === 'pending'
      );
      setJoinRequestSent(hasPendingRequest);
      
      // Check if user is already a member
      setCurrentMember((mockMembers[selectedClub.id] || []).some(
        member => member.id === user?.id
      ));
    } else {
      setShowingMembers(false);
      setShowingRequests(false);
    }
  }, [selectedClub, user?.id]);

  const handleJoinRequest = () => {
    if (!user || !selectedClub) return;
    
    // Add new request
    const newRequest: JoinRequest = {
      id: `req-${Date.now()}`,
      userId: user.id,
      userName: user.name || 'Anonymous',
      userAvatar: user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anonymous',
      status: 'pending'
    };
    
    // Update mock data
    mockJoinRequests[selectedClub.id] = [
      ...(mockJoinRequests[selectedClub.id] || []),
      newRequest
    ];
    
    setJoinRequestSent(true);
    setJoinRequests([...joinRequests, newRequest]);
  };

  const handleRequestAction = (requestId: string, action: 'approve' | 'reject') => {
    if (!selectedClub) return;
    
    // Find the request
    const request = joinRequests.find(req => req.id === requestId);
    if (!request) return;
    
    if (action === 'approve') {
      // Add as member
      const newMember: ClubMember = {
        id: request.userId,
        name: request.userName,
        avatar: request.userAvatar,
        joinedDate: new Date(),
        role: 'member'
      };
      
      mockMembers[selectedClub.id] = [
        ...(mockMembers[selectedClub.id] || []),
        newMember
      ];
      
      setClubMembers([...clubMembers, newMember]);
      
      // Remove request
      mockJoinRequests[selectedClub.id] = mockJoinRequests[selectedClub.id].filter(
        req => req.id !== requestId
      );
      
      setJoinRequests(joinRequests.filter(req => req.id !== requestId));
    } else {
      // Just remove request
      mockJoinRequests[selectedClub.id] = mockJoinRequests[selectedClub.id].filter(
        req => req.id !== requestId
      );
      
      setJoinRequests(joinRequests.filter(req => req.id !== requestId));
    }
  };

  return (
    <div className="animate-page-transition-in">
      {!selectedClub ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Clubs</h1>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockClubs.map(club => (
              <div 
                key={club.id} 
                className="glass-card overflow-hidden rounded-xl card-hover"
              >
                <div className="h-40 overflow-hidden">
                  <img 
                    src={club.imageUrl} 
                    alt={club.name} 
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-1">{club.name}</h3>
                  
                  <div className="text-sm text-white/70 mb-3">
                    Coordinator: {club.coordinator}
                  </div>
                  
                  <p className="text-sm text-white/80 mb-4 line-clamp-2">
                    {club.description}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-white/70">
                      <Users size={14} className="mr-1" />
                      <span>{club.memberCount} members</span>
                    </div>
                    
                    <button
                      onClick={() => setSelectedClub(club)}
                      className="btn-secondary py-1 px-3 text-xs"
                    >
                      View Club
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Club Detail Header */}
          <div className="flex items-center mb-4">
            <button 
              onClick={() => {
                setSelectedClub(null);
                setShowingMembers(false);
                setShowingRequests(false);
              }}
              className="text-white/70 hover:text-white mr-2"
            >
              ← Back to clubs
            </button>
            <h1 className="text-2xl font-bold">{selectedClub.name}</h1>
          </div>
          
          {!showingMembers && !showingRequests ? (
            <>
              {/* Club Details */}
              <div className="glass-card rounded-xl overflow-hidden">
                <div className="h-60 md:h-80 overflow-hidden">
                  <img 
                    src={selectedClub.imageUrl} 
                    alt={selectedClub.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">{selectedClub.name}</h2>
                      <div className="text-white/70">
                        Coordinator: {selectedClub.coordinator}
                      </div>
                    </div>
                    
                    <div className="mt-4 md:mt-0 flex space-x-3">
                      {isCoordinator && (
                        <button
                          onClick={() => setShowingRequests(true)}
                          className="btn-secondary"
                        >
                          View Join Requests
                          {joinRequests.length > 0 && (
                            <span className="ml-2 bg-white text-black text-xs rounded-full w-5 h-5 flex items-center justify-center">
                              {joinRequests.length}
                            </span>
                          )}
                        </button>
                      )}
                      
                      <button
                        onClick={() => setShowingMembers(true)}
                        className="btn-secondary flex items-center"
                      >
                        <Users size={16} className="mr-2" />
                        View Members
                      </button>
                      
                      {!isCoordinator && !currentMember && (
                        <button
                          onClick={handleJoinRequest}
                          disabled={joinRequestSent}
                          className={`btn-primary ${joinRequestSent ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {joinRequestSent ? 'Request Sent' : 'Join Club'}
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="border-t border-white/10 pt-6">
                    <h3 className="text-lg font-semibold mb-3">About</h3>
                    <p className="text-white/80">
                      {selectedClub.description}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Club Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6 rounded-xl">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Total Members</h3>
                    <Users size={20} className="text-white/70" />
                  </div>
                  <p className="text-3xl font-bold mt-2">{selectedClub.memberCount}</p>
                </div>
                
                <div className="glass-card p-6 rounded-xl">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Activities</h3>
                    <Info size={20} className="text-white/70" />
                  </div>
                  <p className="text-3xl font-bold mt-2">12</p>
                  <p className="text-white/70 text-sm">Upcoming events</p>
                </div>
                
                <div className="glass-card p-6 rounded-xl">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Status</h3>
                    <Info size={20} className="text-white/70" />
                  </div>
                  <p className="text-xl font-medium mt-2">
                    {currentMember 
                      ? 'You are a member' 
                      : joinRequestSent 
                        ? 'Request pending' 
                        : 'Not a member'}
                  </p>
                </div>
              </div>
            </>
          ) : showingMembers ? (
            <div className="glass-card rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Club Members</h2>
                <button 
                  onClick={() => setShowingMembers(false)}
                  className="text-white/70 hover:text-white"
                >
                  Back to club
                </button>
              </div>
              
              <div className="space-y-4">
                {clubMembers.map(member => (
                  <div 
                    key={member.id}
                    className="flex items-center p-4 border border-white/10 rounded-lg hover:bg-white/5"
                  >
                    <div className="mr-4 w-12 h-12 rounded-full overflow-hidden">
                      <img 
                        src={member.avatar} 
                        alt={member.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center">
                        <h3 className="font-medium">{member.name}</h3>
                        {member.role === 'coordinator' && (
                          <span className="ml-2 text-xs bg-white/10 text-white px-2 py-0.5 rounded-full">
                            Coordinator
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-white/70">
                        Joined: {member.joinedDate.toLocaleDateString()}
                      </p>
                    </div>
                    
                    <ChevronRight size={16} className="text-white/50" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="glass-card rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Join Requests</h2>
                <button 
                  onClick={() => setShowingRequests(false)}
                  className="text-white/70 hover:text-white"
                >
                  Back to club
                </button>
              </div>
              
              {joinRequests.length > 0 ? (
                <div className="space-y-4">
                  {joinRequests.map(request => (
                    <div 
                      key={request.id}
                      className="flex items-center p-4 border border-white/10 rounded-lg"
                    >
                      <div className="mr-4 w-12 h-12 rounded-full overflow-hidden">
                        <img 
                          src={request.userAvatar} 
                          alt={request.userName} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-medium">{request.userName}</h3>
                        <p className="text-sm text-white/70">
                          Wants to join {selectedClub.name}
                        </p>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleRequestAction(request.id, 'approve')}
                          className="p-2 rounded-full text-green-500 hover:bg-green-500/10"
                          title="Approve"
                        >
                          <CheckCircle size={20} />
                        </button>
                        
                        <button
                          onClick={() => handleRequestAction(request.id, 'reject')}
                          className="p-2 rounded-full text-red-500 hover:bg-red-500/10"
                          title="Reject"
                        >
                          <XCircle size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-white/70">
                  <Users size={40} className="mx-auto mb-4 opacity-30" />
                  <p>No pending join requests</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ClubPage;
