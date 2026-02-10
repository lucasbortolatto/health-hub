'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Dumbbell, Loader2, AlertCircle, SearchX, Pencil, Trash2 } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { apiPath } from '@/lib/api';

interface Exercise {
  id: number;
  name: string;
  muscle_group: string;
}

const ExerciseList = ({
  refreshKey = 0,
  searchTerm = '',
  sortBy = 'name',
  sortDirection = 'asc',
  onEdit,
  onDelete
}: any) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExercises = async () => {
    try {
      setLoading(true);
      const response = await fetch(apiPath('/exercises/'));
      if (!response.ok) throw new Error('Falha ao carregar');
      const data = await response.json();
      setExercises(data);
    } catch (err) {
      setError('Erro de conexão');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchExercises(); }, [refreshKey]);

  const filteredAndSortedExercises = useMemo(() => {
    let result = [...exercises];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(ex => 
        ex.name.toLowerCase().includes(term) || 
        ex.muscle_group.toLowerCase().includes(term)
      );
    }

    const modifier = sortDirection === 'asc' ? 1 : -1;

    result.sort((a, b) => {
      const valA = (sortBy === 'name' ? a.name : a.muscle_group) || '';
      const valB = (sortBy === 'name' ? b.name : b.muscle_group) || '';
      const comparison = valA.localeCompare(valB, 'pt-BR', { sensitivity: 'base' }) * modifier;
      
      if (comparison === 0 && sortBy === 'muscle_group') {
        return a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' }) * modifier;
      }
      return comparison;
    });

    return result;
  }, [exercises, searchTerm, sortBy, sortDirection]);

  if (loading) return <Loader2 className="animate-spin mx-auto mt-20 text-blue-500" size={40} />;

  return (
    <div className="grid grid-cols-1 gap-4">
      {filteredAndSortedExercises.map((exercise) => {
        // Lógica de Cores Dinâmicas
        const isSuperior = exercise.muscle_group === 'Superior';
        
        return (
          <Card key={exercise.id} padding="sm" className="flex items-center gap-4 bg-white border-slate-100 rounded-2xl group hover:shadow-lg transition-all">
            {/* Ícone com cor dinâmica */}
            <div className={cn(
              "h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
              isSuperior ? "bg-blue-50 text-blue-600" : "bg-orange-50 text-orange-600"
            )}>
              <Dumbbell size={28} />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-lg font-black text-slate-900 truncate leading-tight">{exercise.name}</h4>
              <div className="flex items-center gap-2 mt-1">
                {/* Tag com cor dinâmica */}
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-[0.1em] px-2 py-0.5 rounded-lg",
                  isSuperior ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"
                )}>
                  {exercise.muscle_group}
                </span>
              </div>
            </div>

            {/* Ações (Edit/Delete) */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all pr-1">
              <Button variant="ghost" size="icon" onClick={() => onEdit?.(exercise)}>
                <Pencil size={20} className="text-slate-400 hover:text-blue-600" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onDelete?.(exercise.id)}>
                <Trash2 size={20} className="text-slate-400 hover:text-red-600" />
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default ExerciseList;