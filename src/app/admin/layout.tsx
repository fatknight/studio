
"use client";

import { Church, LogOut, User, Users, Cake, HandHelping } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

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
import { cn } from "@/lib/utils";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { member, setMember } = useAuthStore();

  const handleLogout = () => {
    setMember(null);
    router.push("/");
  };
  
  if(member?.role !== 'Admin') {
    router.push('/members');
    return null;
  }

  const navItems = [
    { href: '/members', label: 'Members', icon: Users },
    { href: '/members?view=intercessory', label: 'Intercessory', icon: HandHelping },
    { href: '/members?view=celebrations', label: 'Celebrations', icon: Cake },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-sm">
        <div className="container flex h-16 items-center">
          <Link href="/admin" className="flex items-center gap-2 font-bold font-headline">
            <Church className="h-6 w-6 text-primary" />
            <span className="text-lg">Cathedral Admin</span>
          </Link>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={member?.memberPhotoUrl || "https://placehold.co/40x40.png"} alt="User avatar" data-ai-hint="person"/>
                    <AvatarFallback>
                      <User />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{member?.name || 'Admin'}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {member?.role || 'Admin'}
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
       <div className="container flex-1 md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
        <aside className="fixed top-16 z-30 -ml-2 hidden h-[calc(100vh-4rem)] w-full shrink-0 md:sticky md:block">
            <div className="h-full py-6 pl-8 pr-6 lg:py-8">
                <nav className="flex flex-col gap-2">
                    {navItems.map(item => (
                        <Link key={item.label} href={item.href} className={cn(
                            "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                            pathname === item.href || (item.href.includes('?') && pathname + `?view=${new URLSearchParams(item.href.split('?')[1]).get('view')}` === item.href) ? "bg-accent" : "transparent"
                        )}>
                            <item.icon className="h-4 w-4" />
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </div>
        </aside>
        <main className="flex-1 py-6">{children}</main>
      </div>
    </div>
  );
}
