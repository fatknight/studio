"use client";

import { Church, LogOut, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuthStore } from "@/hooks/use-auth";

export default function MembersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { member, setMember } = useAuthStore();


  const handleLogout = () => {
    setMember(null);
    router.push("/");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center">
          <Link href="/members" className="flex items-center gap-2 font-bold font-headline">
            <Church className="h-6 w-6 text-primary" />
            <span className="text-lg">Cathedral Family</span>
          </Link>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={member?.avatarUrl || "https://placehold.co/40x40.png"} alt="User avatar" data-ai-hint="person" />
                    <AvatarFallback>
                      <User />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{member?.name || 'Member'}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {member?.role || 'Member'}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
