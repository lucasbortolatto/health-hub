
'use client';

import React from 'react';
import { TrendingUp, Timer, Dumbbell, Zap, ChevronRight, History } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function DashboardPage() {
  return (
    <div className="p-6 md:p-10 space-y-8 animate-in fade-in duration-500">
      {/* Welcome Header */}
      <header>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Evolução Hoje</h1>
        <p className="text-slate-500 text-sm font-medium">Sua jornada de alta performance continua aqui.</p>
      </header>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <Card className="flex flex-col gap-4 border-none shadow-sm bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-6">
          <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center">
            <TrendingUp size={20} className="text-blue-100" />
          </div>
          <div>
            <p className="text-3xl font-black tracking-tighter">128kg</p>
            <p className="text-[10px] text-blue-100/70 uppercase font-black tracking-[0.15em] mt-1">Recorde: Supino Reto</p>
          </div>
        </Card>

        <Card className="flex flex-col gap-4 border-none shadow-sm bg-white p-6 group cursor-pointer hover:shadow-md transition-all">
          <div className="h-10 w-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-100 transition-colors">
            <Timer size={20} />
          </div>
          <div>
            <p className="text-3xl font-black tracking-tighter text-slate-900">48m</p>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-[0.15em] mt-1">Última Sessão</p>
          </div>
        </Card>

        <Card className="hidden lg:flex flex-col gap-4 border-none shadow-sm bg-white p-6">
          <div className="h-10 w-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
            <History size={20} />
          </div>
          <div>
            <p className="text-3xl font-black tracking-tighter text-slate-900">04</p>
            <p className="text-[10px] text-slate-400 uppercase font-bold tracking-[0.15em] mt-1">Treinos / Semana</p>
          </div>
        </Card>
      </section>

      {/* Suggestion & History section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <Card padding="none" className="relative overflow-hidden bg-slate-900 text-white border-0 shadow-2xl rounded-[2.5rem] h-full min-h-[280px] flex flex-col justify-end">
            <div className="absolute -right-10 -top-10 opacity-10 rotate-12">
              <Dumbbell size={240} />
            </div>
            
            <div className="p-8 space-y-4 relative z-10">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-3">
                  <Zap size={12} className="fill-current" /> Sugestão do Dia
                </div>
                <h3 className="text-3xl font-black">Superior A</h3>
                <p className="text-slate-400 text-base font-medium mt-1">Foco em Peitorais e Deltóides • 8 Exercícios</p>
              </div>
              
              <Button variant="primary" className="w-full py-6 text-lg font-bold bg-blue-600 hover:bg-blue-500 border-none shadow-xl shadow-blue-900/40 rounded-2xl group" size="lg">
                Iniciar Agora
                <ChevronRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2 flex flex-col gap-5">
           <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">Recentes</h4>
           {[1, 2, 3].map(i => (
             <Card key={i} padding="sm" className="flex items-center gap-4 hover:border-blue-200 transition-all cursor-pointer">
                <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                  <Dumbbell size={18} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-900">Treino Inferior B</p>
                  <p className="text-[10px] text-slate-400 font-medium">Ontem às 18:30</p>
                </div>
                <ChevronRight size={16} className="text-slate-300" />
             </Card>
           ))}
        </div>
      </div>
    </div>
  );
}
