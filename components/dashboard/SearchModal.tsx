"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, User, FileText, Settings, ArrowRight, RotateCcw, Hash, LayoutGrid, Loader2 } from 'lucide-react';
import { routes } from '@/lib/routes';
import { searchDashboard, SearchResult } from '@/services/searchService';

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const [query, setQuery] = useState('');
    const [dbResults, setDbResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [recentSearches, setRecentSearches] = useState<SearchResult[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const stored = localStorage.getItem('TIMBERLAKE_recent_searches');
        if (stored) setRecentSearches(JSON.parse(stored));
    }, []);

    const routeResults = useMemo(() => {
        return routes.map(r => ({
            id: `route-${r.path}`,
            type: 'route' as const,
            title: r.label,
            subtitle: `Navigation: ${r.path}`,
            link: r.path,
            category: 'Pages' as const
        }));
    }, []);

    useEffect(() => {
        if (!query.trim()) {
            setDbResults([]);
            setIsLoading(false);
            return;
        }

        const timer = setTimeout(async () => {
            setIsLoading(true);
            try {
                const results = await searchDashboard(query);
                setDbResults(results);
            } catch (error) {
                console.error("Search fetch error:", error);
            } finally {
                setIsLoading(false);
            }
        }, 2000);

        return () => clearTimeout(timer);
    }, [query]);

    const filteredResults = useMemo(() => {
        if (!query.trim()) return [];

        const matchingRoutes = routeResults.filter(r =>
            r.title.toLowerCase().includes(query.toLowerCase())
        );

        return [...matchingRoutes, ...dbResults].slice(0, 10);
    }, [query, routeResults, dbResults]);

    const groupedResults = useMemo(() => {
        const groups: Record<string, SearchResult[]> = {};
        filteredResults.forEach(item => {
            if (!groups[item.category]) groups[item.category] = [];
            groups[item.category].push(item);
        });
        return groups;
    }, [filteredResults]);

    const displayList = useMemo(() => {
        if (!query.trim()) return recentSearches;
        return filteredResults;
    }, [query, filteredResults, recentSearches]);

    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setSelectedIndex(0);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    const handleSelect = (result: SearchResult) => {
        const updatedRecent = [result, ...recentSearches.filter(r => r.id !== result.id)].slice(0, 5);
        setRecentSearches(updatedRecent);
        localStorage.setItem('TIMBERLAKE_recent_searches', JSON.stringify(updatedRecent));
        window.location.href = result.link;
        onClose();
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex(prev => (prev + 1) % Math.max(1, displayList.length));
            }
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex(prev => (prev - 1 + displayList.length) % Math.max(1, displayList.length));
            }
            if (e.key === 'Enter' && displayList[selectedIndex]) {
                handleSelect(displayList[selectedIndex]);
            }
        };

        if (isOpen) window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose, displayList, selectedIndex]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4 backdrop-blur-md bg-black/40 animate-in fade-in duration-300">
            <div
                className="bg-white w-full max-w-2xl rounded-[2.5rem] overflow-hidden shadow-2xl border border-black/5 animate-in slide-in-from-top-4 duration-300 flex flex-col"
                onClick={e => e.stopPropagation()}
            >

                <div className="flex items-center gap-5 px-8 py-6 border-b border-black/5">
                    <div className="p-3 bg-[#2563eb]/5 rounded-2xl">
                        {isLoading ? (
                            <Loader2 size={24} className="text-[#2563eb] animate-spin" strokeWidth={3} />
                        ) : (
                            <Search size={24} className="text-[#2563eb]" strokeWidth={3} />
                        )}
                    </div>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search users, posts, pages..."
                        className="flex-1 bg-transparent outline-none text-xl font-black placeholder:text-black/10 text-black italic tracking-tight"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                    />
                    <div className="flex items-center gap-3">
                        <kbd className="hidden sm:flex px-2.5 py-1.5 bg-black/5 border border-black/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-black/30 shadow-sm transition-all hover:bg-black/10">Esc</kbd>
                        <button onClick={onClose} className="p-2 text-black/20 hover:text-black transition-colors rounded-xl hover:bg-black/5">
                            <X size={20} />
                        </button>
                    </div>
                </div>


                <div className="max-h-[60vh] overflow-y-auto p-6 custom-scrollbar space-y-8">
                    {query.trim() === '' ? (
                        <>
                            {recentSearches.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2 mb-4 px-2">
                                        <RotateCcw size={14} className="text-[#2563eb]" />
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-black/30">Recent Searches</h3>
                                    </div>
                                    <div className="space-y-1">
                                        {recentSearches.map((result, idx) => (
                                            <ResultItem
                                                key={result.id}
                                                result={result}
                                                isSelected={idx === selectedIndex}
                                                onSelect={() => handleSelect(result)}
                                                onMouseEnter={() => setSelectedIndex(idx)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div className="grid grid-cols-2 gap-3 pb-2">
                                <QuickAction icon={<LayoutGrid size={18} />} label="Overview" link="/admin/dashboard" />
                                <QuickAction icon={<User size={18} />} label="My Profile" link="/admin/settings" />
                                <QuickAction icon={<Settings size={18} />} label="SMTP Settings" link="/admin/smtp-config" />
                                <QuickAction icon={<FileText size={18} />} label="Blog Content" link="/admin/blog" />
                            </div>
                        </>
                    ) : (
                        Object.entries(groupedResults).length > 0 ? (
                            Object.entries(groupedResults).map(([category, items]) => (
                                <div key={category}>
                                    <div className="flex items-center gap-2 mb-4 px-2">
                                        <Hash size={14} className="text-[#2563eb]" />
                                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-black/30">{category}</h3>
                                    </div>
                                    <div className="space-y-1">
                                        {items.map((result) => {
                                            const globalIdx = displayList.findIndex(r => r.id === result.id);
                                            return (
                                                <ResultItem
                                                    key={result.id}
                                                    result={result}
                                                    isSelected={globalIdx === selectedIndex}
                                                    onSelect={() => handleSelect(result)}
                                                    onMouseEnter={() => setSelectedIndex(globalIdx)}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            ))
                        ) : (
                            !isLoading && (
                                <div className="py-16 text-center">
                                    <div className="w-20 h-20 bg-black/5 rounded-[2rem] flex items-center justify-center mx-auto mb-6 rotate-12 transition-transform hover:rotate-0">
                                        <Search size={32} className="text-black/10" />
                                    </div>
                                    <h4 className="text-lg font-black uppercase italic tracking-tight text-black mb-1">No Matches Found</h4>
                                    <p className="text-xs font-medium uppercase tracking-widest text-black/20">Try refining your search query</p>
                                </div>
                            )
                        )
                    )}
                </div>


                <div className="px-8 py-5 bg-black/[0.02] border-t border-black/5 flex items-center justify-between">
                    <div className="hidden sm:flex items-center gap-8">
                        <div className="flex items-center gap-2.5">
                            <kbd className="px-2.5 py-1.5 bg-white border border-black/10 rounded-xl text-[10px] font-black shadow-sm">↓↑</kbd>
                            <span className="text-[10px] font-black uppercase tracking-tighter text-black/30 italic">Navigate</span>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <kbd className="px-2.5 py-1.5 bg-white border border-black/10 rounded-xl text-[10px] font-black shadow-sm">↵</kbd>
                            <span className="text-[10px] font-black uppercase tracking-tighter text-black/30 italic">Select</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-black text-[#2563eb] italic uppercase tracking-widest">
                        Timberlake <span className="text-black">Vault</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ResultItem({ result, isSelected, onSelect, onMouseEnter }: {
    result: SearchResult;
    isSelected: boolean;
    onSelect: () => void;
    onMouseEnter: () => void;
}) {
    return (
        <button
            onClick={onSelect}
            onMouseEnter={onMouseEnter}
            className={`w-full flex items-center justify-between p-4 rounded-3xl transition-all group text-left ${isSelected ? 'bg-[#2563eb]/5 border-l-4 border-[#2563eb]' : 'hover:bg-black/5 border-l-4 border-transparent'}`}
        >
            <div className="flex items-center gap-5">
                <div className={`p-3.5 rounded-2xl transition-all shadow-sm ${isSelected ? 'bg-white text-[#2563eb] ring-1 ring-[#2563eb]/10' : 'bg-black/5 text-black/30'}`}>
                    {result.type === 'user' && <User size={20} />}
                    {result.type === 'post' && <FileText size={20} />}
                    {result.type === 'route' && <LayoutGrid size={20} />}
                    {result.type === 'settings' && <Settings size={20} />}
                    {result.type === 'page' && <FileText size={20} />}
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-black uppercase tracking-wide text-black mb-0.5 truncate">{result.title}</h4>
                    <p className="text-[10px] font-medium text-black/40 uppercase tracking-tighter italic leading-none truncate">{result.subtitle}</p>
                </div>
            </div>
            <ArrowRight size={18} className={`transition-all duration-300 ${isSelected ? 'translate-x-0 opacity-100' : '-translate-x-4 opacity-0'} text-[#2563eb]`} />
        </button>
    );
}

function QuickAction({ icon, label, link }: { icon: React.ReactNode, label: string, link: string }) {
    return (
        <a
            href={link}
            className="flex items-center gap-3 p-3.5 bg-[#2563eb]/[0.03] border border-[#2563eb]/5 rounded-2xl transition-all hover:bg-[#2563eb]/10 group"
        >
            <div className="text-[#2563eb] transition-transform group-hover:scale-110">
                {icon}
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-black/60 pt-0.5">{label}</span>
        </a>
    );
}
