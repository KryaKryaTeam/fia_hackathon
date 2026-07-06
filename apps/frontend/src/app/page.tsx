'use client';
import DotField from '@/components/DotField';
import Silk from '@/components/Silk';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function Page() {
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
            <Link href={'/ticket/create'}>
              <Button className="w-100 h-15 font-semibold text-lg font-heading">
                Написати заяву
              </Button>{' '}
            </Link>
          </div>
        </section>
      </div>
      <section className="w-full h-screen grid grid-cols-2 grid-rows-1">
        <div className="flex flex-col items-center justify-center gap-10">
          <div className="font-bold font-['Oswald'] text-[4rem] w-full max-w-150">
            Про проєкт
          </div>
          <p className="max-w-150 text-2xl">
            ТіЗ - це сучасна SmartCity платформа, яка ліквідує бюрократичний
            бар'єр між громадянами та органами управління (ОСББ, комунальними
            службами, міською владою). Ми об'єднали штучний інтелект, геодані та
            юридичну базу, щоб кожен міг створити офіційну заяву чи скаргу за
            лічені хвилини — без довгих пошуків шаблонів та юридичних
            консультацій.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="max-w-150 w-full h-200 rounded-md overflow-hidden relative">
            <Silk
              speed={5}
              scale={1}
              color="#7C3AED"
              noiseIntensity={1.5}
              rotation={0}
            ></Silk>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Page;
