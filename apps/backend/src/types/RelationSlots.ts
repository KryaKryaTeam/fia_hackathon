export const RelationSlots = {
  user: {
    avatar: 'user:avatar',
  },
  competition: {
    ultraWideBanner: 'competition:ultraWideBanner',
    banner: 'competition:banner',
    avatar: 'competition:avatar',
    socialMedia: 'competition:socialMedia',
  },
  team: {
    banner: 'team:banner',
    avatar: 'team:avatar',
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
    'competition:ultraWideBanner',
    {
      allowedMimeTypes: imagesMimeType,
      maxSize: 10 * 1024 * 1024,
      dimensions: [2560, 1080],
      shouldBeProcessed: true,
    },
  ],
  [
    'competition:banner',
    {
      allowedMimeTypes: imagesMimeType,
      maxSize: 5 * 1024 * 1024,
      dimensions: [500, 300],
      shouldBeProcessed: true,
    },
  ],
  [
    'competition:socialMedia',
    {
      allowedMimeTypes: imagesMimeType,
      maxSize: 5 * 1024 * 1024,
      dimensions: [1200, 630],
      shouldBeProcessed: true,
    },
  ],
  [
    'competition:avatar',
    {
      allowedMimeTypes: imagesMimeType,
      maxSize: 2 * 1024 * 1024,
      dimensions: [128 * 2, 128 * 2],
      shouldBeProcessed: true,
    },
  ],
  [
    'team:avatar',
    {
      maxSize: 2 * 1024 * 1024,
      allowedMimeTypes: imagesMimeType,
      dimensions: [128 * 2, 128 * 2],
      shouldBeProcessed: true,
    },
  ],
  [
    'team:banner',
    {
      allowedMimeTypes: imagesMimeType,
      maxSize: 5 * 1024 * 1024,
      dimensions: [500, 300],
      shouldBeProcessed: true,
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
