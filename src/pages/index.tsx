import Hero from '../features/Homepage/Hero';
import CourseVideosPreview from '@/features/Homepage/CoursePreviewSlider';
import CustomerReviews from '@/features/Homepage/CustomerReviews';
import Faq from '@/features/Homepage/Faq';

export default function Home() {
  return (
    <>
      <Hero />
      <CourseVideosPreview />
      <CustomerReviews />
      <Faq />
    </>
  );
}
