import Link from 'next/link';

function MainHeader() {
  return (
    <header className="fixed top-0 left-0 w-screen flex row">
      <div className="w-max py-3 mt-5 flex px-15 mx-12 flex-row items-center rounded-full relative overflow-clip">
        <div className="absolute w-full h-full blur-sm bg-secondary opacity-30 left-[-15] z-[-1]"></div>
        <div className="w-10 font-bold font-['Oswald'] text-2xl">ТіЗ</div>
        <nav className="flex-1 mx-20 flex space-x-10 flex-row font-medium font-heading leading-0 text-sm">
          <Link href="#">Про проєкт</Link>
          <Link href="#">Написати заяву</Link>
          <Link href="#">Карта скарг</Link>
        </nav>
      </div>
      <div className="flex-2 flex row justify-end items-center px-10 py-3">
        <p>Login with google</p>
      </div>
    </header>
  );
}

export default MainHeader;
