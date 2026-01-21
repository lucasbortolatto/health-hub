'use client';

import React, { useEffect, useState } from 'react';
import { Dumbbell, Loader2, AlertCircle, Pencil, Trash2, CheckCircle2, Circle } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { apiPath } from '@/lib/api';

interface Exercise {
  id: number;
  name: string;
  muscle_group: string;
}

interface ExerciseListProps {
  refreshKey?: number;
  onEdit?: (exercise: Exercise) => void;
  onDelete?: (exerciseId: number) => void;
  isSelectionMode?: boolean;
  selectedIds?: Set<number>;
  onToggleSelect?: (exerciseId: number) => void;
}

const ExerciseList = ({ 
  refreshKey = 0, 
  onEdit, 
  onDelete,
  isSelectionMode,
  selectedIds = new Set(),
  onToggleSelect
}: ExerciseListProps) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchExercises = async () => {
    try {
      setLoading(true);
      const response = await fetch(apiPath('/exercises/'));
      if (!response.ok) {
        throw new Error('Falha ao carregar exercícios');
      }
      const data = await response.json();
      setExercises(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, [refreshKey]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <Loader2 className="animate-spin mb-3 text-blue-500" size={40} />
        <p className="text-sm font-bold tracking-tight animate-pulse">Consultando biblioteca...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-red-50 border-red-100 p-8 text-center rounded-[2rem]">
        <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="text-red-500" size={24} />
        </div>
        <p className="text-slate-900 font-bold">Falha na conexão</p>
        <p className="text-sm text-red-600 mt-1">{error}</p>
        <Button 
          variant="outline"
          onClick={fetchExercises}
          className="mt-6 border-red-200 text-red-700 hover:bg-red-100 rounded-xl"
        >
          Tentar novamente
        </Button>
      </Card>
    );
  }

  if (exercises.length === 0) {
    return (
      <div className="text-center py-16 px-6 border-2 border-dashed border-slate-200 rounded-[2.5rem] bg-slate-50/50">
        <div className="bg-white shadow-sm w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Dumbbell className="text-slate-300" size={40} />
        </div>
        <h3 className="text-slate-900 font-black text-xl">Sua biblioteca está vazia</h3>
        <p className="text-slate-500 text-sm mt-2 max-w-[240px] mx-auto font-medium">
          Comece adicionando seus exercícios favoritos para organizar seus treinos.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {exercises.map((exercise) => {
        const isSelected = selectedIds.has(exercise.id);
        
        return (
          <Card 
            key={exercise.id} 
            padding="sm" 
            className={cn(
              "flex items-center gap-4 transition-all duration-300 group relative border-transparent hover:border-slate-200 hover:shadow-lg hover:shadow-slate-200/40 rounded-2xl",
              isSelected ? "border-blue-500 bg-blue-50/50 shadow-md shadow-blue-500/10" : "bg-white",
              isSelectionMode ? "cursor-pointer" : ""
            )}
            onClick={() => isSelectionMode && onToggleSelect?.(exercise.id)}
          >
            {/* Selection Checkbox */}
            {isSelectionMode && (
              <div className="shrink-0 pl-1">
                {isSelected ? (
                  <CheckCircle2 size={24} className="text-blue-600 animate-in zoom-in-75 duration-200" fill="currentColor" />
                ) : (
                  <Circle size={24} className="text-slate-200 group-hover:text-slate-300" />
                )}
              </div>
            )}

            <div className={cn(
              "h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300",
              exercise.muscle_group === 'Superior' 
                ? "bg-blue-50 text-blue-600 group-hover:scale-110" 
                : "bg-orange-50 text-orange-600 group-hover:scale-110"
            )}>
              <Dumbbell size={28} />
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className="text-lg font-black text-slate-900 truncate leading-tight">{exercise.name}</h4>
              <div className="flex items-center gap-2 mt-1">
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-[0.1em] px-2 py-0.5 rounded-lg",
                  exercise.muscle_group === 'Superior' ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"
                )}>
                  {exercise.muscle_group}
                </span>
              </div>
            </div>

            {/* Inline Actions */}
            {!isSelectionMode && (
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 pr-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-10 w-10 rounded-xl hover:bg-blue-50 text-slate-400 hover:text-blue-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.(exercise);
                  }}
                >
                  <Pencil size={20} />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-10 w-10 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.(exercise.id);
                  }}
                >
                  <Trash2 size={20} />
                </Button>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
};

export default ExerciseList;