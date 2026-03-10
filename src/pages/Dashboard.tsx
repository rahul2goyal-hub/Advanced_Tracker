import React from 'react';
import { supabase, MOCK_PROJECTS } from '../lib/supabase';
import Modal from '../components/Modal';
import { ArrowRight, Clock, Target, TrendingUp, Plus, Edit2, Trash2, Save, X } from 'lucide-react';

export default function Dashboard() {
  const [projects, setProjects] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [newProject, setNewProject] = React.useState({
    name: '',
    description: '',
    status: 'Ongoing',
    progress: 0,
    current_gate: 'G0'
  });

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (data && data.length > 0) {
        setProjects(data);
      } else {
        setProjects(MOCK_PROJECTS);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
      setProjects(MOCK_PROJECTS);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchProjects();
  }, []);

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.from('projects').insert([newProject]).select();
      if (error) throw error;
      
      if (data) {
        setProjects([data[0], ...projects]);
      }
    } catch (err) {
      console.error('Error adding project:', err);
      const project = { ...newProject, id: Math.random().toString(36).substr(2, 9) };
      setProjects([project, ...projects]);
    } finally {
      setIsModalOpen(false);
      setNewProject({ name: '', description: '', status: 'Ongoing', progress: 0, current_gate: 'G0' });
    }
  };

  const handleUpdateProject = async (id: string, updates: any) => {
    try {
      const { error } = await supabase.from('projects').update(updates).eq('id', id);
      if (error) throw error;
      setProjects(projects.map(p => p.id === id ? { ...p, ...updates } : p));
      setEditingId(null);
    } catch (err) {
      console.error('Error updating project:', err);
      setProjects(projects.map(p => p.id === id ? { ...p, ...updates } : p));
      setEditingId(null);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) throw error;
      setProjects(projects.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error deleting project:', err);
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <h2 className="text-4xl font-black text-gray-900 tracking-tight">Project Tracker</h2>
          <p className="text-gray-500 font-medium mt-1">Simple Editor & Viewer for Hero MotoCorp Projects</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-red-600 transition-all shadow-xl active:scale-95"
        >
          <Plus className="w-5 h-5" />
          New Project
        </button>
      </header>

      {/* Projects List */}
      <div className="grid grid-cols-1 gap-6">
        {projects.map(project => (
          <div key={project.id} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
            {editingId === project.id ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Project Name</label>
                    <input 
                      className="w-full text-2xl font-bold text-gray-900 border-b-2 border-gray-100 focus:border-red-500 outline-none pb-1"
                      defaultValue={project.name}
                      onBlur={(e) => handleUpdateProject(project.id, { name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</label>
                    <select 
                      className="w-full text-lg font-bold text-gray-700 border-b-2 border-gray-100 focus:border-red-500 outline-none pb-1 bg-transparent"
                      defaultValue={project.status}
                      onChange={(e) => handleUpdateProject(project.id, { status: e.target.value })}
                    >
                      <option value="Ongoing">Ongoing</option>
                      <option value="Upcoming">Upcoming</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Description</label>
                  <textarea 
                    className="w-full text-gray-600 border-b-2 border-gray-100 focus:border-red-500 outline-none pb-1 resize-none"
                    defaultValue={project.description}
                    onBlur={(e) => handleUpdateProject(project.id, { description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Progress ({project.progress}%)</label>
                    <input 
                      type="range"
                      className="w-full accent-red-600"
                      defaultValue={project.progress}
                      onChange={(e) => setProjects(projects.map(p => p.id === project.id ? { ...p, progress: parseInt(e.target.value) } : p))}
                      onMouseUp={(e: any) => handleUpdateProject(project.id, { progress: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Current Gate</label>
                    <select 
                      className="w-full font-bold text-gray-700 border-b-2 border-gray-100 focus:border-red-500 outline-none pb-1 bg-transparent"
                      defaultValue={project.current_gate}
                      onChange={(e) => handleUpdateProject(project.id, { current_gate: e.target.value })}
                    >
                      {['G0', 'G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7'].map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <button 
                    onClick={() => setEditingId(null)}
                    className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors"
                  >
                    <Save className="w-4 h-4" /> Done Editing
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <h3 className="text-3xl font-black text-gray-900 group-hover:text-red-600 transition-colors">{project.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      project.status === 'Ongoing' ? 'bg-emerald-100 text-emerald-700' :
                      project.status === 'Upcoming' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <p className="text-gray-500 font-medium leading-relaxed max-w-2xl">{project.description}</p>
                  <div className="flex items-center gap-8 pt-2">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Current Gate</p>
                      <p className="text-xl font-black text-gray-900">{project.current_gate}</p>
                    </div>
                    <div className="flex-1 max-w-[200px] space-y-2">
                      <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-red-600 rounded-full transition-all duration-500" style={{ width: `${project.progress}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex md:flex-col gap-2">
                  <button 
                    onClick={() => setEditingId(project.id)}
                    className="p-4 bg-gray-50 text-gray-400 hover:bg-gray-900 hover:text-white rounded-2xl transition-all"
                    title="Edit Project"
                  >
                    <Edit2 className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={() => handleDeleteProject(project.id)}
                    className="p-4 bg-gray-50 text-gray-400 hover:bg-red-600 hover:text-white rounded-2xl transition-all"
                    title="Delete Project"
                  >
                    <Trash2 className="w-6 h-6" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {projects.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-bold">No projects found. Start by creating one!</p>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Project">
        <form onSubmit={handleAddProject} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Project Name</label>
            <input 
              required
              type="text" 
              className="w-full px-6 py-4 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-red-500 outline-none bg-gray-50 font-bold"
              placeholder="e.g. Project ABRA"
              value={newProject.name}
              onChange={e => setNewProject({...newProject, name: e.target.value})}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Description</label>
            <textarea 
              required
              className="w-full px-6 py-4 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-red-500 outline-none bg-gray-50 h-32 resize-none font-medium"
              placeholder="Brief project overview..."
              value={newProject.description}
              onChange={e => setNewProject({...newProject, description: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</label>
              <select 
                className="w-full px-6 py-4 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-red-500 outline-none bg-gray-50 font-bold"
                value={newProject.status}
                onChange={e => setNewProject({...newProject, status: e.target.value})}
              >
                <option value="Ongoing">Ongoing</option>
                <option value="Upcoming">Upcoming</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Initial Gate</label>
              <select 
                className="w-full px-6 py-4 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-red-500 outline-none bg-gray-50 font-bold"
                value={newProject.current_gate}
                onChange={e => setNewProject({...newProject, current_gate: e.target.value})}
              >
                {['G0', 'G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7'].map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>
          <button 
            type="submit"
            className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black hover:bg-red-600 transition-all shadow-xl mt-4"
          >
            Create Project
          </button>
        </form>
      </Modal>
    </div>
  );
}
