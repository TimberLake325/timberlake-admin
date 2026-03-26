import React, { useState, useEffect, useRef } from 'react';
import { Bell, Trash2, ShieldAlert, LogIn, LogOut, Key, Settings as SettingsIcon, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { getRecentAuditLogs } from '@/services/auditService';

interface Notification {
    id: string;
    type: 'security' | 'user' | 'system';
    title: string;
    message: string;
    time: string;
    isRead: boolean;
}

interface NotificationPanelProps {
    isOpen: boolean;
    onClose: () => void;
    onUnreadChange: (count: number) => void;
}

export default function NotificationPanel({ isOpen, onClose, onUnreadChange }: NotificationPanelProps) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            const fetchLogs = async () => {
                setIsLoading(true);
                try {
                    const response = await getRecentAuditLogs(5);
                    if (response.success) {
                        const mapped: Notification[] = response.data.map((log: any) => ({
                            id: log._id,
                            type: log.action.includes('SECURITY') || log.action.includes('FAILED') ? 'security' : 'system',
                            title: log.action.replace(/_/g, ' '),
                            message: `${log.details?.email || 'System'} - ${log.success ? 'Success' : 'Failed'}`,
                            time: new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            isRead: false
                        }));
                        setNotifications(mapped);
                    }
                } catch (e) {
                    console.error("Failed to fetch recent logs", e);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchLogs();
        }
    }, [isOpen]);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    useEffect(() => {
        onUnreadChange(unreadCount);
    }, [unreadCount, onUnreadChange]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
                onClose();
            }
        }
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    };

    const deleteNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const markAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    };

    if (!isOpen) return null;

    return (
        <div
            ref={panelRef}
            className="absolute top-16 right-0 w-full sm:w-96 bg-white rounded-3xl shadow-2xl border border-black/5 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300 z-50 mt-2"
        >

            <div className="px-6 py-5 bg-black/[0.02] border-b border-black/5 flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-black">Alerts<span className="text-[#2563eb]">_</span></h3>
                    <p className="text-[10px] font-medium text-black/30 uppercase tracking-tighter">You have {unreadCount} new notifications</p>
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={markAllRead}
                        className="text-[10px] font-black uppercase tracking-widest text-[#2563eb] hover:bg-[#2563eb]/10 px-3 py-1.5 rounded-lg transition-all"
                    >
                        Mark All Read
                    </button>
                )}
            </div>


            <div className="max-h-[400px] overflow-y-auto p-4 space-y-2 custom-scrollbar">
                {isLoading ? (
                    <div className="py-12 flex justify-center">
                        <div className="w-6 h-6 border-2 border-[#2563eb] border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : notifications.length > 0 ? (
                    notifications.map((notif) => (
                        <div
                            key={notif.id}
                            onClick={() => markAsRead(notif.id)}
                            className={`p-4 rounded-2xl transition-all cursor-pointer relative group ${notif.isRead ? 'bg-transparent' : 'bg-[#2563eb]/[0.03] border-l-4 border-[#2563eb]'}`}
                        >
                            {!notif.isRead && (
                                <div className="absolute top-4 right-4 w-2 h-2 bg-[#2563eb] rounded-full animate-pulse" />
                            )}

                            <div className="flex gap-4">
                                <div className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center ${notif.type === 'security' ? 'bg-red-50 text-red-500' :
                                    notif.type === 'user' ? 'bg-blue-50 text-blue-500' :
                                        'bg-black/5 text-black/40'
                                    }`}>
                                    {notif.type === 'security' && <ShieldAlert size={18} />}
                                    {notif.title.includes('LOGIN') && <LogIn size={18} />}
                                    {notif.title.includes('LOGOUT') && <LogOut size={18} />}
                                    {notif.title.includes('PASSWORD') && <Key size={18} />}
                                    {!notif.type && <SettingsIcon size={18} />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-0.5">
                                        <h4 className="text-[10px] font-black uppercase tracking-tight text-black truncate pr-4 italic">{notif.title}</h4>
                                        <span className="text-[9px] font-medium text-black/30 uppercase tracking-tighter whitespace-nowrap">{notif.time}</span>
                                    </div>
                                    <p className="text-[11px] text-black/50 leading-relaxed truncate">{notif.message}</p>
                                </div>
                            </div>

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    deleteNotification(notif.id);
                                }}
                                className="absolute bottom-2 right-2 p-2 text-black/10 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all border border-black/5 rounded-lg bg-white shadow-sm"
                                title="Dismiss (Local only)"
                            >
                                <Trash2 size={12} />
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="py-12 text-center">
                        <div className="w-16 h-16 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Bell size={24} className="text-black/10" />
                        </div>
                        <p className="text-sm font-black uppercase tracking-widest text-black/20 italic">No alerts found</p>
                    </div>
                )}
            </div>


            <div className="p-4 border-t border-black/5">
                <Link
                    href="/admin/notifications"
                    onClick={onClose}
                    className="w-full py-3 rounded-xl bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#2563eb] transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-2 group"
                >
                    View All Notifications
                    <ExternalLink size={12} className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </div>
    );
}
