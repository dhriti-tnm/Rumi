import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext";
import Navbar from "../components/Navbar";
import { getJournals } from "../apis/journals";
import { Journal } from "../types/journal";
import { Link } from "react-router-dom";
import { BookOpen, TrendingUp, Clock, ArrowRight } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const [journals, setJournals] = useState<Journal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getJournals(0, 3);
        if (response.success) {
          setJournals(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 py-10">
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            Hello, {user?.name}!
          </h1>
          <p className="text-xl text-gray-600">
            Welcome back to your personal sanctuary.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Stats Card 1 */}
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <div className="bg-indigo-50 w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-indigo-600">
              <BookOpen size={24} />
            </div>
            <h3 className="text-gray-500 font-medium mb-1 uppercase tracking-wider text-sm">Total Entries</h3>
            <p className="text-3xl font-bold text-gray-900">{loading ? "..." : journals.length}</p>
          </div>

          {/* Stats Card 2 */}
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <div className="bg-emerald-50 w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-emerald-600">
              <TrendingUp size={24} />
            </div>
            <h3 className="text-gray-500 font-medium mb-1 uppercase tracking-wider text-sm">Current Streak</h3>
            <p className="text-3xl font-bold text-gray-900">0 Days</p>
          </div>

          {/* Stats Card 3 */}
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <div className="bg-orange-50 w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-orange-600">
              <Clock size={24} />
            </div>
            <h3 className="text-gray-500 font-medium mb-1 uppercase tracking-wider text-sm">Last Entry</h3>
            <p className="text-3xl font-bold text-gray-900">
              {journals[0] ? new Date(journals[0].created_at).toLocaleDateString() : "Never"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Recent Activity */}
          <section>
            <div className="flex justify-between items-end mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Recent Journals</h2>
              <Link to="/journals" className="text-indigo-600 font-semibold flex items-center hover:underline">
                View all <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
            
            {loading ? (
              <div className="bg-white p-6 rounded-2xl border border-gray-100 animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ) : journals.length === 0 ? (
              <div className="bg-white p-10 rounded-2xl border border-gray-100 text-center">
                <p className="text-gray-500 mb-4">No recent entries found.</p>
                <Link to="/journals" className="inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium">
                  Create First Entry
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {journals.map((journal) => (
                  <div key={journal.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-gray-900 truncate">{journal.title}</h3>
                      <span className="text-xs text-gray-400">{new Date(journal.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-2">{journal.content}</p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Quick Actions / Tips */}
          <section className="bg-indigo-600 rounded-3xl p-10 text-white relative overflow-hidden flex flex-col justify-center">
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-4">Write for your soul</h2>
              <p className="text-indigo-100 text-lg mb-8 max-w-sm">
                Taking just 5 minutes a day to reflect can significantly improve your mental clarity and emotional resilience.
              </p>
              <Link 
                to="/journals" 
                className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-xl font-bold hover:bg-indigo-50 transition-colors shadow-lg"
              >
                Journal Now
              </Link>
            </div>
            {/* Abstract Background Shapes */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-indigo-500 rounded-full opacity-50 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-48 h-48 bg-indigo-700 rounded-full opacity-50 blur-2xl"></div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;