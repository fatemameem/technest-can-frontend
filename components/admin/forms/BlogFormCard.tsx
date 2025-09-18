              {/* Blog Form Section */}
              {/* <div className="mt-8 pt-8 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">Add New Blog Posts</h2>
                  <div className="flex gap-2">
                    <Button onClick={addBlogForm} variant="outline" className="btn-secondary">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Another Blog
                    </Button>
                    <Button onClick={handleBlogSubmit} className="btn-primary" disabled={isSubmittingBlogs}>
                      <Save className="mr-2 h-4 w-4" />
                      Submit ({blogForms.length})
                    </Button>
                  </div>
                </div>

                <div className="space-y-6 mt-6">
                  {blogForms.map((form, index) => (
                    <Card key={index} className="bg-slate-900 border-slate-800">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center space-x-2 text-lg">
                            <FileText className="h-5 w-5 text-blue-400" />
                            <span>Blog #{index + 1}</span>
                          </CardTitle>
                          {blogForms.length > 1 && (
                            <Button
                              onClick={() => removeBlogForm(index)}
                              variant="ghost"
                              size="icon"
                              className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor={`blog-title-${index}`}>Title *</Label>
                          <Input
                            id={`blog-title-${index}`}
                            value={form.title}
                            onChange={(e) => updateBlogForm(index, 'title', e.target.value)}
                            placeholder="Enter blog title"
                            className="focus-ring"
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`blog-content-${index}`}>Content *</Label>
                          <textarea
                            id={`blog-content-${index}`}
                            value={form.content}
                            onChange={(e) => updateBlogForm(index, 'content', e.target.value)}
                            placeholder="Enter blog content"
                            className="w-full min-h-[200px] rounded-md border border-slate-700 bg-slate-800 p-3 text-white placeholder:text-slate-400 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`blog-author-${index}`}>Author *</Label>
                            <Input
                              id={`blog-author-${index}`}
                              value={form.author}
                              onChange={(e) => updateBlogForm(index, 'author', e.target.value)}
                              placeholder="Enter author name"
                              className="focus-ring"
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor={`blog-cover-${index}`}>Cover Image URL</Label>
                            <Input
                              id={`blog-cover-${index}`}
                              value={form.coverImage}
                              onChange={(e) => updateBlogForm(index, 'coverImage', e.target.value)}
                              placeholder="https://example.com/image.jpg"
                              className="focus-ring"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`blog-date-${index}`}>Publish Date</Label>
                            <Input
                              id={`blog-date-${index}`}
                              type="date"
                              value={form.publishDate}
                              onChange={(e) => updateBlogForm(index, 'publishDate', e.target.value)}
                              className="focus-ring"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor={`blog-status-${index}`}>Status</Label>
                            <Select 
                              value={form.status} 
                              onValueChange={(value: any) => updateBlogForm(index, 'status', value)}
                            >
                              <SelectTrigger className="focus-ring">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="draft">
                                  <span className="flex items-center">
                                    Draft
                                  </span>
                                </SelectItem>
                                <SelectItem value="published">
                                  <span className="flex items-center">
                                    Published
                                  </span>
                                </SelectItem>
                                <SelectItem value="archived">
                                  <span className="flex items-center">
                                    Archived
                                  </span>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div> */}