import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/login-form";
import { Church } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <Card className="grid grid-cols-1 md:grid-cols-2 shadow-2xl">
          <div className="relative hidden h-full min-h-[550px] flex-col justify-between overflow-hidden rounded-l-lg border-r bg-primary/20 p-10 text-primary-foreground md:flex">
             <Image
                src="https://placehold.co/800x1200.png"
                alt="Image of St. Mary"
                layout="fill"
                objectFit="cover"
                className="absolute inset-0 z-0 opacity-20"
                data-ai-hint="St Mary"
              />
            <div className="relative z-10 flex items-center gap-2 text-2xl font-bold text-primary font-headline">
              <Church className="h-8 w-8" />
              Cathedral Family
            </div>
             <div className="relative z-10 mt-auto">
              <blockquote className="space-y-2">
                <p className="text-lg text-primary">
                  &ldquo;A central place for our community to connect and grow together in faith.&rdquo;
                </p>
                <footer className="text-sm text-primary/80">The Church Elders</footer>
              </blockquote>
            </div>
          </div>
          <div className="p-8 flex flex-col justify-center">
            <CardHeader className="p-0 mb-6 text-center md:hidden">
              <div className="flex items-center justify-center gap-2 text-2xl font-bold text-primary font-headline">
                <Church className="h-8 w-8" />
                Cathedral Family
              </div>
            </CardHeader>
            <CardHeader className="p-0 mb-6 text-left">
              <CardTitle className="text-2xl font-headline tracking-tight">Member Login</CardTitle>
              <CardDescription>Enter your credentials to access the directory.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <LoginForm />
            </CardContent>
          </div>
        </Card>
      </div>
    </main>
  );
}
