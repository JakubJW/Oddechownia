import Container from '@/components/Container/Container';

const QuoteSection = () => {
  return (
    <section className="bg-gradient-to-b from-white via-white  to-primary-foreground">
      <Container className="pt-64">
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-light  text-center  max-w-[600px] leading-relaxed mb-12">
            Oddech to pomost pomiędzy ciałem, sercem i umysłem, dlatego w
            Oddechowni praktykujemy jogę nie tylko na macie. Z czułością łączymy
            ruch z bezruchem, filozofię z doświadczaniem, duchowość z
            codziennością.
          </h2>
          <p className="text-2xl font-light text-center max-w-[600px] leading-relaxed mb-12">
            To miejsce dla każdego.
            <br />
            Dla zmęczonych.
            <br />
            Dla poszukujących.
            <br />
            Dla tych, którzy chcą wrócić do siebie.
          </p>
          <p className="text-2xl font-light text-center max-w-[600px] leading-relaxed">
            Tu nie musisz niczego udowadniać.
          </p>
        </div>
      </Container>
    </section>
  );
};

export default QuoteSection;
