
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
import type { Member, FamilyMember } from '@/lib/mock-data';
import { Button } from '../ui/button';
import { ChevronLeft, ChevronRight, Edit, Eye, MapPin, MoreHorizontal, Phone, Trash, Users, Upload, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/hooks/use-auth';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { deleteMember } from '@/services/members';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '../ui/badge';
import Link from 'next/link';
import React from 'react';
import { getSecureUrl } from '@/services/storage';

type MemberWithMatchingFamily = Member & {
  matchingFamilyMembers?: FamilyMember[];
}

type MembersTableProps = {
  members: (Member | MemberWithMatchingFamily)[];
  totalPages: number;
  currentPage: number;
  selectedSubgroup?: string;
};

const WhatsAppIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="text-green-500 h-5 w-5">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 4.315 1.919 6.066l-1.425 4.185 4.25-1.109z" />
    </svg>
);


const MemberAvatar = ({ member }: { member: Member }) => {
    const [imageUrl, setImageUrl] = React.useState('');
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        setLoading(true);
        if (member.memberPhotoUrl) {
            getSecureUrl(member.memberPhotoUrl).then(url => {
                setImageUrl(url);
                setLoading(false);
            });
        } else {
            setLoading(false);
        }
    }, [member.memberPhotoUrl]);

    return (
        <Avatar>
            {loading ? (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
            ) : (
                <AvatarImage src={imageUrl} alt={member.name} data-ai-hint="person portrait" />
            )}
            <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
        </Avatar>
    )
}

export function MembersTable({ members, totalPages, currentPage, selectedSubgroup }: MembersTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { member: currentUser } = useAuthStore();
  const { toast } = useToast();

  const handleRowClick = (id: string) => {
    router.push(`/members/${id}`);
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    router.replace(`${pathname}?${params.toString()}`);
  }

  const handleActionClick = (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  const handleEdit = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    router.push(`/members/edit/${id}`);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await deleteMember(id);
      toast({ title: "Member deleted", description: "The member has been successfully deleted." });
      // A bit of a hack to force a re-fetch of data on the page
      router.replace(pathname + '?' + new URLSearchParams(searchParams.toString()));
      router.refresh();
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete member." });
    }
  };
  
  const membersToDisplay = currentUser?.role === 'Admin' 
    ? members 
    : members.filter(member => member.status === 'Active');


  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Photo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden sm:table-cell">Phone</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {membersToDisplay.map((member) => (
              <TableRow key={member.id} onClick={() => handleRowClick(member.id)} className="cursor-pointer">
                <TableCell>
                  <MemberAvatar member={member as Member} />
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <span>{member.name}</span>
                    {member.status === 'Inactive' && currentUser?.role === 'Admin' && (
                        <Badge variant="outline">Inactive</Badge>
                    )}
                  </div>
                  {'matchingFamilyMembers' in member && member.matchingFamilyMembers && member.matchingFamilyMembers.length > 0 && (
                    <div className="text-xs text-muted-foreground mt-1 flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      {selectedSubgroup}: {member.matchingFamilyMembers.map(fm => fm.name).join(', ')}
                    </div>
                  )}
                </TableCell>
                <TableCell className="hidden md:table-cell text-muted-foreground">{member.email}</TableCell>
                <TableCell className="hidden sm:table-cell text-muted-foreground">{member.phone}</TableCell>
                <TableCell className="text-right">
                    {currentUser?.role === 'Admin' ? (
                       <DropdownMenu>
                           <DropdownMenuTrigger asChild>
                               <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                                   <MoreHorizontal className="h-5 w-5" />
                               </Button>
                           </DropdownMenuTrigger>
                           <DropdownMenuContent align="end">
                               <DropdownMenuItem onClick={(e) => handleRowClick(member.id)}>
                                   <Eye className="mr-2 h-4 w-4" /> View
                               </DropdownMenuItem>
                               <DropdownMenuItem onClick={(e) => handleEdit(e, member.id)}>
                                   <Edit className="mr-2 h-4 w-4" /> Edit
                               </DropdownMenuItem>
                               <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                             <Trash className="mr-2 h-4 w-4" /> Delete
                                        </DropdownMenuItem>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete the member account and all associated data.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={(e) => handleDelete(e, member.id)}>Delete</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                               </AlertDialog>
                           </DropdownMenuContent>
                       </DropdownMenu>
                    ) : (
                       <div className='flex items-center justify-end gap-2'>
                         <Button variant="ghost" size="icon" className="sm:hidden" onClick={(e) => handleActionClick(e, `tel:${member.phone}`)}>
                            <Phone className="h-5 w-5 text-primary" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={(e) => handleActionClick(e, `https://wa.me/${member.phone.replace(/\D/g, '')}`)}>
                          <WhatsAppIcon />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={(e) => handleActionClick(e, `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(member.address)}`)}>
                          <MapPin className="h-5 w-5 text-primary" />
                        </Button>
                      </div>
                    )}
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
