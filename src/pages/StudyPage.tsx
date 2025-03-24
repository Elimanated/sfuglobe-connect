
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, MessageSquare, ChevronRight, User } from 'lucide-react';

// Mock student data
const mockStudents = [
  { id: 'stu1', name: 'Alex Johnson', studentId: '301234', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
  { id: 'stu2', name: 'Jamie Smith', studentId: '301235', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jamie' },
  { id: 'stu3', name: 'Morgan Lee', studentId: '301236', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Morgan' },
  { id: 'stu4', name: 'Casey Williams', studentId: '301237', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Casey' },
  { id: 'stu5', name: 'Taylor Brown', studentId: '301238', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor' },
];

// Mock chat messages
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

// Mock student details
interface StudentDetails {
  id: string;
  name: string;
  studentId: string;
  avatar: string;
  program?: string;
  year?: number;
  bio?: string;
}

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
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredStudents, setFilteredStudents] = useState(mockStudents);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<StudentDetails | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [chats, setChats] = useState(mockChats);
  const [activeView, setActiveView] = useState<'search' | 'chats' | 'profile'>('chats');

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
    const student = mockStudents.find(s => s.id === studentId);
    if (student) {
      setSelectedStudent({
        ...student,
        program: 'Computer Science',
        year: 3,
        bio: 'Passionate about technology and coding. Always looking to collaborate on interesting projects.',
      });
      setSelectedChat(null);
    }
  };

  return (
    <div className="animate-page-transition-in h-[calc(100vh-16rem)]">
      <div className="flex flex-col lg:flex-row h-full gap-6">
        {/* Sidebar */}
        <div className="w-full lg:w-80 flex flex-col glass-card rounded-lg overflow-hidden">
          <div className="p-4 border-b border-border/40">
            <div className="flex space-x-2">
              <button 
                onClick={() => setActiveView('chats')}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeView === 'chats' ? 'bg-primary text-white' : 'hover:bg-secondary'
                }`}
              >
                Chats
              </button>
              <button 
                onClick={() => setActiveView('search')}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeView === 'search' ? 'bg-primary text-white' : 'hover:bg-secondary'
                }`}
              >
                Search
              </button>
            </div>
          </div>

          {activeView === 'search' && (
            <>
              <div className="p-4 border-b border-border/40">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
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
                      onClick={() => handleStudentSelect(student)}
                      className="p-4 border-b border-border/40 hover:bg-secondary/50 cursor-pointer flex items-center"
                    >
                      <div className="mr-3 w-10 h-10 rounded-full overflow-hidden">
                        <img src={student.avatar} alt={student.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h3 className="font-medium">{student.name}</h3>
                        <p className="text-sm text-muted-foreground">ID: {student.studentId}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
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
                  const otherParticipant = mockStudents.find(student => student.id === otherParticipantId);
                  
                  return (
                    <div
                      key={chat.id}
                      onClick={() => handleChatSelect(chat)}
                      className={`p-4 border-b border-border/40 hover:bg-secondary/50 cursor-pointer ${
                        selectedChat?.id === chat.id ? 'bg-secondary' : ''
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
                            <p className="text-sm text-muted-foreground truncate">
                              {chat.lastMessage.senderId === user?.id ? 'You: ' : ''}
                              {chat.lastMessage.text}
                            </p>
                          )}
                        </div>
                        <ChevronRight size={16} className="text-muted-foreground" />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="p-4 text-center text-muted-foreground">
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
              <div className="p-4 border-b border-border/40 flex items-center justify-between">
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
                          <p className="text-sm text-muted-foreground">Student ID: {participant?.studentId}</p>
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
                  className="text-sm text-primary"
                >
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
                              ? 'bg-primary text-white rounded-tr-none' 
                              : 'bg-secondary rounded-tl-none'
                          }`}
                        >
                          <p>{message.text}</p>
                          <p className={`text-xs mt-1 ${isCurrentUser ? 'text-white/70' : 'text-muted-foreground'}`}>
                            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <MessageSquare className="mx-auto mb-2 opacity-20" size={40} />
                      <p>No messages yet</p>
                      <p className="text-sm">Start the conversation!</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-border/40">
                <form onSubmit={sendMessage} className="flex">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 py-2 px-4 rounded-l-md border border-border focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="bg-primary text-white px-4 py-2 rounded-r-md disabled:opacity-50"
                  >
                    Send
                  </button>
                </form>
              </div>
            </>
          ) : selectedStudent ? (
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-full md:w-1/3">
                  <div className="text-center">
                    <div className="w-32 h-32 rounded-full mx-auto overflow-hidden">
                      <img 
                        src={selectedStudent.avatar} 
                        alt={selectedStudent.name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <h2 className="text-xl font-bold mt-4">{selectedStudent.name}</h2>
                    <p className="text-muted-foreground">ID: {selectedStudent.studentId}</p>
                    
                    <div className="mt-6">
                      <button
                        onClick={() => startNewChat(selectedStudent)}
                        className="btn-primary w-full"
                      >
                        Start Conversation
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="glass-card p-6 rounded-lg">
                    <h3 className="text-lg font-semibold mb-4">Student Information</h3>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Program</p>
                        <p>{selectedStudent.program || 'Not specified'}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Year</p>
                        <p>{selectedStudent.year || 'Not specified'}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Bio</p>
                        <p>{selectedStudent.bio || 'No bio available'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-6">
              <div className="text-center max-w-md">
                <div className="bg-secondary/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="opacity-50" size={24} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Connect with Fellow Students</h3>
                <p className="text-muted-foreground mb-6">
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
