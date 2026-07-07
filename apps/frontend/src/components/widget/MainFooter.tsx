import Image from 'next/image';
import Link from 'next/link';

function MainFooter() {
  return (
    <footer className="h-150 w-screen relative max-md:h-max">
      <div className="absolute w-full h-full z-[-1] opacity-20 bg-linear-180 from-55% from-background to-primary"></div>
      <div className="grid grid-cols-3 grid-rows-[1fr_100px] h-full w-full text-foreground pt-10 font-sans px-30 max-md:grid-cols-1 max-md:grid-rows-[1fr_1fr_1fr_100px] max-md:px-5 max-md:space-y-10 max-md:pb-10">
        <div className="">
          <span className="flex items-center space-x-2">
            <div className="font-bold font-['Oswald'] text-4xl leading-none">
              ТіЗ
            </div>
            <p className="text-lg font-medium leading-none translate-y-[2px]">
              — Твоя ініціатива зміни зараз
            </p>
          </span>
          <p className="text-xs text-muted-foreground mt-10 max-w-xs leading-relaxed">
            Цей сайт використовує Google OAuth для автентифікації користувачів.
            Ми запитуємо доступ до вашого профілю (імені та email) виключно з
            метою автоматичного заповнення реквізитів у юридичних заявах. Ми не
            зберігаємо та не передаємо ваші персональні дані третім особам.
            Детальніше в{' '}
            <a
              href="https://tiz.swedka121.com/policy/privacy"
              className="underline hover:text-white"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="text-xl text-foreground font-medium">Посилання</h2>
          <nav className="flex flex-col gap-4">
            <Link className="text-foreground leading-4" href="/">
              Про проєкт
            </Link>
            <Link className="text-foreground leading-4" href="/tickets/create">
              Написати заяву
            </Link>
            <Link
              className="text-foreground leading-4"
              href="https://tiz.swedka121.com/policy/privacy"
            >
              Політика конфіденційності
            </Link>
            <Link
              className="text-foreground leading-4"
              href="https://tiz.swedka121.com/policy/terms"
            >
              Умови використання
            </Link>
            <Link
              className="text-foreground leading-4"
              href="https://t.me/kryakryateamsup_bot"
            >
              Підтримка
            </Link>
          </nav>
        </div>
        <div className="flex flex-col gap-4">
          <h2 className="text-xl text-foreground font-medium">
            Соціальні мережі
          </h2>
          <nav className="flex flex-col gap-4">
            <Link className="text-foreground leading-4" href="/">
              KryaKryaTeam Github
            </Link>
            <Link className="text-foreground leading-4" href="/competitions">
              KryaKryaTeam Instagram
            </Link>
            <Link
              className="text-foreground leading-4"
              href="/app/profile/information"
            >
              KryaKryaTeam Threads
            </Link>
            <Link className="text-foreground leading-4" href="/policy/privacy">
              KryaKryaTeam Discord
            </Link>
          </nav>
        </div>
        <div className="col-span-3 grid grid-cols-[48px_1fr] grid-rows-[24px_24px] gap-x-4 max-md:col-span-1 max-md:grid-rows-[48px_48px]">
          <Image
            src={'/KryaKryaTeamLogo.png'}
            width={48}
            height={48}
            alt="krya krya team logo"
            className="row-span-2"
          ></Image>
          <p className="font-heading">
            © {new Date().getFullYear()}{' '}
            <span className="text-foreground font-medium">ТіЗ</span> (Тут і
            Зараз). Всі права захищені.
          </p>
          <p className="font-heading">
            Developed and maintained by{' '}
            <span className="font-semibold hover:underline cursor-pointer">
              KryaKryaTeam
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default MainFooter;
