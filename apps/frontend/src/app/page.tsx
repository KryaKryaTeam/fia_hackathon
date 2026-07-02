'use client'
import DotField from '@/components/DotField';
import { Button } from '@/components/ui/button';
import GeolocationAccessModal from '@/components/widget/GeolocationAccessModal';
import container, { TYPES } from '@/infrastructure/Container';
import ModalState from '@/state/Modal.state';

function Page() {
  
//   if ('geolocation' in navigator) {
//   navigator.geolocation.getCurrentPosition(
//     (position) => {
//       const { latitude, longitude, accuracy } = position.coords;
//       console.log(`Широта: ${latitude}, Довгота: ${longitude}`);
//       console.log(`Точність: ${accuracy} метрів`);
//     },
//     (error) => {
//       console.error('Помилка:', error.message);
//     },
//     {
//       enableHighAccuracy: true, // максимальна точність (GPS)
//       timeout: 5000,            // таймаут очікування (мс)
//       maximumAge: 0             // не використовувати кешовану позицію
//     }
//   );
// } else {
//   console.log('Geolocation не підтримується браузером');
// }
  const modal = container.get<ModalState>(TYPES.ModalState)
  modal.active("InputStreet")
  return (
    <div className="w-screen flex flex-col">
      <div className="w-full h-screen flex flex-col">
        <div
          style={{ width: '100%', height: '100vh', position: 'absolute' }}
          className="z-[-1]"
        >
          <DotField
            dotRadius={1.5}
            dotSpacing={14}
            bulgeStrength={67}
            glowRadius={160}
            sparkle={false}
            waveAmplitude={0}
            cursorRadius={500}
            cursorForce={0.1}
            bulgeOnly
            gradientFrom="#A855F7"
            gradientTo="#B497CF"
            glowColor="#120F17"
          />
        </div>
        <div className="h-20"></div>
        <section className="w-full flex-1 flex justify-center items-center flex-col space-y-20 relative">
          <div className="absolute mx-auto my-auto w-250 h-150 bg-primary blur-3xl rounded-full opacity-20 z-[-2]"></div>
          <h1 className="text-[8rem] font-['Oswald'] font-black font-stretch-extra-condensed leading-32 text-center tracking-tight uppercase">
            Твоя ініціатива <br /> зміни зараз
          </h1>
          <div className="flex row">
            <Button className="w-100 h-15 font-semibold text-lg font-heading">
              Написати заяву
            </Button>
          </div>
        </section>
      </div>
      
    </div>
  );
}

export default Page;
