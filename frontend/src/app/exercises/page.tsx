'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plus, LayoutGrid, X, Trash2, Copy, CheckSquare, Settings2, SlidersHorizontal } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import ExerciseList from '@/components/ExerciseList';
import ExerciseForm from '@/components/ExerciseForm';
import { apiPath } from '@/lib/api';
import { cn } from '@/lib/utils';

interface Exercise {
  id: number;
  name: string;
  muscle_group: string;
}

export default function ExercisesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Selection Logic
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // Automatic cleanup of selection if mode is disabled
  useEffect(() => {
    if (!isSelectionMode) setSelectedIds(new Set());
  }, [isSelectionMode]);

  const handleExerciseSaved = () => {
    setIsFormVisible(false);
    setEditingExercise(null);
    setRefreshKey(prev => prev + 1);
  };

  const handleEdit = (exercise: Exercise) => {
    setEditingExercise(exercise);
    setIsFormVisible(true);
    // Auto scroll to top on mobile when editing
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Deseja excluir este exercício permanentemente? Esta ação não pode ser desfeita.')) return;
    try {
      const res = await fetch(apiPath(`/exercises/${id}`), { method: 'DELETE' });
      if (res.ok) {
        setRefreshKey(prev => prev + 1);
      } else {
        alert('Erro ao excluir exercício.');
      }
    } catch (err) {
      console.error(err);
      alert('Falha na comunicação com o servidor.');
    }
  };

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
  };

  const toggleSelect = (id: number) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Excluir permanentemente os ${selectedIds.size} exercícios selecionados?`)) return;
    try {
      const res = await fetch(apiPath('/exercises/bulk-delete'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Array.from(selectedIds)),
      });
      if (res.ok) {
        setRefreshKey(prev => prev + 1);
        setIsSelectionMode(false);
      } else {
        alert('Erro ao realizar exclusão em massa.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBulkDuplicate = async () => {
    const ids = Array.from(selectedIds);
    try {
      // Logic for duplication: fetch actual items, then post them again with suffix
      const response = await fetch(apiPath('/exercises/'));
      const all: Exercise[] = await response.json();
      const targets = all.filter(ex => selectedIds.has(ex.id));

      let successCount = 0;
      for (const ex of targets) {
        const res = await fetch(apiPath('/exercises/'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: `${ex.name} (Cópia)`,
            muscle_group: ex.muscle_group
          }),
        });
        if (res.ok) successCount++;
      }
      
      if (successCount > 0) {
        setRefreshKey(prev => prev + 1);
        setIsSelectionMode(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 md:p-10 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 pb-40">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            Exercícios
            <div className="bg-blue-100 text-blue-600 text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-widest">v1.2</div>
          </h1>
          <p className="text-slate-500 text-sm font-medium">Gestão centralizada de performance e biomecânica.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={toggleSelectionMode}
            className={cn(
              "rounded-2xl h-12 font-bold transition-all px-5 border-2", 
              isSelectionMode ? "bg-slate-900 text-white border-slate-900" : "bg-white border-slate-100 hover:border-slate-300"
            )}
          >
            {isSelectionMode ? <X size={18} className="mr-2" /> : <Settings2 size={18} className="mr-2" />}
            {isSelectionMode ? "Sair" : "Gerenciar"}
          </Button>
          
          {!isSelectionMode && !isFormVisible && (
            <Button 
              onClick={() => { setIsFormVisible(true); setEditingExercise(null); }}
              className="rounded-2xl h-12 px-6 shadow-xl shadow-blue-500/20 font-black text-sm uppercase tracking-wider"
            >
              <Plus size={20} className="mr-2" />
              Novo
            </Button>
          )}
        </div>
      </header>

      {(isFormVisible || editingExercise) && (
        <section className="animate-in slide-in-from-top-4 duration-500 sticky top-4 z-30">
          <ExerciseForm 
            initialData={editingExercise}
            onSuccess={handleExerciseSaved} 
            onCancel={() => { setIsFormVisible(false); setEditingExercise(null); }} 
          />
        </section>
      )}

      <section className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 group">
            <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <Input 
              placeholder="Pesquisar por nome ou grupo muscular..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-13 h-15 bg-white border-slate-100 shadow-sm focus:border-blue-500 rounded-2xl text-base font-medium"
            />
          </div>
          <Button variant="outline" size="icon" className="h-15 w-15 rounded-2xl bg-white border-slate-100">
            <SlidersHorizontal size={20} className="text-slate-500" />
          </Button>
        </div>
        
        <div className="space-y-5">
          <div className="flex justify-between items-center px-1">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <LayoutGrid size={14} className="text-blue-500" /> 
              {searchTerm ? `Resultados para "${searchTerm}"` : "Base de Dados"}
            </h2>
            {isSelectionMode && (
              <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-widest">
                Modo Seleção Ativo
              </span>
            )}
          </div>
          
          <ExerciseList 
            refreshKey={refreshKey} 
            onEdit={handleEdit}
            onDelete={handleDelete}
            isSelectionMode={isSelectionMode}
            selectedIds={selectedIds}
            onToggleSelect={toggleSelect}
          />
        </div>
      </section>

      {/* Floating Action Bar (Premium UI) */}
      {isSelectionMode && selectedIds.size > 0 && (
        <div className="fixed bottom-24 md:bottom-10 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-20 duration-500 w-[92%] max-w-md">
          <div className="bg-slate-900/95 backdrop-blur-xl text-white rounded-[2.5rem] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex items-center justify-between border border-slate-800">
            <div className="pl-4 flex flex-col">
              <p className="text-xl font-black text-white leading-none">{selectedIds.size}</p>
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1">Selecionados</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="ghost" 
                onClick={handleBulkDuplicate}
                className="h-14 px-6 rounded-2xl text-blue-400 hover:bg-blue-500/10 font-bold flex items-center gap-2"
              >
                <Copy size={20} />
                <span className="hidden sm:inline">Duplicar</span>
              </Button>
              <Button 
                onClick={handleBulkDelete}
                className="h-14 px-6 rounded-[1.5rem] bg-red-600 hover:bg-red-500 text-white font-black flex items-center gap-2 shadow-lg shadow-red-600/20"
              >
                <Trash2 size={20} />
                <span className="hidden sm:inline">Excluir</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}