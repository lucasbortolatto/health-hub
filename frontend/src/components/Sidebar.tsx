'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Dumbbell, ClipboardList, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  const pathname = usePathname();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', href: '/', icon: Home },
    { id: 'exercises', label: 'Exercícios', href: '/exercises', icon: Dumbbell },
    { id: 'workouts', label: 'Meus Treinos', href: '/workouts', icon: ClipboardList },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white fixed h-full left-0 top-0 z-40 border-r border-slate-800 p-6">
        <div className="mb-10 px-2">
          <h1 className="text-xl font-black bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            MyHealthHub
          </h1>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Padrão Ouro</p>
        </div>

        <nav className="space-y-2 flex-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group w-full",
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                )}
              >
                <item.icon size={20} className={cn("transition-transform group-active:scale-90", isActive ? "" : "opacity-70")} />
                <span className="text-sm font-bold tracking-tight">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="pt-6 border-t border-slate-800">
          <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all w-full">
            <User size={20} />
            <span className="text-sm font-bold">Perfil</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-100 flex justify-around p-3 z-50 rounded-t-[2rem] shadow-[0_-8px_30px_rgba(0,0,0,0.05)] px-6">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 transition-all duration-300",
                isActive ? "text-blue-600 scale-110" : "text-slate-400"
              )}
            >
              <div className={cn(
                "p-2 rounded-xl transition-colors",
                isActive ? "bg-blue-50" : ""
              )}>
                <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className="text-[9px] font-black uppercase tracking-tighter">{item.label.split(' ')[0]}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
};

export default Sidebar;