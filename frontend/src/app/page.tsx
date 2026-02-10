'use client';

import React from 'react';
import { TrendingUp, Clock, Calendar, Zap, ChevronRight, Dumbbell } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function DashboardPage() {
  const recentWorkouts = [
    { id: 1, name: 'Treino Inferior B', time: 'Ontem às 18:30' },
    { id: 2, name: 'Treino Inferior B', time: 'Ontem às 18:30' },
    { id: 3, name: 'Treino Inferior B', time: 'Ontem às 18:30' },
  ];

  return (
    <div className="p-6 md:p-10 space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-black text-slate-900">Evolução Hoje</h1>
        <p className="text-slate-500 text-sm font-medium">Sua jornada de alta performance continua aqui.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-indigo-600 to-blue-700 text-white p-6 border-none shadow-xl shadow-blue-200">
          <TrendingUp size={24} className="text-blue-200 mb-4" />
          <h2 className="text-4xl font-black mb-1">128kg</h2>
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">Recorde: Supino Reto</p>
        </Card>

        <Card className="flex flex-col justify-center items-center p-6 bg-white border-slate-100">
          <div className="bg-green-50 p-2 rounded-full mb-3">
            <Clock size={24} className="text-green-600" />
          </div>
          <h2 className="text-3xl font-black text-slate-900">48m</h2>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Última Sessão</p>
        </Card>

        <Card className="flex flex-col justify-center items-center p-6 bg-white border-slate-100">
          <div className="bg-orange-50 p-2 rounded-full mb-3">
            <Calendar size={24} className="text-orange-600" />
          </div>
          <h2 className="text-3xl font-black text-slate-900">04</h2>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Treinos / Semana</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sugestão do Dia */}
        <Card className="bg-slate-900 text-white p-8 relative overflow-hidden rounded-[2.5rem] border-none">
          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
              <Zap size={12} fill="currentColor" /> Sugestão do Dia
            </div>
            <div>
              <h3 className="text-5xl font-black mb-2">Superior A</h3>
              <p className="text-slate-400 font-medium">Foco em Peitorais e Deltóides • 8 Exercícios</p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-500 text-white rounded-2xl h-14 px-8 font-black text-lg group">
              Iniciar Agora <ChevronRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
          {/* Background Icon Decor */}
          <Dumbbell size={200} className="absolute -right-10 -bottom-10 text-white/5 rotate-12" />
        </Card>

        {/* Recentes */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Recentes</h3>
          <div className="space-y-3">
            {recentWorkouts.map((workout) => (
              <Card key={workout.id} padding="sm" className="flex items-center justify-between hover:border-blue-200 transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="bg-slate-100 p-3 rounded-xl text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                    <Dumbbell size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{workout.name}</h4>
                    <p className="text-xs text-slate-500">{workout.time}</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-slate-300" />
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}