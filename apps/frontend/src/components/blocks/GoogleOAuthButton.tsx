'use client';
import Script from 'next/script';
import { useEffect, useState } from 'react';
import container from '../../infrastructure/Container';
import { usePathname, useRouter } from 'next/navigation';
import { RequestLoginWithGoogle } from '../../infrastructure/requests/LoginWithGoogle.request';
import { Button } from '../ui/button';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (parent: HTMLElement, config: any) => void;
          prompt: (momentListener?: any) => void;
        };
      };
    };
  }
}

export default function GoogleOAuthButton() {
  const [error, setError] = useState<string | null>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const initializeGoogle = () => {
    if (!window.google) return;

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

    if (!clientId) {
      setError('Google Client ID is missing.');
      return;
    }

    window.google.accounts.id.initialize({
      client_id: clientId,
      use_fedcm_for_prompt: true,
      callback: async (res: { credential: string }) => {
        try {
          const request = container.get<RequestLoginWithGoogle>(
            RequestLoginWithGoogle,
          );
          const existsBefore = await request.execute({ code: res.credential });
          router.push(existsBefore ? '/app/profile/information' : '/auth/info');
        } catch (err) {
          setError(`Login failed: ${(err as Error).message}`);
        }
      },
    });
  };

  // Функція, яка викликає вікно логіну при кліці на ТВОЮ власну кнопку
  const handleGoogleLogin = () => {
    if (window.google) {
      // Викликає стандартний Google One Tap або вікно вибору акаунту
      window.google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // Якщо One Tap не спрацював (наприклад, заблокований), можна зробити фолбек
          // Але для FedCM зазвичай достатньо просто викликати prompt()
        }
      });
    }
  };

  useEffect(() => {
    if (window.google || scriptLoaded) {
      initializeGoogle();
    }
  }, [pathname, scriptLoaded]);

  return (
    <div className="flex flex-col justify-center items-center">
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
      />

      {/* Твоя повністю кастомна кнопка з дизайном як на скріншоті */}
      <Button
        type="button"
        onClick={handleGoogleLogin}
        className="flex items-center justify-center w-max h-11 px-5 bg-[#1a1d21] hover:bg-[#22252a] text-white rounded-full transition-colors border border-gray-800"
      >
        {/* Біле коло для логотипу Google */}
        <div className="flex items-center justify-center w-8 h-8 rounded-full mr-4">
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#EA4335"
              d="M5.266 9.765A7.077 7.077 0 0112 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.33 0 3.33 2.69 1.455 6.611l3.81 3.154z"
            />
            <path
              fill="#4285F4"
              d="M23.491 12.273c0-.818-.073-1.609-.209-2.373H12v4.509h6.445a5.51 5.51 0 01-2.391 3.618v3.009h3.855c2.255-2.073 3.582-5.127 3.582-8.764z"
            />
            <path
              fill="#FBBC05"
              d="M5.266 14.235L1.455 17.39A11.947 11.947 0 010 12c0-1.927.455-3.755 1.455-5.39l3.81 3.154A7.034 7.034 0 004.91 12c0 82.26 1.14 1.58 2.22"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.973-1.073 7.964-2.918l-3.855-3.009c-1.073.718-2.445 1.145-4.11 1.145-3.173 0-5.854-2.145-6.81-5.018L1.318 17.36C3.182 21.31 7.273 24 12 24z"
            />
          </svg>
        </div>
        <span className="text-sm font-medium tracking-wide">
          Продовжити з Google
        </span>
      </Button>

      {error && <p className="text-xs text-destructive mt-2">{error}</p>}
    </div>
  );
}
