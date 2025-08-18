

"use client";

import { type Member, zones, FamilyMember, SpecialRequest } from '@/lib/mock-data';
import { MembersTable } from '@/components/members/members-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SearchInput } from '@/components/members/search-input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { List, Cake, Filter, Gift, HeartHandshake, HandHelping, User, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format, isWithinInterval, addDays, getDayOfYear, getYear, parseISO, setYear } from 'date-fns';
import { FilterMenu } from '@/components/members/filter-menu';
import { getMembers, getSpecialRequests } from '@/services/members';
import { AdminControls } from '@/components/admin/admin-controls';
import { useAuthStore } from '@/hooks/use-auth';
import React from 'react';
import { useSearchParams } from 'next/navigation';

type MemberWithMatchingFamily = Member & {
  matchingFamilyMembers?: FamilyMember[];
}

const CrossIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
        <path d="M12 2v20M5 7h14" />
    </svg>
)

const DirectoryView = ({ members, searchParams }: { members: Member[], searchParams?: { query?: string; page?: string; zone?: string; ward?: string; subgroup?: string;} }) => {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const selectedSubgroup = searchParams?.subgroup || 'all';
  const pageSize = 10;

  // Text search is still performed on the client-side after initial filtering from the DB
  let filteredMembers = members.filter((member) =>
    member.id !== 'admin' &&
    (member.name.toLowerCase().includes(query.toLowerCase()) ||
    member.email.toLowerCase().includes(query.toLowerCase()) ||
    (member.familyName && member.familyName.toLowerCase().includes(query.toLowerCase())))
  );
  
  // This logic is for highlighting matching family members, not for filtering the main list
  if (selectedSubgroup !== 'all') {
    filteredMembers = filteredMembers.map(member => {
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
        <AdminControls>
            <Link href="/members/edit/new">
                <div className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                    <UserPlus className="mr-2 h-4 w-4" /> Add Member
                </div>
            </Link>
        </AdminControls>
      </div>
      <MembersTable members={paginatedMembers} currentPage={currentPage} totalPages={totalPages} selectedSubgroup={selectedSubgroup} />
    </>
  )
}

const CelebrationsView = ({ members }: { members: Member[] }) => {
    const today = new Date();
    const currentYear = getYear(today);
    const todayDayOfYear = getDayOfYear(today);
    const nextSevenDays = addDays(today, 7);

    const upcomingEvents = members
        .filter(member => member.id !== 'admin' && member.status === 'Active')
        .flatMap(member => {
            const events = [];
            if (member.birthday) {
                events.push({ type: 'Birthday', date: member.birthday, person: member, isFamilyMember: false, headOfFamily: member });
            }
            if (member.maritalStatus === 'Married' && member.weddingDay) {
                events.push({ type: 'Wedding', date: member.weddingDay, person: member, isFamilyMember: false, headOfFamily: member });
            }

            member.family.forEach(familyMember => {
                if (familyMember.status === 'Active') {
                    if (familyMember.birthday) {
                        events.push({ type: 'Birthday', date: familyMember.birthday, person: familyMember, isFamilyMember: true, headOfFamily: member });
                    }
                    if (familyMember.maritalStatus === 'Married' && familyMember.weddingDay) {
                        events.push({ type: 'Wedding', date: familyMember.weddingDay, person: familyMember, isFamilyMember: true, headOfFamily: member });
                    }
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

const IntercessoryServicesView = ({ requests }: { requests: SpecialRequest[] }) => {
    return (
        <div className="space-y-4">
            {requests.length > 0 ? (
                requests.map((request) => (
                    <Link key={request.id} href={`/members/${request.memberId}`} className="block">
                        <div className="flex items-start gap-4 p-4 rounded-lg border hover:bg-muted transition-colors">
                             <Avatar className="h-12 w-12">
                                <AvatarImage src={request.memberAvatarUrl} alt={request.memberName} data-ai-hint="person" />
                                <AvatarFallback>{request.memberName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-semibold text-lg">{request.memberName}</p>
                                        <p className="text-sm text-muted-foreground">Requested a prayer for</p>
                                        <p className="font-semibold text-base">{request.prayingFor}</p>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className="font-semibold text-primary">{format(parseISO(request.requestDate), 'MMMM d, yyyy')}</p>
                                        <p className="text-xs text-muted-foreground">{format(parseISO(request.requestDate), 'EEEE')}</p>
                                    </div>
                                </div>
                                <p className="mt-2 text-base bg-background/50 p-3 rounded-md">
                                    <strong>{request.requestType}</strong>
                                    {request.requestType === 'Other Intercessory Prayers' && request.otherRequest && `: ${request.otherRequest}`}
                                </p>
                            </div>
                        </div>
                    </Link>
                ))
            ) : (
                <p className="text-muted-foreground p-4 text-center">No special requests at this time.</p>
            )}
        </div>
    );
}

function MembersPageContent({
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
  const { member: currentUser } = useAuthStore();
  const isAdmin = currentUser?.role === 'Admin';
  const currentSearchParams = useSearchParams();
  const view = currentSearchParams.get('view') || 'directory';

  const [members, setMembers] = React.useState<Member[]>([]);
  const [requests, setRequests] = React.useState<SpecialRequest[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        const filters = {
          zone: currentSearchParams.get('zone') || undefined,
          ward: currentSearchParams.get('ward') || undefined,
          subgroup: currentSearchParams.get('subgroup') || undefined,
        };
        const [membersData, requestsData] = await Promise.all([
            getMembers(filters),
            isAdmin ? getSpecialRequests() : Promise.resolve([])
        ]);
        setMembers(membersData);
        setRequests(requestsData);
        setLoading(false);
    }
    fetchData();
  }, [isAdmin, currentSearchParams]);

  if (loading) {
      return (
          <div className="container mx-auto py-10">
              <Card className="shadow-lg">
                  <CardHeader>
                      <CardTitle className="font-headline text-2xl">Church Members</CardTitle>
                      <CardDescription>Browse and manage the directory of church members.</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <div className="flex justify-center items-center p-10">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                      </div>
                  </CardContent>
              </Card>
          </div>
      )
  }
  

  return (
    <div className="container mx-auto py-10">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Church Members</CardTitle>
          <CardDescription>Browse and manage the directory of church members.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={view} className="w-full">
            <TabsList className={`grid w-full ${isAdmin ? 'grid-cols-3' : 'grid-cols-2'}`}>
              <TabsTrigger value="directory"><List className="mr-2 h-4 w-4" />Directory</TabsTrigger>
              <TabsTrigger value="celebrations"><Cake className="mr-2 h-4 w-4" />Celebrations</TabsTrigger>
              {isAdmin && <TabsTrigger value="intercessory"><CrossIcon />Intercessory Services</TabsTrigger>}
            </TabsList>
            <TabsContent value="directory" className="mt-6">
              <DirectoryView members={members} searchParams={searchParams} />
            </TabsContent>
            <TabsContent value="celebrations" className="mt-6">
              <CelebrationsView members={members} />
            </TabsContent>
            {isAdmin && <TabsContent value="intercessory" className="mt-6">
                <IntercessoryServicesView requests={requests} />
            </TabsContent>}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}


export default function MembersPage({
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
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <MembersPageContent searchParams={searchParams} />
    </React.Suspense>
  )
}
