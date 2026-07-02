import { Test, TestingModule } from '@nestjs/testing';
import { EventDispatcher } from './EventDispatcher';
import { BaseTokens } from '@/common/Tokens';
import { Event } from '@/common/domain/Event';
import { EventType } from '@/common/domain/EventType';

describe('EventDispatcher', () => {
  let dispatcher: EventDispatcher;

  // Мокаємо EventHandler
  const mockEventHandler = {
    handle: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventDispatcher,
        {
          provide: BaseTokens.EventHandler,
          useValue: mockEventHandler,
        },
      ],
    }).compile();

    dispatcher = module.get<EventDispatcher>(EventDispatcher);
    jest.clearAllMocks();
  });

  it('should add events to the list', () => {
    const event = { EventType: EventType.CHANGE_ROLE } as Event<unknown>;

    dispatcher.addEvent(event);

    expect(dispatcher.getEventsCount()).toBe(1);
  });

  it('should dispatch all events and clear the list', async () => {
    const event1 = { EventType: EventType.CHANGE_ROLE } as Event<unknown>;
    const event2 = { EventType: EventType.CHANGE_ROLE } as Event<unknown>;

    dispatcher.addEvent(event1);
    dispatcher.addEvent(event2);

    expect(dispatcher.getEventsCount()).toBe(2);

    // Викликаємо диспетчеризацію
    dispatcher.dispatchEvents();

    // 1. Перевіряємо, що список очистився миттєво
    expect(dispatcher.getEventsCount()).toBe(0);

    // 2. Оскільки використовується setImmediate, нам потрібно почекати завершення поточного циклу
    await new Promise((resolve) => setImmediate(resolve));

    expect(mockEventHandler.handle).toHaveBeenCalledTimes(2);
    expect(mockEventHandler.handle).toHaveBeenCalledWith(event1);
    expect(mockEventHandler.handle).toHaveBeenCalledWith(event2);
  });

  it('should handle errors in dispatchEvent gracefully', async () => {
    const event = { EventType: EventType.CHANGE_ROLE } as Event<unknown>;
    dispatcher.addEvent(event);

    mockEventHandler.handle.mockRejectedValueOnce(new Error('Handler crashed'));

    dispatcher.dispatchEvents();

    await new Promise((resolve) => setImmediate(resolve));

    expect(mockEventHandler.handle).toHaveBeenCalledWith(event);
  });
});
