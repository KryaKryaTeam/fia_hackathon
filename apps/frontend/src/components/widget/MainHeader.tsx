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
import { HomeIcon, LogOut, MenuIcon, UserRound } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useIsMobile } from '@/lib/useIsMobilde';
import { useRequestMutation } from '@/lib/useRequestMutation';
import { LogoutRequest } from '@/request/Logout.request';
import container, { TYPES } from '@/infrastructure/Container';
import { UserState } from '@/state/User.state';

const MainHeader = observer(() => {
  const { data, isLoading } = useRequestQuery(MyUserRequest, undefined);
  const { mutateAsync } = useRequestMutation(LogoutRequest);
  const userState = container.get<UserState>(TYPES.UserState);
  const router = useRouter();

  const isMobile = useIsMobile();

  if (isMobile)
    return (
      <header className="fixed top-0 left-0 w-screen flex row items-center py-5">
        <div className="w-max flex px-6 flex-row items-center rounded-full relative overflow-clip">
          <Link href={'/'} className="w-max h-max">
            <div className="w-10 font-bold font-['Oswald'] text-2xl">ТіЗ</div>
          </Link>
        </div>
        <div className="flex-2 flex row justify-end items-center px-6 space-x-4">
          <DropdownMenu dir="rtl">
            <DropdownMenuTrigger asChild>
              <MenuIcon className="w-8 h-8" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-50">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Меню</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => {
                    router.push('/');
                  }}
                >
                  Головна <HomeIcon />
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    router.push('/ticket/create');
                  }}
                >
                  Написати заяву <UserRound />
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
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
                  <DropdownMenuItem
                    onClick={() => {
                      router.push('/user/changeData');
                    }}
                  >
                    Оновити мої дані <UserRound />
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-300"
                    onClick={() => {
                      mutateAsync(undefined, {
                        onSuccess: () => {
                          userState.clearAuthToken();
                          userState.clearUserData();
                          router.refresh();
                        },
                      });
                    }}
                  >
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

  return (
    <header className="fixed top-0 left-0 w-screen flex row">
      <div className="w-max py-3 mt-5 flex px-15 max-h-15 mx-12 flex-row items-center rounded-full relative overflow-clip">
        <div className="absolute w-full h-full blur-sm bg-secondary opacity-30 left-[-15] z-[-1]"></div>
        <Link href={'/'} className="w-max h-max">
          <div className="w-10 font-bold font-['Oswald'] text-2xl">ТіЗ</div>
        </Link>
        <nav className="flex-1 mx-20 flex space-x-10 flex-row font-medium font-heading leading-0 text-sm">
          <Link href="/#project">Про проєкт</Link>
          <Link href="/ticket/create">Написати заяву</Link>
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
                <DropdownMenuItem
                  onClick={() => {
                    router.push('/user/changeData');
                  }}
                >
                  Оновити мої дані <UserRound />
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-300"
                  onClick={() => {
                    mutateAsync(undefined, {
                      onSuccess: () => {
                        userState.clearAuthToken();
                        userState.clearUserData();
                        router.refresh();
                      },
                    });
                  }}
                >
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
