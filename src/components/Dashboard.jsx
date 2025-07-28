
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  BookOpen, 
  Clock, 
  BarChart2,
  FileText,
  Settings,
  MessageSquare,
  Award,
  ChevronUp,
  ChevronDown,
  Plus,
  UserCheck,
  TrendingUp
} from 'lucide-react';
import { toast } from 'react-toastify';
import axiosInstance from '../../api';
import { useAdmin } from '../hooks/useAdminContext';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { admin, adminLogout } = useAdmin();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/dashboard/stats');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString();
  };

  const formatIndianNumber = (num) => {
    if (num === undefined || num === null) return '0';
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // Stats data with real data from backend
  const stats = dashboardData ? [
    { 
      title: "Total Students", 
      value: formatIndianNumber(dashboardData.stats.totalStudents), 
      icon: <Users size={20} />, 
      trend: `${dashboardData.trends.userGrowth}%`, 
      isUp: dashboardData.trends.userGrowth >= 0,
      color: "bg-blue-100 text-blue-600" 
    },
    { 
      title: "Active Tests", 
      value: formatIndianNumber(dashboardData.stats.activeTests), 
      icon: <BookOpen size={20} />, 
      trend: `${dashboardData.trends.testGrowth}%`, 
      isUp: dashboardData.trends.testGrowth >= 0,
      color: "bg-green-100 text-green-600" 
    },
    { 
      title: "Avg. Test Time", 
      value: dashboardData.stats.avgTestTime, 
      icon: <Clock size={20} />, 
      trend: "2%", 
      isUp: false,
      color: "bg-orange-100 text-orange-600" 
    },
    { 
      title: "Completion Rate", 
      value: dashboardData.stats.completionRate, 
      icon: <BarChart2 size={20} />, 
      trend: `${dashboardData.trends.completionRateChange}%`, 
      isUp: dashboardData.trends.completionRateChange >= 0,
      color: "bg-purple-100 text-purple-600" 
    }
  ] : [];

  // Quick actions data
  const quickActions = [
    { 
      title: "Create Test", 
      icon: <FileText size={18} />, 
      color: "bg-blue-100 text-blue-600",
      action: () => navigate('/admin/create-test')
    },
    { 
      title: "Create Quiz", 
      icon: <Plus size={18} />, 
      color: "bg-green-100 text-green-600",
      action: () => navigate('/admin/create-free-quiz')
    },
    { 
      title: "Manage Quizzes", 
      icon: <BookOpen size={18} />, 
      color: "bg-purple-100 text-purple-600",
      action: () => navigate('/admin/free-quizzes')
    },
    { 
      title: "View Reports", 
      icon: <BarChart2 size={18} />, 
      color: "bg-orange-100 text-orange-600",
      action: () => navigate('/admin/reports')
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 w-full mx-auto">
      {/* Dashboard Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Test Series Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back, {admin?.username}! Here's what's happening with your platform.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">Active</span>
          <button 
            onClick={fetchDashboardData}
            className="p-2 rounded-lg bg-white shadow hover:bg-gray-50 transition-colors"
            title="Refresh data"
          >
            <TrendingUp size={16} className="text-gray-600" />
          </button>
          <button 
            onClick={() => {
              adminLogout();
              navigate('/admin/login');
              toast.success('Admin logged out successfully');
            }}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors text-sm font-medium"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${stat.color}`}>
                {stat.icon}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                <div className="flex items-center gap-1 mt-1">
                  {stat.isUp ? (
                    <ChevronUp size={14} className="text-green-500" />
                  ) : (
                    <ChevronDown size={14} className="text-red-500" />
                  )}
                  <span className={`text-xs ${stat.isUp ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.trend} from last week
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Left Column - Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold mb-3 text-gray-900">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, index) => (
              <div 
                key={index} 
                className="bg-white rounded-lg shadow p-4 hover:bg-gray-50 cursor-pointer transition-all hover:shadow-md"
                onClick={action.action}
              >
                <div className="flex flex-col items-center gap-2">
                  <div className={`p-3 rounded-full ${action.color}`}>
                    {action.icon}
                  </div>
                  <p className="text-sm font-medium text-gray-900">{action.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Middle Column - Activities */}
        <div>
          <h2 className="text-lg font-semibold mb-3 text-gray-900">Recent Activities</h2>
          <div className="bg-white rounded-lg shadow p-4">
            {dashboardData?.activities && dashboardData.activities.length > 0 ? (
              <div className="flex flex-col gap-3">
                {dashboardData.activities.map((activity, index) => (
                  <div 
                    key={index} 
                    className={`flex gap-3 items-start pb-3 ${index < dashboardData.activities.length - 1 ? 'border-b border-gray-100' : ''}`}
                  >
                    <div className="p-1.5 rounded-full bg-gray-100">
                      <MessageSquare size={16} className="text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-500">{activity.action}</p>
                      <p className="text-xs text-gray-400">{formatTimeAgo(activity.time)}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageSquare size={32} className="text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No recent activities</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Top Performers */}
        <div>
          <h2 className="text-lg font-semibold mb-3 text-gray-900">Top Performers</h2>
          <div className="bg-white rounded-lg shadow p-4">
            {dashboardData?.topPerformers && dashboardData.topPerformers.length > 0 ? (
              <div className="flex flex-col gap-3">
                {dashboardData.topPerformers.map((student, index) => (
                  <div 
                    key={index} 
                    className={`flex gap-3 items-center pb-3 ${index < dashboardData.topPerformers.length - 1 ? 'border-b border-gray-100' : ''}`}
                  >
                    <div className="p-1.5 rounded-full bg-amber-100 text-amber-600">
                      <Award size={16} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{student.name}</p>
                      <p className="text-sm text-gray-500">{student.test}</p>
                      <p className="text-xs text-green-500 font-medium">Score: {student.score}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Award size={32} className="text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">No performance data yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;