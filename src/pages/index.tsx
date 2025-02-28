import AvailableSubscriptions from '@/features/Homepage/AvailableSubscriptions';
import Hero from '../features/Homepage/Hero';
import CourseVideosPreview from '@/features/Homepage/CoursePreviewSlider';
import CustomerReviews from '@/features/Homepage/CustomerReviews';
import Faq from '@/features/Homepage/Faq';
import AboutMe from '@/features/Homepage/AboutMe';
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
      <AboutMe />
      <AvailableSubscriptions />
      <Faq />
    </>
  );
}
