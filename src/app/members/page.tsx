import { members, type Member, zones } from '@/lib/mock-data';
import { MembersTable } from '@/components/members/members-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SearchInput } from '@/components/members/search-input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { List, Cake, Filter } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format, isWithinInterval, addDays, getDayOfYear, getYear, parseISO, setYear } from 'date-fns';
import { FilterMenu } from '@/components/members/filter-menu';


const DirectoryView = ({ searchParams }: { searchParams?: { query?: string; page?: string; zone?: string; ward?: string; } }) => {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;
  const selectedZone = searchParams?.zone || 'all';
  const selectedWard = searchParams?.ward || 'all';
  const pageSize = 10;

  let filteredMembers = members.filter((member) =>
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
  
  const paginatedMembers: Member[] = filteredMembers.slice(
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
      <MembersTable members={paginatedMembers} currentPage={currentPage} totalPages={totalPages} />
    </>
  )
}

const BirthdayView = () => {
    const today = new Date();
    const currentYear = getYear(today);
    const todayDayOfYear = getDayOfYear(today);

    const upcomingBirthdays = members
        .map(member => {
            if (!member.birthday) return null;
            const birthdayDate = parseISO(member.birthday);
            
            let currentYearBirthday = setYear(birthdayDate, currentYear);
            
            if (getDayOfYear(currentYearBirthday) < todayDayOfYear) {
                currentYearBirthday = setYear(birthdayDate, currentYear + 1);
            }
            
            return {
                ...member,
                currentYearBirthday
            };
        })
        .filter((member): member is Member & { currentYearBirthday: Date } => {
            if (!member) return false;
            const nextSevenDays = addDays(today, 7);
            return isWithinInterval(member.currentYearBirthday, { start: today, end: nextSevenDays });
        })
        .sort((a, b) => getDayOfYear(a.currentYearBirthday) - getDayOfYear(b.currentYearBirthday));

    return (
        <div className="space-y-4">
            {upcomingBirthdays.length > 0 ? (
                upcomingBirthdays.map(member => (
                    <Link key={member.id} href={`/members/${member.id}`} className="block">
                        <div className="flex items-center justify-between gap-4 p-3 rounded-lg border hover:bg-muted transition-colors">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={member.avatarUrl} alt={member.name} data-ai-hint="person" />
                                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold text-lg">{member.name}</p>
                                    <p className="text-sm text-muted-foreground">{member.familyName}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold text-primary">{format(member.currentYearBirthday, 'MMMM d')}</p>
                                <p className="text-xs text-muted-foreground">{format(member.currentYearBirthday, 'EEEE')}</p>
                            </div>
                        </div>
                    </Link>
                ))
            ) : (
                <p className="text-muted-foreground p-4 text-center">No upcoming birthdays this week.</p>
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
              <TabsTrigger value="birthdays"><Cake className="mr-2 h-4 w-4" />Birthdays</TabsTrigger>
            </TabsList>
            <TabsContent value="directory" className="mt-6">
              <DirectoryView searchParams={searchParams} />
            </TabsContent>
            <TabsContent value="birthdays" className="mt-6">
              <BirthdayView />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
