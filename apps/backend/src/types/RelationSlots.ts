export const RelationSlots = {
  user: {
    avatar: 'user:avatar',
  },
  application: {
    pdf: 'application:pdf',
  },
} as const;

export type TMimeType = `${string}/${string}`;
export type Dimensions = [number, number];

export interface ISlotConfig {
  maxSize: number;
  allowedMimeTypes: TMimeType[];
  dimensions: Dimensions;
  shouldBeProcessed: boolean;
}

const imagesMimeType: TMimeType[] = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/avif',
];

export const RelationSlotsConfig = new Map<string, ISlotConfig>([
  [
    'user:avatar',
    {
      maxSize: 2 * 1024 * 1024,
      allowedMimeTypes: imagesMimeType,
      dimensions: [128 * 2, 128 * 2],
      shouldBeProcessed: true,
    },
  ],
  [
    'application:pdf',
    {
      allowedMimeTypes: ['application/pdf'],
      shouldBeProcessed: false,
      maxSize: 20 * 1024 * 1024,
      dimensions: [0, 0],
    },
  ],
]);

type DeepValues<T> = T extends string
  ? T
  : T extends object
    ? DeepValues<T[keyof T]>
    : never;

export type AppSlotCode = DeepValues<typeof RelationSlots>;

export type RelationSlots = typeof RelationSlots;
