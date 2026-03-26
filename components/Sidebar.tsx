"use client";

import { routes, Route } from '@/lib/routes';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FiArrowUpRight, FiPower, FiChevronDown } from 'react-icons/fi';
import { logout } from '@/services/authService';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [openMenus, setOpenMenus] = useState<string[]>([]);

    useEffect(() => {
        // Auto-expand menus if a child is active
        const newOpenMenus = routes
            .filter(route => route.subItems?.some(sub => pathname.startsWith(sub.path)))
            .map(route => route.label);

        if (newOpenMenus.length > 0) {
            setOpenMenus(prev => Array.from(new Set([...prev, ...newOpenMenus])));
        }
    }, [pathname]);

    const handleSignOut = async () => {
        await logout();
        router.push('/login');
    };

    const handleLinkClick = () => {
        if (typeof window !== 'undefined' && window.innerWidth < 640) {
            onClose();
        }
    };

    const toggleMenu = (label: string) => {
        setOpenMenus(prev =>
            prev.includes(label)
                ? prev.filter(m => m !== label)
                : [...prev, label]
        );
    };

    return (
        <aside
            className={`fixed left-0 top-0 z-50 h-screen w-64 bg-white border-r border-black/[0.08] transition-all duration-300 ease-in-out transform
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
            <div className="flex flex-col h-full">
                <div className="px-4 py-6 shrink-0">
                    <Link href="/admin" onClick={handleLinkClick} className="group block">
                        <h1 className="text-3xl font-black tracking-tighter text-black uppercase italic leading-none">
                            TIMBERLAKE<span className="text-[#2563eb]">.</span>
                        </h1>
                    </Link>
                </div>

                <nav className="flex-1 px-4 pr-2 mt-6 overflow-y-auto scrollbar-thin scrollbar-thumb-black/10 scrollbar-track-transparent scroll-visible">
                    <ul className="space-y-6">
                        {routes.map((route) => {
                            const Icon = route.icon;
                            const hasSubItems = route.subItems && route.subItems.length > 0;
                            const isMenuOpen = openMenus.includes(route.label);

                            const isParentActive = hasSubItems && route.subItems?.some(sub =>
                                pathname === sub.path || pathname.startsWith(sub.path)
                            );

                            const isActive = !hasSubItems && (
                                route.path === '/admin'
                                    ? pathname === '/admin'
                                    : pathname.startsWith(route.path)
                            );

                            return (
                                <li key={route.label} className='mb-1'>
                                    {hasSubItems ? (
                                        <div className={`space-y-4 p-4 rounded-2xl transition-all duration-300 ${isMenuOpen || isParentActive ? 'bg-black/5 border border-black/5' : 'bg-black/1 border border-transparent'}`}>
                                            <button
                                                onClick={() => toggleMenu(route.label)}
                                                className={`w-full flex items-center justify-between group transition-all duration-300 cursor-pointer ${isParentActive ? 'text-[#2563eb]' : 'text-black/80 hover:text-black'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <Icon size={18} className={`${isParentActive ? 'text-[#2563eb]' : 'text-black/50 group-hover:text-[#2563eb] transition-colors'}`} />
                                                    <span className="text-xs font-black uppercase tracking-[0.2em]">
                                                        {route.label}
                                                    </span>
                                                </div>
                                                <FiChevronDown
                                                    size={14}
                                                    className={`transition-transform duration-300 ${isMenuOpen ? 'rotate-180' : ''}`}
                                                />
                                            </button>

                                            <AnimatePresence>
                                                {isMenuOpen && (
                                                    <motion.ul
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                                                        className="overflow-hidden pl-8 space-y-4"
                                                    >
                                                        {route.subItems?.map((sub) => {
                                                            const isSubActive = pathname === sub.path || pathname.startsWith(sub.path);
                                                            return (
                                                                <li key={sub.path}>
                                                                    <Link
                                                                        href={sub.path}
                                                                        onClick={handleLinkClick}
                                                                        className={`flex items-center justify-between group transition-all duration-300 ${isSubActive ? 'text-[#2563eb]' : 'text-black/80 hover:text-black'
                                                                            }`}
                                                                    >
                                                                        <span className="text-[12px] font-bold uppercase tracking-[0.15em]">
                                                                            {sub.label}
                                                                        </span>
                                                                        {isSubActive && (
                                                                            <div className="w-1 h-2 bg-[#2563eb]/60" />
                                                                        )}
                                                                    </Link>
                                                                </li>
                                                            );
                                                        })}
                                                    </motion.ul>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ) : (
                                        <Link
                                            href={route.path}
                                            onClick={handleLinkClick}
                                            className={`flex items-center justify-between group transition-all duration-300 px-4 py-2 ${isActive ? 'text-[#2563eb]' : 'text-black/80 hover:text-black'
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <Icon size={18} className={`${isActive ? 'text-[#2563eb]' : 'text-black/60 group-hover:text-[#2563eb] transition-colors'}`} />
                                                <span className="text-[12px] font-black uppercase tracking-[0.2em]">
                                                    {route.label}
                                                </span>
                                            </div>

                                            {isActive ? (
                                                <div className="w-1 h-3 bg-[#2563eb] shadow-[0_0_12px_rgba(139,92,246,0.3)]" />
                                            ) : (
                                                <FiArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-black/10" />
                                            )}
                                        </Link>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div className="p-8 mt-auto border-t border-black/8 bg-black/1 shrink-0">
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-4 text-black/30 hover:text-red-500 transition-all text-[11px] font-black uppercase tracking-[0.2em] group w-full text-left"
                    >
                        <div className="p-2 border border-black/5 rounded-lg group-hover:border-red-500/20 transition-colors">
                            <FiPower size={16} className="group-hover:rotate-90 transition-transform duration-500" />
                        </div>
                        Sign_Out
                    </button>
                </div>
            </div>
        </aside>
    );
}
