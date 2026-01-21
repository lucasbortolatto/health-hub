'use client';

import React, { useState, useEffect } from 'react';
import { X, Dumbbell, Save, RefreshCw } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { apiPath } from '@/lib/api';

interface Exercise {
  id: number;
  name: string;
  muscle_group: string;
}

interface ExerciseFormProps {
  initialData?: Exercise | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const ExerciseForm = ({ initialData, onSuccess, onCancel }: ExerciseFormProps) => {
  const [name, setName] = useState('');
  const [muscleGroup, setMuscleGroup] = useState<'Superior' | 'Inferior'>('Superior');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!initialData;

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setMuscleGroup(initialData.muscle_group as 'Superior' | 'Inferior');
    } else {
      setName('');
      setMuscleGroup('Superior');
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setIsLoading(true);
    setError(null);

    const url = isEditing 
      ? apiPath(`/exercises/${initialData.id}`) 
      : apiPath('/exercises/');
    
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          muscle_group: muscleGroup,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Erro ao processar exercício');
      }

      setName('');
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-blue-200 shadow-xl shadow-blue-900/5 animate-in slide-in-from-top-4 duration-300">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-black text-slate-900 flex items-center gap-2">
          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
            <Dumbbell size={18} />
          </div>
          {isEditing ? 'Editar Exercício' : 'Novo Exercício'}
        </h3>
        <Button variant="ghost" size="icon" onClick={onCancel} className="rounded-full hover:bg-slate-100">
          <X size={20} />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Nome do Exercício"
          placeholder="Ex: Supino Inclinado com Halteres"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={error || undefined}
          disabled={isLoading}
          autoFocus
        />

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 px-1 uppercase tracking-wider">
            Grupo Muscular
          </label>
          <div className="grid grid-cols-2 gap-3">
            {(['Superior', 'Inferior'] as const).map((group) => (
              <button
                key={group}
                type="button"
                onClick={() => setMuscleGroup(group)}
                className={cn(
                  "flex items-center justify-center py-4 rounded-2xl border-2 font-bold transition-all duration-200",
                  muscleGroup === group
                    ? "border-blue-600 bg-blue-50 text-blue-700 shadow-sm"
                    : "border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200"
                )}
              >
                {group}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-2 flex gap-3">
          <Button 
            type="submit" 
            className="flex-1 h-14 shadow-lg shadow-blue-200 font-bold rounded-2xl text-base" 
            isLoading={isLoading}
          >
            {isEditing ? (
              <span className="flex items-center gap-2">
                <RefreshCw size={18} /> Atualizar Exercício
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Save size={18} /> Criar Exercício
              </span>
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ExerciseForm;