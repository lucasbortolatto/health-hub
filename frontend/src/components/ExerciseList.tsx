
'use client';

import React, { useEffect, useState } from 'react';
import { Dumbbell, Loader2, AlertCircle } from 'lucide-react';
import Card from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { apiPath } from '@/lib/api';

interface Exercise {
  id: number;
  name: string;
  muscle_group: string;
}

interface ExerciseListProps {
  refreshKey?: number;
}

const ExerciseList = ({ refreshKey = 0 }: ExerciseListProps) => {
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
      <div className="flex flex-col items-center justify-center py-12 text-slate-400">
        <Loader2 className="animate-spin mb-2" size={32} />
        <p className="text-sm font-medium tracking-tight">Consultando biblioteca...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-red-50 border-red-100 p-6 text-center">
        <AlertCircle className="mx-auto text-red-500 mb-2" size={24} />
        <p className="text-sm text-red-600 font-semibold">{error}</p>
        <button 
          onClick={fetchExercises}
          className="mt-3 text-xs font-bold text-red-700 underline underline-offset-4"
        >
          Tentar novamente
        </button>
      </Card>
    );
  }

  if (exercises.length === 0) {
    return (
      <div className="text-center py-12 px-6 border-2 border-dashed border-slate-200 rounded-3xl">
        <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Dumbbell className="text-slate-400" size={32} />
        </div>
        <h3 className="text-slate-900 font-bold text-lg">Biblioteca vazia</h3>
        <p className="text-slate-500 text-sm mt-1 max-w-[200px] mx-auto">
          Adicione seu primeiro exercício para começar a trackear.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3">
      {exercises.map((exercise) => (
        <Card key={exercise.id} padding="sm" className="flex items-center gap-4 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer group">
          <div className={cn(
            "h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors",
            exercise.muscle_group === 'Superior' 
              ? "bg-blue-50 text-blue-600 group-hover:bg-blue-100" 
              : "bg-orange-50 text-orange-600 group-hover:bg-orange-100"
          )}>
            <Dumbbell size={24} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-base font-bold text-slate-900 truncate">{exercise.name}</h4>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={cn(
                "text-[10px] font-extrabold uppercase tracking-widest px-1.5 py-0.5 rounded",
                exercise.muscle_group === 'Superior' ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"
              )}>
                {exercise.muscle_group}
              </span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ExerciseList;
