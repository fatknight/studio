'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import React from 'react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, PlusCircle, Save, Trash, X } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { type Member, zones } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';
import { createMember, updateMember } from '@/services/members';
import { Textarea } from '../ui/textarea';

const familyMemberSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  relation: z.enum(['Spouse', 'Son', 'Daughter', 'Daughter-in-law', 'Son-in-law', 'Grandson', 'Granddaughter', 'Mother', 'Father', 'Brother', 'Sister', 'Others']),
  status: z.enum(['Active', 'Inactive']).optional(),
  birthday: z.date().optional(),
  phone: z.string().optional(),
  avatarUrl: z.string().url().optional(),
  subGroups: z.array(z.string()).optional(),
  maritalStatus: z.enum(['Single', 'Married', 'Divorced', 'Widowed']).optional(),
  weddingDay: z.date().optional(),
});

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone is required'),
  password: z.string().optional(),
  address: z.string().min(1, 'Address is required'),
  status: z.enum(['Active', 'Inactive']),
  homeParish: z.string().min(1, 'Home Parish is required'),
  nativeDistrict: z.string().min(1, 'Native District is required'),
  birthday: z.date().optional(),
  maritalStatus: z.enum(['Single', 'Married', 'Divorced', 'Widowed']),
  weddingDay: z.date().optional(),
  familyName: z.string().optional(),
  familyId: z.string().optional(),
  subGroups: z.array(z.string()).optional(),
  avatarUrl: z.string().url('Invalid URL'),
  zone: z.string().min(1, 'Zone is required'),
  ward: z.string().min(1, 'Ward is required'),
  role: z.enum(['Admin', 'Member']),
  family: z.array(familyMemberSchema),
});

type FormValues = z.infer<typeof formSchema>;

export function MemberForm({ member }: { member: Member | null }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const isNew = member === null;

  const defaultValues = {
      ...member,
      birthday: member?.birthday ? new Date(member.birthday) : undefined,
      weddingDay: member?.weddingDay ? new Date(member.weddingDay) : undefined,
      family: member?.family.map(f => ({
          ...f,
          status: f.status || 'Active',
          birthday: f.birthday ? new Date(f.birthday) : undefined,
          weddingDay: f.weddingDay ? new Date(f.weddingDay) : undefined,
      })) || [],
      subGroups: member?.subGroups || [],
      role: member?.role || 'Member',
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: isNew ? { 
        status: 'Active',
        maritalStatus: 'Single',
        family: [],
        subGroups: [],
        role: 'Member',
        avatarUrl: 'https://placehold.co/128x128.png',
     } : defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'family',
  });

  const selectedZone = form.watch('zone');
  const currentZone = zones.find(z => z.name === selectedZone);

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    
    const memberData = {
        ...values,
        birthday: values.birthday?.toISOString(),
        weddingDay: values.weddingDay?.toISOString(),
        family: values.family.map(f => ({
            ...f,
            birthday: f.birthday?.toISOString(),
            weddingDay: f.weddingDay?.toISOString(),
        })),
    };

    try {
        if (isNew) {
            await createMember(memberData);
            toast({ title: 'Member Created', description: 'New member has been successfully added.' });
        } else if(member) {
            await updateMember(member.id, memberData);
            toast({ title: 'Member Updated', description: 'Member details have been successfully updated.' });
        }
        router.push('/members');
        router.refresh();
    } catch (error) {
        console.error("Form submission error:", error)
        toast({ variant: 'destructive', title: 'Error', description: 'An error occurred. Please try again.' });
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>{isNew ? 'Add New Member' : 'Edit Member'}</CardTitle>
              <CardDescription>Fill in the details below to {isNew ? 'add a new' : 'update the'} member.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="familyName" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Family Name</FormLabel>
                        <FormControl><Input placeholder="Doe Family" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                 <FormField control={form.control} name="familyId" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Family ID</FormLabel>
                        <FormControl><Input placeholder="e.g., 24/PM/0001" {...field} /></FormControl>
                        <FormDescription>Unique identifier for the family.</FormDescription>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl><Input type="email" placeholder="member@example.com" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl><Input placeholder="555-0101" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="password" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl><Input type="password" placeholder="Leave blank to keep unchanged" {...field} /></FormControl>
                        <FormDescription>Set or update the member's login password. A password is required for the member role</FormDescription>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="address" render={({ field }) => (
                    <FormItem className="md:col-span-2">
                        <FormLabel>Address</FormLabel>
                        <FormControl><Textarea placeholder="123 Maple St, Anytown, USA" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="homeParish" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Home Parish</FormLabel>
                        <FormControl><Input placeholder="St. Peter's Cathedral" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="nativeDistrict" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Native District</FormLabel>
                        <FormControl><Input placeholder="Kottayam" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="birthday" render={({ field }) => (
                    <FormItem className="flex flex-col">
                        <FormLabel>Birthday</FormLabel>
                         <Popover>
                            <PopoverTrigger asChild>
                            <FormControl>
                                <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="maritalStatus" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Marital Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="Single">Single</SelectItem>
                                <SelectItem value="Married">Married</SelectItem>
                                <SelectItem value="Divorced">Divorced</SelectItem>
                                <SelectItem value="Widowed">Widowed</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )} />
                {form.watch('maritalStatus') === 'Married' && (
                    <FormField control={form.control} name="weddingDay" render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Wedding Day</FormLabel>
                             <Popover>
                                <PopoverTrigger asChild>
                                <FormControl>
                                    <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                    {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )} />
                )}
                 <FormField control={form.control} name="avatarUrl" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Avatar URL</FormLabel>
                        <FormControl><Input placeholder="https://placehold.co/128x128.png" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                 <FormField control={form.control} name="zone" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Zone</FormLabel>
                        <Select onValueChange={(value) => { field.onChange(value); form.setValue('ward', ''); }} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select zone" /></SelectTrigger></FormControl>
                            <SelectContent>
                                {zones.map(zone => <SelectItem key={zone.name} value={zone.name}>{zone.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )} />
                 {currentZone && (
                     <FormField control={form.control} name="ward" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Ward</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Select ward" /></SelectTrigger></FormControl>
                                <SelectContent>
                                    {currentZone.wards.map(ward => <SelectItem key={ward} value={ward}>{ward}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )} />
                 )}
                 <FormField control={form.control} name="status" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Inactive">Inactive</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="role" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="Member">Member</SelectItem>
                                <SelectItem value="Admin">Admin</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )} />
            </CardContent>
          </Card>

           <Card>
                <CardHeader>
                    <CardTitle>Family Members</CardTitle>
                    <CardDescription>Add and manage family members.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {fields.map((field, index) => (
                        <div key={field.id} className="p-4 border rounded-lg relative space-y-4">
                             <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2" onClick={() => remove(index)}>
                                <X className="h-4 w-4" />
                            </Button>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField control={form.control} name={`family.${index}.name`} render={({ field }) => (
                                    <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name={`family.${index}.relation`} render={({ field }) => (
                                    <FormItem><FormLabel>Relation</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger><SelectValue placeholder="Select relation" /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                {['Spouse', 'Son', 'Daughter', 'Daughter-in-law', 'Son-in-law', 'Grandson', 'Granddaughter', 'Mother', 'Father', 'Brother', 'Sister', 'Others'].map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    <FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name={`family.${index}.status`} render={({ field }) => (
                                    <FormItem><FormLabel>Status</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl>
                                            <SelectContent>
                                                <SelectItem value="Active">Active</SelectItem>
                                                <SelectItem value="Inactive">Inactive</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    <FormMessage /></FormItem>
                                )} />
                                 <FormField control={form.control} name={`family.${index}.birthday`} render={({ field }) => (
                                    <FormItem className="flex flex-col"><FormLabel>Birthday</FormLabel>
                                         <Popover>
                                            <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>
                                                {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                                            </PopoverContent>
                                        </Popover>
                                    <FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name={`family.${index}.phone`} render={({ field }) => (
                                    <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                            </div>
                        </div>
                    ))}
                    <Button type="button" variant="outline" onClick={() => append({ name: '', relation: 'Others', status: 'Active' })}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Family Member
                    </Button>
                </CardContent>
           </Card>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : <><Save className="mr-2 h-4 w-4" /> Save Member</>}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
