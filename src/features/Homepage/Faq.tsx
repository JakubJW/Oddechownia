import { FaqAnswer, FaqQuestion, FaqItem } from '@/components/FaqItem/FaqItem';
import Container from '@/components/Container/Container';
import HeaderTwo from '@/components/Headers/HeaderTwo';

export default function Faq() {
  return (
    <section className="bg-matcha">
      <Container>
        <HeaderTwo className="text-center mb-16">
          W czym mogę ci <span className="text-white">pomóc?</span>
        </HeaderTwo>
        <div className="space-y-6 max-w-[1000px] mx-auto">
          <FaqItem>
            <FaqQuestion>
              <p>
                Jestem osobą początkującą. Czy w Oddechowni znajdę coś dla
                siebie?
              </p>
            </FaqQuestion>
            <FaqAnswer>
              <p>
                Zdecydowanie tak! Aby praktykować w Oddechowni, nie potrzebujesz
                konkretnego poziomu zaawansowania, elastyczności, doświadczenia
                czy wiedzy, a jedynie otwartości i kilku wolnych chwil. <br />
                <br />
                Praktyki w Oddechowni są różnorodne - znajdziesz tu zarówno
                sekwencje, przy których można się rozgrzać i rozruszać ciało,
                jak i te, które ukoją zmysły, wyciszą i otulą. Są też spotkania,
                podczas których możesz pozostać w łóżku, wsłuchując się w słowa,
                które wprowadzą Cię w świat jogicznej filozofii. <br />
                <br />W każdej praktyce dzielę się wskazówkami i modyfikacjami,
                dzięki którym wspólnie szukamy wygody i swobodnego oddechu w
                asanach - a to właśnie jest najważniejszym celem praktyki. Nie
                musisz być „jakaś” ani „gotowy” - wystarczy, że jesteś. Tu i
                teraz.
              </p>
            </FaqAnswer>
          </FaqItem>
          <FaqItem>
            <FaqQuestion>
              <p>Czy muszę być rozciągnięty/a, aby zacząć jogę?</p>
            </FaqQuestion>
            <FaqAnswer>
              <p>
                Zdecydowanie tak! Aby praktykować w Oddechowni, nie potrzebujesz
                konkretnego poziomu zaawansowania, elastyczności, doświadczenia
                czy wiedzy, a jedynie otwartości i kilku wolnych chwil. <br />
                <br />
                Nie - to jeden z największych mitów, które powstrzymują wiele
                osób przed wejściem na matę. Elastyczność ciała nie jest
                niezbędna do rozpoczęcia praktyki - to raczej jej naturalny
                efekt. <br />
                <br />
                Joga to nie wyścig. To przestrzeń, w której uczysz się słuchać
                swojego ciała, poruszać się z szacunkiem i łagodnością. Nie ma
                jednej „właściwej” formy pozycji, dlatego Oddechowni zawsze
                zachęcam do szukania wygody, swobody i świadomej uważności, a
                nie perfekcyjnych kształtów. Ciało każdego z nas ma inną
                historię - joga ją szanuje, nie ocenia.
              </p>
            </FaqAnswer>
          </FaqItem>
          <FaqItem>
            <FaqQuestion>
              <p>Czego potrzebuję, by zacząć praktykę?</p>
            </FaqQuestion>
            <FaqAnswer>
              <div>
                <p>
                  Przede wszystkim - kilku wolnych chwil. Jeśli je masz - jesteś
                  na dobrej drodze do swojej pierwszej praktyki! Co jeszcze może
                  się przydać?
                </p>
                <br />
                <ul style={{ listStyle: 'inside' }}>
                  <li style={{ display: 'list-item' }}>
                    <b>mata do jogi</b> - na początek możesz skorzystać z koca
                    lub większego ręcznika, ale docelowo mata będzie bardzo
                    pomocna
                  </li>
                  <li style={{ display: 'list-item' }}>
                    <b>wygodny strój</b> - taki, który umożliwi Ci swobodny ruch
                    i w którym czujesz się komfortowo,
                  </li>
                  <li style={{ display: 'list-item' }}>
                    <b>bezpieczny kąt</b>, w którym możesz się swobodnie
                    poruszać, nie zahaczając o meble ani nie obijając łokci,
                  </li>
                  <li style={{ display: 'list-item' }}>
                    <b>otwartość na spotkanie ze sobą</b> - bez oceniania, bez
                    oczekiwań.
                  </li>
                </ul>
                <br />
                <p>
                  Nie potrzebujesz specjalnych umiejętności, sprzętu czy wiedzy.
                  Wszystko, co najważniejsze, masz już w sobie.
                </p>
              </div>
            </FaqAnswer>
          </FaqItem>
          <FaqItem>
            <FaqQuestion>
              <p>Jak zorganizować swoje miejsce do praktyki?</p>
            </FaqQuestion>
            <FaqAnswer>
              <p>
                Twoja przestrzeń do praktyki nie musi być idealna - wystarczy
                cichy, spokojny kąt, w którym możesz w pełni się zrelaksować.
                Zadbaj o to, by móc swobodnie się poruszać - sprawdź, czy możesz
                położyć się na ziemi, rozłożyć ramiona na boki, wyciągnąć nogi,
                wykonać skręt czy skłon, nie zahaczając o meble czy ściany.
                Upewnij się też, że wokół nie ma przedmiotów, które mogłyby Cię
                zranić lub rozpraszać.
              </p>
              <br />
              <br />
              <p>
                Mata, świeczka, koc lub poduszka mogą dodać nastroju i wesprzeć
                Cię w relaksacji, ale najważniejsze jest to, byś czuł/a się
                bezpiecznie i swobodnie.
              </p>
            </FaqAnswer>
          </FaqItem>
          <FaqItem>
            <FaqQuestion>
              <p>
                Czy mogę ćwiczyć jogę, jeśli mam ograniczenia fizyczne lub
                przewlekłe choroby?
              </p>
            </FaqQuestion>
            <FaqAnswer>
              <p>
                Wiele osób praktykujących jogę to osoby z różnymi ograniczeniami
                - fizycznymi, emocjonalnymi, życiowymi. Joga nie jest formą
                rywalizacji ani testem sprawności. W naszej przestrzeni uczymy
                się słuchać ciała, nie przekraczać jego granic. Jeśli masz
                szczególne potrzeby - pisz do nas, chętnie podpowiemy, które
                zajęcia będą dla Ciebie odpowiednie.
              </p>
            </FaqAnswer>
          </FaqItem>
          <FaqItem>
            <FaqQuestion>
              <p>Jaki jest koszt subskrypcji?</p>
            </FaqQuestion>
            <FaqAnswer>
              <p>
                Aktualny koszt subskrypcji znajdziesz na stronie Oddechowni, w
                zakładce TBC. Stawiamy na prostotę i przejrzystość - jedna
                opłata miesięczna, bez żadnych ukrytych kosztów. To dostęp do
                całej biblioteki praktyk, zajęć na żywo, nagrań, medytacji czy
                materiałów edukacyjnych w ramach jednej płatności.
              </p>
            </FaqAnswer>
          </FaqItem>
          <FaqItem>
            <FaqQuestion>
              <p>
                Jak działa subskrypcja? Czy mogę ją anulować w dowolnym
                momencie?
              </p>
            </FaqQuestion>
            <FaqAnswer>
              <p>
                Tak, subskrypcja jest w pełni elastyczna - możesz ją włączyć lub
                anulować w dowolnym momencie, bez zobowiązań.
              </p>
            </FaqAnswer>
          </FaqItem>
          <FaqItem>
            <FaqQuestion>
              <p>Jak mogę dołączyć do zajęć online?</p>
            </FaqQuestion>
            <FaqAnswer>
              <p>
                To bardzo proste. Po wykupieniu subskrypcji otrzymasz dostęp do
                platformy, gdzie znajdziesz linki do zajęć na żywo oraz
                bibliotekę nagrań. Możesz praktykować na żywo lub odtwarzać
                zajęcia wtedy, gdy masz na to przestrzeń.
              </p>
            </FaqAnswer>
          </FaqItem>
          <FaqItem>
            <FaqQuestion>
              <p>Jak wygląda harmonogram zajęć?</p>
            </FaqQuestion>
            <FaqAnswer>
              <p>
                Zajęcia na żywo odbywają się zwykle 3-4 razy w miesiącu, o
                różnych porach - tak, by każdy mógł znaleźć coś dla siebie.
                Dokładny harmonogram znajdziesz w panelu użytkownika oraz w
                mailach z przypomnieniami. Pamiętaj, że jeśli nie możesz być na
                zajęciach na żywo - wszystkie nagrania znajdziesz w TBC.
              </p>
            </FaqAnswer>
          </FaqItem>
          <FaqItem>
            <FaqQuestion>
              <p>Jak długo mam dostęp do nagrań po zajęciach?</p>
            </FaqQuestion>
            <FaqAnswer>
              <p>
                Masz dostęp do pełnej biblioteki nagrań przez cały okres trwania
                Twojej subskrypcji. Możesz wracać do praktyk tak często, jak
                chcesz - we własnym rytmie.
              </p>
            </FaqAnswer>
          </FaqItem>
          <FaqItem>
            <FaqQuestion>
              <p>
                Czy joga to religia? Czy muszę wyznawać jakieś przekonania, żeby
                praktykować?
              </p>
            </FaqQuestion>
            <FaqAnswer>
              <p>
                Nie, joga nie jest religią. To metoda pracy z ciałem, oddechem i
                świadomością - dostępna dla każdego, niezależnie od przekonań,
                doktryn i religijnych praktyk. Może mieć duchowy wymiar, ale
                sama w sobie nie ma charakteru kultu czy religii.
                <br />
                <br />W Oddechowni traktujemy jogę jako narzędzie powrotu do
                siebie. Możesz czerpać z niej tyle, ile potrzebujesz - z
                otwartym sercem.
              </p>
            </FaqAnswer>
          </FaqItem>
          <FaqItem>
            <FaqQuestion>
              <p>Czy joga może pomóc w radzeniu sobie ze stresem i lękiem?</p>
            </FaqQuestion>
            <FaqAnswer>
              <p>
                Tak. Joga ma potencjał, by łagodzić napięcia, regulować oddech i
                uspokajać gonitwę myśli. Regularna praktyka może wpływać kojąco
                na układ nerwowy i może być realnym wsparciem w codziennych
                trudnościach.
              </p>
            </FaqAnswer>
          </FaqItem>
          <FaqItem>
            <FaqQuestion>
              <p>
                Czy są materiały edukacyjne, które mogę przeczytać lub odsłuchać
                poza zajęciami?
              </p>
            </FaqQuestion>
            <FaqAnswer>
              <p>
                Tak! W Oddechowni znajdziesz także aspekty filozoficzne jogi,
                medytacje, nagrania z refleksjami, mantrami czy podcasty.
                Wszystko po to, by wspierać Cię nie tylko na macie, ale też poza
                nią.
              </p>
            </FaqAnswer>
          </FaqItem>
        </div>
      </Container>
    </section>
  );
}
