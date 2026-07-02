import { Test, TestingModule } from '@nestjs/testing';
import { EventHandler } from './EventHandler';
import { Event } from '@/common/domain/Event';
import { EventType } from '@/common/domain/EventType';
import { BaseTokens } from '@/common/Tokens';

describe('EventHandler', () => {
  let handler: EventHandler;

  // Мокаємо DBContext з підтримкою реального виконання колбеку всередині isolate
  const mockDbContext = {
    isolate: jest.fn(async (fn: () => Promise<void>) => {
      // Важливо викликати функцію, яку передає EventHandler в isolate
      return await fn();
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventHandler,
        {
          provide: BaseTokens.DBContext,
          useValue: mockDbContext,
        },
      ],
    }).compile();

    handler = module.get<EventHandler>(EventHandler);
    jest.clearAllMocks();
  });

  it('має викликати isolate та виконати колбек', async () => {
    const eventType = EventType.USER_CREATED;
    const payload = { userId: '123' };
    const event = { EventType: eventType, payload } as Event<unknown>;

    const callback = jest.fn().mockResolvedValue(undefined);
    handler.addListener(eventType, callback);

    await handler.handle(event);

    // Перевіряємо, чи був викликаний isolate
    expect(mockDbContext.isolate).toHaveBeenCalled();
    // Перевіряємо, чи отримав колбек правильні дані
    expect(callback).toHaveBeenCalledWith(payload);
  });

  it('має ізолювати помилку одного обробника, не перериваючи інші', async () => {
    const eventType = EventType.USER_CREATED;
    const event = { EventType: eventType, payload: {} } as Event<unknown>;

    const failingCallback = jest.fn().mockRejectedValue(new Error('DB Error'));
    const successCallback = jest.fn().mockResolvedValue(undefined);

    handler.addListener(eventType, failingCallback);
    handler.addListener(eventType, successCallback);

    // Ми використовуємо Promise.all в коді, тому чекаємо завершення
    await handler.handle(event);

    // Обидва мали бути обгорнуті в isolate
    expect(mockDbContext.isolate).toHaveBeenCalledTimes(2);
    expect(successCallback).toHaveBeenCalled();
    expect(failingCallback).toHaveBeenCalled();
  });
});
