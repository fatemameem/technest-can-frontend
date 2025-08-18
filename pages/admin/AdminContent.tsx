
import React from 'react';
import { useAppContext } from '../../context/AppContext.js';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card.js';

const AdminContent = () => {
    const { podcasts, team } = useAppContext();

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Content Overview</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Podcasts (Read-only)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {podcasts.map(podcast => (
                                <li key={podcast.id} className="text-dark-text-secondary p-2 bg-slate-800 rounded-md">
                                    {podcast.title}
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Team Members (Read-only)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {team.map(member => (
                                <li key={member.id} className="text-dark-text-secondary p-2 bg-slate-800 rounded-md">
                                    {member.name} - <span className="text-dark-meta">{member.role}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminContent;