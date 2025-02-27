import FaqItem from '@/components/FaqItem/FaqItem';
import Container from '@/components/Container/Container';
import HeaderTwo from '@/components/Headers/HeaderTwo';

const mockFaqs = [
  {
    question: 'Neque porro quisquam est',
    answer:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  },
  {
    question: 'Neque porro quisquam est',
    answer:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  },
  {
    question: 'Neque porro quisquam est',
    answer:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  },
];

export default function Faq() {
  return (
    <section className="bg-primaryBg">
      <Container>
        <HeaderTwo className="text-center mb-16">
          W czym możemy ci <span className="text-primaryFg">pomóc?</span>
        </HeaderTwo>
        <div className="space-y-6 max-w-[1000px] mx-auto">
          {mockFaqs.map(({ question, answer }, index) => (
            <FaqItem
              key={index}
              question={question}
              answer={answer}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
