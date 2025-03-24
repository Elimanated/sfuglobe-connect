
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [program, setProgram] = useState(user?.program || '');
  const [year, setYear] = useState<number>(user?.year || 1);
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    updateProfile({
      name,
      bio,
      program,
      year,
    });
    
    setIsEditing(false);
  };

  return (
    <div className="animate-page-transition-in">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
        
        <div className="glass-card rounded-lg overflow-hidden">
          <div className="p-8 flex flex-col md:flex-row gap-8">
            {/* Profile Image */}
            <div className="w-full md:w-1/3 flex flex-col items-center">
              <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-white">
                <img
                  src={user?.avatar}
                  alt={user?.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="mt-4 text-center">
                <h2 className="text-xl font-bold">{user?.name}</h2>
                <p className="text-muted-foreground">Student ID: {user?.studentId}</p>
              </div>
            </div>

            {/* Profile Details / Edit Form */}
            <div className="flex-1">
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Program</label>
                    <input
                      type="text"
                      value={program}
                      onChange={(e) => setProgram(e.target.value)}
                      className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                      placeholder="e.g., Computer Science"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Year</label>
                    <select
                      value={year}
                      onChange={(e) => setYear(Number(e.target.value))}
                      className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                    >
                      <option value={1}>1st Year</option>
                      <option value={2}>2nd Year</option>
                      <option value={3}>3rd Year</option>
                      <option value={4}>4th Year</option>
                      <option value={5}>5th Year +</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Bio</label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30"
                      rows={4}
                      placeholder="Tell other students about yourself..."
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <button type="submit" className="btn-primary">
                      Save Changes
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold">Profile Information</h3>
                    <div className="mt-4 space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p>{user?.email}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Program</p>
                        <p>{user?.program || 'Not specified'}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Year</p>
                        <p>{user?.year ? `${user.year}${getOrdinalSuffix(user.year)} Year` : 'Not specified'}</p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground">Bio</p>
                        <p className="whitespace-pre-line">{user?.bio || 'No bio available'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn-primary"
                  >
                    Edit Profile
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to get ordinal suffix
function getOrdinalSuffix(n: number): string {
  if (n > 3 && n < 21) return 'th';
  switch (n % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
}

export default ProfilePage;
