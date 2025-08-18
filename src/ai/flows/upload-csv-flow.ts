
'use server';
/**
 * @fileOverview A flow to handle bulk member creation from a CSV file.
 *
 * - uploadMembersCsv - A function that parses a CSV and batch updates the database.
 * - UploadCsvInput - The input type for the uploadMembersCsv function.
 * - UploadCsvOutput - The return type for the uploadMembersCsv function.
 */

import { ai } from '@/ai/genkit';
import { batchUpdateMembers, getMemberById } from '@/services/members';
import { z } from 'zod';

const UploadCsvInputSchema = z.object({
  csvData: z.string().describe('The full content of the CSV file as a single string.'),
  adminId: z.string().describe('The ID of the user performing the upload, who must be an admin.'),
});
export type UploadCsvInput = z.infer<typeof UploadCsvInputSchema>;

const UploadCsvOutputSchema = z.object({
  success: z.boolean().describe('Whether the upload was successful.'),
  message: z.string().describe('A message detailing the result of the upload.'),
});
export type UploadCsvOutput = z.infer<typeof UploadCsvOutputSchema>;


const prompt = ai.definePrompt({
    name: 'csvToJsonPrompt',
    input: { schema: z.object({ csv: z.string() }) },
    output: { format: 'json' },
    prompt: `
        You are a data processing expert. Convert the following CSV data into a JSON array.
        The CSV has the following columns: familyId,familyName,relation,name,email,phone,password,address,status,homeParish,nativeDistrict,birthday,maritalStatus,weddingDay,subGroups,avatarUrl,zone,ward,role
        - Each row in the CSV should become a JSON object in the array.
        - The keys of the JSON object should be the column headers.
        - Handle empty fields as null or undefined.
        - Dates should be kept as strings if they are in a valid format (YYYY-MM-DD), otherwise leave as is.
        - Ensure the output is a valid JSON array. Do not wrap it in markdown.
        
        CSV Data:
        {{{csv}}}
    `,
});

export const uploadMembersCsvFlow = ai.defineFlow(
  {
    name: 'uploadMembersCsvFlow',
    inputSchema: UploadCsvInputSchema,
    outputSchema: UploadCsvOutputSchema,
  },
  async (input) => {
    try {
        // First, verify the user is an admin.
        const adminUser = await getMemberById(input.adminId);
        if (!adminUser || adminUser.role !== 'Admin') {
            return {
                success: false,
                message: 'Permission denied. You must be an administrator to perform this action.',
            };
        }

        const { output: jsonOutput } = await prompt({ csv: input.csvData });
      
        if (!jsonOutput) {
            throw new Error('Failed to convert CSV to JSON.');
        }
      
        const jsonData = Array.isArray(jsonOutput) ? jsonOutput : JSON.parse(jsonOutput as any);

        if (!Array.isArray(jsonData)) {
            throw new Error('Parsing resulted in invalid JSON format.');
        }

        // Now, you can pass this structured data to your service layer
        const result = await batchUpdateMembers(jsonData);
      
        return result;

    } catch (error: any) {
        console.error("CSV Upload Flow Error: ", error);
        return {
            success: false,
            message: `An error occurred during CSV processing: ${error.message}`,
        };
    }
  }
);


export async function uploadMembersCsv(input: UploadCsvInput): Promise<UploadCsvOutput> {
    return uploadMembersCsvFlow(input);
}
