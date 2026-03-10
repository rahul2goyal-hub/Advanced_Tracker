import React from 'react';
import { MOCK_ACTIVITIES } from '../lib/supabase';
import Modal from '../components/Modal';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

export default function ScheduleModule() {
  const [activities, setActivities] = React.useState(MOCK_ACTIVITIES);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [newActivity, setNewActivity] = React.useState({
    name: '',
    start_date: format(new Date(), 'yyyy-MM-dd'),
    end_date: format(new Date(), 'yyyy-MM-dd'),
    status: 'Pending'
  });

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    const activity = {
      ...newActivity,
      id: Math.random().toString(36).substr(2, 9),
    };
    const updatedActivities = [...activities, activity];
    setActivities(updatedActivities);
    MOCK_ACTIVITIES.push(activity);
    setIsModalOpen(false);
    setNewActivity({ 
      name: '', 
      start_date: format(new Date(), 'yyyy-MM-dd'), 
      end_date: format(new Date(), 'yyyy-MM-dd'), 
      status: 'Pending' 
    });
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">High-Level Schedule</h2>
          <p className="text-gray-500">Gantt-style activity tracker for Project ABXX</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700">
              <CalendarIcon className="w-4 h-4 text-red-600" />
              Timeline View
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-red-600 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
          >
            <Plus className="w-4 h-4" />
            Add Activity
          </button>
        </div>
      </header>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-64">Activity</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Timeline</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-32">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {activities.map((activity) => (
                <tr key={activity.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900">{activity.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {format(new Date(activity.start_date), 'MMM d')} - {format(new Date(activity.end_date), 'MMM d, yyyy')}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative h-6 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`absolute top-0 h-full rounded-full ${
                          activity.status === 'Completed' ? 'bg-emerald-500' :
                          activity.status === 'In Progress' ? 'bg-amber-500' : 'bg-gray-300'
                        }`}
                        style={{ 
                          left: '10%',
                          width: activity.status === 'Completed' ? '80%' : activity.status === 'In Progress' ? '40%' : '20%'
                        }}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                      activity.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                      activity.status === 'In Progress' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {activity.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Activity">
        <form onSubmit={handleAddActivity} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Activity Name</label>
            <input 
              required
              type="text" 
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 outline-none"
              placeholder="e.g. Clay Surfacing"
              value={newActivity.name}
              onChange={e => setNewActivity({...newActivity, name: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Start Date</label>
              <input 
                required
                type="date" 
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 outline-none"
                value={newActivity.start_date}
                onChange={e => setNewActivity({...newActivity, start_date: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">End Date</label>
              <input 
                required
                type="date" 
                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 outline-none"
                value={newActivity.end_date}
                onChange={e => setNewActivity({...newActivity, end_date: e.target.value})}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Status</label>
            <select 
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 outline-none"
              value={newActivity.status}
              onChange={e => setNewActivity({...newActivity, status: e.target.value})}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <button 
            type="submit"
            className="w-full bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-colors mt-4"
          >
            Add Activity
          </button>
        </form>
      </Modal>
    </div>
  );
}
