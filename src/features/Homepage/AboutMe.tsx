import Container from '@/components/Container/Container';
import HeaderTwo from '@/components/Headers/HeaderTwo';
import BackgroundLines from '../../../public/background-lines.svg';
import Dot from '../../../public/dot.svg';
import Image from 'next/image';

export default function AboutMe() {
  return (
    <section className="relative">
      <Image
        className="absolute top-1/2 -translate-y-1/2 rotate-180 w-full right-0"
        src={BackgroundLines}
        alt="Background lines"
      />
      <Container>
        <hgroup className="text-center mb-24">
          <HeaderTwo>O mnie</HeaderTwo>
        </hgroup>
        <div className="grid grid-cols-1 md:grid-cols-2 justify-items-center gap-6">
          <p className='z-10 order-2 md:order-1'>
            Swoją praktykę rozwijałam w Indiach, Polsce, Hiszpanii i Danii.
            Uczestniczyłam w warsztatach i szkoleniach, które prowadzili m.in.
            Kino MacGregor, Basia Lipska-Larsen, dr S. K. Pandey, Rahul Singh,
            Bhavesh Bhimanathani, Nicky Rawat, Devesh Bhargav, Mann Harjai,
            Lilou Sarah, Lindita Maria, Winther McDonald, dr Arun Thejaus.
            <br />
            <br />
            Miałam okazję stać się jedną z 52 Ambasadorek i Ambasadorów Jogi
            z całego świata. Dzięki zaproszeniu Ministry of AYUSH (ministerstwa
            Jogi, Ajurwedy i Medycyny naturalnej) mogłam uczestniczyć
            w konferencjach poświęconych współczesnym i tradycyjnym aspektom
            jogi. Poznając jednocześnie tajemnice indyjskiej Kerali.
            <br />
            <br />
            Przez dwa lata prowadziłam swoje studio jogi w Danii, obecnie będąc
            w Polsce chętnie dzielę się swoją praktyką z osobami, które
            w codziennym życiu poszukują balansu, harmonii, wyciszenia oraz
            większej świadomości siebie i swojego ciała.
            <br />
            <br />
            Jestem zwolenniczką uzdrawiania poprzez ruch i odpowiednią dietę.
            Głęboko wierzę w to, że piękno powstaje wewnątrz, oraz że każda
            wielka zmiana zaczyna się od jednego małego kroku.
          </p>
          <div className="relative border-8 border-primaryBg rounded-full inline-block h-min">
            <Image
              src={Dot}
              alt="Dot"
              className="h-12 w-12 absolute -right-4 -top-4"
            />
            <Image
              src={Dot}
              alt="Dot"
              className="h-8 w-8 absolute right-12 -top-10"
            />
            {/* <Image
              src="https://wknpvvtasrhwkqmkvoml.supabase.co/storage/v1/object/public/Public/images/pexels-pixabay-460307.jpg"
              height={400}
              width={400}
              className="object-cover rounded-full border-4 border-primaryFg h-full aspect-square"
              alt="Me"
            /> */}
            <Image
              src={Dot}
              alt="Dot"
              className="h-12 w-12 absolute -left-4 -bottom-4"
            />
            <Image
              src={Dot}
              alt="Dot"
              className="h-8 w-8 absolute left-12 -bottom-10"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
