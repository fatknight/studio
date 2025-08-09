export type Member = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: 'Active' | 'Inactive';
  joinDate: string;
  family: {
    spouse?: string;
    children?: string[];
  };
  avatarUrl: string;
};

export const members: Member[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '555-0101',
    address: '123 Maple St, Anytown, USA',
    status: 'Active',
    joinDate: '2018-03-15',
    family: {
      spouse: 'Jane Doe',
      children: ['Jimmy Doe', 'Jenny Doe'],
    },
    avatarUrl: 'https://placehold.co/128x128.png',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '555-0102',
    address: '456 Oak Ave, Anytown, USA',
    status: 'Active',
    joinDate: '2019-07-22',
    family: {
      spouse: 'John Smith',
      children: ['Jake Smith'],
    },
    avatarUrl: 'https://placehold.co/128x128.png',
  },
  {
    id: '3',
    name: 'Peter Jones',
    email: 'peter.jones@example.com',
    phone: '555-0103',
    address: '789 Pine Ln, Anytown, USA',
    status: 'Inactive',
    joinDate: '2017-01-30',
    family: {},
    avatarUrl: 'https://placehold.co/128x128.png',
  },
  {
    id: '4',
    name: 'Mary Johnson',
    email: 'mary.johnson@example.com',
    phone: '555-0104',
    address: '101 Birch Rd, Anytown, USA',
    status: 'Active',
    joinDate: '2020-11-01',
    family: {
      children: ['Chris Johnson'],
    },
    avatarUrl: 'https://placehold.co/128x128.png',
  },
    {
    id: '5',
    name: 'David Williams',
    email: 'david.williams@example.com',
    phone: '555-0105',
    address: '212 Cedar Blvd, Anytown, USA',
    status: 'Active',
    joinDate: '2021-02-14',
    family: {
      spouse: 'Susan Williams',
    },
    avatarUrl: 'https://placehold.co/128x128.png',
  },
  {
    id: '6',
    name: 'Linda Brown',
    email: 'linda.brown@example.com',
    phone: '555-0106',
    address: '333 Elm St, Anytown, USA',
    status: 'Active',
    joinDate: '2016-06-10',
    family: {},
    avatarUrl: 'https://placehold.co/128x128.png',
  },
  {
    id: '7',
    name: 'James Davis',
    email: 'james.davis@example.com',
    phone: '555-0107',
    address: '444 Spruce Way, Anytown, USA',
    status: 'Active',
    joinDate: '2022-08-19',
    family: {
      spouse: 'Patricia Davis',
      children: ['Robert Davis', 'Jennifer Davis'],
    },
    avatarUrl: 'https://placehold.co/128x128.png',
  },
  {
    id: '8',
    name: 'Barbara Miller',
    email: 'barbara.miller@example.com',
    phone: '555-0108',
    address: '555 Willow Creek, Anytown, USA',
    status: 'Inactive',
    joinDate: '2015-04-12',
    family: {
      spouse: 'Richard Miller',
    },
    avatarUrl: 'https://placehold.co/128x128.png',
  },
  {
    id: '9',
    name: 'Michael Wilson',
    email: 'michael.wilson@example.com',
    phone: '555-0109',
    address: '666 Redwood Pkwy, Anytown, USA',
    status: 'Active',
    joinDate: '2023-01-05',
    family: {},
    avatarUrl: 'https://placehold.co/128x128.png',
  },
  {
    id: '10',
    name: 'Elizabeth Moore',
    email: 'elizabeth.moore@example.com',
    phone: '555-0110',
    address: '777 Aspen Grove, Anytown, USA',
    status: 'Active',
    joinDate: '2018-09-30',
    family: {
      spouse: 'William Moore',
      children: ['Jessica Moore', 'Daniel Moore'],
    },
    avatarUrl: 'https://placehold.co/128x128.png',
  },
    {
    id: '11',
    name: 'Charles Taylor',
    email: 'charles.taylor@example.com',
    phone: '555-0111',
    address: '888 Sequoia Trail, Anytown, USA',
    status: 'Active',
    joinDate: '2019-05-25',
    family: {},
    avatarUrl: 'https://placehold.co/128x128.png',
  },
  {
    id: '12',
    name: 'Jessica Anderson',
    email: 'jessica.anderson@example.com',
    phone: '555-0112',
    address: '999 Cypress Ct, Anytown, USA',
    status: 'Active',
    joinDate: '2020-03-17',
    family: {
      spouse: 'Thomas Anderson',
      children: ['Sarah Anderson'],
    },
    avatarUrl: 'https://placehold.co/128x128.png',
  }
];
