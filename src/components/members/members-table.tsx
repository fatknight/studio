"use client";

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Member } from '@/lib/mock-data';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

type MembersTableProps = {
  members: Member[];
  totalPages: number;
  currentPage: number;
};

export function MembersTable({ members, totalPages, currentPage }: MembersTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleRowClick = (id: string) => {
    router.push(`/members/${id}`);
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Avatar</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden sm:table-cell">Phone</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id} onClick={() => handleRowClick(member.id)} className="cursor-pointer">
                <TableCell>
                  <Avatar>
                    <AvatarImage src={member.avatarUrl} alt={member.name} data-ai-hint="person portrait" />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="font-medium">{member.name}</TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">{member.email}</TableCell>
                <TableCell className="hidden sm:table-cell text-muted-foreground">{member.phone}</TableCell>
                <TableCell>
                  <Badge variant={member.status === 'Active' ? 'default' : 'secondary'} className={cn(member.status === 'Active' && 'bg-accent text-accent-foreground')}>
                    {member.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className='ml-1'>Previous</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            <span className='mr-1'>Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
}
