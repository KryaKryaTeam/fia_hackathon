export enum BaseTokens {
  EventDispatcher = 'EVENT_DISPATCHER',
  EventHandler = 'EVENT_HANDLER',
  DBContext = 'DB_CONTEXT',
}

export enum MapperTokens {
  AuthorizationProviderMapper = 'AUTHORIZATION_PROVIDER_MAPPER',
  UserMapper = 'USER_MAPPER',
  NotificationMapper = 'NOTIFICATION_MAPPER',
  FileMapper = 'FILE_MAPPER',
  FileRelationMapper = 'FILE_RELATION_MAPPER',
  ApplicationMapper = 'APPLICATION_MAPPER',
}

export enum ReposTokens {
  UserRepository = 'USER_REPOSITORY',
  AuthorizationProviderRepository = 'AUTHORIZATION_PROVIDER_REPOSITORY',
  NotificationRepository = 'NOTIFICATION_REPOSITORY',
  FileRepository = 'FILE_REPOSITORY',
  FileRelationRepository = 'FILE_RELATION_REPOSITORY',
  ApplicationRepository = 'APPLICATION_REPOSITORY',
}

export enum ServiceTokens {
  AuthorizationProviderService = 'AUTHORIZATION_PROVIDER_SERVICE',
  JWTService = 'JWT_SERVICE',
  HashService = 'HASH_SERVICE',
  NotificationService = 'NOTIFICATION_SERVICE',
  WsTicketService = 'WS_TICKET_SERVICE',
  LoadFileService = 'LOAD_FILE_SERVICE',
  FileLinkerService = 'FILE_LINKER_SERVICE',
  GeoCoderService = 'GEO_CODER_SERVICE',
  PDFGeneratorService = 'PDF_GENERATOR_SERVICE',
  MlService = 'ML_SERVICE',
}

export enum MetadataTokens {
  USER_KEY = 'USER_METADATA',
}
