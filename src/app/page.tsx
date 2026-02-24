import Hero from '../features/Homepage/Hero';
import LessonVideosPreview from '@/features/Homepage/lesson-videos-preview';
// import EBook from '@/features/Homepage/e-book';
import Features from '@/features/Homepage/features';
import CustomerReviews from '@/features/Homepage/customer-reviews';
import IsItForYou from '@/features/Homepage/is-it-for-you';
import AboutMe from '@/features/Homepage/AboutMe';
import Faq from '@/features/Homepage/Faq';

export default function Home() {
  return (
    <>
      <Hero />
      {/* <EBook /> */}
      <LessonVideosPreview />
      <Features />
      <CustomerReviews />
      <IsItForYou />
      <AboutMe />
      <Faq />
    </>
  );
}
