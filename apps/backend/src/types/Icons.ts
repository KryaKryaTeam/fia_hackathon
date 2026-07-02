export enum Icons {
  // Статуси та Важливе (для правил)
  ERROR = 'ERROR',
  WARNING = 'WARNING',
  INFO = 'INFO',
  SUCCESS = 'SUCCESS',
  QUESTION = 'QUESTION', // Для FAQ або умов
  EXCLAMATION = 'EXCLAMATION', // Акцент на важливому правилі

  // Обмеження та Дозволи
  LOCK = 'LOCK', // Закритий доступ
  UNLOCK = 'UNLOCK', // Відкритий доступ
  PROHIBITED = 'PROHIBITED', // "Заборонено" (коло з лінією)
  CHECK_CIRCLE = 'CHECK_CIRCLE', // "Дозволено" або "Виконано"
  EYE = 'EYE', // Видимість правил
  EYE_OFF = 'EYE_OFF', // Прихований контент

  // Списки та Структура
  LIST = 'LIST',
  GAVEL = 'GAVEL', // "Молоток судді" — ідеально для розділу "Юридичні правила"
  FILE_TEXT = 'FILE_TEXT', // Документація
  CLIPBOARD = 'CLIPBOARD', // Вимоги до реєстрації
  BOOK = 'BOOK', // Гайд або база знань

  // Час та Дедлайни
  CLOCK = 'CLOCK', // Часові обмеження
  CALENDAR = 'CALENDAR', // Дати етапів
  HOURGLASS = 'HOURGLASS', // Процес очікування

  // Взаємодія та Користувачі
  USERS = 'USERS', // Командні правила
  USER_CHECK = 'USER_CHECK', // Вимоги до учасника
  MESSAGES = 'MESSAGES', // Комунікація або чат
  SHARE = 'SHARE', // Реферальні правила

  // Нагороди та Мотивація
  TROPHY = 'TROPHY', // Призовий фонд
  STAR = 'STAR', // Особливі умови / Вибране
  GIFT = 'GIFT', // Бонуси
  MEDAL = 'MEDAL', // Ранги учасників

  // Технічні / Гейміфікація
  CODE = 'CODE', // Правила для розробників / API
  CPU = 'CPU', // Технічні вимоги до заліза
  GLOBE = 'GLOBE', // Регіональні обмеження
  LIGHTBULB = 'LIGHTBULB', // Поради або підказки
}
