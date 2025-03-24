
import { useAuth } from '../context/AuthContext';
import { ClipboardCheck, Calendar, User, CheckCircle } from 'lucide-react';
import { useState } from 'react';

// Mock attendance data
interface AttendanceRecord {
  id: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  subject: string;
}

const mockAttendance: AttendanceRecord[] = [
  { id: 'att1', date: '2023-10-01', status: 'present', subject: 'Mathematics 101' },
  { id: 'att2', date: '2023-10-02', status: 'present', subject: 'Computer Science 205' },
  { id: 'att3', date: '2023-10-03', status: 'late', subject: 'Biology 110' },
  { id: 'att4', date: '2023-10-04', status: 'absent', subject: 'History 103' },
  { id: 'att5', date: '2023-10-05', status: 'present', subject: 'Physics 201' },
];

const AttendancePage = () => {
  const { user } = useAuth();
  const [attendance] = useState<AttendanceRecord[]>(mockAttendance);
  
  // Calculate attendance statistics
  const totalClasses = attendance.length;
  const presentCount = attendance.filter(record => record.status === 'present').length;
  const lateCount = attendance.filter(record => record.status === 'late').length;
  const absentCount = attendance.filter(record => record.status === 'absent').length;
  
  const attendancePercentage = totalClasses > 0 
    ? Math.round(((presentCount + lateCount) / totalClasses) * 100) 
    : 0;
  
  return (
    <div className="animate-page-transition-in">
      <h1 className="text-3xl font-bold mb-8">Attendance</h1>
      
      {/* Attendance Summary */}
      <div className="glass-card rounded-lg overflow-hidden mb-8">
        <div className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-bold mb-1">Attendance Summary</h2>
              <p className="text-muted-foreground">Your current attendance for this semester</p>
            </div>
            
            <div className="relative w-24 h-24">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  className="text-secondary"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                />
                <circle
                  className="text-primary"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r="40"
                  cx="50"
                  cy="50"
                  strokeDasharray={`${2 * Math.PI * 40}`}
                  strokeDashoffset={`${2 * Math.PI * 40 * (1 - attendancePercentage / 100)}`}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
                <text x="50" y="50" textAnchor="middle" dy="0.3em" className="text-xl font-bold">
                  {attendancePercentage}%
                </text>
              </svg>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-secondary/50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <h3 className="font-medium">Present</h3>
              </div>
              <p className="text-2xl font-bold">{presentCount}</p>
            </div>
            
            <div className="bg-secondary/50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center mr-3">
                  <Clock className="w-4 h-4" />
                </div>
                <h3 className="font-medium">Late</h3>
              </div>
              <p className="text-2xl font-bold">{lateCount}</p>
            </div>
            
            <div className="bg-secondary/50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center mr-3">
                  <X className="w-4 h-4" />
                </div>
                <h3 className="font-medium">Absent</h3>
              </div>
              <p className="text-2xl font-bold">{absentCount}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Attendance Records */}
      <div className="glass-card rounded-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-6">Attendance Records</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/40">
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Subject</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map(record => (
                  <tr key={record.id} className="border-b border-border/40">
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                        {new Date(record.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                        })}
                      </div>
                    </td>
                    <td className="px-4 py-3">{record.subject}</td>
                    <td className="px-4 py-3">
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        record.status === 'present'
                          ? 'bg-green-100 text-green-800'
                          : record.status === 'late'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                          record.status === 'present'
                            ? 'bg-green-600'
                            : record.status === 'late'
                            ? 'bg-yellow-600'
                            : 'bg-red-600'
                        }`}></span>
                        <span className="capitalize">{record.status}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper components
const Clock = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const X = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export default AttendancePage;
