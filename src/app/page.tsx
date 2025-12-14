import AvailableSubscriptions from '@/features/Homepage/AvailableSubscriptions';
import Hero from '../features/Homepage/Hero';
import LessonVideosPreview from '@/features/Homepage/lesson-videos-preview';
import Faq from '@/features/Homepage/Faq';
import AboutMe from '@/features/Homepage/AboutMe';
// import QuoteSection from '@/features/Homepage/quote-section';

export default function Home() {
  return (
    <>
      <Hero />
      {/* <QuoteSection /> */}
      <LessonVideosPreview />
      <AvailableSubscriptions />
      <AboutMe />
      <Faq />
    </>
  );
}
