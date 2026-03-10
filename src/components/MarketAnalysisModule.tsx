import React from 'react';
import { MOCK_MARKET } from '../lib/supabase';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { Users, Target, BarChart2 } from 'lucide-react';

export default function MarketAnalysisModule() {
  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-2xl font-bold text-gray-900">Market Analysis</h2>
        <p className="text-gray-500">Positioning maps and competitor benchmarking for Project ABXX</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Positioning Map */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-gray-900">Positioning Map</h3>
              <p className="text-xs text-gray-500">Price vs. Performance Matrix</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-[10px] font-bold text-gray-500">
                <span className="w-2 h-2 rounded-full bg-red-600" />
                Our Project
              </span>
              <span className="flex items-center gap-1 text-[10px] font-bold text-gray-500">
                <span className="w-2 h-2 rounded-full bg-gray-400" />
                Competitors
              </span>
            </div>
          </div>

          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  type="number" 
                  dataKey="position_x" 
                  name="Price" 
                  unit="%" 
                  label={{ value: 'Price Sensitivity', position: 'bottom', offset: 0, fontSize: 12 }}
                />
                <YAxis 
                  type="number" 
                  dataKey="position_y" 
                  name="Performance" 
                  unit="%" 
                  label={{ value: 'Performance Index', angle: -90, position: 'left', fontSize: 12 }}
                />
                <ZAxis type="number" range={[100, 1000]} />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter 
                  name="Market Players" 
                  data={MOCK_MARKET} 
                  fill="#8884d8"
                >
                  {MOCK_MARKET.map((entry, index) => (
                    <Scatter
                      key={`scatter-${index}`}
                      data={[entry]}
                      fill={entry.competitor_name === 'Project ABXX' ? '#dc2626' : '#94a3b8'}
                    />
                  ))}
                  <LabelList dataKey="competitor_name" position="top" style={{ fontSize: '10px', fontWeight: 'bold' }} />
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Customer Profiles & Benchmarking */}
        <div className="space-y-6">
          <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900">Target Customer Profiles</h3>
            </div>
            <div className="space-y-4">
              {MOCK_MARKET.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div>
                    <p className="text-sm font-bold text-gray-900">{item.competitor_name}</p>
                    <p className="text-xs text-gray-500">{item.customer_profile}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Market Share</span>
                    <p className="text-sm font-bold text-gray-700">{(Math.random() * 20 + 5).toFixed(1)}%</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <Target className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="font-bold text-gray-900">Competitor Benchmarking</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                <span>Feature</span>
                <span>Advantage</span>
              </div>
              {[
                { feature: 'Battery Range', advantage: '+15km vs. Avg', status: 'High' },
                { feature: 'Charging Time', advantage: '-30min vs. Avg', status: 'High' },
                { feature: 'Top Speed', advantage: 'Par with Segment', status: 'Medium' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 font-medium">{item.feature}</span>
                  <span className="text-xs font-bold text-emerald-600">{item.advantage}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
