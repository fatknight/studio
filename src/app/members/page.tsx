import { members, type Member, zones, FamilyMember } from '@/lib/mock-data';
import { MembersTable } from '@/components/members/members-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SearchInput } from '@/components/members/search-input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { List, Cake, Filter, Gift, HeartHandshake } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format, isWithinInterval, addDays, getDayOfYear, getYear, parseISO, setYear } from 'date-fns';
import { FilterMenu } from '@/components/members/filter-menu';

type MemberWithMatchingFamily = Member & {
  matchingFamilyMembers?: FamilyMember[];
}

const DirectoryView = ({ searchParams }: { searchParams?: { query?: string; page?: string; zone?: string; ward?: string; subgroup?: string;} }) => {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const selectedZone = searchParams?.zone || 'all';
  const selectedWard = searchParams?.ward || 'all';
  const selectedSubgroup = searchParams?.subgroup || 'all';
  const pageSize = 10;

  let filteredMembers = members.filter((member) =>
    member.id !== 'admin' &&
    (member.name.toLowerCase().includes(query.toLowerCase()) ||
    member.email.toLowerCase().includes(query.toLowerCase()) ||
    (member.familyName && member.familyName.toLowerCase().includes(query.toLowerCase())))
  );

  if (selectedZone !== 'all') {
    filteredMembers = filteredMembers.filter(member => member.zone === selectedZone);
  }

  if (selectedWard !== 'all' && selectedZone !== 'all') {
    filteredMembers = filteredMembers.filter(member => member.ward === selectedWard);
  }
  
  if (selectedSubgroup !== 'all') {
    filteredMembers = filteredMembers.filter(member => {
        const inMemberSubgroups = member.subGroups?.includes(selectedSubgroup);
        const inFamilySubgroups = member.family?.some(f => f.subGroups?.includes(selectedSubgroup));
        return inMemberSubgroups || inFamilySubgroups;
    }).map(member => {
        const matchingFamilyMembers = member.family?.filter(f => f.subGroups?.includes(selectedSubgroup));
        return { ...member, matchingFamilyMembers };
    });
  }


  const paginatedMembers: (Member | MemberWithMatchingFamily)[] = filteredMembers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(filteredMembers.length / pageSize);

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <SearchInput />
        <FilterMenu />
      </div>
      <MembersTable members={paginatedMembers} currentPage={currentPage} totalPages={totalPages} selectedSubgroup={selectedSubgroup} />
    </>
  )
}

const CelebrationsView = () => {
    const today = new Date();
    const currentYear = getYear(today);
    const todayDayOfYear = getDayOfYear(today);
    const nextSevenDays = addDays(today, 7);

    const upcomingEvents = members
        .filter(member => member.id !== 'admin')
        .flatMap(member => {
            const events = [];
            if (member.birthday) {
                events.push({ type: 'Birthday', date: member.birthday, person: member, isFamilyMember: false, headOfFamily: member });
            }
            if (member.maritalStatus === 'Married' && member.weddingDay) {
                events.push({ type: 'Wedding', date: member.weddingDay, person: member, isFamilyMember: false, headOfFamily: member });
            }

            member.family.forEach(familyMember => {
                if (familyMember.birthday) {
                    events.push({ type: 'Birthday', date: familyMember.birthday, person: familyMember, isFamilyMember: true, headOfFamily: member });
                }
                if (familyMember.maritalStatus === 'Married' && familyMember.weddingDay) {
                    events.push({ type: 'Wedding', date: familyMember.weddingDay, person: familyMember, isFamilyMember: true, headOfFamily: member });
                }
            });
            
            return events;
        })
        .map(event => {
            const eventDate = parseISO(event.date);
            let currentYearEventDate = setYear(eventDate, currentYear);

            if (getDayOfYear(currentYearEventDate) < todayDayOfYear) {
                currentYearEventDate = setYear(eventDate, currentYear + 1);
            }
            
            return {
                ...event,
                currentYearEventDate
            };
        })
        .filter(event => {
            return isWithinInterval(event.currentYearEventDate, { start: today, end: nextSevenDays });
        })
        .sort((a, b) => getDayOfYear(a.currentYearEventDate) - getDayOfYear(b.currentYearEventDate));

    return (
        <div className="space-y-4">
            {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event, index) => (
                    <Link key={index} href={`/members/${event.headOfFamily.id}`} className="block">
                        <div className="flex items-center justify-between gap-4 p-3 rounded-lg border hover:bg-muted transition-colors">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={event.person.avatarUrl} alt={event.person.name} data-ai-hint="person" />
                                    <AvatarFallback>{event.person.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold text-lg">{event.person.name}</p>
                                    {event.isFamilyMember && (
                                        <p className="text-sm text-muted-foreground">{event.person.relation} of {event.headOfFamily.name}</p>
                                    )}
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                        {event.type === 'Birthday' ? <Gift className="h-4 w-4" /> : <HeartHandshake className="h-4 w-4" />}
                                        <span>{event.type} Anniversary</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold text-primary">{format(event.currentYearEventDate, 'MMMM d')}</p>
                                <p className="text-xs text-muted-foreground">{format(event.currentYearEventDate, 'EEEE')}</p>
                            </div>
                        </div>
                    </Link>
                ))
            ) : (
                <p className="text-muted-foreground p-4 text-center">No upcoming celebrations this week.</p>
            )}
        </div>
    );
};


export default async function MembersPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
    view?: string;
    zone?: string;
    ward?: string;
    subgroup?: string;
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
              <TabsTrigger value="celebrations"><Cake className="mr-2 h-4 w-4" />Celebrations</TabsTrigger>
            </TabsList>
            <TabsContent value="directory" className="mt-6">
              <DirectoryView searchParams={searchParams} />
            </TabsContent>
            <TabsContent value="celebrations" className="mt-6">
              <CelebrationsView />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
