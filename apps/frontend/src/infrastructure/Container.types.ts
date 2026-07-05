export const TYPES = {
  UserState: Symbol.for('UserState'),
  FileStore: Symbol.for('FileStore'),
  GetGeoData: Symbol.for('GetGeoData'),
  ModalState: Symbol.for('ModalState'),
  StreetState: Symbol.for('StreetState'),
  ChangeStreetRequest: Symbol.for('ChangeStreetRequest'),
  QUERY_CLIENT: Symbol.for('QueryClient'),
  GetPointersNetworkRequest: Symbol.for('GetPointersNetworkRequest'),
} as const;
