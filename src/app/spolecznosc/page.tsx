import { PostForm } from '@/features/Spolecznosc/PostForm';
import Container from '@/components/Container/Container';
import { Feed } from '@/features/Spolecznosc/Feed';
import { redirect } from 'next/navigation';
import { getRequiredUser } from '@/lib/data';

const Community = async () => {
  const user = await getRequiredUser();

  if (!user?.hasActiveSubscription) {
    redirect('/wymagana-subskrypcja');
  }

  return (
    <section>
      <Container>
        {user && user.isAdmin && <PostForm />}
        <Feed user={user} />
      </Container>
    </section>
  );
};

export default Community;
