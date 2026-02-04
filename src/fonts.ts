import localFont from 'next/font/local';

export const sourceSans = localFont({
  src: [
    {
      path: '../public/fonts/source-sans-3-v19-latin-ext-300.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/fonts/source-sans-3-v19-latin-ext-300italic.woff2',
      weight: '300',
      style: 'italic',
    },
    {
      path: '../public/fonts/source-sans-3-v19-latin-ext-regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/source-sans-3-v19-latin-ext-500.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/source-sans-3-v19-latin-ext-600.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../public/fonts/source-sans-3-v19-latin-ext-700.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-source-sans',
});

export const montserrat = localFont({
  src: [
    {
      path: '../public/fonts/montserrat-v31-latin-ext-300.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/fonts/montserrat-v31-latin-ext-regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/montserrat-v31-latin-ext-500.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/montserrat-v31-latin-ext-600.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../public/fonts/montserrat-v31-latin-ext-700.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-montserrat',
});
