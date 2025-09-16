"use client";
import { Button } from '@/components/ui/button';
import { Save, Plus, Crown } from 'lucide-react';
import AdminFormCard, { AdminForm } from './AdminFormCard';

export default function AdminSection({
  forms,
  canManageAdmins,
  isSubmitting,
  onAdd,
  onSubmit,
  onRemove,
  onChange,
}: {
  forms: AdminForm[];
  canManageAdmins: boolean;
  isSubmitting: boolean;
  onAdd: () => void;
  onSubmit: () => void;
  onRemove: (index: number) => void;
  onChange: (index: number, field: keyof AdminForm, value: string) => void;
}) {
  if (!canManageAdmins) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Crown className="h-6 w-6 text-amber-400" />
          <h2 className="text-xl font-bold">Admin Management</h2>
        </div>
        <div className="flex gap-2">
          <Button onClick={onAdd} variant="outline" size="sm" className="btn-secondary">
            <Plus className="mr-2 h-4 w-4" />
            Add Another
          </Button>
          <Button disabled={!canManageAdmins || isSubmitting} onClick={onSubmit} size="sm" className="btn-primary">
            <Save className="mr-2 h-4 w-4" />
            Submit ({forms.length})
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {forms.map((form, index) => (
          <AdminFormCard
            key={index}
            index={index}
            form={form}
            canRemove={forms.length > 1}
            onRemove={() => onRemove(index)}
            onChange={(field, value) => onChange(index, field, value)}
          />
        ))}
      </div>
    </div>
  );
}

