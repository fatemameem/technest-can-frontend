import React, { useEffect, useState } from 'react';
import { Card, CardContent} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Plus, Save, ChevronLeft, ChevronRight, HardDriveIcon, LinkedinIcon, InstagramIcon, FacebookIcon, LinkIcon, Loader, Loader2 } from 'lucide-react';
import PodcastFormCard from '@/components/admin/forms/PodcastFormCard';
import { PodcastForm } from '@/types';
import Image from 'next/image';

interface PodcastsTabProps {
	podcastForms: Array<{
		title: string;
		description: string;
		linkedin: string;
		instagram: string;
		drive: string;
		facebook: string;
		thumbnail: string;
		thumbnailFile?: File | null;
	}>;
	showPodcastForm: boolean;
	editMode: {
		podcasts?: boolean;
		[key: string]: boolean | undefined;
	};
	isSubmittingPodcasts: boolean;
	podcasts: any[];
	loadingPodcasts: boolean;
	actions: {
		addPodcastForm: () => void;
		removePodcastForm: (index: number) => void;
		updatePodcastForm: (index: number, field: keyof PodcastForm, value: string) => void;
		handleEditPodcast: (podcastId: string, podcastData: PodcastForm) => void;
		cancelPodcastEdit: () => void;
		handlePodcastSubmit: () => Promise<void>;
		deletePodcast: (id: string) => Promise<void>;
	};
	deletingItemId: string | null;
}

export default function PodcastsTab({
	podcastForms,
	showPodcastForm,
	editMode,
	isSubmittingPodcasts,
	actions,
	podcasts,
	loadingPodcasts,
	deletingItemId
}: PodcastsTabProps) {
	return (
		<div className="space-y-6">
			{/* Podcast Listing Table */}
			<Card className="bg-slate-900 border-slate-800">
				<CardContent className="p-0">
					<div className="overflow-x-auto">
						<table className="w-full">
							<thead className="border-b border-slate-800">
								<tr>
									<th className="text-left p-4 text-slate-400 font-medium">Title</th>
									<th className="text-left p-4 text-slate-400 font-medium">Description</th>
									<th className="text-left p-4 text-slate-400 font-medium">Links</th>
									<th className="text-left p-4 text-slate-400 font-medium">Actions</th>
								</tr>
							</thead>
							<tbody>
								{loadingPodcasts ? (
									<tr>
										<td colSpan={4} className="p-4 text-center text-slate-400">
											Loading podcasts...
										</td>
									</tr>
								) : podcasts.length === 0 ? (
									<tr>
										<td colSpan={4} className="p-4 text-center text-slate-400">
											No podcasts found. Add your first podcast above.
										</td>
									</tr>
								) : (
									podcasts.map((podcast) => (
										<tr key={podcast.id} className="border-b border-slate-800 hover:bg-slate-800/50">
											<td className="p-4">
												<div className="flex items-center space-x-3">
													<div
														className="w-12 h-12 flex-shrink-0 bg-cover bg-center rounded-lg"
														style={{ 
															backgroundImage: `url(${
																// Check if thumbnail is an object with cloudinary data
																podcast.thumbnail && typeof podcast.thumbnail === 'object' && podcast.thumbnail.cloudinary
																	? podcast.thumbnail.cloudinary.secureUrl
																	// Fallback for backward compatibility or missing thumbnails
																	: 'https://placehold.co/100x100/444/fff?text=Podcast'
															})`
														}}
													></div>
													<p className="text-white font-medium">{podcast.title}</p>
												</div>
											</td>
											<td className="p-4 text-slate-300">
												<p className="line-clamp-2">{podcast.description}</p>
											</td>
											<td className="p-4">
												<div className="flex flex-wrap gap-2">
													{podcast.driveLink && (
														<a
															href={podcast.driveLink}
															target="_blank"
															rel="noreferrer"
															className="inline-flex items-center rounded-full  px-2.5 py-0.5 text-xs font-medium text-blue-400"
														>
															<LinkIcon className="mr-1 h-3 w-3" />
														</a>
													)}
													{podcast.socialLinks.linkedin && (
														<a
															href={podcast.socialLinks.linkedin}
															target="_blank"
															rel="noreferrer"
															className="inline-flex items-center rounded-full  px-2.5 py-0.5 text-xs font-medium text-blue-400"
														>
															<LinkedinIcon className="mr-1 h-3 w-3" />
														</a>
													)}
													{podcast.socialLinks.instagram && (
														<a
															href={podcast.socialLinks.instagram}
															target="_blank"
															rel="noreferrer"
															className="inline-flex items-center rounded-full  px-2.5 py-0.5 text-xs font-medium text-blue-400"
														>
															<InstagramIcon className="mr-1 h-3 w-3" />
														</a>
													)}
													{podcast.socialLinks.facebook && (
														<a
															href={podcast.socialLinks.facebook}
															target="_blank"
															rel="noreferrer"
															className="inline-flex items-center rounded-full  px-2.5 py-0.5 text-xs font-medium text-blue-400"
														>
															<FacebookIcon className="mr-1 h-3 w-3" />
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
														onClick={() => actions.handleEditPodcast(podcast.id, {
															title: podcast.title || '',
															description: podcast.description || '',
															linkedin: podcast.linkedin || '',
															instagram: podcast.instagram || '',
															drive: podcast.drive || '',
															facebook: podcast.facebook || '',
															thumbnail: podcast.thumbnail || ''
														})}
														disabled={isSubmittingPodcasts || deletingItemId !== null}
													>
														<Edit className="h-4 w-4" />
													</Button>
													<Button
														variant="ghost"
														size="sm"
														className="text-red-400 hover:text-red-300 hover:bg-red-600/20"
														onClick={() => actions.deletePodcast(podcast.id)}
														disabled={isSubmittingPodcasts || deletingItemId === podcast.id}
													>
														{deletingItemId === podcast.id ? (
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
			{podcasts && podcasts.length > 0 && (
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

		{/* Podcast Form Section */}
		{showPodcastForm && (
		<div id="podcast-form-section" className="mt-8 pt-8 border-t border-slate-800">
			<div className="flex items-center justify-between">
			<h2 className="text-2xl font-bold text-white">
				{editMode.podcasts ? "Edit Podcast" : "Add New Podcasts"}
			</h2>
			<div className="flex gap-2">
				{!editMode.podcasts && (
				<Button onClick={actions.addPodcastForm} variant="outline" className="btn-secondary">
					<Plus className="mr-2 h-4 w-4" />
					Add Another Podcast
				</Button>
				)}
				<Button onClick={actions.handlePodcastSubmit} className="btn-primary" disabled={isSubmittingPodcasts}>
				<Save className="mr-2 h-4 w-4" />
				{editMode.podcasts ? "Save Changes" : `Submit All (${podcastForms.length})`}
				</Button>
				<Button
				onClick={actions.cancelPodcastEdit}
				variant="outline"
				className="border-slate-600 text-slate-400 hover:bg-slate-800"
				>
				Cancel
				</Button>
			</div>
			</div>

			<div className="space-y-6 mt-6">
			{podcastForms.map((form, index) => (
				<PodcastFormCard
				key={index}
				index={index}
				form={form}
				canRemove={podcastForms.length > 1 && !editMode.podcasts}
				onRemove={() => actions.removePodcastForm(index)}
				onChange={(field, value) => actions.updatePodcastForm(index, field, value)}
				/>
			))}
			</div>
		</div>
		)}
	</div>
	);
}