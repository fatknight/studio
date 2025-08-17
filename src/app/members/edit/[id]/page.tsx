import { MemberForm } from '@/components/members/member-form';
import { getMemberById } from '@/services/members';
import { notFound } from 'next/navigation';

export default async function EditMemberPage({ params }: { params: { id: string } }) {
    const isNew = params.id === 'new';
    const member = isNew ? null : await getMemberById(params.id);

    if (!isNew && !member) {
        notFound();
    }

    return <MemberForm member={member} />;
}
