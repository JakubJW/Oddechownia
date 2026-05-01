import { FaqAnswer, FaqQuestion, FaqItem } from '@/components/FaqItem/FaqItem';
import Container from '@/components/Container/Container';

export default function Faq() {
  return (
    <section className="bg-matcha">
      <Container>
        <h2 className="text-2xl leading-normal xl:text-4xl xl:leading-relaxed text-center text-white mb-16">
          FAQ
        </h2>
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
              <p>
                Czy mogę dołączyć, jeśli nie chcę wykonywać praktyki fizycznej?
              </p>
            </FaqQuestion>
            <FaqAnswer>
              <p>
                Tak! W Oddechowni praktyki asan to tylko jedna z dostępnych
                sekcji. Oprócz tego zanurzamy się również wspólnie w świat
                filozofii jogi, medytujemy, praktykujemy jogę nidrę & rozmawiamy
                o wielu ciekawych i inspirujących jogicznych konceptach.
              </p>
            </FaqAnswer>
          </FaqItem>
        </div>
      </Container>
    </section>
  );
}
