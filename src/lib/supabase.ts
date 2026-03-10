import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 
  import.meta.env.VITE_SUPABASE_URL || 
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL || 
  (typeof process !== 'undefined' ? process.env.SUPABASE_URL : undefined) ||
  'https://placeholder-project.supabase.co';

const supabaseAnonKey = 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
  (typeof process !== 'undefined' ? process.env.SUPABASE_ANON_KEY : undefined) ||
  'placeholder-key';

// For demo purposes, if keys are missing, we'll use a placeholder to avoid initialization crash.
// The app will still function using the mock data provided below.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Mock data for 'Project ABXX'
export let MOCK_PROJECTS = [
  {
    id: 'abxx-id',
    name: 'Project ABXX',
    description: 'Next-generation electric commuter scooter for urban markets.',
    status: 'Ongoing',
    progress: 30,
    current_gate: 'G2',
    start_date: '2024-01-01',
    end_date: '2025-12-31'
  }
];

export let MOCK_MEMBERS = [
  { id: '1', name: 'Rahul Goyal', role: 'Project Lead', department: 'MLH' },
  { id: '2', name: 'Amit Singh', role: 'Design Engineer', department: 'SS MPL' },
  { id: '3', name: 'Priya Sharma', role: 'Costing Analyst', department: 'Finance' }
];

export let MOCK_ACTIVITIES = [
  { id: '1', name: 'Clay Surfacing', start_date: '2024-02-01', end_date: '2024-04-15', status: 'Completed' },
  { id: '2', name: 'Design Freeze', start_date: '2024-04-16', end_date: '2024-06-30', status: 'In Progress' },
  { id: '3', name: 'Prototyping', start_date: '2024-07-01', end_date: '2024-10-31', status: 'Pending' },
  { id: '4', name: 'Testing & Validation', start_date: '2024-11-01', end_date: '2025-03-31', status: 'Pending' }
];

export let MOCK_COMPONENTS = [
  { id: '1', name: 'Chassis Frame', status: 'Common' },
  { id: '2', name: 'Battery Pack', status: 'New' },
  { id: '3', name: 'LED Headlamp', status: 'Modified' },
  { id: '4', name: 'Digital Cluster', status: 'New' }
];

export let MOCK_FINANCIALS = [
  { id: '1', category: 'Tooling', item: 'Body Panels Mold', cost: 500000 },
  { id: '2', category: 'Jigs', item: 'Welding Fixture', cost: 150000 },
  { id: '3', category: 'Development', item: 'Software Integration', cost: 200000 }
];

export let MOCK_MARKET = [
  { id: '1', competitor_name: 'Competitor A', position_x: 70, position_y: 80, customer_profile: 'Premium Urban' },
  { id: '2', competitor_name: 'Competitor B', position_x: 40, position_y: 50, customer_profile: 'Budget Commuter' },
  { id: '3', competitor_name: 'Project ABXX', position_x: 60, position_y: 90, customer_profile: 'Tech-Savvy Youth' }
];
