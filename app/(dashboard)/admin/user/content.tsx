"use client";

import PageHeader from '@/components/global/PageHeader';
import { useToast } from '@/components/global/Toast';
import { getUsers, updateUser, createUser, getAllUsers } from '@/services/userService';
import { useEffect, useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiEye, FiSearch, FiX, FiPlus, FiEdit2, FiTrash2, FiChevronUp, FiChevronDown, FiUser, FiMail, FiPhone, FiBriefcase, FiDollarSign, FiCalendar, FiGlobe, FiCheckCircle, FiUsers, FiFileText, FiMessageSquare, FiClock, FiFilter, FiDownload } from 'react-icons/fi';

interface User {
    _id: string;
    fullName: string;
    email: string;
    service: string;
    projectDetails: string;
    phone?: string;
    company?: string;
    budget?: string;
    timeline?: string;
    source?: string;
    isReviewed: boolean;
    status: string;
    internalNotes?: string;
    assignedTo?: string;
    followUpDate?: string;
    communicationHistory?: any[];
    createdAt: string;
    message?: string;
}

const InputField = ({ label, value, onChange, placeholder, type = "text", isTextArea = false, isSelect = false, options = [] }: any) => (
    <div className="mb-4">
        <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-black/40 mb-1.5 ml-1">
            {label}
        </label>
        {isTextArea ? (
            <textarea
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                rows={3}
                className="w-full p-3 bg-black/[0.02] border border-black/[0.06] rounded-xl text-xs focus:outline-none focus:border-[#2563eb]/30 transition-all placeholder:text-black/20"
            />
        ) : isSelect ? (
            <select
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                className="w-full p-3 bg-black/[0.02] border border-black/[0.06] rounded-xl text-xs focus:outline-none focus:border-[#2563eb]/30 transition-all text-black"
            >
                <option value="" className="text-black/20">{placeholder}</option>
                {options.map((option: any) => (
                    <option key={option.value} value={option.value} className="text-black">
                        {option.label}
                    </option>
                ))}
            </select>
        ) : (
            <input
                type={type}
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full p-3 bg-black/[0.02] border border-black/[0.06] rounded-xl text-xs focus:outline-none focus:border-[#2563eb]/30 transition-all placeholder:text-black/20"
            />
        )}
    </div>
);

const StatusBadge = ({ status }: { status: string }) => {
    const styles = {
        pending: 'bg-yellow-100 text-yellow-800',
        contacted: 'bg-blue-100 text-blue-800',
        in_progress: 'bg-purple-100 text-purple-800',
        cancelled: 'bg-red-100 text-red-800',
        completed: 'bg-green-100 text-green-800',
    };

    return (
        <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full ${styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800'}`}>
            {status.replace('_', ' ')}
        </span>
    );
};

const UserContent = () => {
    const { showToast } = useToast();
    const [users, setUsers] = useState<User[]>([]);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [formData, setFormData] = useState<Partial<User>>({});
    console.log('selectedUser -- ', selectedUser);
    const fetchUsers = async (page = 1) => {
        setLoading(true);
        try {
            const result = await getUsers(page, 10, statusFilter);
            if (result.success) {
                setUsers(result.data.users);
                setTotal(result.data.total);
            } else {
                showToast('Failed to fetch users', 'error');
            }
        } catch (error) {

            showToast('Error fetching users k', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(currentPage);
    }, [currentPage, statusFilter]);

    const handleSaveEdit = async () => {
        if (!editingUser) return;
        try {
            const result = await updateUser(editingUser._id, formData);
            if (result.success) {
                showToast('User updated successfully', 'success');
                setIsEditModalOpen(false);
                setEditingUser(null);
                setFormData({});
                fetchUsers(currentPage);
            } else {
                showToast('Failed to update user', 'error');
            }
        } catch (error) {
            showToast('Error updating user', 'error');
        }
    };

    const handleSaveAdd = async () => {
        try {
            const result = await createUser(formData);
            if (result.success) {
                showToast('User created successfully', 'success');
                setIsAddModalOpen(false);
                setFormData({});
                fetchUsers(currentPage);
            } else {

                showToast('Failed to create user', 'error');
            }
        } catch (error) {
            showToast('Error creating user', 'error');
        }
    };

    const handleFormChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const filteredUsers = users.filter(user =>
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const exportToCSV = async () => {
        try {
            setLoading(true);
            const result = await getAllUsers(statusFilter);
            if (!result.success) {
                showToast('Failed to fetch data for export', 'error');
                return;
            }

            const dataToExport = result.data;
            if (dataToExport.length === 0) {
                showToast('No users found to export', 'info');
                return;
            }

            const headers = [
                'ID', 'Full Name', 'Email', 'Phone', 'Company', 'Service',
                'Budget', 'Timeline', 'Source', 'Status', 'Is Reviewed',
                'Assigned To', 'Follow Up Date', 'Created At'
            ];

            const rows = dataToExport.map((user: User) => [
                user._id,
                `"${user.fullName}"`,
                user.email,
                user.phone || '',
                `"${user.company || ''}"`,
                user.service,
                `"${user.budget || ''}"`,
                user.timeline || '',
                user.source || '',
                user.status,
                user.isReviewed ? 'Yes' : 'No',
                user.assignedTo || '',
                user.followUpDate ? new Date(user.followUpDate).toLocaleDateString() : '',
                new Date(user.createdAt).toLocaleString()
            ]);

            const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", `users_${statusFilter || 'all'}_${new Date().toISOString().split('T')[0]}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            showToast('CSV exported successfully', 'success');
        } catch (error) {
            console.error('Export error:', error);
            showToast('Error exporting CSV', 'error');
        } finally {
            setLoading(false);
        }
    };

    const totalPages = Math.ceil(total / 10);

    return (
        <div className="space-y-8">

            <div className="bg-white border border-black/[0.06] rounded-[2rem] p-6">
                <h1 className="text-[13px] font-black uppercase tracking-[0.3em] text-black mb-2">USER MANAGEMENT</h1>
                <p className="text-[10px] text-black/40 uppercase tracking-widest">Manage user inquiries and project requests</p>
            </div>


            <div className="bg-white border border-black/[0.06] rounded-2xl p-6">
                <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center">
                    <div className="flex-1 flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black/20" size={14} />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-black/[0.02] border border-black/[0.06] rounded-xl text-xs focus:outline-none focus:border-[#2563eb]/30 transition-all placeholder:text-black/20"
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-3 bg-black/[0.02] border border-black/[0.06] rounded-xl text-xs focus:outline-none focus:border-[#2563eb]/30 transition-all text-black"
                        >
                            <option value="" className="text-black/20">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="contacted">Contacted</option>
                            <option value="in_progress">In Progress</option>
                            <option value="cancelled">Cancelled</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={exportToCSV}
                            className="px-6 py-3 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#2563eb] transition-all flex items-center gap-2 shadow-sm"
                        >
                            <FiDownload size={12} /> Export CSV
                        </button>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="px-6 py-3 bg-[#2563eb] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#7C4DF6] transition-all flex items-center gap-2 shadow-sm hover:shadow-md"
                        >
                            <FiPlus size={12} /> Add New User
                        </button>
                    </div>
                </div>
            </div>


            <div className="bg-white border border-black/[0.06] rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-black/[0.06] bg-black/[0.01]">
                                {['User Info', 'Contact', 'Service', 'Budget', 'Timeline', 'Status', 'Reviewed', 'Assigned', 'Follow Up', 'Actions'].map((header) => (
                                    <th key={header} className="px-6 py-4 text-left">
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-black/40">{header}</span>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={10} className="px-6 py-8 text-center">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b border-[#2563eb]"></div>
                                            <span className="text-xs text-black/40">Loading users...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={10} className="px-6 py-8 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <FiUser className="text-black/10" size={32} />
                                            <span className="text-xs text-black/30">No users found</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user._id} className="border-b border-black/[0.03] hover:bg-black/[0.005] transition-colors group">
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="text-xs font-medium text-black">{user.fullName}</div>
                                                <div className="text-[10px] text-black/30 mt-0.5">{user.email}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-xs text-black/60">{user.phone || '-'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs text-black/70 bg-black/[0.03] px-3 py-1 rounded-full">{user.service}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-xs text-black/60 flex items-center gap-1">
                                                <FiDollarSign size={10} />
                                                {user.budget || 'Not sure'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-xs text-black/60 flex items-center gap-1">
                                                <FiCalendar size={10} />
                                                {user.timeline || 'Flexible'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={user.status} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${user.isReviewed ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                                <FiCheckCircle size={12} />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-xs text-black/60">{user.assignedTo || '-'}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-xs text-black/60">
                                                {user.followUpDate ? new Date(user.followUpDate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) : '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => {
                                                        setEditingUser(user);
                                                        setFormData(user);
                                                        setIsEditModalOpen(true);
                                                    }}
                                                    className="p-2 bg-black/[0.02] border border-black/[0.06] rounded-lg text-black/40 hover:text-[#2563eb] hover:border-[#2563eb]/30 transition-all"
                                                >
                                                    <FiEdit2 size={12} />
                                                </button>
                                                <button
                                                    onClick={() => setSelectedUser(user)}
                                                    className="p-2 bg-black/[0.02] border border-black/[0.06] rounded-lg text-black/40 hover:text-green-600 hover:border-green-300 transition-all"
                                                >
                                                    <FiEye size={12} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>


                {totalPages > 1 && (
                    <div className="border-t border-black/[0.06] px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-[10px] text-black/40 uppercase tracking-widest">
                            Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, total)} of {total} users
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="p-2 bg-black/[0.02] border border-black/[0.06] rounded-lg text-black/20 hover:text-[#2563eb] hover:border-[#2563eb]/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                <FiChevronLeft size={14} />
                            </button>
                            <div className="flex items-center gap-1">
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    let pageNum;
                                    if (totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i;
                                    } else {
                                        pageNum = currentPage - 2 + i;
                                    }

                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => setCurrentPage(pageNum)}
                                            className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${currentPage === pageNum
                                                ? 'bg-[#2563eb] text-white'
                                                : 'text-black/40 hover:text-[#2563eb] hover:bg-black/[0.02]'}`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}
                            </div>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="p-2 bg-black/[0.02] border border-black/[0.06] rounded-lg text-black/20 hover:text-[#2563eb] hover:border-[#2563eb]/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                            >
                                <FiChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                )}
            </div>


            {selectedUser && (
                <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white border border-black/[0.06] rounded-[2rem] w-full w-full mx-4 max-h-[90vh] max-w-2xl overflow-y-auto">
                        <div className="flex justify-between items-center p-8 border-b border-black/[0.06]">
                            <div>
                                <h3 className="text-[13px] font-black uppercase tracking-[0.3em] text-black mb-1">USER DETAILS</h3>
                                <p className="text-[10px] text-black/40 uppercase tracking-widest">Complete user information</p>
                            </div>
                            <button
                                onClick={() => setSelectedUser(null)}
                                className="p-2 hover:bg-black/[0.02] rounded-xl text-black/20 hover:text-black/40 transition-colors"
                            >
                                <FiX size={20} />
                            </button>
                        </div>
                        <div className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[
                                    { icon: FiUser, label: 'Full Name', value: selectedUser.fullName },
                                    { icon: FiMail, label: 'Email', value: selectedUser.email },
                                    { icon: FiBriefcase, label: 'Service', value: selectedUser.service },
                                    { icon: FiPhone, label: 'Phone', value: selectedUser.phone || '-' },
                                    { icon: FiBriefcase, label: 'Company', value: selectedUser.company || '-' },
                                    { icon: FiDollarSign, label: 'Budget', value: selectedUser.budget || 'Not sure' },
                                    { icon: FiCalendar, label: 'Timeline', value: selectedUser.timeline || 'Flexible' },
                                    { icon: FiGlobe, label: 'Source', value: selectedUser.source || 'Website' },
                                    { icon: FiCheckCircle, label: 'Status', value: <StatusBadge status={selectedUser.status} /> },
                                    { icon: FiUsers, label: 'Assigned To', value: selectedUser.assignedTo || '-' },
                                    { icon: FiClock, label: 'Follow Up Date', value: selectedUser.followUpDate ? new Date(selectedUser.followUpDate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) : '-' },
                                ].map((field, idx) => (
                                    <div key={idx} className="p-4 bg-black/[0.01] border border-black/[0.04] rounded-xl">
                                        <div className="flex items-center gap-2 mb-2">
                                            <field.icon size={12} className="text-[#2563eb]" />
                                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-black/40">{field.label}</span>
                                        </div>
                                        <div className="text-xs text-black">{field.value}</div>
                                    </div>
                                ))}
                                {/* <div className="md:col-span-2 p-4 bg-black/[0.01] border border-black/[0.04] rounded-xl">
                                    <div className="flex items-center gap-2 mb-2">
                                        <FiFileText size={12} className="text-[#2563eb]" />
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-black/40">Project Details</span>
                                    </div>
                                    <div className="text-xs text-black whitespace-pre-wrap">{selectedUser.projectDetails}</div>
                                </div> */}
                                <div className="md:col-span-2 p-4 bg-black/[0.01] border border-black/[0.04] rounded-xl">
                                    <div className="flex items-center gap-2 mb-2">
                                        <FiMessageSquare size={12} className="text-[#2563eb]" />
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-black/40">Message</span>
                                    </div>
                                    <div className="text-xs text-black whitespace-pre-wrap">{selectedUser.message || '-'}</div>
                                </div>
                                <div className="md:col-span-2 p-4 bg-black/[0.01] border border-black/[0.04] rounded-xl">
                                    <div className="flex items-center gap-2 mb-2">
                                        <FiCalendar size={12} className="text-[#2563eb]" />
                                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-black/40">Submitted At</span>
                                    </div>
                                    <div className="text-xs text-black">{new Date(selectedUser.createdAt).toLocaleString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}


            {(isEditModalOpen || isAddModalOpen) && (
                <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white border border-black/[0.06] rounded-[2rem] w-full w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-8 border-b border-black/[0.06]">
                            <div>
                                <h3 className="text-[13px] font-black uppercase tracking-[0.3em] text-black mb-1">
                                    {isEditModalOpen ? 'EDIT USER' : 'ADD NEW USER'}
                                </h3>
                                <p className="text-[10px] text-black/40 uppercase tracking-widest">
                                    {isEditModalOpen ? 'Update user information' : 'Create new user record'}
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    if (isEditModalOpen) {
                                        setIsEditModalOpen(false);
                                        setEditingUser(null);
                                    } else {
                                        setIsAddModalOpen(false);
                                    }
                                    setFormData({});
                                }}
                                className="p-2 hover:bg-black/[0.02] rounded-xl text-black/20 hover:text-black/40 transition-colors"
                            >
                                <FiX size={20} />
                            </button>
                        </div>
                        <div className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <InputField
                                    label="Full Name"
                                    value={formData.fullName || ''}
                                    onChange={(v: string) => handleFormChange('fullName', v)}
                                    placeholder="John Doe"
                                />
                                <InputField
                                    label="Email"
                                    value={formData.email || ''}
                                    onChange={(v: string) => handleFormChange('email', v)}
                                    placeholder="john@example.com"
                                    type="email"
                                />
                                <InputField
                                    label="Service"
                                    value={formData.service || ''}
                                    onChange={(v: string) => handleFormChange('service', v)}
                                    placeholder="Select service"
                                    isSelect
                                    options={[
                                        { value: 'Web Development', label: 'Web Development' },
                                        { value: 'Mobile Apps', label: 'Mobile Apps' },
                                        { value: 'AI & Data', label: 'AI & Data' },
                                        { value: 'Cloud/DevOps', label: 'Cloud/DevOps' },
                                        { value: 'UI/UX Design', label: 'UI/UX Design' },
                                        { value: 'Consulting', label: 'Consulting' },
                                        { value: 'Other', label: 'Other' },
                                    ]}
                                />
                                <InputField
                                    label="Phone"
                                    type="number"
                                    value={formData.phone || ''}
                                    onChange={(v: string) => handleFormChange('phone', v)}
                                    placeholder="+91 1234567890"
                                />
                                <InputField
                                    label="Company"
                                    value={formData.company || ''}
                                    onChange={(v: string) => handleFormChange('company', v)}
                                    placeholder="Company name"
                                />
                                <InputField
                                    label="Budget"
                                    value={formData.budget || ''}
                                    onChange={(v: string) => handleFormChange('budget', v)}
                                    placeholder="Select budget range"

                                />
                                <InputField
                                    label="Timeline"
                                    value={formData.timeline || ''}
                                    onChange={(v: string) => handleFormChange('timeline', v)}
                                    placeholder="Select timeline"

                                />
                                <InputField
                                    label="Source"
                                    value={formData.source || ''}
                                    onChange={(v: string) => handleFormChange('source', v)}
                                    placeholder="Select source"
                                    isSelect
                                    options={[
                                        { value: 'Website', label: 'Website' },
                                        { value: 'Referral', label: 'Referral' },
                                        { value: 'Social Media', label: 'Social Media' },
                                        { value: 'Google Search', label: 'Google Search' },
                                        { value: 'Other', label: 'Other' },
                                    ]}
                                />
                                <InputField
                                    label="Status"
                                    value={formData.status || ''}
                                    onChange={(v: string) => handleFormChange('status', v)}
                                    placeholder="Select status"
                                    isSelect
                                    options={[
                                        { value: 'pending', label: 'Pending' },
                                        { value: 'contacted', label: 'Contacted' },
                                        { value: 'in_progress', label: 'In Progress' },
                                        { value: 'cancelled', label: 'Cancelled' },
                                        { value: 'completed', label: 'Completed' },
                                    ]}
                                />
                                <div className="p-4 bg-black/[0.01] border border-black/[0.04] rounded-xl">
                                    <label className="block text-[9px] font-black uppercase tracking-[0.2em] text-black/40 mb-3 ml-1">
                                        Is Reviewed
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <div className={`w-6 h-6 rounded-lg border border-black/[0.1] flex items-center justify-center ${formData.isReviewed ? 'bg-[#2563eb] border-[#2563eb]' : 'bg-white'}`}>
                                            {formData.isReviewed && <FiCheckCircle size={12} className="text-white" />}
                                        </div>
                                        <span className="text-xs text-black">Mark as reviewed</span>
                                        <input
                                            type="checkbox"
                                            checked={formData.isReviewed || false}
                                            onChange={(e) => handleFormChange('isReviewed', e.target.checked)}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                                <InputField
                                    label="Assigned To"
                                    value={formData.assignedTo || ''}
                                    onChange={(v: string) => handleFormChange('assignedTo', v)}
                                    placeholder="Team member name"
                                />
                                <InputField
                                    label="Follow Up Date"
                                    value={formData.followUpDate ? new Date(formData.followUpDate).toISOString().split('T')[0] : ''}
                                    onChange={(v: string) => handleFormChange('followUpDate', v)}
                                    placeholder="Select date"
                                    type="date"
                                />
                                <div className="md:col-span-2">
                                    <InputField
                                        label="Project Details"
                                        value={formData.projectDetails || ''}
                                        onChange={(v: string) => handleFormChange('projectDetails', v)}
                                        placeholder="Describe the project requirements..."
                                        isTextArea
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <InputField
                                        label="Internal Notes"
                                        value={formData.internalNotes || ''}
                                        onChange={(v: string) => handleFormChange('internalNotes', v)}
                                        placeholder="Add internal notes or comments..."
                                        isTextArea
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-8 pt-8 border-t border-black/[0.06]">
                                <button
                                    onClick={() => {
                                        if (isEditModalOpen) {
                                            setIsEditModalOpen(false);
                                            setEditingUser(null);
                                        } else {
                                            setIsAddModalOpen(false);
                                        }
                                        setFormData({});
                                    }}
                                    className="px-6 py-3 border border-black/[0.1] rounded-xl text-xs font-black uppercase tracking-widest text-black/40 hover:text-black/60 hover:border-black/20 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={isEditModalOpen ? handleSaveEdit : handleSaveAdd}
                                    className="px-6 py-3 bg-[#2563eb] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#7C4DF6] transition-all shadow-sm hover:shadow-md"
                                >
                                    {isEditModalOpen ? 'Save Changes' : 'Create User'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserContent;