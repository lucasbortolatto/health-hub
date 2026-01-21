'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Library, Home, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Biblioteca', href: '/library', icon: Library },
    { name: 'Meus Treinos', href: '/workouts', icon: Activity },
  ];

  return (
    <aside className="w-full md:w-64 bg-slate-900 text-white flex flex-col border-r border-slate-800">
      <div className="p-6">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <Activity size={20} className="text-white" />
          </div>
          <span className="font-black text-xl tracking-tight">MyHealth</span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}
            >
              <item.icon size={20} className={cn(
                "transition-colors",
                isActive ? "text-white" : "text-slate-500 group-hover:text-blue-400"
              )} />
              <span className="font-semibold text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-slate-800">
        <div className="bg-slate-800/50 rounded-2xl p-4">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Versão</p>
          <p className="text-xs font-medium text-slate-300">1.0.0 - Alpha</p>
        </div>
      </div>
    </aside>
  );
}