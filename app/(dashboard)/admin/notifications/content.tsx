"use client";

import { getAuditLogs } from "@/services/auditService";
import {
    ChevronLeft,
    ChevronRight,
    Clock,
    Key,
    LogIn,
    LogOut,
    Search,
    Settings as SettingsIcon,
    ShieldAlert
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function NotificationContent() {
    const [logs, setLogs] = useState<any[]>([]);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
    const [isLoading, setIsLoading] = useState(true);

    const [search, setSearch] = useState('');
    const [actionFilter, setActionFilter] = useState('ALL');
    const [statusFilter, setStatusFilter] = useState('ALL');

    const fetchLogs = async (page: number, currentFilters?: any) => {
        setIsLoading(true);
        try {
            const filters = currentFilters || {
                search: search,
                action: actionFilter,
                success: statusFilter === 'ALL' ? undefined : statusFilter === 'SUCCESS'
            };
            const response = await getAuditLogs(page, 15, filters);
            if (response.success) {
                setLogs(response.data.logs);
                setPagination({
                    page: response.data.page || 1,
                    totalPages: response.data.totalPages || 1,
                    total: response.data.total || 0
                });
            }
        } catch (error) {
            console.error("Error fetching logs:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (search.trim() === '') {
            fetchLogs(1);
        }
    }, [actionFilter, statusFilter]);

    useEffect(() => {
        if (search.trim() === '') return;
        const timer = setTimeout(() => {
            fetchLogs(1);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    const handleFilterChange = (type: string, value: string) => {
        if (type === 'action') setActionFilter(value);
        if (type === 'status') setStatusFilter(value);
    };

    const getIcon = (action: string) => {
        if (action.includes('SECURITY') || action.includes('FAILED')) return <ShieldAlert size={20} className="text-red-500" />;
        if (action.includes('LOGIN')) return <LogIn size={20} className="text-blue-500" />;
        if (action.includes('LOGOUT')) return <LogOut size={20} className="text-black/40" />;
        if (action.includes('PASSWORD')) return <Key size={20} className="text-[#2563eb]" />;
        return <SettingsIcon size={20} className="text-black/40" />;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
        };
    };

    return (
        <div className="  animate-in fade-in slide-in-from-bottom-4 duration-500 bg-white rounded-xl border border-black/5 py-2 mt-2 overflow-hidden">
            <div className=" overflow-hidden min-h-[600px] flex flex-col">

                <div className="px-8 py-6 border-b border-black/5 bg-white flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative flex-1 w-full">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20" />
                        <input
                            type="text"
                            placeholder="Search by email, IP, or action..."
                            className="w-full pl-12 pr-4 py-3 bg-black/[0.02] border border-black/5 rounded-2xl text-xs font-bold placeholder:text-black/10 text-black outline-none focus:border-[#2563eb]/30 transition-all"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <select
                            className="flex-1 sm:flex-none px-4 py-3 bg-black/[0.02] border border-black/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-black/60 outline-none focus:border-[#2563eb]/30 transition-all appearance-none cursor-pointer"
                            value={actionFilter}
                            onChange={(e) => handleFilterChange('action', e.target.value)}
                        >
                            <option value="ALL">All Event Types</option>
                            <option value="LOGIN_SUCCESS">Login Success</option>
                            <option value="LOGIN_FAILED_INVALID_PASSWORD">Login Failed</option>
                            <option value="SECURITY_ALERT">Security Alerts</option>
                            <option value="PASSWORD_RESET_SUCCESS">Password Reset</option>
                            <option value="OTP_SENT">OTP Requests</option>
                        </select>
                        <select
                            className="flex-1 sm:flex-none px-4 py-3 bg-black/[0.02] border border-black/5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-black/60 outline-none focus:border-[#2563eb]/30 transition-all appearance-none cursor-pointer"
                            value={statusFilter}
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                        >
                            <option value="ALL">Any Status</option>
                            <option value="SUCCESS">Success Only</option>
                            <option value="FAILED">Failures Only</option>
                        </select>
                    </div>
                </div>


                <div className="px-8 py-6 bg-black/[0.02] border-b border-black/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-[#2563eb]/5 rounded-xl">
                            <Clock size={16} className="text-[#2563eb]" />
                        </div>
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-black">Live Activity Log</h3>
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-black/20 italic">
                        Real-time synchronization active
                    </div>
                </div>


                <div className="flex-1 overflow-x-auto">
                    {isLoading ? (
                        <div className="h-full flex items-center justify-center py-20">
                            <div className="w-10 h-10 border-4 border-[#2563eb] border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : logs.length > 0 ? (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-black/5 bg-black/[0.01]">
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-black/30">Event</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-black/30">Details</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-black/30">Origin</th>
                                    <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-black/30 text-right">Timestamp</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map((log) => {
                                    const { date, time } = formatDate(log.timestamp);
                                    return (
                                        <tr key={log._id} className="border-b border-black/[0.03] hover:bg-black/[0.01] transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="p-3 bg-black/[0.03] rounded-2xl group-hover:bg-white group-hover:shadow-sm transition-all">
                                                        {getIcon(log.action)}
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-black uppercase tracking-tight text-black italic leading-none mb-1">
                                                            {log.action.replace(/_/g, ' ')}
                                                        </p>
                                                        <span className={`text-[9px] font-black uppercase tracking-tighter ${log.success ? 'text-emerald-500' : 'text-red-500'}`}>
                                                            {log.success ? 'Action Successful' : 'Action Failed'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="max-w-xs xl:max-w-md">
                                                    <p className="text-xs text-black/60 font-medium leading-relaxed truncate">
                                                        {log.details?.email || log.details?.error || 'System operation executed'}
                                                    </p>
                                                    <p className="text-[10px] text-black/20 font-bold uppercase tracking-tighter truncate">
                                                        UID: {log.adminId || 'ANONYMOUS'}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black uppercase text-black italic">{log.ip}</span>
                                                    <span className="text-[9px] text-black/20 font-medium uppercase truncate max-w-[150px]">{log.userAgent}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex flex-col items-end">
                                                    <span className="text-[10px] font-black uppercase text-black leading-none mb-1">{time}</span>
                                                    <span className="text-[9px] text-black/30 font-bold uppercase tracking-tighter">{date}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center py-20 opacity-20">
                            <ShieldAlert size={48} className="mb-4" />
                            <p className="text-sm font-black uppercase tracking-widest italic">No activity logs recorded</p>
                        </div>
                    )}
                </div>


                <div className="px-8 py-6 bg-black/[0.02] border-t border-black/5 flex items-center justify-between">
                    <p className="text-[10px] font-black uppercase tracking-widest text-black/30">
                        Showing {logs.length} of {pagination.total} activities
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            disabled={pagination.page === 1}
                            onClick={() => fetchLogs(pagination.page - 1)}
                            className="p-2.5 rounded-xl border border-black/5 bg-white text-black hover:bg-[#2563eb] hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-black transition-all shadow-sm"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <div className="flex items-center gap-1 px-4">
                            <span className="text-xs font-black text-[#2563eb] italic">{pagination.page}</span>
                            <span className="text-[10px] font-black uppercase tracking-tighter text-black/20">of {pagination.totalPages}</span>
                        </div>
                        <button
                            disabled={pagination.page === pagination.totalPages}
                            onClick={() => fetchLogs(pagination.page + 1)}
                            className="p-2.5 rounded-xl border border-black/5 bg-white text-black hover:bg-[#2563eb] hover:text-white disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-black transition-all shadow-sm"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
