
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import React from "react";
import { format } from "date-fns";
import { CalendarIcon, User } from "lucide-react";

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
import { type Member, CreateRequestInputSchema } from "@/lib/mock-data";
import { createRequest } from "@/ai/flows/create-request-flow";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";

const CrossIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
        <path d="M12 2v20M5 7h14" />
    </svg>
)

const formSchema = CreateRequestInputSchema.omit({
    memberId: true,
    memberName: true,
    memberAvatarUrl: true,
}).extend({
    requestDate: z.date({
        required_error: "A date for the service is required.",
    }),
}).refine(data => {
    if (data.requestType === 'Other Intercessory Prayers') {
        return !!data.otherRequest && data.otherRequest.length >= 10;
    }
    return true;
}, {
    message: "Please provide details for your prayer request (minimum 10 characters).",
    path: ["otherRequest"],
});

type FormValues = z.infer<typeof formSchema>;

export function RequestForm({ children, member }: { children: React.ReactNode, member: Member }) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  
  const requestTypeRef = React.useRef<HTMLButtonElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        otherRequest: "",
        prayingFor: "",
    }
  });

  const requestType = form.watch("requestType");

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    
    try {
      await createRequest({
        memberId: member.id,
        memberName: member.name,
        memberAvatarUrl: member.avatarUrl,
        requestDate: values.requestDate.toISOString(),
        prayingFor: values.prayingFor,
        requestType: values.requestType,
        otherRequest: values.otherRequest,
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
            Request an Intercessory Service for a specific date. Please select the type of prayer and provide details below.
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
                        onSelect={(date) => {
                          field.onChange(date);
                          // A short delay to allow the popover to close before focusing
                          setTimeout(() => requestTypeRef.current?.focus(), 100);
                        }}
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
              name="prayingFor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Praying For</FormLabel>
                  <FormControl>
                    <div className="relative">
                       <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                       <Input placeholder="Enter name" {...field} className="pl-10" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
                control={form.control}
                name="requestType"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Prayer Request Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger ref={requestTypeRef}>
                                <SelectValue placeholder="Select a prayer type" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="Orma Qurbana">Orma Qurbana</SelectItem>
                                <SelectItem value="Special Qurbana">Special Qurbana</SelectItem>
                                <SelectItem value="Other Intercessory Prayers">Other Intercessory Prayers</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />

            {requestType === 'Other Intercessory Prayers' && (
                 <FormField
                    control={form.control}
                    name="otherRequest"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Details for your Prayer</FormLabel>
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
            )}

            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="ghost">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
                    ) : (
                        <>
                        <CrossIcon /> Submit Request
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
