
'use client'

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Users, Cake, ArrowRight, HandHelping, Church } from 'lucide-react';
import Link from 'next/link';
import { useAuthStore } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Progress } from '@/components/ui/progress';

export default function AdminDashboard() {
    const { member } = useAuthStore();
    const router = useRouter();
    const [loading, setLoading] = React.useState(true);


    React.useEffect(() => {
        if(member) {
            if(member.role !== 'Admin') {
                router.push('/members');
            } else {
                setLoading(false);
            }
        }
    }, [member, router]);

    const dashboardCards = [
        {
            title: 'Manage Members',
            description: 'Add, edit, and view all member profiles and their families.',
            icon: <Users className="h-8 w-8 text-primary" />,
            link: '/members',
        },
        {
            title: 'Intercessory Requests',
            description: 'View and manage all special prayer requests from members.',
            icon: <Church className="h-8 w-8 text-primary" />,
            link: '/members?view=intercessory',
        },
        {
            title: 'Upcoming Celebrations',
            description: 'See upcoming birthdays and wedding anniversaries.',
            icon: <Cake className="h-8 w-8 text-primary" />,
            link: '/members?view=celebrations',
        },
    ];

    if (loading) {
        return (
             <div className="flex flex-col justify-center items-center h-full gap-4">
                <p>Loading Admin Dashboard...</p>
                <Progress value={50} className="w-1/2" />
            </div>
        )
    }

    if (!member) return null;

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
                <p className="text-muted-foreground">Welcome back, {member.name}. Here is your overview.</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {dashboardCards.map((card) => (
                    <Link href={card.link} key={card.title}>
                        <Card className="hover:shadow-lg transition-shadow h-full flex flex-col">
                            <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                                <div className="p-3 bg-primary/10 rounded-lg">
                                    {card.icon}
                                </div>
                                <div className="flex-1">
                                    <CardTitle>{card.title}</CardTitle>
                                </div>
                                <ArrowRight className="h-5 w-5 text-muted-foreground" />
                            </CardHeader>
                            <CardContent className="pt-2 flex-1">
                                <p className="text-sm text-muted-foreground">{card.description}</p>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}
