
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import React from 'react';
import Image from 'next/image';
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
import { CalendarIcon, PlusCircle, Save, Trash, X, Upload, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { type Member, zones } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';
import { createMember, updateMember } from '@/services/members';
import { Textarea } from '../ui/textarea';
import { useAuthStore } from '@/hooks/use-auth';
import { AdminControls } from '../admin/admin-controls';
import { getSecureUrl, uploadImage } from '@/services/storage';

const familyMemberSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  relation: z.enum(['Spouse', 'Son', 'Daughter', 'Daughter-in-law', 'Son-in-law', 'Grandson', 'Granddaughter', 'Mother', 'Father', 'Brother', 'Sister', 'Others']),
  status: z.enum(['Active', 'Inactive']).optional(),
  birthday: z.date().optional(),
  phone: z.string().optional(),
  memberPhotoUrl: z.string().optional(),
  subGroups: z.array(z.string()).optional(),
  maritalStatus: z.enum(['Single', 'Married', 'Divorced', 'Widowed']).optional(),
  weddingDay: z.date().optional(),
});

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address.'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit Indian phone number.'),
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
  memberPhotoUrl: z.string(),
  familyPhotoUrl: z.string().optional(),
  zone: z.string().min(1, 'Zone is required'),
  ward: z.string().min(1, 'Ward is required'),
  role: z.enum(['Admin', 'Member']),
  family: z.array(familyMemberSchema),
});

type FormValues = z.infer<typeof formSchema>;

const ImageDisplay = ({ url, alt }: { url?: string, alt: string }) => {
    const [displayUrl, setDisplayUrl] = React.useState('');

    React.useEffect(() => {
        if (url) {
            getSecureUrl(url).then(setDisplayUrl);
        } else {
            setDisplayUrl('');
        }
    }, [url]);

    if (!displayUrl) return null;

    return (
        <Image
            src={displayUrl}
            alt={alt}
            width={80}
            height={80}
            className="rounded-lg object-cover"
        />
    );
};

const ImageUpload = ({ value, onChange, onUploadStart, onUploadEnd, disabled }: { value?: string, onChange: (url: string) => void, onUploadStart: () => void, onUploadEnd: () => void, disabled?: boolean }) => {
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = React.useState(false);
    const { toast } = useToast();

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        onUploadStart();
        setIsUploading(true);

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
            const dataUrl = reader.result as string;
            try {
                const path = await uploadImage(dataUrl);
                onChange(path);
                toast({ title: 'Image uploaded successfully!' });
            } catch (error) {
                console.error("Image upload failed", error);
                toast({ variant: 'destructive', title: 'Upload Failed', description: 'Could not upload the image.' });
            } finally {
                setIsUploading(false);
                onUploadEnd();
            }
        };
        reader.onerror = (error) => {
            console.error("File reading failed", error);
            toast({ variant: 'destructive', title: 'File Read Failed', description: 'Could not read the selected file.' });
            setIsUploading(false);
            onUploadEnd();
        }
    };

    return (
        <div className="flex items-center gap-4">
            <ImageDisplay url={value} alt="Current photo" />
            {!disabled && (
                 <>
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                    />
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                    >
                        {isUploading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Upload className="mr-2 h-4 w-4" />
                        )}
                        {value ? 'Change Photo' : 'Upload Photo'}
                    </Button>
                </>
            )}
        </div>
    );
};


export function MemberForm({ member }: { member: Member | null }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [activeUploads, setActiveUploads] = React.useState(0);
  const { member: currentUser } = useAuthStore();
  const isNew = member === null;
  const isAdmin = currentUser?.role === 'Admin';
  const isOwner = !isNew && currentUser?.id === member.id;


  const defaultValues = {
      name: member?.name || '',
      email: member?.email || '',
      phone: member?.phone || '',
      address: member?.address || '',
      status: member?.status || 'Active',
      homeParish: member?.homeParish || '',
      nativeDistrict: member?.nativeDistrict || '',
      birthday: member?.birthday ? new Date(member.birthday) : undefined,
      maritalStatus: member?.maritalStatus || 'Single',
      weddingDay: member?.weddingDay ? new Date(member.weddingDay) : undefined,
      familyName: member?.familyName || '',
      familyId: member?.familyId || '',
      subGroups: member?.subGroups || [],
      memberPhotoUrl: member?.memberPhotoUrl || 'https://placehold.co/128x128.png',
      familyPhotoUrl: member?.familyPhotoUrl || 'https://placehold.co/600x400.png',
      zone: member?.zone || '',
      ward: member?.ward || '',
      role: member?.role || 'Member',
      family: member?.family.map(f => ({
          ...f,
          name: f.name || '',
          phone: f.phone || '',
          memberPhotoUrl: f.memberPhotoUrl || 'https://placehold.co/128x128.png',
          status: f.status || 'Active',
          birthday: f.birthday ? new Date(f.birthday) : undefined,
          weddingDay: f.weddingDay ? new Date(f.weddingDay) : undefined,
      })) || [],
      password: '',
  };

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: isNew ? {
        status: 'Active',
        maritalStatus: 'Single',
        family: [],
        subGroups: [],
        role: 'Member',
        memberPhotoUrl: 'https://placehold.co/128x128.png',
        familyPhotoUrl: 'https://placehold.co/600x400.png',
        name: '',
        email: '',
        phone: '',
        address: '',
        homeParish: '',
        nativeDistrict: '',
        familyName: '',
        familyId: '',
        zone: '',
        ward: '',
        password: '',
     } : defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'family',
  });

  const selectedZone = form.watch('zone');
  const currentZone = zones.find(z => z.name === selectedZone);

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);

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

    // Remove password if it's empty
    if (!memberData.password) {
        delete (memberData as Partial<typeof memberData>).password;
    }


    try {
        if (isNew) {
            if (!isAdmin) throw new Error("Permission denied.");
            await createMember(memberData);
            toast({ title: 'Member Created', description: 'New member has been successfully added.' });
        } else if(member) {
            if (!isAdmin && !isOwner) throw new Error("Permission denied.");
            await updateMember(member.id, memberData);
            toast({ title: 'Member Updated', description: 'Member details have been successfully updated.' });
        }
        router.push(isAdmin ? '/members' : `/members/${member?.id || currentUser?.id}`);
        router.refresh();
    } catch (error) {
        console.error("Form submission error:", error)
        toast({ variant: 'destructive', title: 'Error', description: 'An error occurred. Please try again.' });
    } finally {
        setIsSubmitting(false);
    }
  }

  const handleUploadStart = () => setActiveUploads(prev => prev + 1);
  const handleUploadEnd = () => setActiveUploads(prev => prev - 1);
  const isUploading = activeUploads > 0;
  const canSubmit = !isSubmitting && !isUploading;

  if (!isAdmin && !isNew && !isOwner) {
    // This should ideally redirect or be handled by routing rules
    return <p>You do not have permission to edit this member.</p>;
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
                        <FormControl><Input placeholder="e.g., 24/PM/0001" {...field} disabled={!isAdmin} /></FormControl>
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
                        <FormControl><Input placeholder="9876543210" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                 <FormField control={form.control} name="password" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl><Input type="password" placeholder={isNew ? "Set initial password" : "Password cannot be edited"} {...field} disabled={!isAdmin || !isNew} /></FormControl>
                        <FormDescription>{isNew ? "Set an initial password for the new member." : "Password cannot be changed here."}</FormDescription>
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
                 <FormField control={form.control} name="memberPhotoUrl" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Member Photo</FormLabel>
                         <ImageUpload
                            value={field.value}
                            onChange={field.onChange}
                            onUploadStart={handleUploadStart}
                            onUploadEnd={handleUploadEnd}
                            disabled={!isAdmin}
                        />
                        <FormMessage />
                    </FormItem>
                )} />
                 <FormField control={form.control} name="familyPhotoUrl" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Family Photo</FormLabel>
                         <ImageUpload
                            value={field.value}
                            onChange={field.onChange}
                            onUploadStart={handleUploadStart}
                            onUploadEnd={handleUploadEnd}
                            disabled={!isAdmin}
                        />
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="zone" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Zone</FormLabel>
                        <Select onValueChange={(value) => { field.onChange(value); form.setValue('ward', ''); }} defaultValue={field.value} disabled={!isAdmin}>
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
                            <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value} disabled={!isAdmin}>
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
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!isAdmin}>
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
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!isAdmin}>
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
                                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!isAdmin}>
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
                                <FormField control={form.control} name={`family.${index}.memberPhotoUrl`} render={({ field }) => (
                                    <FormItem><FormLabel>Photo</FormLabel>
                                        <ImageUpload
                                            value={field.value}
                                            onChange={field.onChange}
                                            onUploadStart={handleUploadStart}
                                            onUploadEnd={handleUploadEnd}
                                            disabled={!isAdmin}
                                        />
                                    <FormMessage /></FormItem>
                                )} />
                            </div>
                        </div>
                    ))}
                    <Button type="button" variant="outline" onClick={() => append({ name: '', relation: 'Others', status: 'Active', memberPhotoUrl: 'https://placehold.co/128x128.png', phone: '' })}>
                        <PlusCircle className="mr-2 h-4 w-4" /> Add Family Member
                    </Button>
                </CardContent>
           </Card>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
            <Button type="submit" disabled={!canSubmit}>
              {isSubmitting ? 'Saving...' : isUploading ? 'Uploading...' : <><Save className="mr-2 h-4 w-4" /> Save Member</>}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
