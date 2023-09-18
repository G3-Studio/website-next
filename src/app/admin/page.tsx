'use client';
import Layout from '@/components/Layout';
import Loading from '@/components/Loading';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'unauthenticated') {
    router.push('/admin/login');
  }

  if (status === 'loading') {
    return <Loading></Loading>;
  }

  return (
    <Layout title={'Page Admin'} session={session ? session : undefined}>
      <div className="flex flex-col">
        <h1>Admin</h1>
        <p>Protected content</p>
        <p>Session: {JSON.stringify(session)}</p>

        <a
          href="/admin/login"
          onClick={(e) => {
            e.preventDefault();
            signOut();
          }}>
          Sign out
        </a>
      </div>
    </Layout>
  );
}
