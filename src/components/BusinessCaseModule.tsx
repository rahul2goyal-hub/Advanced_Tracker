import React from 'react';
import { supabase, MOCK_FINANCIALS } from '../lib/supabase';
import Modal from '../components/Modal';
import { IndianRupee, TrendingDown, DollarSign, Plus } from 'lucide-react';

export default function BusinessCaseModule() {
  const [financials, setFinancials] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [newItem, setNewItem] = React.useState({
    category: 'Tooling',
    item: '',
    cost: ''
  });

  const fetchFinancials = async () => {
    try {
      const { data, error } = await supabase.from('financials').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      if (data && data.length > 0) {
        setFinancials(data);
      } else {
        setFinancials(MOCK_FINANCIALS);
      }
    } catch (err) {
      console.error('Error fetching financials:', err);
      setFinancials(MOCK_FINANCIALS);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchFinancials();
  }, []);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...newItem,
        cost: Number(newItem.cost)
      };
      const { data, error } = await supabase.from('financials').insert([payload]).select();
      if (error) throw error;
      
      if (data) {
        setFinancials([data[0], ...financials]);
      }
    } catch (err) {
      console.error('Error adding financial item:', err);
      const item = {
        ...newItem,
        id: Math.random().toString(36).substr(2, 9),
        cost: Number(newItem.cost)
      };
      setFinancials([item, ...financials]);
      MOCK_FINANCIALS.push(item);
    } finally {
      setIsModalOpen(false);
      setNewItem({ category: 'Tooling', item: '', cost: '' });
    }
  };

  const totalCost = financials.reduce((acc, curr) => acc + Number(curr.cost), 0);

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
          <h2 className="text-2xl font-bold text-gray-900">Business Case</h2>
          <p className="text-gray-500">Financial inputs and tooling costs for Project ABXX</p>
        </div>
        <div className="bg-red-50 px-4 py-2 rounded-xl border border-red-100">
          <p className="text-[10px] font-bold text-red-600 uppercase tracking-wider">Total Estimated Cost</p>
          <p className="text-xl font-black text-red-700">₹ {(totalCost / 100000).toFixed(2)} Lakhs</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-900">Cost Input Details</h3>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Item</th>
                  <th className="text-right px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Cost (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {financials.map((fin) => (
                  <tr key={fin.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-lg bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider">
                        {fin.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{fin.item}</td>
                    <td className="px-6 py-4 text-right font-bold text-gray-900">
                      {Number(fin.cost).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4">Financial Summary</h3>
            <div className="space-y-4">
              {[
                { label: 'Tooling Budget', value: '₹ 45.0 L', progress: Math.min(100, (financials.filter(f => f.category === 'Tooling').reduce((a, b) => a + Number(b.cost), 0) / 4500000) * 100), color: 'bg-red-600' },
                { label: 'R&D Expenses', value: '₹ 12.5 L', progress: Math.min(100, (financials.filter(f => f.category === 'Development').reduce((a, b) => a + Number(b.cost), 0) / 1250000) * 100), color: 'bg-blue-600' },
                { label: 'Marketing Fund', value: '₹ 8.0 L', progress: 10, color: 'bg-emerald-600' },
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 font-medium">{item.label}</span>
                    <span className="text-gray-900 font-bold">{item.value}</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 p-6 rounded-2xl text-white shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/10 rounded-lg">
                <TrendingDown className="w-5 h-5 text-red-400" />
              </div>
              <h3 className="font-bold">Cost Reduction Target</h3>
            </div>
            <p className="text-3xl font-black mb-1">15%</p>
            <p className="text-sm text-gray-400">Target reduction in BOM cost by Gate G4</p>
            <button className="w-full mt-6 bg-white text-gray-900 py-2.5 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors">
              View Strategy
            </button>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Cost Input">
        <form onSubmit={handleAddItem} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Category</label>
            <select 
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 outline-none"
              value={newItem.category}
              onChange={e => setNewItem({...newItem, category: e.target.value})}
            >
              <option value="Tooling">Tooling</option>
              <option value="Jigs">Jigs</option>
              <option value="Development">Development</option>
              <option value="Marketing">Marketing</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Item Name</label>
            <input 
              required
              type="text" 
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 outline-none"
              placeholder="e.g. Body Panels Mold"
              value={newItem.item}
              onChange={e => setNewItem({...newItem, item: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Cost (₹)</label>
            <input 
              required
              type="number" 
              className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 outline-none"
              placeholder="e.g. 500000"
              value={newItem.cost}
              onChange={e => setNewItem({...newItem, cost: e.target.value})}
            />
          </div>
          <button 
            type="submit"
            className="w-full bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-colors mt-4"
          >
            Add Cost Item
          </button>
        </form>
      </Modal>
    </div>
  );
}
