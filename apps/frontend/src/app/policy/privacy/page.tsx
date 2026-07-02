import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0a0516] text-gray-300 py-16 px-4 sm:px-6 lg:px-8 selection:bg-purple-500 selection:text-white">
      <div className="max-w-3xl mx-auto bg-[#110a24] border border-purple-900/30 rounded-2xl p-6 sm:p-10 shadow-[0_0_50px_-12px_rgba(139,92,246,0.15)]">
        {/* хедер сторінки */}
        <header className="border-b border-purple-900/40 pb-6 mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
            Політика конфіденційності
          </h1>
          <p className="text-xs sm:text-sm text-purple-400/70 font-medium">
            Останнє оновлення: {new Date().toLocaleDateString('uk-UA')}
          </p>
        </header>

        {/* контент */}
        <div className="space-y-8 text-sm sm:text-base leading-relaxed text-gray-300">
          <section className="group">
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 group-hover:text-purple-400 transition-colors duration-200">
              1. Загальні положення (ЗУ «Про захист персональних даних»)
            </h2>
            <p className="text-gray-400">
              Ця Політика конфіденційності розроблена відповідно до чинного
              законодавства України, зокрема Закону України **«Про захист
              персональних даних» № 2297-VI**. Ми здійснюємо збір, зберігання та
              обробку інформації з метою забезпечення функціонування платформи
              та захисту прав користувачів.
            </p>
          </section>

          <section className="group">
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 group-hover:text-purple-400 transition-colors duration-200">
              2. Склад персональних даних, що обробляються
            </h2>
            <p className="text-gray-400 mb-2">
              При використанні сервісу (поданні скарг, заяв або реєстрації) ми
              можемо обробляти такі дані:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2 text-gray-400">
              <li>Прізвище, ім'я, по батькові (за наявності);</li>
              <li>Контактний номер телефону та адреса електронної пошти;</li>
              <li>
                Інформація, яка міститься у ваших зверненнях, заявах або доданих
                документах;
              </li>
              <li>
                Автоматичні технічні дані (файли cookies, IP-адреса, дані про
                геолокацію для коректної роботи карти скарг).
              </li>
            </ul>
          </section>

          <section className="group">
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 group-hover:text-purple-400 transition-colors duration-200">
              3. Мета та підстави обробки персональних даних
            </h2>
            <p className="text-gray-400 mb-2">
              Обробка ваших даних здійснюється виключно на законних підставах
              для:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-gray-400">
              <li>
                Реєстрації, розгляду та публікації ваших ініціатив і скарг на
                платформі;
              </li>
              <li>
                Направлення офіційних запитів до відповідних органів за вашим
                дорученням;
              </li>
              <li>
                Забезпечення безпеки сервісу, запобігання спаму, фроду та
                кібератакам;
              </li>
              <li>Комунікації з вами щодо статусу розгляду поданих заяв.</li>
            </ul>
          </section>

          <section className="group">
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 group-hover:text-purple-400 transition-colors duration-200">
              4. Права Користувача як суб'єкта даних
            </h2>
            <p className="text-gray-400 mb-2">
              Відповідно до **ст. 8 Закону України «Про захист персональних
              даних»**, ви маєте право:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-gray-400">
              <li>
                Знати про джерела збору, місцезнаходження своїх персональних
                даних та мету їх обробки;
              </li>
              <li>
                Отримувати інформацію про умови надання доступу до даних третім
                особам;
              </li>
              <li>
                Пред'являти вмотивовану вимогу щодо зміни або знищення своїх
                даних, якщо вони обробляються незаконно чи є недостовірними;
              </li>
              <li>
                Відкликати згоду на обробку персональних даних у будь-який
                момент.
              </li>
            </ul>
          </section>

          <section className="group">
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 group-hover:text-purple-400 transition-colors duration-200">
              5. Захист інформації та термін зберігання
            </h2>
            <p className="text-gray-400">
              Ми застосовуємо сучасні методи шифрування (SSL/TLS), обмеження
              доступу та інші організаційні заходи для запобігання витоку
              інформації. Персональні дані зберігаються протягом строку,
              необхідного для реалізації мети обробки, але не довше, ніж це
              передбачено законом або до моменту отримання вимоги про їх
              видалення від користувача.
            </p>
          </section>

          <section className="group">
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 group-hover:text-purple-400 transition-colors duration-200">
              6. Взаємодія з третіми особами
            </h2>
            <p className="text-gray-400">
              Передача персональних даних третім особам без вашої згоди
              заборонена, за винятком випадків, коли така передача є необхідною
              для виконання вашої заяви (наприклад, надсилання скарги до
              державних органів чи комунальних служб) або прямо передбачена
              чинним законодавством України.
            </p>
          </section>
        </div>

        {/* футер сторінки */}
        <footer className="mt-12 pt-6 border-t border-purple-900/40 text-center">
          <p className="text-xs sm:text-sm text-gray-500">
            Ваша приватність — наш пріоритет. У разі виникнення питань щодо
            видалення або зміни даних, звертайтесь до нашої служби підтримки.
          </p>
        </footer>
      </div>
    </div>
  );
}
