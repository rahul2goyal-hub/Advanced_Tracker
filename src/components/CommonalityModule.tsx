import React from 'react';
import { supabase, MOCK_COMPONENTS } from '../lib/supabase';
import Modal from '../components/Modal';
import { Box, RefreshCcw, PlusCircle, CheckCircle2, Plus } from 'lucide-react';

export default function CommonalityModule() {
  const [components, setComponents] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [newComponent, setNewComponent] = React.useState({
    name: '',
    status: 'Common'
  });

  const fetchComponents = async () => {
    try {
      const { data, error } = await supabase.from('components').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (data && data.length > 0) {
        setComponents(data);
      } else {
        setComponents(MOCK_COMPONENTS);
      }
    } catch (err) {
      console.error('Error fetching components:', err);
      setComponents(MOCK_COMPONENTS);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchComponents();
  }, []);

  const handleAddComponent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.from('components').insert([newComponent]).select();
      if (error) throw error;
      
      if (data) {
        setComponents([data[0], ...components]);
      }
    } catch (err) {
      console.error('Error adding component:', err);
      const component = {
        ...newComponent,
        id: Math.random().toString(36).substr(2, 9),
      };
      setComponents([component, ...components]);
      MOCK_COMPONENTS.push(component);
    } finally {
      setIsModalOpen(false);
      setNewComponent({ name: '', status: 'Common' });
    }
  };

  const stats = {
    common: components.filter(c => c.status === 'Common').length,
    modified: components.filter(c => c.status === 'Modified').length,
    new: components.filter(c => c.status === 'New').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Commonality Strategy</h2>
          <p className="text-gray-500">Track component status and reuse strategy for Project ABXX</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
        >
          <Plus className="w-4 h-4" />
          Add Component
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Common', value: stats.common, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Modified', value: stats.modified, icon: RefreshCcw, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'New', value: stats.new, icon: PlusCircle, color: 'text-red-600', bg: 'bg-red-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label} Components</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Component Name</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Strategy</th>
              <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {components.map((component) => (
              <tr key={component.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Box className="w-5 h-5 text-gray-400" />
                    <span className="font-bold text-gray-900">{component.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                    component.status === 'Common' ? 'bg-emerald-100 text-emerald-700' :
                    component.status === 'Modified' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {component.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-xs font-bold text-gray-500 hover:text-red-600 transition-colors">
                    Edit Strategy
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Component">
        <form onSubmit={handleAddComponent} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Component Name</label>
            <input 
              required
              type="text" 
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 outline-none"
              placeholder="e.g. Chassis Frame"
              value={newComponent.name}
              onChange={e => setNewComponent({...newComponent, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Strategy</label>
            <select 
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 outline-none"
              value={newComponent.status}
              onChange={e => setNewComponent({...newComponent, status: e.target.value})}
            >
              <option value="Common">Common</option>
              <option value="Modified">Modified</option>
              <option value="New">New</option>
            </select>
          </div>
          <button 
            type="submit"
            className="w-full bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-colors mt-4"
          >
            Add Component
          </button>
        </form>
      </Modal>
    </div>
  );
}
