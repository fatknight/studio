"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import React from "react";
import { format } from "date-fns";
import { CalendarIcon, HandHelping } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { type Member } from "@/lib/mock-data";
import { createRequest } from "@/ai/flows/create-request-flow";


const formSchema = z.object({
  requestDate: z.date({
    required_error: "A date for the service is required.",
  }),
  prayerRequest: z.string().min(10, { message: "Prayer request must be at least 10 characters." }),
});

export function RequestForm({ children, member }: { children: React.ReactNode, member: Member }) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prayerRequest: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    
    try {
      await createRequest({
        memberId: member.id,
        memberName: member.name,
        memberAvatarUrl: member.avatarUrl,
        requestDate: values.requestDate.toISOString(),
        prayerRequest: values.prayerRequest,
      });

      toast({
        title: "Request Submitted",
        description: "Your prayer request has been successfully submitted.",
      });
      setOpen(false);
      form.reset();
    } catch (error) {
       toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "There was a problem submitting your request. Please try again.",
      });
      console.error(error);
    }

    setIsLoading(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Special Request</DialogTitle>
          <DialogDescription>
            Request an Intercessory Service for a specific date. Please provide the details for your prayer request below.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pt-4">
            <FormField
              control={form.control}
              name="requestDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Service Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date()
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
                control={form.control}
                name="prayerRequest"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Prayer Request</FormLabel>
                    <FormControl>
                        <Textarea
                        placeholder="Please enter your prayer request here..."
                        className="resize-none"
                        {...field}
                        />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />

            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="ghost">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
                    ) : (
                        <>
                        <HandHelping className="mr-2 h-4 w-4" /> Submit Request
                        </>
                    )}
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

    