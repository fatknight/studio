import { members, type Member, zones } from '@/lib/mock-data';
import { MembersTable } from '@/components/members/members-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SearchInput } from '@/components/members/search-input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Users, List, User } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


const DirectoryView = ({ searchParams }: { searchParams?: { query?: string; page?: string; } }) => {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const pageSize = 10;

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(query.toLowerCase()) ||
    member.email.toLowerCase().includes(query.toLowerCase()) ||
    (member.familyName && member.familyName.toLowerCase().includes(query.toLowerCase()))
  );

  const paginatedMembers: Member[] = filteredMembers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(filteredMembers.length / pageSize);

  return (
    <>
      <div className="mb-4">
        <SearchInput />
      </div>
      <MembersTable members={paginatedMembers} currentPage={currentPage} totalPages={totalPages} />
    </>
  )
}

const ZoneWardView = () => {
  return (
    <Accordion type="single" collapsible className="w-full">
      {zones.map(zone => (
        <AccordionItem key={zone.name} value={zone.name}>
          <AccordionTrigger className="text-xl font-medium">{zone.name}</AccordionTrigger>
          <AccordionContent>
            <Accordion type="multiple" className="w-full space-y-4">
              {zone.wards.map(ward => {
                const wardMembers = members.filter(m => m.zone === zone.name && m.ward === ward);
                return (
                  <AccordionItem key={ward} value={ward} className="border rounded-lg px-4">
                    <AccordionTrigger className="text-lg">{ward} ({wardMembers.length} members)</AccordionTrigger>
                    <AccordionContent>
                      {wardMembers.length > 0 ? (
                        <div className="space-y-4 pt-2">
                          {wardMembers.map(member => (
                            <Link key={member.id} href={`/members/${member.id}`} className="block">
                              <div className="flex items-center gap-4 p-2 rounded-md hover:bg-muted transition-colors">
                                <Avatar>
                                  <AvatarImage src={member.avatarUrl} alt={member.name} data-ai-hint="person" />
                                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-semibold">{member.name}</p>
                                  <p className="text-sm text-muted-foreground">{member.familyName}</p>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted-foreground p-4 text-center">No members in this ward.</p>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                )
              })}
            </Accordion>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}


export default async function MembersPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
    view?: string;
  };
}) {

  const view = searchParams?.view || 'directory';

  return (
    <div className="container mx-auto py-10">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Church Members</CardTitle>
          <CardDescription>Browse and manage the directory of church members.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={view} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="directory"><List className="mr-2 h-4 w-4" />Directory</TabsTrigger>
              <TabsTrigger value="zone-ward"><Users className="mr-2 h-4 w-4" />Zone & Ward View</TabsTrigger>
            </TabsList>
            <TabsContent value="directory" className="mt-6">
              <DirectoryView searchParams={searchParams} />
            </TabsContent>
            <TabsContent value="zone-ward" className="mt-6">
              <ZoneWardView />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
