import React from 'react';
import ExcelJS from 'exceljs';
import pptxgen from 'pptxgenjs';
import { FileSpreadsheet, Presentation, Download, CheckCircle2 } from 'lucide-react';
import { MOCK_PROJECTS, MOCK_MEMBERS, MOCK_ACTIVITIES, MOCK_FINANCIALS } from '../lib/supabase';

export default function ExportEngine() {
  const [isExporting, setIsExporting] = React.useState(false);
  const [lastExport, setLastExport] = React.useState<string | null>(null);
  const mainProject = MOCK_PROJECTS[0];

  const exportToExcel = async () => {
    if (!mainProject) return;
    setIsExporting(true);
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Project Status');

    sheet.columns = [
      { header: 'Category', key: 'category', width: 20 },
      { header: 'Detail', key: 'detail', width: 40 },
      { header: 'Status/Value', key: 'status', width: 20 },
    ];

    sheet.addRow({ category: 'Project Name', detail: mainProject.name, status: mainProject.status });
    sheet.addRow({ category: 'Current Gate', detail: 'Project Maturity Stage', status: mainProject.current_gate });
    sheet.addRow({ category: 'Progress', detail: 'Overall Completion', status: `${mainProject.progress}%` });
    
    sheet.addRow({});
    sheet.addRow({ category: 'TEAM MEMBERS' });
    MOCK_MEMBERS.forEach(m => sheet.addRow({ category: m.role, detail: m.name, status: m.department }));

    sheet.addRow({});
    sheet.addRow({ category: 'SCHEDULE' });
    MOCK_ACTIVITIES.forEach(a => sheet.addRow({ category: a.name, detail: `${a.start_date} to ${a.end_date}`, status: a.status }));

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `${mainProject.name}_Status.xlsx`;
    anchor.click();
    window.URL.revokeObjectURL(url);
    
    setIsExporting(false);
    setLastExport(new Date().toLocaleTimeString());
  };

  const exportToPPT = async () => {
    if (!mainProject) return;
    setIsExporting(true);
    const pres = new pptxgen();

    // Title Slide
    let slide = pres.addSlide();
    slide.background = { color: 'F1F5F9' };
    slide.addText('GATEL PROJECT MANAGEMENT', { x: 1, y: 1, w: '80%', h: 1, fontSize: 36, bold: true, color: 'DC2626' });
    slide.addText(`Management Summary: ${mainProject.name}`, { x: 1, y: 2, w: '80%', h: 0.5, fontSize: 24, color: '1E293B' });
    slide.addText(`Generated on: ${new Date().toLocaleDateString()}`, { x: 1, y: 5, w: '80%', h: 0.5, fontSize: 12, color: '64748B' });

    // Status Slide
    slide = pres.addSlide();
    slide.addText('Project Status & Timeline', { x: 0.5, y: 0.5, w: '90%', h: 0.5, fontSize: 24, bold: true, color: 'DC2626' });
    slide.addText(`Current Gate: ${mainProject.current_gate}`, { x: 0.5, y: 1.5, w: 4, h: 0.5, fontSize: 18, bold: true });
    slide.addText(`Overall Progress: ${mainProject.progress}%`, { x: 0.5, y: 2.2, w: 4, h: 0.5, fontSize: 18, bold: true });

    // Financials Slide
    slide = pres.addSlide();
    slide.addText('Business Case Summary', { x: 0.5, y: 0.5, w: '90%', h: 0.5, fontSize: 24, bold: true, color: 'DC2626' });
    const totalCost = MOCK_FINANCIALS.reduce((acc, curr) => acc + Number(curr.cost), 0);
    slide.addText(`Total Estimated Cost: ₹ ${(totalCost / 100000).toFixed(2)} Lakhs`, { x: 0.5, y: 1.5, w: 8, h: 0.5, fontSize: 20, bold: true });

    pres.writeFile({ fileName: `${mainProject.name}_Presentation.pptx` });
    
    setIsExporting(false);
    setLastExport(new Date().toLocaleTimeString());
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">Export Engine</h2>
        <p className="text-gray-500 mt-2">Generate professional reports and presentations for management</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Excel Export */}
        <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl transition-all group">
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <FileSpreadsheet className="w-8 h-8 text-emerald-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Project Data (.xlsx)</h3>
          <p className="text-sm text-gray-500 mb-8">
            Export full project details including team members, schedule, and component strategy for deep analysis.
          </p>
          <button 
            onClick={exportToExcel}
            disabled={isExporting}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white py-3 rounded-xl font-bold hover:bg-emerald-700 transition-colors disabled:opacity-50"
          >
            <Download className="w-5 h-5" />
            Download Excel
          </button>
        </div>

        {/* PPT Export */}
        <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm hover:shadow-xl transition-all group">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Presentation className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Management PPT (.pptx)</h3>
          <p className="text-sm text-gray-500 mb-8">
            Generate a boardroom-ready presentation summarizing project status, timeline, and business case.
          </p>
          <button 
            onClick={exportToPPT}
            disabled={isExporting}
            className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-3 rounded-xl font-bold hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            <Download className="w-5 h-5" />
            Download Presentation
          </button>
        </div>
      </div>

      {lastExport && (
        <div className="flex items-center justify-center gap-2 text-sm font-medium text-emerald-600 bg-emerald-50 py-3 rounded-2xl border border-emerald-100 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-4 h-4" />
          Last export completed at {lastExport}
        </div>
      )}
    </div>
  );
}
