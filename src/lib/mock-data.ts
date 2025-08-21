import { z } from 'zod';

export type FamilyMember = {
  name: string;
  relation: 'Spouse' | 'Son' | 'Daughter' | 'Daughter-in-law' | 'Son-in-law' | 'Grandson' | 'Granddaughter' | 'Mother' | 'Father' | 'Brother' | 'Sister' | 'Others';
  status?: 'Active' | 'Inactive';
  birthday?: string;
  phone?: string;
  email?: string;
  memberId?: string;
  memberPhotoUrl?: string;
  subGroups?: string[];
  maritalStatus?: 'Single' | 'Married' | 'Separated' | 'Widowed';
  weddingDay?: string;
};

export type Member = {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  address: string;
  status: 'Active' | 'Inactive';
  joinDate: string; // Will be repurposed for Home Parish for now, can be removed later
  homeParish: string;
  nativeDistrict: string;
  birthday?: string;
  maritalStatus: 'Single' | 'Married' | 'Separated' | 'Widowed';
  weddingDay?: string;
  family: FamilyMember[];
  familyName?: string;
  familyId?: string;
  memberId?: string;
  familyPhotoUrl?: string;
  subGroups?: string[];
  memberPhotoUrl: string;
  zone: string;
  ward: string;
  role?: 'Admin' | 'Member';
};

export type SpecialRequest = {
  id: string;
  memberId: string;
  memberName: string;
  memberAvatarUrl: string;
  requestDate: string;
  prayingFor: string;
  requestType: 'Orma Qurbana' | 'Special Qurbana' | 'Other Intercessory Prayers';
  otherRequest?: string;
  createdAt: any; // Using `any` for Firestore Timestamp
};

export const CreateRequestInputSchema = z.object({
  memberId: z.string().describe('The ID of the member making the request.'),
  memberName: z.string().describe('The name of the member.'),
  memberAvatarUrl: z.string().describe('The avatar URL of the member.'),
  requestDate: z.string().describe('The ISO string of the requested date.'),
  prayingFor: z.string().min(1, { message: 'Please enter the name of the person to pray for.' }),
  requestType: z.enum(['Orma Qurbana', 'Special Qurbana', 'Other Intercessory Prayers']).describe('The type of prayer request.'),
  otherRequest: z.string().optional().describe('The details of the prayer request if "Other" is selected.'),
});

export type CreateRequestInput = z.infer<typeof CreateRequestInputSchema>;


export const members: Member[] = [
  {
    id: 'admin',
    name: 'Admin User',
    email: 'admin@example.com',
    phone: 'admin',
    password: 'adminpassword',
    address: 'N/A',
    status: 'Active',
    joinDate: '',
    homeParish: 'N/A',
    nativeDistrict: 'N/A',
    maritalStatus: 'Single',
    family: [],
    familyName: 'Admin',
    familyId: '00/ADMIN/0000',
    memberId: 'Z00W00F00M00',
    memberPhotoUrl: 'https://placehold.co/128x128/A3E4D7/2E86C1.png',
    zone: '',
    ward: '',
    role: 'Admin',
    subGroups: ['Church Committee'],
  },
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '555-0101',
    password: 'password123',
    address: '123 Maple St, Anytown, USA',
    status: 'Active',
    joinDate: '2018-03-15',
    homeParish: 'St. Peter\'s Cathedral',
    nativeDistrict: 'Kottayam',
    birthday: '1985-05-20',
    maritalStatus: 'Married',
    weddingDay: '2010-06-12',
    family: [
      { memberId: 'Z01W01F01M02', email: 'jane.doe@example.com', status: 'Active', relation: 'Spouse', name: 'Jane Doe', birthday: '1988-04-12', phone: '555-0113', memberPhotoUrl: 'https://placehold.co/128x128/D5F5E3/1E8449.png', subGroups: ['Womens League'], maritalStatus: 'Married', weddingDay: '2010-06-12' },
      { memberId: 'Z01W01F01M03', email: 'jimmy.doe@example.com', status: 'Active', relation: 'Son', name: 'Jimmy Doe', birthday: '2012-01-15', phone: 'N/A', memberPhotoUrl: 'https://placehold.co/128x128/E8DAEF/884EA0.png', subGroups: ['Altar'], maritalStatus: 'Single'},
      { memberId: 'Z01W01F01M04', email: 'jenny.doe@example.com', status: 'Inactive', relation: 'Daughter-in-law', name: 'Jenny Doe', birthday: '2014-07-22', phone: 'N/A', memberPhotoUrl: 'https://placehold.co/128x128/FDEBD0/D35400.png', subGroups: ['Sunday School'], maritalStatus: 'Single' },
    ],
    familyName: 'Doe Family',
    familyId: '18/PM/0001',
    memberId: 'Z01W01F01M01',
    familyPhotoUrl: 'https://placehold.co/600x400.png',
    subGroups: ['Church Committee'],
    memberPhotoUrl: 'https://placehold.co/128x128/EBF4FA/3E6680.png',
    zone: '1',
    ward: 'Ward 1',
    role: 'Member',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '555-0102',
    password: 'password123',
    address: '456 Oak Ave, Anytown, USA',
    status: 'Active',
    joinDate: '2019-07-22',
    homeParish: 'St. Mary\'s Basilica',
    nativeDistrict: 'Ernakulam',
    birthday: '1990-08-15',
    maritalStatus: 'Married',
    weddingDay: '2015-08-14',
    family: [
      { memberId: 'Z01W02F01M02', email: 'john.smith@example.com', status: 'Active', relation: 'Spouse', name: 'John Smith', birthday: '1989-11-30', phone: '555-0114', memberPhotoUrl: 'https://placehold.co/128x128/D6EAF8/2E86C1.png', subGroups: ['Elders Forum'], maritalStatus: 'Married', weddingDay: '2015-08-14' },
      { memberId: 'Z01W02F01M03', email: 'jake.smith@example.com', status: 'Active', relation: 'Son', name: 'Jake Smith', birthday: '2018-06-01', phone: 'N/A', memberPhotoUrl: 'https://placehold.co/128x128/D1F2EB/138D75.png', subGroups: ['Sunday School'], maritalStatus: 'Single' },
      { memberId: 'Z01W02F01M04', email: 'jill.smith@example.com', status: 'Active', relation: 'Mother', name: 'Jill Smith', birthday: '1965-02-10', phone: 'N/A', memberPhotoUrl: 'https://placehold.co/128x128/F5EEF8/6C3483.png', subGroups: ['Elders Forum'], maritalStatus: 'Widowed' }
    ],
    familyName: 'Smith Family',
    familyId: '19/AM/0002',
    memberId: 'Z01W02F01M01',
    familyPhotoUrl: 'https://placehold.co/600x400.png',
    subGroups: ['Youth Association'],
    memberPhotoUrl: 'https://placehold.co/128x128/FCF3CF/F1C40F.png',
    zone: '1',
    ward: 'Ward 2',
    role: 'Member',
  },
  {
    id: '3',
    name: 'Peter Jones',
    email: 'peter.jones@example.com',
    phone: '555-0103',
    password: 'password123',
    address: '789 Pine Ln, Anytown, USA',
    status: 'Inactive',
    joinDate: '2017-01-30',
    homeParish: 'St. George\'s Church',
    nativeDistrict: 'Thrissur',
    birthday: '1982-01-10',
    maritalStatus: 'Single',
    family: [],
    familyName: 'Jones Family',
    familyId: '17/PM/0003',
    memberId: 'Z02W01F01M01',
    subGroups: ['Elders Forum'],
    memberPhotoUrl: 'https://placehold.co/128x128/F5B7B1/922B21.png',
    zone: '2',
    ward: 'Ward 1',
    role: 'Member',
  },
  {
    id: '4',
    name: 'Mary Johnson',
    email: 'mary.johnson@example.com',
    phone: '555-0104',
    password: 'password123',
    address: '101 Birch Rd, Anytown, USA',
    status: 'Active',
    joinDate: '2020-11-01',
    homeParish: 'St. Peter\'s Cathedral',
    nativeDistrict: 'Pathanamthitta',
    birthday: '1995-03-25',
    maritalStatus: 'Single',
    family: [
       { memberId: 'Z02W02F01M02', email: 'chris.johnson@example.com', status: 'Active', relation: 'Son', name: 'Chris Johnson', birthday: '2020-05-20', phone: 'N/A', memberPhotoUrl: 'https://placehold.co/128x128/E6E6FA/483D8B.png', subGroups: ['Sunday School'], maritalStatus: 'Single' }
    ],
    familyName: 'Johnson Family',
    familyId: '20/PM/0004',
    memberId: 'Z02W02F01M01',
    subGroups: ['Sunday School'],
    memberPhotoUrl: 'https://placehold.co/128x128/D7BDE2/5B2C6F.png',
    zone: '2',
    ward: 'Ward 2',
    role: 'Member',
  },
    {
    id: '5',
    name: 'David Williams',
    email: 'david.williams@example.com',
    phone: '555-0105',
    password: 'password123',
    address: '212 Cedar Blvd, Anytown, USA',
    status: 'Active',
    joinDate: '2021-02-14',
    homeParish: 'St. Mary\'s Basilica',
    nativeDistrict: 'Alappuzha',
    birthday: '1978-11-05',
    maritalStatus: 'Married',
    weddingDay: '2005-02-14',
    family: [
      { memberId: 'Z03W01F01M02', email: 'susan.williams@example.com', status: 'Active', relation: 'Spouse', name: 'Susan Williams', birthday: '1980-02-20', phone: '555-0115', memberPhotoUrl: 'https://placehold.co/128x128/FFDAB9/A0522D.png', subGroups: ['Womens League'], maritalStatus: 'Married', weddingDay: '2005-02-14' }
    ],
    familyName: 'Williams Family',
    familyId: '21/AM/0005',
    memberId: 'Z03W01F01M01',
    subGroups: ['Church Committee'],
    memberPhotoUrl: 'https://placehold.co/128x128/FAD7A0/AF601A.png',
    zone: '3',
    ward: 'Ward 1',
    role: 'Member',
  },
  {
    id: '6',
    name: 'Linda Brown',
    email: 'linda.brown@example.com',
    phone: '555-0106',
    password: 'password123',
    address: '333 Elm St, Anytown, USA',
    status: 'Active',
    joinDate: '2016-06-10',
    homeParish: 'St. George\'s Church',
    nativeDistrict: 'Idukki',
    birthday: '1965-07-30',
    maritalStatus: 'Widowed',
    family: [],
    familyName: 'Brown Family',
    familyId: '16/PM/0006',
    memberId: 'Z03W02F01M01',
    subGroups: ['Elders Forum'],
    memberPhotoUrl: 'https://placehold.co/128x128/ABEBC6/196F3D.png',
    zone: '3',
    ward: 'Ward 2',
    role: 'Member',
  },
  {
    id: '7',
    name: 'James Davis',
    email: 'james.davis@example.com',
    phone: '555-0107',
    password: 'password123',
    address: '444 Spruce Way, Anytown, USA',
    status: 'Active',
    joinDate: '2022-08-19',
    homeParish: 'St. Peter\'s Cathedral',
    nativeDistrict: 'Kollam',
    birthday: '1980-04-01',
    maritalStatus: 'Married',
    weddingDay: '2008-08-20',
    family: [
      { memberId: 'Z04W01F01M02', email: 'patricia.davis@example.com', status: 'Active', relation: 'Spouse', name: 'Patricia Davis', birthday: '1982-08-20', phone: '555-0116', memberPhotoUrl: 'https://placehold.co/128x128/B0E0E6/4682B4.png', subGroups: ['Womens League'], maritalStatus: 'Married', weddingDay: '2008-08-20' },
      { memberId: 'Z04W01F01M03', email: 'robert.davis@example.com', status: 'Active', relation: 'Son', name: 'Robert Davis', birthday: '2010-10-10', phone: 'N/A', memberPhotoUrl: 'https://placehold.co/128x128/B0E0E6/4682B4.png', subGroups: ['Altar'], maritalStatus: 'Single' },
      { memberId: 'Z04W01F01M04', email: 'jennifer.davis@example.com', status: 'Active', relation: 'Daughter', name: 'Jennifer Davis', birthday: '2012-12-12', phone: 'N/A', memberPhotoUrl: 'https://placehold.co/128x128/B0E0E6/4682B4.png', subGroups: ['Sunday School'], maritalStatus: 'Single' },
    ],
    familyName: 'Davis Family',
    familyId: '22/PM/0007',
    memberId: 'Z04W01F01M01',
    subGroups: ['Choir'],
    memberPhotoUrl: 'https://placehold.co/128x128/AED6F1/1B4F72.png',
    zone: '4',
    ward: 'Ward 1',
    role: 'Member',
  },
  {
    id: '8',
    name: 'Barbara Miller',
    email: 'barbara.miller@example.com',
    phone: '555-0108',
    password: 'password123',
    address: '555 Willow Creek, Anytown, USA',
    status: 'Inactive',
    joinDate: '2015-04-12',
    homeParish: 'St. Mary\'s Basilica',
    nativeDistrict: 'Thiruvananthapuram',
    birthday: '1975-02-12',
    maritalStatus: 'Married',
    weddingDay: '2000-05-15',
    family: [
      { memberId: 'Z04W02F01M02', email: 'richard.miller@example.com', status: 'Active', relation: 'Spouse', name: 'Richard Miller', birthday: '1974-01-01', phone: '555-0117', memberPhotoUrl: 'https://placehold.co/128x128/F08080/800000.png', subGroups: ['Elders Forum'], maritalStatus: 'Married', weddingDay: '2000-05-15' }
    ],
    familyName: 'Miller Family',
    familyId: '15/AM/0008',
    memberId: 'Z04W02F01M01',
    subGroups: ['Womens League'],
    memberPhotoUrl: 'https://placehold.co/128x128/F5CBA7/7E5109.png',
    zone: '4',
    ward: 'Ward 2',
    role: 'Member',
  },
  {
    id: '9',
    name: 'Michael Wilson',
    email: 'michael.wilson@example.com',
    phone: '555-0109',
    password: 'password123',
    address: '666 Redwood Pkwy, Anytown, USA',
    status: 'Active',
    joinDate: '2023-01-05',
    homeParish: 'St. George\'s Church',
    nativeDistrict: 'Palakkad',
    birthday: '1992-06-18',
    maritalStatus: 'Single',
    family: [],
    familyName: 'Wilson Family',
    familyId: '23/PM/0009',
    memberId: 'Z01W03F01M01',
    subGroups: ['Youth Association'],
    memberPhotoUrl: 'https://placehold.co/128x128/E6B0AA/641E16.png',
    zone: '1',
    ward: 'Ward 3',
    role: 'Member',
  },
  {
    id: '10',
    name: 'Elizabeth Moore',
    email: 'elizabeth.moore@example.com',
    phone: '555-0110',
    password: 'password123',
    address: '777 Aspen Grove, Anytown, USA',
    status: 'Active',
    joinDate: '2018-09-30',
    homeParish: 'St. Peter\'s Cathedral',
    nativeDistrict: 'Kozhikode',
    birthday: '1988-12-25',
    maritalStatus: 'Married',
    weddingDay: '2012-01-22',
    family: [
        { memberId: 'Z02W03F01M02', email: 'william.moore@example.com', status: 'Active', relation: 'Spouse', name: 'William Moore', birthday: '1987-11-11', phone: '555-0118', memberPhotoUrl: 'https://placehold.co/128x128/D8BFD8/4B0082.png', subGroups: ['Elders Forum'], maritalStatus: 'Married', weddingDay: '2012-01-22' },
        { memberId: 'Z02W03F01M03', email: 'jessica.moore@example.com', status: 'Active', relation: 'Daughter', name: 'Jessica Moore', birthday: '2014-02-02', phone: 'N/A', memberPhotoUrl: 'https://placehold.co/128x128/D8BFD8/4B0082.png', subGroups: ['Sunday School'], maritalStatus: 'Single' },
        { memberId: 'Z02W03F01M04', email: 'daniel.moore@example.com', status: 'Active', relation: 'Son', name: 'Daniel Moore', birthday: '2016-03-03', phone: 'N/A', memberPhotoUrl: 'https://placehold.co/128x128/D8BFD8/4B0082.png', subGroups: ['Altar'], maritalStatus: 'Single' }
    ],
    familyName: 'Moore Family',
    familyId: '18/PM/0010',
    memberId: 'Z02W03F01M01',
    subGroups: ['Sunday School'],
    memberPhotoUrl: 'https://placehold.co/128x128/A9DFBF/145A32.png',
    zone: '2',
    ward: 'Ward 3',
    role: 'Member',
  },
    {
    id: '11',
    name: 'Charles Taylor',
    email: 'charles.taylor@example.com',
    phone: '555-0111',
    password: 'password123',
    address: '888 Sequoia Trail, Anytown, USA',
    status: 'Active',
    joinDate: '2019-05-25',
    homeParish: 'St. Mary\'s Basilica',
    nativeDistrict: 'Wayanad',
    birthday: '1986-10-10',
    maritalStatus: 'Single',
    family: [],
    familyName: 'Taylor Family',
    familyId: '19/AM/0011',
    memberId: 'Z03W03F01M01',
    subGroups: ['Youth Association'],
    memberPhotoUrl: 'https://placehold.co/128x128/F4D03F/7D6608.png',
    zone: '3',
    ward: 'Ward 3',
    role: 'Member',
  },
  {
    id: '12',
    name: 'Libin Cheruvathur',
    email: 'libs_c@yahoo.co.in',
    phone: '9844234658',
    password: 'password123',
    address: 'G4, Eastern Court Apartment, Coles Road, Frazer Town, Bangalore-560005',
    status: 'Active',
    joinDate: '2023-03-17',
    homeParish: 'St. Peter\'s & St.Paul\'s JSO Church, Mathikere',
    nativeDistrict: 'Thrissur',
    birthday: '1986-11-30',
    maritalStatus: 'Married',
    weddingDay: '2016-11-06',
    family: [
        { memberId: 'Z04W03F01M02', email: 'lisha.shaji@example.com', status: 'Active', relation: 'Spouse', name: 'Lisha Elizabeth Shaji', birthday: '1990-05-25', phone: '9449835249', memberPhotoUrl: 'https://placehold.co/128x128/FFC0CB/800000.png', subGroups: ['Womens League'], maritalStatus: 'Married', weddingDay: '2016-11-06' },
        { memberId: 'Z04W03F01M03', email: 'bryanna.cheruvathur@example.com', status: 'Active', relation: 'Daughter', name: 'Bryanna Mary Cheruvathur', birthday: '2019-03-28', phone: 'N/A', memberPhotoUrl: 'https://placehold.co/128x128/FFC0CB/800000.png', subGroups: ['Sunday School'], maritalStatus: 'Single' },
        { memberId: 'Z04W03F01M04', email: 'meena.ippurukutty@example.com', status: 'Active', relation: 'Mother', name: 'Meena Ippurukutty', birthday: '1990-05-25', phone: '9449835249', memberPhotoUrl: 'https://placehold.co/128x128/FFC0CB/800000.png', subGroups: ['Elders Forum'], maritalStatus: 'Widowed', weddingDay: '1979-01-15' }
    ],
    familyName: 'Cheruvathur Family',
    familyId: '23/PM/0012',
    memberId: 'Z04W03F01M01',
    subGroups: ['Choir'],
    memberPhotoUrl: 'https://placehold.co/128x128/85C1E9/21618C.png',
    zone: '4',
    ward: 'Ward 3',
    role: 'Member',
  },
  {
    id: '13',
    name: 'Jessica Anderson',
    email: 'jessica.anderson@example.com',
    phone: '555-0112',
    password: 'password123',
    address: '999 Cypress Ct, Anytown, USA',
    status: 'Active',
    joinDate: '2020-03-17',
    homeParish: 'St. George\'s Church',
    nativeDistrict: 'Kannur',
    birthday: '1991-08-08',
    maritalStatus: 'Married',
    weddingDay: '2018-02-18',
    family: [
        { memberId: 'Z04W03F02M02', email: 'thomas.anderson@example.com', status: 'Active', relation: 'Spouse', name: 'Thomas Anderson', birthday: '1990-01-01', phone: '555-0119', memberPhotoUrl: 'https://placehold.co/128x128/FFC0CB/800000.png', subGroups: ['Society'], maritalStatus: 'Married', weddingDay: '2018-02-18' },
        { memberId: 'Z04W03F02M03', email: 'sarah.anderson@example.com', status: 'Active', relation: 'Daughter', name: 'Sarah Anderson', birthday: '2020-10-10', phone: 'N/A', memberPhotoUrl: 'https://placehold.co/128x128/FFC0CB/800000.png', subGroups: ['Sunday School'], maritalStatus: 'Single' }
    ],
    familyName: 'Anderson Family',
    familyId: '20/AM/0013',
    memberId: 'Z04W03F02M01',
    subGroups: ['Womens League'],
    memberPhotoUrl: 'https://placehold.co/128x128/85C1E9/21618C.png',
    zone: '4',
    ward: 'Ward 3',
    role: 'Member',
  }
];

export const zones = [
    { name: '1', wards: ['Ward 1', 'Ward 2', 'Ward 3', 'Ward 4', 'Ward 5'] },
    { name: '2', wards: ['Ward 1', 'Ward 2', 'Ward 3', 'Ward 4', 'Ward 5'] },
    { name: '3', wards: ['Ward 1', 'Ward 2', 'Ward 3', 'Ward 4', 'Ward 5'] },
    { name: '4', wards: ['Ward 1', 'Ward 2', 'Ward 3', 'Ward 4', 'Ward 5'] },
]

    
