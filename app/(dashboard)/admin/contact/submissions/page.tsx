"use client";

import React, { useEffect, useState } from 'react';
import { getSubmissions, deleteSubmission, updateSubmissionStatus } from '@/actions/submissions';
import { FiTrash2, FiEye, FiDownload, FiSearch, FiFilter, FiCalendar, FiUser, FiClock, FiCheckCircle } from 'react-icons/fi';
import ConfirmationModal from '@/components/global/ConfirmationModal';
const formatDate = (date: Date | string, includeTime = true) => {
    const d = new Date(date);
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        hour: includeTime ? '2-digit' : undefined,
        minute: includeTime ? '2-digit' : undefined,
        hour12: true
    }).format(d);
};

export default function SubmissionsPage() {
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [filteredSubmissions, setFilteredSubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<string | null>(null);

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const fetchSubmissions = async () => {
        setLoading(true);
        const data = await getSubmissions();
        setSubmissions(data);
        setFilteredSubmissions(data);
        setLoading(false);
    };

    useEffect(() => {
        let filtered = submissions;
        if (search) {
            filtered = filtered.filter(s =>
                JSON.stringify(s.formData).toLowerCase().includes(search.toLowerCase()) ||
                s.metadata?.ip?.includes(search)
            );
        }
        if (statusFilter !== 'all') {
            filtered = filtered.filter(s => s.status === statusFilter);
        }
        setFilteredSubmissions(filtered);
    }, [search, statusFilter, submissions]);

    const handleDelete = async () => {
        if (itemToDelete) {
            await deleteSubmission(itemToDelete);
            fetchSubmissions();
            setIsDeleteModalOpen(false);
            setItemToDelete(null);
            if (selectedSubmission?._id === itemToDelete) setSelectedSubmission(null);
        }
    };

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        await updateSubmissionStatus(id, newStatus);
        fetchSubmissions();
    };

    const exportToCSV = () => {
        if (filteredSubmissions.length === 0) return;

        const allKeys = Array.from(new Set(filteredSubmissions.flatMap(s => Object.keys(s.formData))));
        const headers = ['ID', 'Date', 'Status', 'IP', ...allKeys];

        const rows = filteredSubmissions.map(s => [
            s._id,
            formatDate(s.createdAt),
            s.status,
            s.metadata?.ip,
            ...allKeys.map(k => {
                const val = s.formData[k];
                return Array.isArray(val) ? `"${val.join(', ')}"` : `"${val}"`;
            })
        ]);

        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `submissions_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="p-10 max-w-[1600px] mx-auto min-h-screen">
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onCancel={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Delete Submission"
                message="Are you sure you want to permanently delete this submission? This action cannot be undone."
                confirmLabel="Delete Permanently"
            />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter text-black uppercase mb-2">Form Submissions</h1>
                    <p className="text-black/40 text-xs font-bold uppercase tracking-widest">Manage and export dynamic contact form responses</p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={exportToCSV}
                        className="flex items-center gap-2 bg-black text-white px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-[#2563eb] transition-all shadow-xl shadow-black/10 active:scale-95"
                    >
                        <FiDownload size={14} /> Export to CSV
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                <div className="lg:col-span-3 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-black/2 p-6 rounded-4xl border border-black/5">
                        <div className="relative">
                            <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-black/20" />
                            <input
                                type="text"
                                placeholder="Search submissions..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-12 pr-6 py-4 bg-white border border-black/5 rounded-2xl text-xs font-bold focus:outline-none focus:border-[#2563eb] transition-all"
                            />
                        </div>
                        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-black/5">
                            <FiFilter className="ml-3 text-black/20" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="flex-1 bg-transparent text-[10px] font-black uppercase tracking-widest focus:outline-none cursor-pointer"
                            >
                                <option value="all">All Statuses</option>
                                <option value="new">New</option>
                                <option value="read">Read</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>
                    </div>

                    <div className="bg-white rounded-5xl border border-black/6 shadow-sm overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-black text-white">
                                <tr>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Inquiry Source</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Metadata</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-center">Status</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-black/5">
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="w-8 h-8 border-4 border-[#2563eb] border-t-transparent rounded-full animate-spin"></div>
                                                <p className="text-[10px] font-black uppercase text-black/20 tracking-widest">Accessing Secured Database...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredSubmissions.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-8 py-20 text-center text-black/20 text-[10px] font-black uppercase tracking-widest">
                                            No transmissions found
                                        </td>
                                    </tr>
                                ) : filteredSubmissions.map((s) => (
                                    <tr
                                        key={s._id}
                                        onClick={() => {
                                            setSelectedSubmission(s);
                                            if (s.status === 'new') handleStatusUpdate(s._id, 'read');
                                        }}
                                        className={`group cursor-pointer hover:bg-black/1 transition-all ${selectedSubmission?._id === s._id ? 'bg-[#2563eb]/5' : ''}`}
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black text-black">
                                                    {s.formData?.fullName || s.formData?.name || 'Anonymous User'}
                                                </span>
                                                <span className="text-[10px] font-bold text-black/30">
                                                    {s.formData?.email || 'No email provided'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-[9px] font-black text-black/40 flex items-center gap-2">
                                                    <FiCalendar /> {formatDate(s.createdAt)}
                                                </span>
                                                <span className="text-[9px] font-black text-black/40 flex items-center gap-2 uppercase tracking-tighter">
                                                    <FiUser /> {s.metadata?.ip}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-center">
                                            <span className={`inline-block px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${s.status === 'new' ? 'bg-red-100 text-red-600' :
                                                s.status === 'read' ? 'bg-[#2563eb]/10 text-[#2563eb]' :
                                                    'bg-black/5 text-black/30'
                                                }`}>
                                                {s.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex items-center justify-end gap-2 transition-opacity">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setSelectedSubmission(s); }}
                                                    className="p-2 text-black/20 hover:text-[#2563eb] hover:bg-[#2563eb]/5 rounded-xl transition-all"
                                                >
                                                    <FiEye size={16} />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setItemToDelete(s._id); setIsDeleteModalOpen(true); }}
                                                    className="p-2 text-black/20 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                                >
                                                    <FiTrash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>


                <div className="lg:col-span-1">
                    {selectedSubmission ? (
                        <div className="bg-white border-2 rounded-lg border-black rounded-5xl p-8 shadow-2xl animate-in slide-in-from-right-4 duration-500 sticky top-24">
                            <div className="flex justify-between items-start mb-8">
                                <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${selectedSubmission.status === 'new' ? 'bg-red-500 text-white' : 'bg-black text-white'
                                    }`}>
                                    ID: {selectedSubmission._id.slice(-6)}
                                </span>
                                <div className="flex gap-2 text-black/20">
                                    <button onClick={() => handleStatusUpdate(selectedSubmission._id, 'archived')} className="hover:text-black transition-all">
                                        <FiCheckCircle size={18} title="Archive submission" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2563eb] mb-4">Transmission Payload</p>
                                    <div className="space-y-6">
                                        {Object.entries(selectedSubmission.formData).map(([key, value]) => (
                                            <div key={key} className="p-4 bg-black/2 rounded-2xl border border-black/5">
                                                <p className="text-[8px] font-black uppercase text-black/30 mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                                                <p className="text-xs font-bold text-black wrap-break-word leading-relaxed">
                                                    {Array.isArray(value) ? value.join(', ') : (value as string) || '—'}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-black/5">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2563eb] mb-4 flex items-center gap-2">
                                        <FiClock /> Forensic Metadata
                                    </p>
                                    <div className="grid grid-cols-1 gap-3">
                                        <div className="flex justify-between items-center py-2 px-4 rounded-xl hover:bg-black/2">
                                            <span className="text-[8px] font-black uppercase text-black/20">IP Address</span>
                                            <span className="text-[10px] font-bold text-black">{selectedSubmission.metadata?.ip}</span>
                                        </div>
                                        <div className="flex flex-col py-2 px-4 rounded-xl hover:bg-black/2 gap-1">
                                            <span className="text-[8px] font-black uppercase text-black/20">User Agent</span>
                                            <span className="text-[9px] font-medium text-black/60 wrap-break-word leading-tight">{selectedSubmission.metadata?.userAgent}</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => { setItemToDelete(selectedSubmission._id); setIsDeleteModalOpen(true); }}
                                    className="w-full mt-4 py-4 bg-red-50 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all border border-red-100"
                                >
                                    Delete Submission Record
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full min-h-[400px] border-2 border-dashed border-black/5 rounded-[2.5rem] flex flex-col items-center justify-center text-center p-10 group hover:border-[#2563eb]/20 transition-all">
                            <div className="w-20 h-20 bg-black/2 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#2563eb]/5 transition-all">
                                <FiEye size={30} className="text-black/10 group-hover:text-[#2563eb]/30" />
                            </div>
                            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-black/20 max-w-[200px]">Select a transmission to decrypt payload details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
