import Hero from '../features/Homepage/Hero';
import CourseVideosPreview from '@/features/Homepage/CoursePreviewSlider';
import CustomerReviews from '@/features/Homepage/CustomerReviews';

export default function Home() {
  return (
    <>
      <Hero />
      <CourseVideosPreview />
      <CustomerReviews />
    </>
  );
}
