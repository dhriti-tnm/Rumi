import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { 
  getJournals, 
  createJournal, 
  updateJournal, 
  deleteJournal 
} from "../apis/journals";
import { Journal } from "../types/journal";
import { Plus, Search, Filter, Edit2, Trash2, X, Calendar } from "lucide-react";

const JournalPage = () => {
  const [journals, setJournals] = useState<Journal[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMood, setFilterMood] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJournal, setEditingJournal] = useState<Journal | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    mood: ""
  });

  const moods = ["Happy", "Sad", "Calm", "Anxious", "Grateful", "Productive"];

  useEffect(() => {
    fetchJournals();
  }, []);

  const fetchJournals = async () => {
    try {
      const response = await getJournals();
      if (response.success) {
        setJournals(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch journals:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (journal: Journal | null = null) => {
    if (journal) {
      setEditingJournal(journal);
      setFormData({
        title: journal.title,
        content: journal.content,
        mood: journal.mood || ""
      });
    } else {
      setEditingJournal(null);
      setFormData({ title: "", content: "", mood: "" });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingJournal) {
        await updateJournal(editingJournal.id, formData);
      } else {
        await createJournal(formData);
      }
      setIsModalOpen(false);
      fetchJournals();
    } catch (error) {
      console.error("Error saving journal:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      try {
        await deleteJournal(id);
        fetchJournals();
      } catch (error) {
        console.error("Error deleting journal:", error);
      }
    }
  };

  const filteredJournals = journals.filter(journal => {
    const matchesSearch = journal.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         journal.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMood = filterMood === "All" || journal.mood === filterMood;
    return matchesSearch && matchesMood;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Journal Entries</h1>
            <p className="text-gray-600">Document your thoughts and track your journey.</p>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            <Plus size={20} />
            <span>New Entry</span>
          </button>
        </div>

        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search journals..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative w-full md:w-48">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white appearance-none"
              value={filterMood}
              onChange={(e) => setFilterMood(e.target.value)}
            >
              <option value="All">All Moods</option>
              {moods.map(mood => (
                <option key={mood} value={mood}>{mood}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your entries...</p>
          </div>
        ) : filteredJournals.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500 text-lg">No journal entries found.</p>
            <button 
              onClick={() => handleOpenModal()}
              className="mt-4 text-indigo-600 font-medium hover:underline"
            >
              Start by creating your first entry
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJournals.map((journal) => (
              <div key={journal.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow relative group">
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                    journal.mood ? 'bg-indigo-50 text-indigo-700' : 'bg-gray-50 text-gray-600'
                  }`}>
                    {journal.mood || 'No Mood'}
                  </span>
                  <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => handleOpenModal(journal)} className="text-gray-400 hover:text-indigo-600">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(journal.id)} className="text-gray-400 hover:text-red-600">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 truncate">{journal.title}</h3>
                <p className="text-gray-600 line-clamp-3 mb-4">{journal.content}</p>
                <div className="flex items-center text-xs text-gray-400 mt-auto">
                  <Calendar size={14} className="mr-1" />
                  {new Date(journal.created_at).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl shadow-xl">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">
                {editingJournal ? "Edit Entry" : "New Journal Entry"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="What's on your mind?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mood</label>
                <select
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 appearance-none bg-white"
                  value={formData.mood}
                  onChange={(e) => setFormData({...formData, mood: e.target.value})}
                >
                  <option value="">Select a mood (optional)</option>
                  {moods.map(mood => (
                    <option key={mood} value={mood}>{mood}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                <textarea
                  required
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  placeholder="Write your thoughts here..."
                ></textarea>
              </div>
              <div className="flex justify-end space-x-3 mt-8">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-50 rounded-lg border border-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  {editingJournal ? "Save Changes" : "Create Entry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JournalPage;
