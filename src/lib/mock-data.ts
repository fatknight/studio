export type FamilyMember = {
  name: string;
  relation: 'Spouse' | 'Child';
  birthday?: string;
  phone?: string;
  avatarUrl?: string;
  homeParish?: string;
  subGroups?: string[];
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
  maritalStatus: 'Single' | 'Married' | 'Divorced' | 'Widowed';
  weddingDay?: string;
  family: FamilyMember[];
  familyName?: string;
  subGroups?: string[];
  avatarUrl: string;
  zone: string;
  ward: string;
  role?: 'Admin' | 'Member';
};

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
    avatarUrl: 'https://placehold.co/128x128/A3E4D7/2E86C1.png',
    zone: '',
    ward: '',
    role: 'Admin',
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
      { relation: 'Spouse', name: 'Jane Doe', birthday: '1988-04-12', phone: '555-0113', avatarUrl: 'https://placehold.co/128x128/D5F5E3/1E8449.png', homeParish: 'St. Peter\'s Cathedral', subGroups: ['Choir'] },
      { relation: 'Child', name: 'Jimmy Doe', birthday: '2012-01-15', phone: 'N/A', avatarUrl: 'https://placehold.co/128x128/E8DAEF/884EA0.png', homeParish: 'St. Peter\'s Cathedral', subGroups: ['Altar Servers'] },
      { relation: 'Child', name: 'Jenny Doe', birthday: '2014-07-22', phone: 'N/A', avatarUrl: 'https://placehold.co/128x128/FDEBD0/D35400.png', homeParish: 'St. Peter\'s Cathedral', subGroups: ['Sunday School'] },
    ],
    familyName: 'Doe Family',
    subGroups: ['Sunday School', 'Choir'],
    avatarUrl: 'https://placehold.co/128x128/EBF4FA/3E6680.png',
    zone: 'North Zone',
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
      { relation: 'Spouse', name: 'John Smith', birthday: '1989-11-30', phone: '555-0114', avatarUrl: 'https://placehold.co/128x128/D6EAF8/2E86C1.png', homeParish: 'St. Mary\'s Basilica', subGroups: ['Men\'s Fellowship'] },
      { relation: 'Child', name: 'Jake Smith', birthday: '2018-06-01', phone: 'N/A', avatarUrl: 'https://placehold.co/128x128/D1F2EB/138D75.png', homeParish: 'St. Mary\'s Basilica', subGroups: ['Sunday School'] }
    ],
    familyName: 'Smith Family',
    subGroups: ['Youth League'],
    avatarUrl: 'https://placehold.co/128x128/FCF3CF/F1C40F.png',
    zone: 'North Zone',
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
    subGroups: ['Men\'s Fellowship'],
    avatarUrl: 'https://placehold.co/128x128/F5B7B1/922B21.png',
    zone: 'South Zone',
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
       { relation: 'Child', name: 'Chris Johnson', birthday: '2020-05-20', phone: 'N/A', avatarUrl: 'https://placehold.co/128x128/E6E6FA/483D8B.png' }
    ],
    familyName: 'Johnson Family',
    subGroups: ['Sunday School Teacher'],
    avatarUrl: 'https://placehold.co/128x128/D7BDE2/5B2C6F.png',
    zone: 'South Zone',
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
      { relation: 'Spouse', name: 'Susan Williams', birthday: '1980-02-20', phone: '555-0115', avatarUrl: 'https://placehold.co/128x128/FFDAB9/A0522D.png', homeParish: 'St. Mary\'s Basilica' }
    ],
    familyName: 'Williams Family',
    subGroups: ['Pastoral Council'],
    avatarUrl: 'https://placehold.co/128x128/FAD7A0/AF601A.png',
    zone: 'East Zone',
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
    avatarUrl: 'https://placehold.co/128x128/ABEBC6/196F3D.png',
    zone: 'East Zone',
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
      { relation: 'Spouse', name: 'Patricia Davis', birthday: '1982-08-20', phone: '555-0116', avatarUrl: 'https://placehold.co/128x128/B0E0E6/4682B4.png', homeParish: 'St. Peter\'s Cathedral', subGroups: ['Charity Wing'] },
      { relation: 'Child', name: 'Robert Davis', birthday: '2010-10-10', phone: 'N/A', avatarUrl: 'https://placehold.co/128x128/B0E0E6/4682B4.png', homeParish: 'St. Peter\'s Cathedral' },
      { relation: 'Child', name: 'Jennifer Davis', birthday: '2012-12-12', phone: 'N/A', avatarUrl: 'https://placehold.co/128x128/B0E0E6/4682B4.png', homeParish: 'St. Peter\'s Cathedral' },
    ],
    familyName: 'Davis Family',
    subGroups: ['Choir', 'Men\'s Fellowship'],
    avatarUrl: 'https://placehold.co/128x128/AED6F1/1B4F72.png',
    zone: 'West Zone',
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
      { relation: 'Spouse', name: 'Richard Miller', birthday: '1974-01-01', phone: '555-0117', avatarUrl: 'https://placehold.co/128x128/F08080/800000.png', homeParish: 'St. Mary\'s Basilica' }
    ],
    familyName: 'Miller Family',
    avatarUrl: 'https://placehold.co/128x128/F5CBA7/7E5109.png',
    zone: 'West Zone',
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
    subGroups: ['Youth League'],
    avatarUrl: 'https://placehold.co/128x128/E6B0AA/641E16.png',
    zone: 'North Zone',
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
        { relation: 'Spouse', name: 'William Moore', birthday: '1987-11-11', phone: '555-0118', avatarUrl: 'https://placehold.co/128x128/D8BFD8/4B0082.png', homeParish: 'St. Peter\'s Cathedral' },
        { relation: 'Child', name: 'Jessica Moore', birthday: '2014-02-02', phone: 'N/A', avatarUrl: 'https://placehold.co/128x128/D8BFD8/4B0082.png', homeParish: 'St. Peter\'s Cathedral' },
        { relation: 'Child', name: 'Daniel Moore', birthday: '2016-03-03', phone: 'N/A', avatarUrl: 'https://placehold.co/128x128/D8BFD8/4B0082.png', homeParish: 'St. Peter\'s Cathedral' }
    ],
    familyName: 'Moore Family',
    subGroups: ['Sunday School Teacher', 'Charity Wing'],
    avatarUrl: 'https://placehold.co/128x128/A9DFBF/145A32.png',
    zone: 'South Zone',
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
    avatarUrl: 'https://placehold.co/128x128/F4D03F/7D6608.png',
    zone: 'East Zone',
    ward: 'Ward 3',
    role: 'Member',
  },
  {
    id: '12',
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
        { relation: 'Spouse', name: 'Thomas Anderson', birthday: '1990-01-01', phone: '555-0119', avatarUrl: 'https://placehold.co/128x128/FFC0CB/800000.png', homeParish: 'St. George\'s Church', subGroups: ['Men\'s Fellowship'] },
        { relation: 'Child', name: 'Sarah Anderson', birthday: '2020-10-10', phone: 'N/A', avatarUrl: 'https://placehold.co/128x128/FFC0CB/800000.png', homeParish: 'St. George\'s Church' }
    ],
    familyName: 'Anderson Family',
    subGroups: ['Youth League', 'Choir'],
    avatarUrl: 'https://placehold.co/128x128/85C1E9/21618C.png',
    zone: 'West Zone',
    ward: 'Ward 3',
    role: 'Member',
  }
];

export const zones = [
    { name: 'North Zone', wards: ['Ward 1', 'Ward 2', 'Ward 3', 'Ward 4', 'Ward 5'] },
    { name: 'South Zone', wards: ['Ward 1', 'Ward 2', 'Ward 3', 'Ward 4', 'Ward 5'] },
    { name: 'East Zone', wards: ['Ward 1', 'Ward 2', 'Ward 3', 'Ward 4', 'Ward 5'] },
    { name: 'West Zone', wards: ['Ward 1', 'Ward 2', 'Ward 3', 'Ward 4', 'Ward 5'] },
]

    