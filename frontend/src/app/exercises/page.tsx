'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, X, Trash2, Copy, Settings2, SlidersHorizontal, 
  Dumbbell, ArrowDownAZ, ArrowUpZA, Tag, ChevronDown, ChevronUp 
} from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import ExerciseList from '@/components/ExerciseList';
import ExerciseForm from '@/components/ExerciseForm';
import { apiPath } from '@/lib/api';
import { cn } from '@/lib/utils';

export default function ExercisesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'muscle_group'>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Função de Toggle com Log para Debug
  const handleSortToggle = (criterion: 'name' | 'muscle_group') => {
    console.log('👆 Clique detectado no critério:', criterion);
    if (sortBy === criterion) {
      const newDir = sortDirection === 'asc' ? 'desc' : 'asc';
      console.log('🔄 Invertendo direção para:', newDir);
      setSortDirection(newDir);
    } else {
      console.log('🆕 Mudando critério para:', criterion);
      setSortBy(criterion);
      setSortDirection('asc');
    }
  };

  return (
    <div className="p-6 md:p-10 space-y-8 pb-40">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-black text-slate-900">Exercícios</h1>
        <Button onClick={() => {}} className="rounded-2xl h-12 px-6">
          <Plus size={20} className="mr-2" /> Novo
        </Button>
      </header>

      <section className="space-y-6">
        <div className="flex items-center gap-4 relative">
          <div className="relative flex-1 group">
            <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Pesquisar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-13 h-14 bg-white rounded-2xl"
            />
          </div>

          <div className="relative">
            <Button
              variant="outline"
              className={cn("h-14 w-14 rounded-2xl", isSortMenuOpen && "border-blue-500 text-blue-600")}
              onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}
            >
              <SlidersHorizontal size={20} />
            </Button>

            {isSortMenuOpen && (
              <>
                {/* Overlay com z-index menor que o Card */}
                <div className="fixed inset-0 z-[80]" onClick={() => setIsSortMenuOpen(false)} />
                <Card className="absolute right-0 top-16 w-64 z-[90] p-2 shadow-2xl border-slate-200 animate-in zoom-in-95 duration-200 origin-top-right">
                  <p className="text-[10px] font-black uppercase text-slate-400 px-3 py-2 tracking-widest">Ordenar por</p>
                  
                  <button
                    type="button"
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-bold transition-colors",
                      sortBy === 'name' ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"
                    )}
                    onClick={(e) => {
                      e.stopPropagation(); // Impede que o clique feche o menu antes de processar
                      handleSortToggle('name');
                    }}
                  >
                    <div className="flex items-center gap-3">
                      {sortBy === 'name' && sortDirection === 'desc' ? <ArrowUpZA size={18} /> : <ArrowDownAZ size={18} />}
                      <span>Nome</span>
                    </div>
                    {sortBy === 'name' && (sortDirection === 'asc' ? <ChevronDown size={14} /> : <ChevronUp size={14} />)}
                  </button>

                  <button
                    type="button"
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-3 rounded-xl text-sm font-bold transition-colors",
                      sortBy === 'muscle_group' ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSortToggle('muscle_group');
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <Tag size={18} />
                      <span>Grupo Muscular</span>
                    </div>
                    {sortBy === 'muscle_group' && (sortDirection === 'asc' ? <ChevronDown size={14} /> : <ChevronUp size={14} />)}
                  </button>
                </Card>
              </>
            )}
          </div>
        </div>

        <ExerciseList
          refreshKey={refreshKey}
          searchTerm={searchTerm}
          sortBy={sortBy}
          sortDirection={sortDirection}
        />
      </section>
    </div>
  );
}