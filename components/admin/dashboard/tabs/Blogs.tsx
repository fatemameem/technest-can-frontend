import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, ChevronLeft, ChevronRight, Plus, Save, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Blog } from '@/types';

// Add deletingItemId to props
interface BlogsTabProps {
  blogForms: Blog[];
  showBlogForm: boolean;
  editMode: {
    blogs?: boolean;
    [key: string]: boolean | undefined;
  };
  isSubmittingBlogs: boolean;
  blogs: any[]; // Add this for real data
  loadingBlogs: boolean; // Add this for loading state
  deletingItemId: string | null;
  actions: {
    addBlogForm: () => void;
    removeBlogForm: (index: number) => void;
    updateBlogForm: (index: number, field: keyof Blog, value: string) => void;
    handleEditBlog: (blogId: string, blogData: Blog) => void;
    cancelBlogEdit: () => void;
    handleBlogSubmit: () => Promise<void>;
    deleteBlog: (id: string) => Promise<void>; // Add this
  };
}

export default function BlogsTab({
  blogForms,
  showBlogForm,
  editMode,
  isSubmittingBlogs,
  blogs,
  loadingBlogs,
  deletingItemId,
  actions
}: BlogsTabProps) {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Blog Submission Form */}
      {showBlogForm && (
        <div id="blog-form-section">
          <Card className="bg-slate-900 border-slate-800 mb-6">
            <CardHeader>
              <div className="text-lg font-semibold text-white">
                {editMode.blogs ? 'Edit Blog' : 'Add New Blog'}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {blogForms.map((form, index) => (
                <div key={index} className="space-y-4 p-4 border border-slate-700 rounded-md">
                  <div className="flex justify-between items-center">
                    <h3 className="text-white font-medium">Blog #{index + 1}</h3>
                    {blogForms.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => actions.removeBlogForm(index)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-600/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Title</label>
                    <Input
                      value={form.title}
                      onChange={(e) => actions.updateBlogForm(index, 'title', e.target.value)}
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Content</label>
                    <Textarea
                      value={form.content}
                      onChange={(e) => actions.updateBlogForm(index, 'content', e.target.value)}
                      className="bg-slate-800 border-slate-700 text-white min-h-[100px]"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1">Author</label>
                      <Input
                        value={form.author}
                        onChange={(e) => actions.updateBlogForm(index, 'author', e.target.value)}
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1">Cover Image URL</label>
                      <Input
                        value={form.coverImage}
                        onChange={(e) => actions.updateBlogForm(index, 'coverImage', e.target.value)}
                        className="bg-slate-800 border-slate-700 text-white"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1">Publish Date</label>
                      <Input
                        type="date"
                        value={form.publishDate}
                        onChange={(e) => actions.updateBlogForm(index, 'publishDate', e.target.value)}
                        className="bg-slate-800 border-slate-700 text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-1">Status</label>
                      <Select
                        value={form.status}
                        onValueChange={(value) => actions.updateBlogForm(index, 'status', value)}
                      >
                        <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="archived">Archived</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="flex justify-between mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={actions.addBlogForm}
                  className="text-slate-300 border-slate-600"
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Another Blog
                </Button>
                
                <div className="space-x-2">
                  {editMode.blogs && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={actions.cancelBlogEdit}
                      className="text-slate-300 border-slate-600"
                    >
                      Cancel
                    </Button>
                  )}
                  
                  <Button
                    type="button"
                    onClick={actions.handleBlogSubmit}
                    disabled={isSubmittingBlogs}
                    className="bg-blue-600 hover:bg-blue-500 text-white"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isSubmittingBlogs ? 'Saving...' : 'Save Blog'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Blog Listing Table */}
      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-800">
                <tr>
                  <th className="text-left p-4 text-slate-400 font-medium">Title</th>
                  <th className="text-left p-4 text-slate-400 font-medium">Author</th>
                  <th className="text-left p-4 text-slate-400 font-medium">Date</th>
                  <th className="text-left p-4 text-slate-400 font-medium">Status</th>
                  <th className="text-left p-4 text-slate-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loadingBlogs ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-slate-400">
                      Loading blogs...
                    </td>
                  </tr>
                ) : !blogs || blogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-slate-400">
                      No blogs found. Add your first blog above.
                    </td>
                  </tr>
                ) : (
                  blogs.map((blog) => (
                    <tr key={blog.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                      <td className="p-4">
                        <div className="flex items-center space-x-3">
                          {/* Use coverImageUrl instead of coverImage */}
                          {blog.meta?.coverImageUrl && (
                            <div 
                              className="w-12 h-12 bg-cover bg-center rounded-lg" 
                              style={{ backgroundImage: `url(${blog.meta.coverImageUrl})` }}
                            />
                          )}
                          {/* Fallback if no cover image */}
                          {!blog.meta?.coverImageUrl && (
                            <div 
                              className="w-12 h-12 bg-slate-700 rounded-lg flex items-center justify-center bg-cover bg-center"
                              style={{ backgroundImage: `url('https://placehold.co/100x100/444/fff?text=${blog.meta?.title || 'Untitled'})'` }}
                            >
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-white">{blog.meta?.title || 'Untitled'}</div>
                            <div className="text-sm text-slate-400">{blog.meta?.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-slate-300">{blog.meta?.authorRef || blog.author || 'Unknown'}</td>
                      <td className="p-4 text-slate-300">
                        {formatDate(blog.meta?.publishedAt || blog.meta?.updatedAt || blog.publishDate || '')}
                      </td>
                      <td className="p-4">
                        <Badge 
                          variant="secondary" 
                          className={
                            blog.meta?.status === 'published' 
                              ? "bg-green-600/20 text-green-400 border-green-600/30"
                              : blog.meta?.status === 'archived'
                              ? "bg-red-600/20 text-red-400 border-red-600/30"
                              : "bg-yellow-600/20 text-yellow-400 border-yellow-600/30"
                          }
                        >
                          {blog.meta?.status || blog.status || 'Draft'}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-blue-400 hover:text-blue-300 hover:bg-blue-600/20"
                            onClick={() => {
                              // For simple forms we use the dashboard editor
                              // For more complex blog editing we redirect to the full blog editor
                              window.location.href = `/admin/blogs/${blog.id}/edit`;
                            }}
                            disabled={isSubmittingBlogs || deletingItemId !== null}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-400 hover:text-red-300 hover:bg-red-600/20"
                            onClick={() => actions.deleteBlog(blog.id)}
                            disabled={isSubmittingBlogs || deletingItemId === blog.id}
                          >
                            {deletingItemId === blog.id ? (
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
      {blogs && blogs.length > 0 && (
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