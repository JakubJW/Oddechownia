import { NewPostForm } from '@/features/Spolecznosc/NewPostForm';
import Container from '@/components/Container/Container';
import { Feed } from '@/features/Spolecznosc/Feed';

const Community = () => {
  return (
    <Container>
      <NewPostForm />
      <Feed />
    </Container>
  );
};

export default Community;
