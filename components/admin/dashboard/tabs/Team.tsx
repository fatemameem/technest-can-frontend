import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TeamMemberForm } from '@/types';
import { Users, Edit, Trash2, Plus, Save, Loader2, ChevronLeft, ChevronRight, Github, Twitter, Linkedin, Globe } from 'lucide-react';
import TeamMemberFormCard from '@/components/admin/forms/TeamMemberFormCard';

interface TeamTabProps {
  teamMemberForms: TeamMemberForm[];
  showTeamMemberForm: boolean;
  editMode: {
    teamMembers?: boolean;
    [key: string]: boolean | undefined;
  };
  isSubmittingTeam: boolean;
  teamMembers: any[]; // Add this for real data
  loadingTeamMembers: boolean; // Add this for loading state
  deletingItemId: string | null; // Add this
  actions: {
    addTeamMemberForm: () => void;
    removeTeamMemberForm: (index: number) => void;
    updateTeamMemberForm: (index: number, field: keyof TeamMemberForm, value: string | File | null) => void;
    handleEditTeamMember: (teamMemberId: string, teamMemberData: TeamMemberForm) => void;
    cancelTeamMemberEdit: () => void;
    handleTeamMemberSubmit: () => Promise<void>;
    deleteTeamMember: (id: string) => Promise<void>; // Add this
  };
}

export default function TeamTab({
  teamMemberForms,
  showTeamMemberForm,
  editMode,
  isSubmittingTeam,
  teamMembers,
  loadingTeamMembers,
  deletingItemId,
  actions
}: TeamTabProps) {
  return (
    <div className="space-y-6">
      {/* Team Member Form */}
      {showTeamMemberForm && (
        <div id="team-member-form-section">
          <Card className="bg-slate-900 border-slate-800 mb-6">
            <CardHeader>
              <div className="text-lg font-semibold text-white">
                {editMode.teamMembers ? 'Edit Team Member' : 'Add New Team Member'}
              </div>
            </CardHeader>
            <CardContent>
              {teamMemberForms.map((form, index) => (
                <TeamMemberFormCard
                  key={index}
                  index={index}
                  form={form}
                  canRemove={teamMemberForms.length > 1}
                  onRemove={() => actions.removeTeamMemberForm(index)}
                  onChange={(field, value) => actions.updateTeamMemberForm(index, field, value)}
                />
              ))}
              <div className="flex justify-between mt-4">
                <div className="space-x-2">
                  {!editMode.teamMembers && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={actions.addTeamMemberForm}
                    className="text-slate-300 border-slate-600"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Another Team Member
                  </Button>
                )}
                <Button
                  type="button"
                  variant="outline"
                  onClick={actions.cancelTeamMemberEdit}
                  className="text-slate-300 border-slate-600"
                  disabled={isSubmittingTeam}
                >
                  <Trash2 className="h-4 w-4 mr-2 text-red-400 hover:text-red-300" />
                  Cancel
                </Button>
                </div>
                <div className="space-x-2">
                  {/* {editMode.teamMembers && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={actions.cancelTeamMemberEdit}
                      className="text-slate-300 border-slate-600"
                      disabled={isSubmittingTeam}
                    >
                      Cancel
                    </Button>
                  )} */}
                  <Button
                    type="button"
                    onClick={actions.handleTeamMemberSubmit}
                    disabled={isSubmittingTeam}
                    className="bg-blue-600 hover:bg-blue-500 text-white"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isSubmittingTeam ? 'Saving...' : 'Save Team Member'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Team Members List */}
      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-800">
                <tr>
                  <th className="text-left p-4 text-slate-400 font-medium">Name</th>
                  <th className="text-left p-4 text-slate-400 font-medium">Role</th>
                  <th className="text-left p-4 text-slate-400 font-medium">Contact</th>
                  <th className="text-left p-4 text-slate-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loadingTeamMembers ? (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-slate-400">
                      Loading team members...
                    </td>
                  </tr>
                ) : !teamMembers || teamMembers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-slate-400">
                      No team members found. Add your first team member above.
                    </td>
                  </tr>
                ) : (
                  teamMembers.map((member) => (
                    <tr key={member.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          {/* Display image from Media relation or fallback to imageLink */}
                          <div
                            className="w-12 h-12 flex-shrink-0 bg-cover bg-center rounded-full"
                            style={{ 
                              backgroundImage: `url(${
                                // Check if image is a Media object with cloudinary data
                                member.image && typeof member.image === 'object' && member.image.cloudinary
                                  ? member.image.cloudinary.secureUrl
                                  // Fallback to direct image string or placeholder
                                  : member.image && typeof member.image === 'string'
                                    ? member.image
                                    : 'https://placehold.co/100x100/444/fff?text=User'
                              })`
                            }}
                          ></div>
                          <div>
                            <p className="text-white font-medium">{member.name}</p>
                            <p className="text-slate-400 text-sm">{member.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-slate-300">{member.designation}</td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-2">
                          {member.socialLinks?.linkedin && (
                            <a 
                              href={member.socialLinks.linkedin} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="inline-flex items-center rounded-full  px-2.5 py-2.5 text-xs font-medium text-blue-400"
                            >
                              <Linkedin className="h-4 w-4 mr-1" />
                            </a>
                          )}
                          {member.socialLinks?.twitter && (
                            <a 
                              href={member.socialLinks.twitter} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="inline-flex items-center rounded-full  px-2.5 py-2.5 text-xs font-medium text-blue-400"
                            >
                              <Twitter className="h-4 w-4 mr-1" />
                            </a>
                          )}
                          {member.socialLinks?.github && (
                            <a 
                              href={member.socialLinks.github} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="inline-flex items-center rounded-full  px-2.5 py-2.5 text-xs font-medium text-blue-400"
                            >
                              <Github className="h-4 w-4 mr-1" />
                            </a>
                          )}
                          {member.website && (
                            <a 
                              href={member.website} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="inline-flex items-center rounded-full  px-2.5 py-2.5 text-xs font-medium text-blue-400"
                            >
                              <Globe className="h-4 w-4 mr-1" />
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-blue-400 hover:text-blue-300 hover:bg-blue-600/20"
                            onClick={() => actions.handleEditTeamMember(member.id, {
                              name: member.name || '',
                              email: member.email || '',
                              designation: member.designation || '',
                              description: member.description || '',
                              linkedin: member.socialLinks?.linkedin || '',
                              twitter: member.socialLinks?.twitter || '',
                              github: member.socialLinks?.github || '',
                              website: member.website || '',
                              image: typeof member.image === 'object' ? member.image.id : member.image || '',
                              imageUrl: typeof member.image === 'object' && member.image.cloudinary 
                                ? member.image.cloudinary.secureUrl 
                                : (typeof member.image === 'string' ? member.image : ''),
                              imageFile: null,
                            })}
                            disabled={isSubmittingTeam || deletingItemId !== null}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-400 hover:text-red-300 hover:bg-red-600/20"
                            onClick={() => actions.deleteTeamMember(member.id)}
                            disabled={isSubmittingTeam || deletingItemId === member.id}
                          >
                            {deletingItemId === member.id ? (
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
      {/* Pagination */}
      {teamMembers && teamMembers.length > 0 && (
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