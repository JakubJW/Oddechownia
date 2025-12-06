import { PostForm } from '@/features/Spolecznosc/PostForm';
import Container from '@/components/Container/Container';
import { Feed } from '@/features/Spolecznosc/Feed';
import { getUser } from '@/server/actions/user';

const Community = async () => {
  const user = await getUser();

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
