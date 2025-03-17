import AvailableSubscriptions from '@/features/Homepage/AvailableSubscriptions';
import Hero from '../features/Homepage/Hero';
import CourseVideosPreview from '@/features/Homepage/CoursePreviewSlider';
import CustomerReviews from '@/features/Homepage/CustomerReviews';
import Faq from '@/features/Homepage/Faq';
import AboutMe from '@/features/Homepage/AboutMe';

export default function Home() {
  return (
    <>
      <Hero />
      <CourseVideosPreview />
      <CustomerReviews />
      <AboutMe />
      <AvailableSubscriptions />
      <Faq />
    </>
  );
}
