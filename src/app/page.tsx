import AvailableSubscriptions from '@/features/Homepage/AvailableSubscriptions';
import Hero from '../features/Homepage/Hero';
import CourseVideosPreview from '@/features/Homepage/CoursePreviewSlider';
import Faq from '@/features/Homepage/Faq';
import AboutMe from '@/features/Homepage/AboutMe';

export default function Home() {
  return (
    <>
      <Hero />
      <CourseVideosPreview />
      <AboutMe />
      <AvailableSubscriptions />
      <Faq />
    </>
  );
}
