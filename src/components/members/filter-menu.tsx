"use client";

import React from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { zones, members as mockMembers } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

// We still need the mock data to populate the filter options initially.
// A better approach would be to fetch these from Firestore as well.
const allSubgroups = Array.from(new Set(
  mockMembers.flatMap(m => [
    ...(m.subGroups || []),
    ...(m.family?.flatMap(f => f.subGroups || []) || [])
  ])
));


export function FilterMenu() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const selectedZone = searchParams.get('zone') || 'all';
  const selectedWard = searchParams.get('ward') || 'all';
  const selectedSubgroup = searchParams.get('subgroup') || 'all';


  const handleFilterChange = (type: 'zone' | 'ward' | 'subgroup', value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', '1');

    if (type === 'zone') {
      if (value === 'all') {
        params.delete('zone');
        params.delete('ward');
      } else {
        params.set('zone', value);
        params.delete('ward');
      }
    } else if (type === 'ward') {
      if (value === 'all') {
        params.delete('ward');
      } else {
        params.set('ward', value);
      }
    } else if (type === 'subgroup') {
      if (value === 'all') {
        params.delete('subgroup');
      } else {
        params.set('subgroup', value);
      }
    }
    
    router.replace(`${pathname}?${params.toString()}`);
  };

  const currentZone = zones.find(z => z.name === selectedZone);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 p-4" align="end">
        <div className="space-y-4">
          <div>
            <Label>Zone</Label>
            <Select
              value={selectedZone}
              onValueChange={(value) => handleFilterChange('zone', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Zone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Zones</SelectItem>
                {zones.map(zone => (
                  <SelectItem key={zone.name} value={zone.name}>{zone.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {selectedZone !== 'all' && currentZone && (
             <div>
               <Label>Ward</Label>
                <Select
                  value={selectedWard}
                  onValueChange={(value) => handleFilterChange('ward', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Ward" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Wards</SelectItem>
                    {currentZone.wards.map(ward => (
                        <SelectItem key={ward} value={ward}>{ward}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
             </div>
          )}
          
          <DropdownMenuSeparator />

          <div>
            <Label>Spiritual Organization</Label>
            <Select
              value={selectedSubgroup}
              onValueChange={(value) => handleFilterChange('subgroup', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Organization" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Organizations</SelectItem>
                {allSubgroups.map(subgroup => (
                  <SelectItem key={subgroup} value={subgroup}>{subgroup}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
