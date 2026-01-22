// import AvailableSubscriptions from '@/features/Homepage/AvailableSubscriptions';
import Hero from '../features/Homepage/Hero';
import LessonVideosPreview from '@/features/Homepage/lesson-videos-preview';
import Faq from '@/features/Homepage/Faq';
import AboutMe from '@/features/Homepage/AboutMe';
// import QuoteSection from '@/features/Homepage/quote-section';
import Features from '@/features/Homepage/features';
// import CustomerReviews from '@/features/Homepage/CustomerReviews';
import IsItForYou from '@/features/Homepage/is-it-for-you';

export default function Home() {
  return (
    <>
      <Hero />
      <LessonVideosPreview />
      <Features />
      {/* <CustomerReviews /> */}
      <IsItForYou />
      <AboutMe />
      <Faq />
    </>
  );
}
