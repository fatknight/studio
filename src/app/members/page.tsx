import { members, type Member } from '@/lib/mock-data';
import { MembersTable } from '@/components/members/members-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function MembersPage({
  searchParams,
}: {
  searchParams?: {
    page?: string;
  };
}) {
  const currentPage = Number(searchParams?.page) || 1;
  const pageSize = 10;

  const paginatedMembers: Member[] = members.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(members.length / pageSize);

  return (
    <div className="container mx-auto py-10">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Church Members</CardTitle>
          <CardDescription>Browse and manage the directory of church members.</CardDescription>
        </CardHeader>
        <CardContent>
          <MembersTable members={paginatedMembers} currentPage={currentPage} totalPages={totalPages} />
        </CardContent>
      </Card>
    </div>
  );
}
