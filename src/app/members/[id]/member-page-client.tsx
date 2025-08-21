
'use client';

import type { Member } from '@/lib/mock-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Phone, Home, Calendar, Users, User, ArrowLeft, Map, Gift, HeartHandshake, MapPin, Tag, HandHelping, Edit, Info, Church, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { RequestForm } from '@/components/members/request-form';
import { useAuthStore } from '@/hooks/use-auth';
import { DetailItem, FamilyMemberCard } from './page';
import React from 'react';
import { getSecureUrl } from '@/services/storage';

const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-green-500">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 4.315 1.919 6.066l-1.425 4.185 4.25-1.109z" />
    </svg>
);

const SecureImage = ({ src, alt, ...props }: React.ComponentProps<typeof Image>) => {
    const [imageUrl, setImageUrl] = React.useState('');
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        if (src) {
            setLoading(true);
            getSecureUrl(src as string).then(url => {
                setImageUrl(url);
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, [src]);

    if (loading) {
        return (
            <div className="w-full h-full bg-muted flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }
    
    if (!imageUrl) return null;

    return <Image src={imageUrl} alt={alt} {...props} onContextMenu={(e) => e.preventDefault()} />;
};


export const MemberPageClient = ({ member }: { member: Member }) => {
    const { member: currentUser } = useAuthStore();
    const isAdmin = currentUser?.role === 'Admin';
    const isOwner = currentUser?.id === member.id;
    const [memberPhotoUrl, setMemberPhotoUrl] = React.useState('');
    const [loadingPhoto, setLoadingPhoto] = React.useState(true);

    React.useEffect(() => {
        if (member.memberPhotoUrl) {
            setLoadingPhoto(true);
            getSecureUrl(member.memberPhotoUrl).then(url => {
                setMemberPhotoUrl(url);
                setLoadingPhoto(false);
            });
        } else {
            setLoadingPhoto(false);
        }
    }, [member.memberPhotoUrl]);

    if (!isAdmin && member.status === 'Inactive') {
        return (
            <div className="container mx-auto max-w-4xl py-10 text-center">
                 <Card>
                    <CardHeader>
                        <CardTitle>Member Not Found</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>This member's profile is not available.</p>
                        <Link href="/members" className='mt-4 inline-block'>
                            <Button variant="outline">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Directory
                            </Button>
                        </Link>
                    </CardContent>
                 </Card>
            </div>
        )
    }

    const whatsappLink = `https://wa.me/${member.phone.replace(/\D/g, '')}`;
    
    const visibleFamilyMembers = isAdmin 
        ? member.family 
        : member.family.filter(f => f.status !== 'Inactive');


    return (
        <div className="container mx-auto max-w-4xl py-10">
            <div className="flex justify-between items-center mb-6">
                <Link href="/members" className='inline-block'>
                    <Button variant="outline">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Directory
                    </Button>
                </Link>
                <div className="flex items-center gap-2">
                    {(isAdmin || isOwner) && (
                         <Link href={`/members/edit/${member.id}`}>
                            <Button variant="outline">
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Member
                            </Button>
                        </Link>
                    )}
                    {(isOwner || isAdmin) && (
                        <RequestForm member={member}>
                        <Button>
                            <Church className="mr-2 h-4 w-4" />
                            Make a Request
                        </Button>
                        </RequestForm>
                    )}
                </div>
            </div>
            <Card className="overflow-hidden shadow-lg">
                <CardHeader className="flex flex-col items-center gap-6 bg-primary/10 p-6 text-center sm:flex-row sm:text-left">
                     <Avatar className="h-24 w-24 border-4 border-background shadow-md">
                        {loadingPhoto ? (
                            <div className="w-full h-full flex items-center justify-center bg-muted">
                                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                            </div>
                        ) : (
                            <AvatarImage src={memberPhotoUrl} alt={member.name} data-ai-hint="person portrait" onContextMenu={(e) => e.preventDefault()} />
                        )}
                        <AvatarFallback className="text-3xl">{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                        <div className='flex items-center gap-4'>
                            <CardTitle className="font-headline text-3xl">{member.name}</CardTitle>
                            {member.status === 'Inactive' && <Badge variant="destructive">Inactive</Badge>}
                        </div>
                        <p className="text-lg text-muted-foreground">{member.familyName}</p>
                        {member.memberId && <Badge variant="secondary" className="mt-2">{member.memberId}</Badge>}
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    <Tabs defaultValue="personal" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="personal"><User className="mr-2 h-4 w-4" />Personal Details</TabsTrigger>
                            <TabsTrigger value="family"><Users className="mr-2 h-4 w-4" />Family Details</TabsTrigger>
                        </TabsList>
                        <TabsContent value="personal" className="mt-6">
                            <div className="space-y-6">
                                {member.familyId && <DetailItem icon={Info} label="Family ID" value={member.familyId} />}
                                <DetailItem icon={Mail} label="Email" value={member.email} />
                                <DetailItem icon={Phone} label="Phone" value={member.phone} action={
                                   member.phone !== 'admin' && <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                                        <Button variant="ghost" size="icon">
                                            <WhatsAppIcon />
                                        </Button>
                                    </a>
                                } />
                                <DetailItem icon={Home} label="Address" value={member.address} action={
                                   member.address !== 'N/A' && <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(member.address)}`} target="_blank" rel="noopener noreferrer">
                                        <Button variant="outline" size="sm">
                                            <Map className="mr-2 h-4 w-4" /> Directions
                                        </Button>
                                    </a>
                                } />
                                <DetailItem icon={MapPin} label="Native District" value={member.nativeDistrict} />
                                <DetailItem icon={Gift} label="Birthday" value={member.birthday ? format(new Date(member.birthday), 'MMMM d') : undefined} />
                                {member.maritalStatus === 'Married' && member.weddingDay && (
                                    <DetailItem icon={HeartHandshake} label="Wedding Day" value={format(new Date(member.weddingDay), 'MMMM d')} />
                                )}
                                <DetailItem icon={Calendar} label="Home Parish" value={member.homeParish} />
                                <DetailItem icon={Tag} label="">
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {member.subGroups && member.subGroups.length > 0 ? (
                                            member.subGroups.map((group, index) => (
                                                <Badge key={index} variant="secondary" className="text-base py-1 px-3">{group}</Badge>
                                            ))
                                        ) : (
                                            <p className="text-base font-semibold text-muted-foreground">Not a member of any sub-groups.</p>
                                        )}
                                    </div>
                                </DetailItem>
                            </div>
                        </TabsContent>
                        <TabsContent value="family" className="mt-6">
                            <div className="space-y-8">
                                <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                                    <SecureImage src={member.familyPhotoUrl || "https://placehold.co/600x400.png"} alt="Family photo" layout="fill" objectFit="cover" data-ai-hint="family photo" />
                                </div>
                                 <div className="grid gap-4 md:grid-cols-2">
                                    {visibleFamilyMembers.length > 0 ? (
                                        visibleFamilyMembers.map((familyMember, index) => (
                                            <FamilyMemberCard key={index} member={familyMember} isAdmin={isAdmin} />
                                        ))
                                    ) : (
                                        <p className="text-muted-foreground col-span-2">No family details available.</p>
                                    )}
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
