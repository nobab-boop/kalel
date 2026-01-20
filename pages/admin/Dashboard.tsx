import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, Search, Filter, Phone, Mail, Calendar, CheckCircle, Clock, AlertCircle, Home, ShieldCheck, Trash2, X, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { SERVICES } from '../../constants';

interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  serviceType: string;
  date: string;
  time: string;
  instructions: string;
  status: 'New' | 'Contacted' | 'Booked' | 'Completed';
  submittedAt: string;
}

export const AdminDashboard: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filter, setFilter] = useState('All');
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; leadId: string | null }>({ 
    show: false, 
    leadId: null 
  });
  const navigate = useNavigate();

  const loadLeads = (): Lead[] => {
    const stored = localStorage.getItem('kl_leads');
    return stored ? JSON.parse(stored) : [];
  };

  useEffect(() => {
    setLeads(loadLeads());
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('kl_admin_token');
    navigate('/admin');
  };

  const handleStatusChange = (id: string, newValue: string) => {
    const currentData = loadLeads();
    const updated = currentData.map(lead =>
      lead.id === id ? { ...lead, status: newValue as Lead['status'] } : lead
    );
    localStorage.setItem('kl_leads', JSON.stringify(updated));
    setLeads(updated);
  };

  const openDeleteModal = (leadId: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setDeleteModal({ show: true, leadId });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ show: false, leadId: null });
  };

  const confirmDelete = () => {
    if (!deleteModal.leadId) return;

    const stored = localStorage.getItem('kl_leads');
    if (stored) {
      const currentData: Lead[] = JSON.parse(stored);
      const updatedData = currentData.filter(lead => lead.id !== deleteModal.leadId);
      localStorage.setItem('kl_leads', JSON.stringify(updatedData));
      setLeads(updatedData);
    }
    
    closeDeleteModal();
  };

  const getServiceTitle = (id: string) => {
    return SERVICES.find(s => s.id === id)?.title || id;
  };

  const filteredLeads = filter === 'All' 
    ? leads 
    : leads.filter(l => l.status === filter);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'New': return 'bg-blue-100 text-blue-800';
      case 'Contacted': return 'bg-yellow-100 text-yellow-800';
      case 'Booked': return 'bg-green-100 text-green-800';
      case 'Completed': return 'bg-slate-100 text-slate-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(14, 165, 233); // Brand color #0ea5e9
    doc.text("KL Softwash LLC", 14, 20);
    
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Leads Report - Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, 14, 30);
    
    if (filter !== 'All') {
        doc.text(`Filter: ${filter} Status Only`, 14, 36);
    }

    // Table
    const tableColumn = ["Date", "Status", "Name", "Service", "Phone", "Email", "Details"];
    const tableRows = filteredLeads.map(lead => [
        new Date(lead.date).toLocaleDateString(),
        lead.status,
        lead.name,
        getServiceTitle(lead.serviceType),
        lead.phone,
        lead.email,
        lead.instructions || '-'
    ]);

    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: filter !== 'All' ? 42 : 38,
        theme: 'grid',
        headStyles: { fillColor: [14, 165, 233] },
        styles: { fontSize: 8, cellPadding: 2 },
        columnStyles: {
            0: { cellWidth: 20 }, // Date
            1: { cellWidth: 20 }, // Status
            2: { cellWidth: 25 }, // Name
            3: { cellWidth: 30 }, // Service
            4: { cellWidth: 25 }, // Phone
            5: { cellWidth: 35 }, // Email
            6: { cellWidth: 'auto' } // Details
        }
    });

    const fileName = `KL_Softwash_Leads_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Delete Confirmation Modal */}
      {deleteModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Delete Booking Request</h3>
              <button 
                onClick={closeDeleteModal}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-slate-600 mb-6">
              Are you sure you want to delete this booking request? This action cannot be undone.
            </p>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-brand-600" />
              <h1 className="text-xl font-bold text-slate-900">ADMIN DASHBOARD</h1>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:text-brand-600 transition-colors"
              >
                <Home className="w-4 h-4" />
                View Site
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Total Leads</p>
                <p className="text-3xl font-bold text-slate-900">{leads.length}</p>
              </div>
              <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-brand-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">New Leads</p>
                <p className="text-3xl font-bold text-blue-600">
                  {leads.filter(l => l.status === 'New').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Pending Contact</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {leads.filter(l => l.status === 'Contacted').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Booked Jobs</p>
                <p className="text-3xl font-bold text-green-600">
                  {leads.filter(l => l.status === 'Booked').length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200">
          {/* Table Header */}
          <div className="px-6 py-4 border-b border-slate-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <h2 className="text-lg font-semibold text-slate-900">Recent Booking Requests</h2>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                 <button 
                    onClick={exportToPDF}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg transition-colors text-sm font-medium shadow-sm hover:shadow"
                    title="Download leads as PDF"
                >
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Export PDF</span>
                    <span className="sm:hidden">Export</span>
                </button>
                <div className="relative flex-1 sm:flex-none">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="w-full sm:w-auto pl-9 pr-8 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                  >
                    <option value="All">All Status</option>
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Booked">Booked</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Instructions
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Requested Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-slate-500">
                      No booking requests found.
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={lead.status}
                          onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                          className={`px-3 py-1 rounded-full text-xs font-bold border-none cursor-pointer focus:ring-2 focus:ring-offset-1 focus:ring-brand-300 ${getStatusColor(lead.status)}`}
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Booked">Booked</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-900">{lead.name}</div>
                        <div className="text-xs text-slate-500">
                          {new Date(lead.submittedAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Phone className="w-4 h-4" />
                          {lead.phone}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Mail className="w-4 h-4" />
                          {lead.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900">{getServiceTitle(lead.serviceType)}</div>
                      </td>
                      <td className="px-6 py-4">
                        {lead.instructions ? (
                          <div className="text-sm text-slate-600 max-w-xs truncate" title={lead.instructions}>
                            "{lead.instructions}"
                          </div>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Calendar className="w-4 h-4" />
                          {new Date(lead.date).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-slate-500">
                          {lead.time} preference
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={(e) => openDeleteModal(lead.id, e)}
                          className="text-slate-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full cursor-pointer"
                          title="Delete Request"
                          aria-label="Delete booking request"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Cloudflare Badge Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
          <ShieldCheck className="w-4 h-4" />
          <span>Verified by Cloudflare Protection</span>
        </div>
      </div>
    </div>
  );
};