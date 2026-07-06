'use client';
import Link from 'next/link';
import GoogleOAuthButton from './GoogleOAuthButton';
import { MyUserRequest } from '@/request/MyUser.request';
import Image from 'next/image';
import { observer } from 'mobx-react-lite';
import { useRequestQuery } from '@/lib/useRequestQuery';
import { Skeleton } from '../ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { FileUser, LogOut, UserRound } from 'lucide-react';

const MainHeader = observer(() => {
  const { data, isLoading } = useRequestQuery(MyUserRequest, undefined);

  return (
    <header className="fixed top-0 left-0 w-screen flex row">
      <div className="w-max py-3 mt-5 flex px-15 max-h-15 mx-12 flex-row items-center rounded-full relative overflow-clip">
        <div className="absolute w-full h-full blur-sm bg-secondary opacity-30 left-[-15] z-[-1]"></div>
        <div className="w-10 font-bold font-['Oswald'] text-2xl">ТіЗ</div>
        <nav className="flex-1 mx-20 flex space-x-10 flex-row font-medium font-heading leading-0 text-sm">
          <Link href="/">Про проєкт</Link>
          <Link href="/ticket/create">Написати заяву</Link>
          <Link href="/map">Карта скарг</Link>
        </nav>
      </div>
      <div className="flex-2 flex row justify-end items-center px-10 py-3">
        {isLoading ? (
          <Skeleton className="w-12 h-12 rounded-full"></Skeleton>
        ) : data ? (
          <DropdownMenu dir="rtl">
            <DropdownMenuTrigger asChild>
              <Image
                src={data.avatarURL}
                alt="User Avatar"
                width={40}
                height={40}
                className="w-12 h-12 rounded-full"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-70">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Account {data.email}</DropdownMenuLabel>
                <DropdownMenuItem>
                  Переглянути мої заяви <FileUser />
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Змінити дані користувача <UserRound />
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-300">
                  Вийти <LogOut />
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <GoogleOAuthButton />
        )}
      </div>
    </header>
  );
});

export default MainHeader;
