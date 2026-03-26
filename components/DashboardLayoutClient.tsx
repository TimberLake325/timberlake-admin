"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import SearchModal from "@/components/dashboard/SearchModal";
import { SecurityMonitor } from "@/hooks/useSecuritySession";
import { useEffect } from "react";

interface DashboardLayoutClientProps {
    children: React.ReactNode;
    pageTitle: string;
}

export default function DashboardLayoutClient({ children, pageTitle }: DashboardLayoutClientProps) {

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setIsSearchOpen(true);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="min-h-screen bg-[#fcfcfc]">

            <SecurityMonitor />


            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm sm:hidden transition-opacity duration-300"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}


            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <Topbar
                onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                onSearchClick={() => setIsSearchOpen(true)}
                pageTitle={pageTitle}
                isSidebarOpen={isSidebarOpen}
            />

            <SearchModal
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
            />


            <main className={`transition-all duration-300 ease-in-out pt-20 min-h-screen overflow-x-hidden ${isSidebarOpen ? 'sm:ml-64' : 'ml-0'}`}>
                <div className="max-w-[1600px] mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
