-- Supabase Schema for Gatel Project Management System

-- Projects Table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'Ongoing', -- Ongoing, Upcoming, Completed
  progress INTEGER DEFAULT 0,
  current_gate TEXT DEFAULT 'G0', -- G0 to G7
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Members Table
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  department TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activities Table (Schedule)
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT DEFAULT 'Pending', -- Pending, In Progress, Completed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Components Table (Commonality Strategy)
CREATE TABLE components (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status TEXT NOT NULL, -- Common, Modified, New
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Financials Table (Business Case)
CREATE TABLE financials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  category TEXT NOT NULL, -- Tooling, Jigs, Development, etc.
  item TEXT NOT NULL,
  cost DECIMAL(15, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Market Analysis Table
CREATE TABLE market_analysis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  competitor_name TEXT,
  position_x DECIMAL(5, 2), -- e.g., Price
  position_y DECIMAL(5, 2), -- e.g., Performance
  customer_profile TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
