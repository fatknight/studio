
import { type Member, type FamilyMember } from '@/lib/mock-data';
import { notFound, redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Phone, Home, Calendar, Users, User, Link as LinkIcon, ArrowLeft, Map, Gift, HeartHandshake, MapPin, Tag, Heart, HandHelping, Edit, Trash, ShieldOff } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { getMemberById } from '@/services/members';
import { RequestForm } from '@/components/members/request-form';
import { AdminControls } from '@/components/admin/admin-controls';
import { MemberPageClient } from './member-page-client';
import React from 'react';
import { getSecureUrl } from '@/services/storage';

const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-green-500">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 4.315 1.919 6.066l-1.425 4.185 4.25-1.109z" />
    </svg>
);


export const DetailItem = ({ icon: Icon, label, value, action, children }: { icon: React.ElementType, label: string, value?: string | string[], action?: React.ReactNode, children?: React.ReactNode }) => {
    if (!value && !children && !action) return null;
    return (
        <div className="flex items-start gap-4">
            <Icon className="h-5 w-5 text-muted-foreground mt-1" />
            <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">{label}</p>
                {value && (Array.isArray(value) ? (
                    <ul className="list-disc pl-5">
                        {value.map((item, index) => <li key={index} className="text-base font-semibold">{item}</li>)}
                    </ul>
                ) : (
                    <p className="text-base font-semibold">{value}</p>
                ))}
                {children}
            </div>
            {action}
        </div>
    );
};

const FamilyMemberAvatar = ({ member }: { member: FamilyMember }) => {
    const [imageUrl, setImageUrl] = React.useState('');

    React.useEffect(() => {
        if (member.memberPhotoUrl) {
            getSecureUrl(member.memberPhotoUrl).then(setImageUrl);
        }
    }, [member.memberPhotoUrl]);

    return (
        <Avatar className="h-16 w-16 border">
            <AvatarImage src={imageUrl} alt={member.name} data-ai-hint="person" />
            <AvatarFallback>{member.name ? member.name.split(' ').map(n => n[0]).join('') : ''}</AvatarFallback>
        </Avatar>
    );
}

export const FamilyMemberCard = ({ member, isAdmin }: { member: FamilyMember, isAdmin?: boolean }) => (
    <Card>
        <CardHeader className="flex flex-row items-center gap-4">
             <FamilyMemberAvatar member={member} />
            <div>
                <div className="flex items-center gap-2">
                    <CardTitle>{member.name}</CardTitle>
                     {isAdmin && member.status === 'Inactive' && (
                        <Badge variant="outline" className="text-xs"><ShieldOff className="h-3 w-3 mr-1"/>Inactive</Badge>
                    )}
                </div>
                <CardDescription>{member.relation}</CardDescription>
            </div>
        </CardHeader>
        <CardContent className="space-y-4 text-sm pt-4">
            {member.birthday && <p><Gift className="inline-block mr-2 h-4 w-4 text-muted-foreground" /> Birthday: {format(new Date(member.birthday), 'MMMM d')}</p>}
            {member.phone && member.phone !== "N/A" && <p><Phone className="inline-block mr-2 h-4 w-4 text-muted-foreground" /> Phone: {member.phone}</p>}
            {member.maritalStatus === 'Married' && member.weddingDay && (
                <p><HeartHandshake className="inline-block mr-2 h-4 w-4 text-muted-foreground" /> Wedding Day: {format(new Date(member.weddingDay), 'MMMM d')}</p>
            )}
            {member.subGroups && member.subGroups.length > 0 && (
                <div className="flex items-start">
                    <Tag className="inline-block mr-2 h-4 w-4 text-muted-foreground mt-1" />
                    <div className="flex flex-wrap gap-1">
                        {member.subGroups.map((group, index) => (
                           <Badge key={index} variant="secondary">{group}</Badge>
                        ))}
                    </div>
                </div>
            )}
        </CardContent>
    </Card>
)


export default async function MemberDetailPage({ params }: { params: { id: string } }) {
    const member = await getMemberById(params.id);

    if (!member) {
        notFound();
    }
    
    return <MemberPageClient member={member} />
}
