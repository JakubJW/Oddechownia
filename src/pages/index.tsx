import Hero from '../features/Homepage/Hero';
import CourseVideosPreview from '@/features/Homepage/CoursePreviewSlider';
import CustomerReviews from '@/features/Homepage/CustomerReviews';
import Faq from '@/features/Homepage/Faq';
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Twoje studio yogi online | Oddechownia</title>
      </Head>
      <Hero />
      <CourseVideosPreview />
      <CustomerReviews />
      {/* <AvailableSubscriptions /> */}
      <Faq />
    </>
  );
}
