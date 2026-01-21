
'use client';

import React, { useState } from 'react';
import { Search, Plus, LayoutGrid, X } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import ExerciseList from '@/components/ExerciseList';
import ExerciseForm from '@/components/ExerciseForm';

export default function LibraryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleExerciseCreated = () => {
    setIsFormVisible(false);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="p-6 md:p-10 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Biblioteca</h1>
          <p className="text-slate-500 text-sm font-medium">Gerencie sua base de dados de exercícios.</p>
        </div>
        {!isFormVisible && (
          <Button 
            onClick={() => setIsFormVisible(true)}
            className="rounded-2xl h-12 shadow-lg shadow-blue-200"
          >
            <Plus size={20} className="mr-2" />
            Novo Exercício
          </Button>
        )}
      </header>

      {isFormVisible && (
        <section className="animate-in slide-in-from-top-4 duration-300">
          <ExerciseForm 
            onSuccess={handleExerciseCreated} 
            onCancel={() => setIsFormVisible(false)} 
          />
        </section>
      )}

      <section className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 group">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <Input 
              placeholder="Pesquisar por nome ou grupo..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 h-14 bg-white border-slate-200 shadow-sm focus:border-blue-500 rounded-2xl"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2 px-1">
            <LayoutGrid size={12} className="text-blue-500" /> Seus Exercícios
          </h2>
          <ExerciseList refreshKey={refreshKey} />
        </div>
      </section>
    </div>
  );
}
