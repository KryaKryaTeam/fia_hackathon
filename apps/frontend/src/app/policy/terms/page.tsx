import React from 'react';

export default function TermsOfUsePage() {
  return (
    <div className="min-h-screen bg-[#0a0516] text-gray-300 py-16 px-4 sm:px-6 lg:px-8 selection:bg-purple-500 selection:text-white">
      <div className="max-w-3xl mx-auto bg-[#110a24] border border-purple-900/30 rounded-2xl p-6 sm:p-10 shadow-[0_0_50px_-12px_rgba(139,92,246,0.15)]">
        {/* хедер сторінки */}
        <header className="border-b border-purple-900/40 pb-6 mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
            Умови використання сервісу
          </h1>
          <p className="text-xs sm:text-sm text-purple-400/70 font-medium">
            Останнє оновлення: {new Date().toLocaleDateString('uk-UA')}
          </p>
        </header>

        {/* Контент */}
        <div className="space-y-8 text-sm sm:text-base leading-relaxed text-gray-300">
          <section className="group">
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 group-hover:text-purple-400 transition-colors duration-200">
              1. Загальні положення та згода
            </h2>
            <p className="text-gray-400">
              Ця угода користувача регулює відносини між вами (Користувачем) та
              нашою платформою. Використовуючи будь-які функції нашого сайту,
              включаючи подачу заяв та скарг, ви автоматично та беззастережно
              приймаєте ці Умови у повному обсязі.
            </p>
          </section>

          <section className="group">
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 group-hover:text-purple-400 transition-colors duration-200">
              2. Правила поведінки та кібербезпека (КК України)
            </h2>
            <p className="text-gray-400 mb-3">
              Платформа створена для забезпечення прозорості та законних
              ініціатив змін. Будь-які протиправні дії на сайті суворо
              заборонені. Користувачам забороняється:
            </p>
            <ul className="list-disc list-inside space-y-2 pl-2 text-gray-400">
              <li>
                Здійснювати несанкціоноване втручання в роботу платформи,
                комп'ютерних мереж або систем сервісу (**ст. 361 Кримінального
                кодексу України**).
              </li>
              <li>
                Створювати штучне навантаження на сервер, проводити DDoS-атаки
                або поширювати шкідливе програмне забезпечення (**ст. 361-1, 362
                КК України**).
              </li>
              <li>
                Використовувати сервіс для шахрайства, фішингу, збору чужих
                персональних даних або маніпуляцій з інформацією (**ст. 190 КК
                України**).
              </li>
              <li>
                Надсилати спам, неправдиві заяви, або заклики до насильства,
                повалення конституційного ладу та порушення територіальної
                цілісності України.
              </li>
            </ul>
          </section>

          <section className="group">
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 group-hover:text-purple-400 transition-colors duration-200">
              3. Подання заяв та достовірність інформації
            </h2>
            <p className="text-gray-400">
              При користуванні функціоналом «Написати заяву» або мапою скарг, ви
              несете особисту відповідальність за достовірність наданих фактів.
              Навмисне надання завідомо неправдивої інформації, що порочить
              честь, гідність чи ділову репутацію третіх осіб, може мати
              наслідки згідно з чинним законодавством України (Цивільний кодекс
              України).
            </p>
          </section>

          <section className="group">
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 group-hover:text-purple-400 transition-colors duration-200">
              4. Інтелектуальна власність
            </h2>
            <p className="text-gray-400">
              Усі елементи інтерфейсу, дизайн, логотипи, вихідний код та контент
              платформи є об'єктами інтелектуальної власності. Забороняється
              копіювання або комерційне використання матеріалів сайту без
              попередньої письмової згоди розробників.
            </p>
          </section>

          <section className="group">
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 group-hover:text-purple-400 transition-colors duration-200">
              5. Обмеження відповідальності
            </h2>
            <p className="text-gray-400">
              Сервіс надається «як є» (as is). Ми докладаємо максимум зусиль для
              безперебійної роботи, але не гарантуємо відсутність тимчасових
              технічних збоїв. Адміністрація платформи не несе відповідальності
              за будь-які прямі чи непрямі збитки, пов'язані з використанням або
              неможливістю використання цього сайту.
            </p>
          </section>
        </div>

        {/* сторінка з футером */}
        <footer className="mt-12 pt-6 border-t border-purple-900/40 text-center">
          <p className="text-xs sm:text-sm text-gray-500">
            Дотримуйтесь законів України та поважайте інших користувачів. Зміни
            починаються з кожного з нас!
          </p>
        </footer>
      </div>
    </div>
  );
}
