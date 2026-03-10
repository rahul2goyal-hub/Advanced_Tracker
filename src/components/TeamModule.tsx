import React from 'react';
import { supabase, MOCK_MEMBERS } from '../lib/supabase';
import Modal from '../components/Modal';
import { UserPlus, Mail, Shield, Building2 } from 'lucide-react';

export default function TeamModule() {
  const [members, setMembers] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [newMember, setNewMember] = React.useState({
    name: '',
    role: '',
    department: 'MLH'
  });

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase.from('members').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (data && data.length > 0) {
        setMembers(data);
      } else {
        setMembers(MOCK_MEMBERS);
      }
    } catch (err) {
      console.error('Error fetching members:', err);
      setMembers(MOCK_MEMBERS);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchMembers();
  }, []);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.from('members').insert([newMember]).select();
      if (error) throw error;
      
      if (data) {
        setMembers([data[0], ...members]);
      }
    } catch (err) {
      console.error('Error adding member:', err);
      const member = {
        ...newMember,
        id: Math.random().toString(36).substr(2, 9),
      };
      setMembers([member, ...members]);
      MOCK_MEMBERS.push(member);
    } finally {
      setIsModalOpen(false);
      setNewMember({ name: '', role: '', department: 'MLH' });
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
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Team Selection</h2>
          <p className="text-gray-500">Role-based member assignment for Project ABXX</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
        >
          <UserPlus className="w-4 h-4" />
          Add Member
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => (
          <div key={member.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-600 font-bold text-lg">
                {member.name.split(' ').map((n: string) => n[0]).join('')}
              </div>
              <span className="px-2 py-1 rounded-lg bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider">
                ID: {member.id.toString().slice(0, 8)}
              </span>
            </div>
            
            <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
            
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Shield className="w-4 h-4 text-gray-400" />
                <span className="font-medium">{member.role}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Building2 className="w-4 h-4 text-gray-400" />
                <span>{member.department}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="truncate">{member.name.toLowerCase().replace(' ', '.')}@heromotocorp.com</span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100 flex gap-2">
              <button className="flex-1 text-xs font-bold text-gray-600 hover:bg-gray-50 py-2 rounded-lg border border-gray-200 transition-colors">
                View Profile
              </button>
              <button className="flex-1 text-xs font-bold text-red-600 hover:bg-red-50 py-2 rounded-lg border border-red-100 transition-colors">
                Manage Role
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Team Member">
        <form onSubmit={handleAddMember} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Full Name</label>
            <input 
              required
              type="text" 
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 outline-none"
              placeholder="e.g. John Doe"
              value={newMember.name}
              onChange={e => setNewMember({...newMember, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Role</label>
            <input 
              required
              type="text" 
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 outline-none"
              placeholder="e.g. Design Engineer"
              value={newMember.role}
              onChange={e => setNewMember({...newMember, role: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Department</label>
            <select 
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 outline-none"
              value={newMember.department}
              onChange={e => setNewMember({...newMember, department: e.target.value})}
            >
              <option value="MLH">MLH</option>
              <option value="SS MPL">SS MPL</option>
              <option value="Finance">Finance</option>
              <option value="Marketing">Marketing</option>
              <option value="R&D">R&D</option>
            </select>
          </div>
          <button 
            type="submit"
            className="w-full bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-colors mt-4"
          >
            Add Member
          </button>
        </form>
      </Modal>
    </div>
  );
}
