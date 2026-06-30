import DotField from '@/components/DotField';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

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
        <section className="w-full flex-1 flex justify-center items-center flex-col space-y-20">
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
