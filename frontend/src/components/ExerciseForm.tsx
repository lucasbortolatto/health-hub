
'use client';

import React, { useState } from 'react';
import { Plus, X, Loader2, AlertCircle, Dumbbell } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { apiPath } from '@/lib/api';

interface ExerciseFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const ExerciseForm = ({ onSuccess, onCancel }: ExerciseFormProps) => {
  const [name, setName] = useState('');
  const [muscleGroup, setMuscleGroup] = useState<'Superior' | 'Inferior'>('Superior');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(apiPath('/exercises/'), {
        method: 'POST',
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
        // Captura erro 400 (RN-EX01) do FastAPI detail
        throw new Error(data.detail || 'Erro ao salvar exercício');
      }

      // Sucesso
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
          <Dumbbell size={20} className="text-blue-600" />
          Novo Exercício
        </h3>
        <Button variant="ghost" size="icon" onClick={onCancel} className="rounded-full">
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
                  "flex items-center justify-center py-3 rounded-xl border-2 font-bold transition-all",
                  muscleGroup === group
                    ? "border-blue-600 bg-blue-50 text-blue-700"
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
            className="flex-1 h-12 shadow-lg shadow-blue-200 font-bold" 
            isLoading={isLoading}
          >
            Salvar Exercício
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ExerciseForm;
