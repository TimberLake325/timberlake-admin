"use client";

import { usePathname } from 'next/navigation';
import { User, Bell, Search, Menu } from 'lucide-react';
import { routes } from '@/lib/routes';
import Link from 'next/link';
import { useState, useEffect, useCallback } from 'react';
import { getSession } from "@/services/authService";
import SearchModal from './dashboard/SearchModal';
import NotificationPanel from './dashboard/NotificationPanel';

interface TopbarProps {
    onToggle: () => void;
    onSearchClick: () => void;
    pageTitle: string;
    isSidebarOpen: boolean;
}

export default function Topbar({ onToggle, onSearchClick, pageTitle, isSidebarOpen }: TopbarProps) {
    const pathname = usePathname();

    const currentRoute = routes.find(r =>
        r.path === '/' ? pathname === '/admin' : pathname.startsWith(r.path)
    );

    const title = currentRoute ? currentRoute.label : pageTitle;

    const [user, setUser] = useState<{ name: string; email: string } | null>(null);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [unreadNotifications, setUnreadNotifications] = useState(0);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const session = await getSession();
                if (session) {
                    setUser({
                        name: (session.name as string) || 'Admin',
                        email: (session.email as string) || ''
                    });
                }
            } catch (e) {
                console.error("Failed to fetch user in topbar", e);
            }
        };
        fetchUser();
    }, []);

    const toggleNotifications = useCallback(() => {
        setIsNotificationOpen(prev => !prev);
    }, []);

    return (
        <nav className={`fixed top-0 right-0 z-30 transition-all duration-300 bg-white/90 backdrop-blur-xl border-b border-black/5 ${isSidebarOpen ? 'w-full sm:w-[calc(100%-16rem)]' : 'w-full'}`}>
            <div className="px-6 py-4 lg:px-10">
                <div className="flex items-center justify-between">


                    <div className="flex items-center gap-4">
                        <button
                            onClick={onToggle}
                            className="p-2 pl-0 text-black/40 hover:text-black transition-colors"
                            aria-label="Toggle Sidebar"
                        >
                            <Menu size={20} strokeWidth={3} />
                        </button>

                        <div className="h-4 w-[2px] bg-[#2563eb]" />
                        <h1 className="text-sm font-black tracking-[0.2em] text-black uppercase italic">
                            {title}<span className="text-[#2563eb]">_</span>
                        </h1>
                    </div>


                    <div className="flex items-center gap-8">

                        <div className="hidden md:flex items-center gap-6 border-r border-black/5 pr-8 relative">
                            <button
                                onClick={onSearchClick}
                                className="text-black/30 hover:text-[#2563eb] transition-colors flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-1 bg-gray-50/70"
                                title="Search (Ctrl+K)"
                            >
                                <span className='text-xs'>
                                    crt + k
                                </span>
                                <Search size={18} strokeWidth={2} />
                            </button>

                            <div className="relative">
                                <button
                                    onClick={toggleNotifications}
                                    className={`transition-colors border border-gray-200 rounded-lg p-1 bg-gray-50/70 relative ${isNotificationOpen ? 'text-[#2563eb]' : 'text-black/30 hover:text-[#2563eb]'}`}
                                >
                                    <Bell size={18} strokeWidth={3} />
                                    {unreadNotifications > 0 && (
                                        <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-[#2563eb] rounded-full shadow-[0_0_8px_rgba(139,92,246,0.5)]" />
                                    )}
                                </button>

                                <NotificationPanel
                                    isOpen={isNotificationOpen}
                                    onClose={() => setIsNotificationOpen(false)}
                                    onUnreadChange={setUnreadNotifications}
                                />
                            </div>
                        </div>


                        <Link href="/admin/settings" className="flex items-center gap-4 group cursor-pointer">
                            <div className="text-right hidden sm:block">
                                <p className="text-[10px] font-black uppercase tracking-widest text-black leading-none mb-1">
                                    {user ? user.name : 'Loading...'}
                                </p>
                                <p className="text-[9px] text-[#2563eb] font-black uppercase tracking-tighter opacity-80">
                                    {user ? user.email : '...'}
                                </p>
                            </div>

                            <div className="relative w-9 h-9 flex items-center justify-center bg-black/[0.03] border border-black/10 group-hover:border-[#2563eb]/50 transition-all rounded-lg">
                                <User size={18} className="text-black/40 group-hover:text-[#2563eb] transition-colors" />

                                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}