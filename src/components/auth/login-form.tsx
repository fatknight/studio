
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import React from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { LogIn } from "lucide-react";
import { authenticateMember } from "@/services/members";
import { useAuthStore } from "@/hooks/use-auth";
import { Progress } from "../ui/progress";


const formSchema = z.object({
  phone: z.string().min(1, { message: "Please enter a valid username." }),
  password: z.string().min(1, { message: "Password is required." }),
});

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const { setMember } = useAuthStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    
    const authenticatedMember = await authenticateMember(values.phone, values.password);

    if (authenticatedMember) {
      setMember(authenticatedMember);
      toast({
        title: "Login Successful",
        description: `Welcome back, ${authenticatedMember.name}!`,
      });

      if(authenticatedMember.role === 'Admin') {
        router.push("/admin");
      } else {
        router.push("/members");
      }

    } else {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid phone number or password. Please try again.",
      });
    }
    setIsLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username (Phone Number)</FormLabel>
              <FormControl>
                <Input placeholder="Enter your phone number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <div className="w-full flex items-center justify-center">
              <span className="animate-pulse">Authenticating...</span>
            </div>
          ) : (
             <>
              <LogIn className="mr-2 h-4 w-4" /> Login
             </>
          )}
        </Button>
      </form>
    </Form>
  );
}
