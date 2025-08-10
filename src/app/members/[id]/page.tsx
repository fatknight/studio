import { members, type Member, type FamilyMember } from '@/lib/mock-data';
import { notFound, redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Phone, Home, Calendar, Users, User, Link as LinkIcon, ArrowLeft, Map, Gift, HeartHandshake, MapPin, Tag } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-green-500">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 4.315 1.919 6.066l-1.425 4.185 4.25-1.109z" />
    </svg>
);


const DetailItem = ({ icon: Icon, label, value, action, children }: { icon: React.ElementType, label: string, value?: string | string[], action?: React.ReactNode, children?: React.ReactNode }) => {
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

const FamilyMemberCard = ({ member }: { member: FamilyMember }) => (
    <Card>
        <CardHeader className="flex flex-row items-center gap-4">
             <Avatar className="h-16 w-16 border">
                <AvatarImage src={member.avatarUrl} alt={member.name} data-ai-hint="person" />
                <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
                <CardTitle>{member.name}</CardTitle>
                <CardDescription>{member.relation}</CardDescription>
            </div>
        </CardHeader>
        <CardContent className="space-y-4 text-sm pt-4">
            {member.birthday && <p><Gift className="inline-block mr-2 h-4 w-4 text-muted-foreground" /> Birthday: {format(new Date(member.birthday), 'MMMM d')}</p>}
            {member.phone && member.phone !== "N/A" && <p><Phone className="inline-block mr-2 h-4 w-4 text-muted-foreground" /> Phone: {member.phone}</p>}
            {member.homeParish && <p><Calendar className="inline-block mr-2 h-4 w-4 text-muted-foreground" /> Home Parish: {member.homeParish}</p>}
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
    const member = members.find((m) => m.id === params.id);

    if (!member) {
        notFound();
    }

    const whatsappLink = `https://wa.me/${member.phone.replace(/\D/g, '')}`;

    return (
        <div className="container mx-auto max-w-4xl py-10">
            <Link href="/members" className='mb-6 inline-block'>
                <Button variant="outline">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Directory
                </Button>
            </Link>
            <Card className="overflow-hidden shadow-lg">
                <CardHeader className="flex flex-col items-center gap-6 bg-primary/10 p-6 text-center sm:flex-row sm:text-left">
                    <Avatar className="h-24 w-24 border-4 border-background shadow-md">
                        <AvatarImage src={member.avatarUrl} alt={member.name} data-ai-hint="person portrait" />
                        <AvatarFallback className="text-3xl">{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="font-headline text-3xl">{member.name}</CardTitle>
                        <p className="text-lg text-muted-foreground">{member.familyName}</p>
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
                                <DetailItem icon={Gift} label="Birthday" value={member.birthday ? format(new Date(member.birthday), 'MMMM d, yyyy') : undefined} />
                                <DetailItem icon={HeartHandshake} label="Wedding Day" value={member.weddingDay ? format(new Date(member.weddingDay), 'MMMM d, yyyy') : undefined} />
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
                                    <Image src="https://placehold.co/600x400.png" alt="Family photo" layout="fill" objectFit="cover" data-ai-hint="family photo" />
                                </div>
                                 <div className="grid gap-4 md:grid-cols-2">
                                    {member.family.length > 0 ? (
                                        member.family.map((familyMember) => (
                                            <FamilyMemberCard key={familyMember.name} member={familyMember} />
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
