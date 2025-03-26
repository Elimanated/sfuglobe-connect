
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, MessageSquare, ChevronRight, User, Send, ArrowLeft, Edit, Save, X } from 'lucide-react';

// Mock student data
const mockStudents = [
  { id: 'stu1', name: 'Alex Johnson', studentId: '301234', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
  { id: 'stu2', name: 'Jamie Smith', studentId: '301235', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jamie' },
  { id: 'stu3', name: 'Morgan Lee', studentId: '301236', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Morgan' },
  { id: 'stu4', name: 'Casey Williams', studentId: '301237', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Casey' },
  { id: 'stu5', name: 'Taylor Brown', studentId: '301238', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor' },
];

// Types
interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
}

interface Chat {
  id: string;
  participants: string[];
  messages: Message[];
  lastMessage?: Message;
}

interface StudentDetails {
  id: string;
  name: string;
  studentId: string;
  avatar: string;
  program?: string;
  year?: number;
  bio?: string;
}

// Mock student details
const mockStudentDetails: Record<string, StudentDetails> = {
  'stu1': {
    id: 'stu1',
    name: 'Alex Johnson',
    studentId: '301234',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    program: 'Computer Science',
    year: 3,
    bio: 'Passionate about technology and coding. Always looking to collaborate on interesting projects.'
  },
  'stu2': {
    id: 'stu2',
    name: 'Jamie Smith',
    studentId: '301235',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jamie',
    program: 'Biology',
    year: 2,
    bio: 'Interested in molecular biology and genetics. Love to discuss the latest research in the field.'
  },
  'stu3': {
    id: 'stu3',
    name: 'Morgan Lee',
    studentId: '301236',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Morgan',
    program: 'Mathematics',
    year: 4,
    bio: 'Math enthusiast. Currently working on statistical models and data analysis.'
  },
  'stu4': {
    id: 'stu4',
    name: 'Casey Williams',
    studentId: '301237',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Casey',
    program: 'Physics',
    year: 3,
    bio: 'Fascinated by quantum mechanics and theoretical physics. Always up for a study group.'
  },
  'stu5': {
    id: 'stu5',
    name: 'Taylor Brown',
    studentId: '301238',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor',
    program: 'Engineering',
    year: 2,
    bio: 'Working on various engineering projects. Interested in sustainable technology and innovation.'
  }
};

// Mock chat messages
const mockChats: Chat[] = [
  {
    id: 'chat1',
    participants: ['user_current', 'stu1'],
    messages: [
      { id: 'msg1', senderId: 'stu1', text: 'Hey, do you have notes from yesterday?', timestamp: new Date('2023-10-01T10:30:00') },
      { id: 'msg2', senderId: 'user_current', text: 'Yes, I can share them with you', timestamp: new Date('2023-10-01T10:31:00') },
    ],
  },
  {
    id: 'chat2',
    participants: ['user_current', 'stu2'],
    messages: [
      { id: 'msg3', senderId: 'user_current', text: 'When is the project deadline?', timestamp: new Date('2023-10-02T09:15:00') },
      { id: 'msg4', senderId: 'stu2', text: 'It\'s next Friday at 5pm', timestamp: new Date('2023-10-02T09:16:00') },
    ],
  },
];

// Prepare mock data with last messages
mockChats.forEach(chat => {
  if (chat.messages.length > 0) {
    chat.lastMessage = chat.messages[chat.messages.length - 1];
  }
});

const StudyPage = () => {
  const { user, updateProfile } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStudents, setFilteredStudents] = useState(mockStudents);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<StudentDetails | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [chats, setChats] = useState(mockChats);
  const [activeView, setActiveView] = useState<'search' | 'chats' | 'profile'>('chats');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // For profile editing
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editProgram, setEditProgram] = useState('');
  const [editYear, setEditYear] = useState<number | string>('');

  // Filter students based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredStudents(mockStudents);
      return;
    }
    
    const filtered = mockStudents.filter(student => 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentId.includes(searchQuery)
    );
    
    setFilteredStudents(filtered);
  }, [searchQuery]);

  // Scroll to bottom of chat when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedChat?.messages]);

  // Initialize edit form when viewing profile
  useEffect(() => {
    if (selectedStudent && selectedStudent.id === user?.id) {
      setEditName(user.name || '');
      setEditBio(user.bio || '');
      setEditProgram(user.program || '');
      setEditYear(user.year || '');
    }
  }, [selectedStudent, user]);

  // Handle chat selection
  const handleChatSelect = (chat: Chat) => {
    setSelectedChat(chat);
    setSelectedStudent(null);
    setActiveView('chats');
  };

  // Handle student selection
  const handleStudentSelect = (student: StudentDetails) => {
    // Check if a chat already exists with this student
    const existingChat = chats.find(chat => 
      chat.participants.includes(student.id) && chat.participants.includes(user?.id || '')
    );
    
    if (existingChat) {
      setSelectedChat(existingChat);
      setSelectedStudent(null);
    } else {
      // Show student profile first
      setSelectedStudent(student);
      setSelectedChat(null);
    }
    
    setActiveView('chats');
  };

  // Start a new chat with a student
  const startNewChat = (student: StudentDetails) => {
    const newChat: Chat = {
      id: `chat_${Date.now()}`,
      participants: [user?.id || '', student.id],
      messages: [],
    };
    
    setChats([...chats, newChat]);
    setSelectedChat(newChat);
    setSelectedStudent(null);
  };

  // Send a new message
  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedChat || !newMessage.trim()) return;
    
    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      senderId: user?.id || '',
      text: newMessage,
      timestamp: new Date(),
    };
    
    const updatedChat = {
      ...selectedChat,
      messages: [...selectedChat.messages, newMsg],
      lastMessage: newMsg,
    };
    
    setChats(chats.map(chat => (chat.id === selectedChat.id ? updatedChat : chat)));
    setSelectedChat(updatedChat);
    setNewMessage('');
  };

  // View student profile
  const viewStudentProfile = (studentId: string) => {
    if (studentId === user?.id) {
      // View own profile
      const currentUserProfile: StudentDetails = {
        id: user.id,
        name: user.name || 'Anonymous',
        studentId: user.studentId || 'Not set',
        avatar: user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anonymous',
        program: user.program,
        year: user.year,
        bio: user.bio
      };
      setSelectedStudent(currentUserProfile);
    } else {
      // View other student profile
      const student = mockStudentDetails[studentId] || mockStudents.find(s => s.id === studentId);
      if (student) {
        setSelectedStudent(mockStudentDetails[studentId] || {
          ...student,
          program: 'Not specified',
          year: 0,
          bio: 'No bio available',
        });
      }
    }
    setSelectedChat(null);
  };

  // Save profile changes
  const saveProfileChanges = async () => {
    try {
      await updateProfile({
        name: editName,
        bio: editBio,
        program: editProgram,
        year: typeof editYear === 'string' ? parseInt(editYear) : editYear
      });
      
      setIsEditing(false);
      
      // Update the local view
      if (selectedStudent && user) {
        setSelectedStudent({
          ...selectedStudent,
          name: editName,
          bio: editBio,
          program: editProgram,
          year: typeof editYear === 'string' ? parseInt(editYear) : editYear
        });
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  return (
    <div className="animate-page-transition-in h-[calc(100vh-16rem)]">
      <div className="flex flex-col lg:flex-row h-full gap-6">
        {/* Sidebar */}
        <div className="w-full lg:w-80 flex flex-col glass-card rounded-lg overflow-hidden">
          <div className="p-4 border-b border-white/10">
            <div className="flex space-x-2">
              <button 
                onClick={() => setActiveView('chats')}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeView === 'chats' ? 'bg-white text-black' : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                Chats
              </button>
              <button 
                onClick={() => setActiveView('search')}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeView === 'search' ? 'bg-white text-black' : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                Search
              </button>
            </div>
          </div>

          {activeView === 'search' && (
            <>
              <div className="p-4 border-b border-white/10">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" size={16} />
                  <input
                    type="text"
                    placeholder="Search by name or student ID"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="input-search"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map(student => (
                    <div
                      key={student.id}
                      onClick={() => handleStudentSelect(mockStudentDetails[student.id] || student)}
                      className="p-4 border-b border-white/10 hover:bg-white/5 cursor-pointer flex items-center"
                    >
                      <div className="mr-3 w-10 h-10 rounded-full overflow-hidden">
                        <img src={student.avatar} alt={student.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="font-medium">{student.name}</h3>
                        <p className="text-sm text-white/60">ID: {student.studentId}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-white/60">
                    No students found
                  </div>
                )}
              </div>
            </>
          )}

          {activeView === 'chats' && (
            <div className="flex-1 overflow-y-auto">
              {chats.length > 0 ? (
                chats.map(chat => {
                  const otherParticipantId = chat.participants.find(id => id !== user?.id);
                  const otherParticipant = otherParticipantId === 'user_current' ? 
                    { name: 'You', avatar: user?.avatar || '', id: 'user_current' } : 
                    mockStudents.find(student => student.id === otherParticipantId);
                  
                  return (
                    <div
                      key={chat.id}
                      onClick={() => handleChatSelect(chat)}
                      className={`p-4 border-b border-white/10 hover:bg-white/5 cursor-pointer ${
                        selectedChat?.id === chat.id ? 'bg-white/10' : ''
                      }`}
                    >
                      <div className="flex items-center">
                        <div className="mr-3 w-10 h-10 rounded-full overflow-hidden">
                          <img 
                            src={otherParticipant?.avatar} 
                            alt={otherParticipant?.name} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium">{otherParticipant?.name}</h3>
                          {chat.lastMessage && (
                            <p className="text-sm text-white/60 truncate">
                              {chat.lastMessage.senderId === user?.id ? 'You: ' : ''}
                              {chat.lastMessage.text}
                            </p>
                          )}
                        </div>
                        <ChevronRight size={16} className="text-white/50" />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-4 text-center text-white/60">
                  No chats yet
                </div>
              )}
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex-1 glass-card rounded-lg overflow-hidden flex flex-col">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center">
                  {selectedChat.participants.map(participantId => {
                    if (participantId === user?.id) return null;
                    const participant = mockStudents.find(s => s.id === participantId);
                    return (
                      <div key={participantId} className="flex items-center">
                        <div className="mr-3 w-10 h-10 rounded-full overflow-hidden">
                          <img 
                            src={participant?.avatar} 
                            alt={participant?.name} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div>
                          <h3 className="font-medium">{participant?.name}</h3>
                          <p className="text-sm text-white/60">Student ID: {participant?.studentId}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <button 
                  onClick={() => {
                    const otherParticipantId = selectedChat.participants.find(id => id !== user?.id);
                    if (otherParticipantId) viewStudentProfile(otherParticipantId);
                  }}
                  className="text-sm text-white/80 hover:text-white flex items-center"
                >
                  <User size={14} className="mr-1" />
                  View Profile
                </button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedChat.messages.length > 0 ? (
                  selectedChat.messages.map(message => {
                    const isCurrentUser = message.senderId === user?.id;
                    return (
                      <div key={message.id} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                        <div 
                          className={`max-w-[70%] rounded-lg px-4 py-2 ${
                            isCurrentUser 
                              ? 'bg-white text-black rounded-tr-none' 
                              : 'bg-white/10 text-white rounded-tl-none'
                          }`}
                        >
                          <p>{message.text}</p>
                          <p className={`text-xs mt-1 ${isCurrentUser ? 'text-black/70' : 'text-white/60'}`}>
                            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center text-white/60">
                      <MessageSquare className="mx-auto mb-2 opacity-20" size={40} />
                      <p>No messages yet</p>
                      <p className="text-sm">Start the conversation!</p>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-white/10">
                <form onSubmit={sendMessage} className="flex">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 py-2 px-4 rounded-l-md bg-white/10 border border-white/10 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="bg-white text-black px-4 py-2 rounded-r-md hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                  >
                    <Send size={16} className="mr-1" /> Send
                  </button>
                </form>
              </div>
            </>
          ) : selectedStudent ? (
            <div className="p-6 h-full overflow-y-auto">
              <div className="flex items-center mb-6">
                <button 
                  onClick={() => {
                    setSelectedStudent(null);
                    setIsEditing(false);
                  }}
                  className="text-white/70 hover:text-white mr-3 flex items-center"
                >
                  <ArrowLeft size={16} className="mr-1" /> Back
                </button>
                <h2 className="text-xl font-bold">Student Profile</h2>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-full md:w-1/3">
                  <div className="text-center">
                    <div className="w-32 h-32 rounded-full mx-auto overflow-hidden border-2 border-white/20">
                      <img 
                        src={selectedStudent.avatar} 
                        alt={selectedStudent.name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <h2 className="text-xl font-bold mt-4">{isEditing ? editName : selectedStudent.name}</h2>
                    <p className="text-white/60">ID: {selectedStudent.studentId}</p>
                    
                    {selectedStudent.id !== user?.id && (
                      <div className="mt-6">
                        <button
                          onClick={() => startNewChat(selectedStudent)}
                          className="btn-primary w-full"
                        >
                          Start Conversation
                        </button>
                      </div>
                    )}
                    
                    {selectedStudent.id === user?.id && !isEditing && (
                      <div className="mt-6">
                        <button
                          onClick={() => setIsEditing(true)}
                          className="btn-secondary w-full flex items-center justify-center"
                        >
                          <Edit size={16} className="mr-2" /> Edit Profile
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex-1">
                  {isEditing ? (
                    <div className="glass-card p-6 rounded-lg space-y-4">
                      <h3 className="text-lg font-semibold mb-2">Edit Profile</h3>
                      
                      <div>
                        <label className="block text-sm text-white/70 mb-1">Name</label>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full p-2 rounded bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white/30"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm text-white/70 mb-1">Program</label>
                        <input
                          type="text"
                          value={editProgram}
                          onChange={(e) => setEditProgram(e.target.value)}
                          className="w-full p-2 rounded bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white/30"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm text-white/70 mb-1">Year</label>
                        <input
                          type="number"
                          min="1"
                          max="6"
                          value={editYear}
                          onChange={(e) => setEditYear(parseInt(e.target.value) || '')}
                          className="w-full p-2 rounded bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white/30"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm text-white/70 mb-1">Bio</label>
                        <textarea
                          rows={4}
                          value={editBio}
                          onChange={(e) => setEditBio(e.target.value)}
                          className="w-full p-2 rounded bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white/30"
                        />
                      </div>
                      
                      <div className="pt-2 flex space-x-2">
                        <button
                          onClick={saveProfileChanges}
                          className="btn-primary flex items-center"
                        >
                          <Save size={16} className="mr-2" /> Save Changes
                        </button>
                        <button
                          onClick={() => setIsEditing(false)}
                          className="btn-secondary flex items-center"
                        >
                          <X size={16} className="mr-2" /> Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="glass-card p-6 rounded-lg">
                      <h3 className="text-lg font-semibold mb-4">Student Information</h3>
                      
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-white/60">Program</p>
                          <p>{selectedStudent.program || 'Not specified'}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-white/60">Year</p>
                          <p>{selectedStudent.year || 'Not specified'}</p>
                        </div>
                        
                        <div>
                          <p className="text-sm text-white/60">Bio</p>
                          <p className="whitespace-pre-line">{selectedStudent.bio || 'No bio available'}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-6">
              <div className="text-center max-w-md">
                <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="text-white/70" size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Connect with Fellow Students</h3>
                <p className="text-white/70 mb-6">
                  Search for students by name or student ID to connect and collaborate.
                </p>
                <button
                  onClick={() => setActiveView('search')}
                  className="btn-primary"
                >
                  Find Students
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyPage;
