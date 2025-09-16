"use client";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Crown, Shield, Trash2, UserPlus } from 'lucide-react';

export interface AdminForm {
  name: string;
  email: string;
  role: 'admin' | 'moderator' | '';
}

export default function AdminFormCard({
  index,
  form,
  canRemove,
  onRemove,
  onChange,
}: {
  index: number;
  form: AdminForm;
  canRemove: boolean;
  onRemove: () => void;
  onChange: (field: keyof AdminForm, value: string) => void;
}) {
  return (
    <Card className="surface">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <UserPlus className="h-5 w-5 text-amber-400" />
            <span>Admin #{index + 1}</span>
          </CardTitle>
          {canRemove && (
            <Button onClick={onRemove} variant="ghost" size="icon" className="text-red-400 hover:text-red-300 hover:bg-red-400/10">
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`admin-name-${index}`}>Name *</Label>
            <Input id={`admin-name-${index}`} value={form.name} onChange={(e) => onChange('name', e.target.value)} placeholder="Enter full name" className="focus-ring" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`admin-email-${index}`}>Email *</Label>
            <Input id={`admin-email-${index}`} type="email" value={form.email} onChange={(e) => onChange('email', e.target.value)} placeholder="admin@tech-nest.org" className="focus-ring" required />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`admin-role-${index}`}>Role *</Label>
          <Select value={form.role} onValueChange={(value) => onChange('role', value)}>
            <SelectTrigger className="focus-ring">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">
                <div className="flex items-center">
                  <Crown className="mr-2 h-4 w-4 text-amber-400" />
                  Admin
                </div>
              </SelectItem>
              <SelectItem value="moderator">
                <div className="flex items-center">
                  <Shield className="mr-2 h-4 w-4 text-blue-400" />
                  Moderator
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}

