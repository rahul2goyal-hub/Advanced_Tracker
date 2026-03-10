import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import TeamModule from './components/TeamModule';
import ScheduleModule from './components/ScheduleModule';
import CommonalityModule from './components/CommonalityModule';
import BusinessCaseModule from './components/BusinessCaseModule';
import MarketAnalysisModule from './components/MarketAnalysisModule';
import ExportEngine from './components/ExportEngine';

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/team" element={<TeamModule />} />
          <Route path="/schedule" element={<ScheduleModule />} />
          <Route path="/commonality" element={<CommonalityModule />} />
          <Route path="/business-case" element={<BusinessCaseModule />} />
          <Route path="/market-analysis" element={<MarketAnalysisModule />} />
          <Route path="/export" element={<ExportEngine />} />
        </Routes>
      </Layout>
    </Router>
  );
}
