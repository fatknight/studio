import { members, type Member } from '@/lib/mock-data';
import { notFound, redirect } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Phone, Home, Calendar, Users, User, Link as LinkIcon, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const DetailItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value?: string | string[] }) => {
  if (!value) return null;
  return (
    <div className="flex items-start gap-4">
      <Icon className="h-5 w-5 text-muted-foreground mt-1" />
      <div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        {Array.isArray(value) ? (
          <ul className="list-disc pl-5">
            {value.map((item, index) => <li key={index} className="text-base font-semibold">{item}</li>)}
          </ul>
        ) : (
          <p className="text-base font-semibold">{value}</p>
        )}
      </div>
    </div>
  );
};


export default async function MemberDetailPage({ params }: { params: { id: string } }) {
  const member = members.find((m) => m.id === params.id);

  if (!member) {
    notFound();
  }

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
            <p className="text-lg text-muted-foreground">{member.email}</p>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="personal"><User className="mr-2 h-4 w-4"/>Personal Details</TabsTrigger>
              <TabsTrigger value="family"><Users className="mr-2 h-4 w-4"/>Family Details</TabsTrigger>
            </TabsList>
            <TabsContent value="personal" className="mt-6">
              <div className="space-y-6">
                <DetailItem icon={Mail} label="Email" value={member.email} />
                <DetailItem icon={Phone} label="Phone" value={member.phone} />
                <DetailItem icon={Home} label="Address" value={member.address} />
                <DetailItem icon={Calendar} label="Join Date" value={format(new Date(member.joinDate), 'MMMM d, yyyy')} />
                <DetailItem icon={LinkIcon} label="Status" value={member.status} />
              </div>
            </TabsContent>
            <TabsContent value="family" className="mt-6">
              <div className="space-y-8">
                <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                  <Image src="https://placehold.co/600x400.png" alt="Family photo" layout="fill" objectFit="cover" data-ai-hint="family photo" />
                </div>
                <div className="space-y-6">
                  {member.family.spouse && <DetailItem icon={User} label="Spouse" value={member.family.spouse} />}
                  {member.family.children && member.family.children.length > 0 && <DetailItem icon={Users} label="Children" value={member.family.children} />}
                  {!member.family.spouse && (!member.family.children || member.family.children.length === 0) && (
                    <p className="text-muted-foreground">No family details available.</p>
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
