import React from 'react';
import { MOCK_PROJECTS } from '../lib/supabase';
import ProjectGates from '../components/ProjectGates';
import Modal from '../components/Modal';
import { ArrowRight, Clock, Target, TrendingUp, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [projects, setProjects] = React.useState(MOCK_PROJECTS);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [newProject, setNewProject] = React.useState({
    name: '',
    description: '',
    status: 'Ongoing',
    progress: 0,
    current_gate: 'G0'
  });

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    const project = {
      ...newProject,
      id: Math.random().toString(36).substr(2, 9),
    };
    const updatedProjects = [...projects, project];
    setProjects(updatedProjects);
    // Update global mock for persistence during session
    MOCK_PROJECTS.push(project);
    setIsModalOpen(false);
    setNewProject({ name: '', description: '', status: 'Ongoing', progress: 0, current_gate: 'G0' });
  };

  const ongoingProjects = projects.filter(p => p.status === 'Ongoing');
  const upcomingProjects = projects.filter(p => p.status === 'Upcoming');
  const mainProject = projects[0];

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Project Dashboard</h2>
          <p className="text-gray-500 mt-1">Welcome back, Rahul. Here's what's happening across your projects.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-red-600 text-white px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-red-700 transition-all shadow-lg shadow-red-200 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          New Project
        </button>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Active Projects', value: ongoingProjects.length.toString(), icon: Target, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Upcoming Gates', value: '4', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Avg. Progress', value: `${Math.round(projects.reduce((a, b) => a + b.progress, 0) / projects.length)}%`, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Team Members', value: '86', icon: Target, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Project Focus */}
      {mainProject && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">Current Focus: {mainProject.name}</h3>
            <Link to="/team" className="text-sm font-semibold text-red-600 hover:text-red-700 flex items-center gap-1">
              View Details <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <ProjectGates currentGate={mainProject.current_gate} progress={mainProject.progress} />
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Ongoing Projects */}
        <section className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900">Ongoing Projects</h3>
          <div className="space-y-4">
            {ongoingProjects.map(project => (
              <div key={project.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:border-red-200 transition-colors group">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-bold text-gray-900 group-hover:text-red-600 transition-colors">{project.name}</h4>
                    <p className="text-sm text-gray-500 mt-1">{project.description}</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 uppercase tracking-wider">
                    {project.status}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-red-600 rounded-full" style={{ width: `${project.progress}%` }} />
                  </div>
                </div>
              </div>
            ))}
            {ongoingProjects.length === 0 && <p className="text-gray-400 text-sm italic">No ongoing projects found.</p>}
          </div>
        </section>

        {/* Upcoming Projects */}
        <section className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900">Upcoming Projects</h3>
          <div className="space-y-4">
            {upcomingProjects.map(project => (
              <div key={project.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm border-dashed">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-bold text-gray-900">{project.name}</h4>
                    <p className="text-sm text-gray-500 mt-1">{project.description}</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 uppercase tracking-wider">
                    {project.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />
                    <span>Planned Start</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Target className="w-4 h-4" />
                    <span>Gate {project.current_gate}</span>
                  </div>
                </div>
              </div>
            ))}
            {upcomingProjects.length === 0 && <p className="text-gray-400 text-sm italic">No upcoming projects found.</p>}
          </div>
        </section>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Project">
        <form onSubmit={handleAddProject} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Project Name</label>
            <input 
              required
              type="text" 
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
              placeholder="e.g. Project ABRA"
              value={newProject.name}
              onChange={e => setNewProject({...newProject, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Description</label>
            <textarea 
              required
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all h-24 resize-none"
              placeholder="Brief project overview..."
              value={newProject.description}
              onChange={e => setNewProject({...newProject, description: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Status</label>
              <select 
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 outline-none"
                value={newProject.status}
                onChange={e => setNewProject({...newProject, status: e.target.value})}
              >
                <option value="Ongoing">Ongoing</option>
                <option value="Upcoming">Upcoming</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Initial Gate</label>
              <select 
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 outline-none"
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
            className="w-full bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-colors mt-4"
          >
            Create Project
          </button>
        </form>
      </Modal>
    </div>
  );
}
