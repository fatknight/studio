
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoginForm } from "@/components/auth/login-form";
import { Church } from "lucide-react";

export default function Home() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <div className="w-full max-w-4xl">
        <Card className="grid grid-cols-1 md:grid-cols-2 shadow-2xl">
          <div className="relative flex h-full min-h-[300px] md:min-h-[550px] flex-col justify-between overflow-hidden rounded-t-lg md:rounded-l-lg md:rounded-t-none border-b md:border-r md:border-b-0 bg-primary/10 p-10 text-primary-foreground">
             <div className="absolute inset-0 z-0 bg-primary/20 opacity-50"></div>
             <div className="relative z-10 flex items-center gap-2 text-2xl font-bold text-primary font-headline">
              <Church className="h-8 w-8" />
              St.Mary's JSO Cathedral, Bangalore
            </div>
             <div className="relative z-10 mt-6 block md:hidden">
              <blockquote className="space-y-2 text-center">
                 <Image
                  src="/st-mary.png"
                  alt="Image of St. Mary"
                  width={300}
                  height={150}
                  className="rounded-lg shadow-2xl object-cover mx-auto"
                  data-ai-hint="St Mary"
                />
              </blockquote>
            </div>
            <div className="relative z-10 hidden md:flex justify-center items-center flex-grow">
               <Image
                  src="/st-mary.png"
                  alt="Image of St. Mary"
                  width={300}
                  height={150}
                  className="rounded-lg shadow-2xl object-cover"
                  data-ai-hint="St Mary"
                />
            </div>
             <div className="relative z-10 hidden md:block">
              <blockquote className="space-y-2 text-center">
                <p className="text-lg text-primary">
                  &ldquo;A central place for our community to connect and grow together in faith.&rdquo;
                </p>
                <footer className="text-sm text-primary/80">The Church Elders</footer>
              </blockquote>
            </div>
          </div>
          <div className="flex flex-col justify-center p-8">
            <CardHeader className="p-0 mb-6 text-center md:hidden">
              <div className="flex items-center justify-center gap-2 text-2xl font-bold text-primary font-headline">
                <Church className="h-8 w-8" />
                St.Mary's JSO Cathedral, Bangalore
              </div>
            </CardHeader>
            <CardHeader className="p-0 mb-6 text-left">
              <CardTitle className="text-2xl font-headline tracking-tight">Member Login</CardTitle>
              <CardDescription>Enter your username and password to access the directory.</CardDescription>
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

    
