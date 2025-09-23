import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Plus, Save, Loader2, UserCog, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AdminForm } from '@/types';

interface AdminsTabProps {
  adminForms: AdminForm[];
  showAdminForm: boolean;
  editMode: {
    admins?: boolean;
    [key: string]: boolean | undefined;
  };
  isSubmittingAdmins: boolean;
  canManageAdmins: boolean;
  users: any[]; // Add this for real data
  loadingUsers: boolean; // Add this for loading state
  deletingItemId: string | null; // Add this
  actions: {
    addAdminForm: () => void;
    removeAdminForm: (index: number) => void;
    updateAdminForm: (index: number, field: keyof AdminForm, value: string) => void;
    handleEditAdmin: (adminId: string, adminData: AdminForm) => void;
    cancelAdminEdit: () => void;
    handleAdminSubmit: () => Promise<void>;
    deleteUser: (id: string) => Promise<void>; // Add this
  };
}

export default function AdminsTab({
  adminForms,
  showAdminForm,
  editMode,
  isSubmittingAdmins,
  canManageAdmins,
  users,
  loadingUsers,
  deletingItemId,
  actions
}: AdminsTabProps) {
  if (!canManageAdmins) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-semibold text-red-400 mb-2">Access Restricted</h2>
        <p className="text-slate-400">Only administrators can manage user permissions.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Admins List */}
      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-800">
                <tr>
                  <th className="text-left p-4 text-slate-400 font-medium">Name</th>
                  <th className="text-left p-4 text-slate-400 font-medium">Email</th>
                  <th className="text-left p-4 text-slate-400 font-medium">Role</th>
                  <th className="text-left p-4 text-slate-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loadingUsers ? (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-slate-400">
                      Loading users...
                    </td>
                  </tr>
                ) : !users || users.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-slate-400">
                      No admin users found. Add your first admin above.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          <UserCog className="h-6 w-6 text-slate-400" />
                          <p className="text-white font-medium">{user.name || 'Unnamed User'}</p>
                        </div>
                      </td>
                      <td className="p-4 text-slate-300">{user.email}</td>
                      <td className="p-4">
                        <Badge 
                          variant="secondary" 
                          className={
                            user.role === 'admin' 
                              ? "bg-amber-600/20 text-amber-400 border-amber-600/30"
                              : "bg-blue-600/20 text-blue-400 border-blue-600/30"
                          }
                        >
                          {user.role === 'admin' ? 'Admin' : 'Moderator'}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-blue-400 hover:text-blue-300 hover:bg-blue-600/20"
                            onClick={() => actions.handleEditAdmin(user.id, {
                              name: user.name || '',
                              email: user.email || '',
                              role: user.role || ''
                            })}
                            disabled={isSubmittingAdmins || deletingItemId !== null}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-400 hover:text-red-300 hover:bg-red-600/20"
                            onClick={() => actions.deleteUser(user.id)}
                            disabled={isSubmittingAdmins || deletingItemId === user.id}
                          >
                            {deletingItemId === user.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      {/* Admin Form */}
      {showAdminForm && (
        <div id="admin-form-section">
          <Card className="bg-slate-900 border-slate-800 mb-6">
            <CardHeader>
              <div className="text-lg font-semibold text-white">
                {editMode.admins ? 'Edit Admin' : 'Add New Admin'}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {adminForms.map((form, index) => (
                <div key={index} className="space-y-4 p-4 border border-slate-700 rounded-md">
                  <div className="flex justify-between items-center">
                    <h3 className="text-white font-medium">Admin #{index + 1}</h3>
                    {adminForms.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => actions.removeAdminForm(index)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-600/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor={`admin-name-${index}`}>Name</Label>
                    <Input
                      id={`admin-name-${index}`}
                      value={form.name}
                      onChange={(e) => actions.updateAdminForm(index, 'name', e.target.value)}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`admin-email-${index}`}>Email</Label>
                    <Input
                      id={`admin-email-${index}`}
                      type="email"
                      value={form.email}
                      onChange={(e) => actions.updateAdminForm(index, 'email', e.target.value)}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`admin-role-${index}`}>Role</Label>
                    <Select
                      value={form.role}
                      onValueChange={(value) => actions.updateAdminForm(index, 'role', value)}
                    >
                      <SelectTrigger id={`admin-role-${index}`} className="bg-slate-800 border-slate-700 text-white">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="moderator">Moderator</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
              
              <div className="flex justify-between mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={actions.addAdminForm}
                  className="text-slate-300 border-slate-600"
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Another Admin
                </Button>
                
                <div className="space-x-2">
                  {editMode.admins && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={actions.cancelAdminEdit}
                      className="text-slate-300 border-slate-600"
                      disabled={isSubmittingAdmins}
                    >
                      Cancel
                    </Button>
                  )}
                  
                  <Button
                    type="button"
                    onClick={actions.handleAdminSubmit}
                    disabled={isSubmittingAdmins}
                    className="bg-blue-600 hover:bg-blue-500 text-white"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isSubmittingAdmins ? 'Saving...' : 'Save Admin'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      {/* Pagination */}
      {users && users.length > 0 && (
        <div className="flex items-center justify-center space-x-2">
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="bg-blue-600 text-white">1</Button>
          <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}