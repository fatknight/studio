
'use client'

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, FileText, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { uploadMembersCsv } from '@/ai/flows/upload-csv-flow';
import { useAuthStore } from '@/hooks/use-auth';

export function CsvUploadDialog() {
  const [file, setFile] = React.useState<File | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { member: currentUser } = useAuthStore();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        variant: 'destructive',
        title: 'No file selected',
        description: 'Please select a CSV file to upload.',
      });
      return;
    }
    
    if (!currentUser || currentUser.role !== 'Admin') {
        toast({
            variant: 'destructive',
            title: 'Permission Denied',
            description: 'You are not authorized to perform this action.',
        });
        return;
    }

    setIsLoading(true);
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = async (event) => {
        const csvData = event.target?.result as string;
        if (csvData) {
            try {
                const result = await uploadMembersCsv({ csvData, adminId: currentUser.id });
                if (result.success) {
                    toast({
                        title: 'Upload Successful',
                        description: result.message,
                    });
                    setOpen(false);
                    setFile(null);
                    router.refresh();
                } else {
                     toast({
                        variant: 'destructive',
                        title: 'Upload Failed',
                        description: result.message,
                    });
                }
            } catch (err: any) {
                 toast({
                    variant: 'destructive',
                    title: 'Upload Error',
                    description: err.message || 'An unknown error occurred.',
                });
            } finally {
                setIsLoading(false);
            }
        }
    };
    reader.onerror = () => {
        toast({
            variant: 'destructive',
            title: 'File Read Error',
            description: 'Could not read the selected file.',
        });
        setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Upload className="mr-2 h-4 w-4" />
          Upload CSV
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Members CSV</DialogTitle>
          <DialogDescription>
            Select a CSV file to bulk-upload member data. Make sure the file
            follows the required format.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="csv-file">CSV File</Label>
            <Input id="csv-file" type="file" accept=".csv" onChange={handleFileChange} />
          </div>
          {file && (
            <div className='flex items-center space-x-2 text-sm text-muted-foreground'>
                <FileText className='h-4 w-4'/>
                <span>{file.name}</span>
            </div>
          )}
          <div>
            <a href="/sample-members.csv" download>
                <Button variant="link" className="p-0 h-auto">
                    <Download className="mr-2 h-4 w-4"/>
                    Download Sample CSV
                </Button>
            </a>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="ghost">
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleUpload} disabled={!file || isLoading}>
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
            ) : (
              'Upload'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
