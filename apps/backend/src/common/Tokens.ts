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
  CompetitionMapper = 'COMPETITION_MAPPER',
  RoundMapper = 'ROUND_MAPPER',
  TaskMapper = 'TASK_MAPPER',
  ScoreMapper = 'SCORE_MAPPER',
  TeamMapper = 'TEAM_MAPPER',
  CriteriaMapper = 'CRITERIA_MAPPER',
  SubmitionMapper = 'SUBMITION_MAPPER',
  LeaderboardMapper = 'LEADERBOARD_MAPPER',
  RoundReviewMapper = 'ROUND_REVIEW_MAPPER',
}

export enum ReposTokens {
  UserRepository = 'USER_REPOSITORY',
  AuthorizationProviderRepository = 'AUTHORIZATION_PROVIDER_REPOSITORY',
  NotificationRepository = 'NOTIFICATION_REPOSITORY',
  FileRepository = 'FILE_REPOSITORY',
  FileRelationRepository = 'FILE_RELATION_REPOSITORY',
  CompetitionRepository = 'COMPETITION_REPOSITORY',
  RoundRepository = 'ROUND_REPOSITORY',
  TeamRepository = 'TEAM_REPOSITORY',
  TaskRepository = 'TASK_REPOSITORY',
  ScoreRepository = 'SCORE_REPOSITORY',
  CriteriaRepository = 'CRITERIA_REPOSTORY',
  SubmitionRepository = 'SUBMITION_REPOSITORY',
  LeaderboardRepository = 'LEADERBOARD_REPOSITORY',
  RoundReviewRepository = 'ROUND_REVIEW_REPOSITORY',
}

export enum CommandTokens {
  // --- AUTH & USER ---
  LoginCommand = 'LOGIN_COMMAND',
  RegistrationCommand = 'REGISTRATION_COMMAND',
  ValidateRegistrationCommand = 'VALIDATE_REGISTRATION_COMMAND',
  CheckCommand = 'CHECK_COMMAND',
  GenerateTicketCommand = 'GENERATE_TICKET_COMMAND',
  RefreshCommand = 'REFRESH_COMMAND',
  GetPublicProfileQuery = 'GET_PUBLIC_PROFILE_QUERY',
  GetPrivateProfileQuery = 'GET_PRIVATE_PROFILE_QUERY',
  UpdateUserAdditionalDataCommand = 'UPDATE_USER_ADDITIONAL_DATA_COMMAND',
  UpdateUsernameCommand = 'UPDATE_USERNAME_COMMAND',
  UpdateAvatarCommand = 'UPDATE_AVATAR_COMMAND',
  GetCSRFToken = 'GET_CSRF_TOKEN_QUERY',

  // --- NOTIFICATIONS ---
  GetNotificationsQuery = 'GET_NOTIFICATION_QUERY',
  MakeNotificationReadCommand = 'MAKE_NOTIFICATION_READ_COMMAND',
  MarkAllNotificationsReadCommand = 'MARK_ALL_NOTIFICATIONS_READ_COMMAND',
  SendTestNotificationCommand = 'SEND_TEST_NOTIFICATION_COMMAND',

  // --- FILE & INFRA ---
  UploadFileCommand = 'UPLOAD_FILE_COMMAND',
  GetLinkQuery = 'GET_LINK_QUERY',
  DeleteGarbageCommand = 'DELETE_GARBAGE_COMMAND',

  // --- TEAMS ---
  CreateTeamCommand = 'CREATE_TEAM_COMMAND',
  PatchTeamCommand = 'PATCH_TEAM_COMMAND',
  RegisterTeamCommand = 'REGISTER_TEAM_COMMAND',
  CancelRegistrationOfTeamsCommand = 'CANCEL_REGISTRATION_OF_TEAMS_COMMAND',
  GetMyTeamsPageQuery = 'GET_MY_TEAMS_PAGE_QUERY',
  DeleteTeamCommand = 'DELETE_TEAM_COMMAND',

  // --- TEAM MEMBERS ---
  InviteMemberCommand = 'INVITE_MEMBER_COMMAND',
  AcceptMemberInviteCommand = 'ACCEPT_MEMBER_INVITE_COMMAND',
  DeleteMemberCommand = 'DELETE_MEMBER_COMMAND',
  ChangeCaptainCommand = 'CHANGE_CAPTAIN_COMMAND',

  // --- COMPETITION MANAGEMENT ---
  CreateCompetitionCommand = 'CREATE_COMPETITION_COMMAND',
  UpdateCompetitionCommand = 'UPDATE_COMPETITION_COMMAND',
  DeleteCompetitionCommand = 'DELETE_COMPETITION_COMMAND',
  PublishCompetitionCommand = 'PUBLISH_COMPETITION_COMMAND',
  ScheduleCompetitionPublishCommand = 'SCHEDULE_COMPETITION_PUBLISH_COMMAND',
  DeclineScheduledPublishCommand = 'DECLINE_SCHEDULED_PUBLISH_COMMAND',
  GetPublicCompetitionQuery = 'GET_PUBLIC_COMPETITION_QUERY',
  GetCompetitionPageQuery = 'GET_COMPETITION_PAGE_QUERY',
  GetPublicCompetitionsPageQuery = 'GET_PUBLIC_COMPETITIONS_PAGE_QUERY',
  UpdateSettingsOfCompetitionCommand = 'UPDATE_SETTINGS_OF_COMPETITION_COMMAND',
  GetPrivateCompetitionByIdCommand = 'GET_PRIVATE_COMPETITION_BY_ID_COMMAND',

  // --- ROUNDS & TASKS ---
  CreateRoundCommand = 'CREATE_ROUND_COMMAND',
  DeleteRoundCommand = 'DELETE_ROUND_COMMAND',
  PatchRoundCommand = 'PATCH_ROUND_COMMAND',
  ReadRoundCommand = 'READ_ROUND_COMMAND',
  CreateTaskCommand = 'CREATE_TASK_COMMAND',
  PullTeamsToNextRound = 'PULL_TEAMS_TO_NEXT_ROUND_COMMAND',
  DeleteTaskCommand = 'DELETE_TASK_COMMAND',

  // --- AUTOMATION & EVENTS ---
  RunEndEventOnAllEndedRoundsCommand = 'RUN_END_EVENT_ON_ALL_ENDED_ROUNDS_COMMAND',
  RunStartedEventOnAllStartedRoundsCommand = 'RUN_STARTED_EVENT_ON_ALL_STARTED_ROUNDS_COMMAND',
  HandleCompetitionScheduledEventsCommand = 'HANDLE_COMPETITION_SCHEDULED_EVENTS_COMMAND',

  // --- ADMIN ---
  CreateSuperUserCommand = 'CREATE_SUPER_USER_COMMAND',
  SetRoleToAUserCommand = 'SET_ROLE_TO_A_USER_COMMAND',
  GetUsersByEmailQuery = 'GET_USERS_BY_EMAIL_QUERY',

  // --- JUDGING ---
  RoundOnJudgingCommand = 'ROUND_ON_JUDGING_COMMAND',
  CreateSubmissionCommand = 'CREATE_SUBMISSION_COMMAND',
  UpdateSubmissionCommand = 'UPDATE_SUBMISSION_COMMAND',
  FindSubmissionByIdCommand = 'FIND_SUBMISSION_BY_ID_COMMAND',
  DeleteSubmissionCommand = 'DELETE_SUBMISSION_COMMAND',
  CreateScoreCommand = 'CREATE_SCORE_COMMAND',
  CreateRoundReviewCommand = 'CREATE_ROUND_REVIEW_COMMAND',
}

export enum ServiceTokens {
  AuthorizationProviderService = 'AUTHORIZATION_PROVIDER_SERVICE',
  JWTService = 'JWT_SERVICE',
  HashService = 'HASH_SERVICE',
  NotificationService = 'NOTIFICATION_SERVICE',
  WsTicketService = 'WS_TICKET_SERVICE',
  LoadFileService = 'LOAD_FILE_SERVICE',
  FileLinkerService = 'FILE_LINKER_SERVICE',
}

export enum MetadataTokens {
  USER_KEY = 'USER_METADATA',
}
