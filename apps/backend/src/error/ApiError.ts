import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

interface ErrorCodeComp {
  message: string;
  status: number;
}

export const ApiErrorsCodeVal: Record<string, ErrorCodeComp> = {
  DOM_001: {
    message: 'This change is restricted by domain logic',
    status: 403,
  },
  DOM_002: {
    message: 'This query is restricted by domain logic',
    status: 403,
  },
  DOM_003: {
    message: 'This value is immutable',
    status: 400,
  },
  DOM_004: {
    message: 'This value is unexpected',
    status: 400,
  },
  DOM_005: {
    message: "Data is equal, entity didn't changed",
    status: 400,
  },
  DOM_006: {
    message: 'Data is duplicated',
    status: 400,
  },
  NOTIFICATION_001: {
    message: 'Template for this notification is undefined (MISCONFIGURED)',
    status: 500,
  },
  NOTIFICATION_002: {
    message: 'Notification with this id is undefined',
    status: 404,
  },
  NOTIFICATION_003: {
    message: 'Ticker service error',
    status: 400,
  },
  ERR_001: {
    message: 'Page is empty',
    status: 404,
  },
  ERR_002: {
    message: 'Validation error',
    status: 400,
  },
  FILE_001: {
    message: 'File with this id is undefined',
    status: 404,
  },
  FILE_002: {
    message: 'File size exceeds the allowed limit',
    status: 400,
  },
  FILE_003: {
    message: 'Unsupported file MIME type or format',
    status: 400,
  },
  FILE_004: {
    message: 'File metadata (size/slot) is already set and cannot be changed',
    status: 400,
  },
  FILE_005: {
    message: 'File slot configuration is missing or invalid',
    status: 400,
  },
  FILE_006: {
    message:
      'File slot mismatch: requested slot does not match file definition',
    status: 400,
  },
  FILE_007: {
    message:
      'Entity mismatch: slot family does not match the related entity type',
    status: 400,
  },
  FILE_008: {
    message: 'Relation is immutable: cannot reassign file to another entity',
    status: 400,
  },
  FILE_009: {
    message: 'File relation is incomplete: missing slot or target entity',
    status: 400,
  },
  FILE_010: {
    message: 'Invalid internal file format: missing "internal_file:" prefix',
    status: 400,
  },
  FILE_011: {
    message: 'Mime type is undefined',
    status: 400,
  },
  FILE_012: {
    message: 'Invalid relation string format (expected "family:code")',
    status: 400,
  },
  FILE_013: {
    message: 'Unknown relation family (family not found in RelationSlots)',
    status: 404,
  },
  FILE_014: {
    message: 'Unknown relation code for the specified family',
    status: 404,
  },
  FILE_015: {
    message: 'Slot configuration not found for this relation string',
    status: 404,
  },
  FILE_016: {
    message: 'Avatar URL is unavailable',
    status: 404,
  },
  FILE_017: {
    message: 'Failed to fetch avatar',
    status: 500,
  },
  FILE_018: {
    message: 'File is unprocessed',
    status: 400,
  },
  FILE_019: {
    message: 'File is too large',
    status: 413,
  },
  USER_001: {
    message: 'This user already has provider with this type!',
    status: 400,
  },
  USER_002: {
    message: 'Admin only can change user role',
    status: 403,
  },
  USER_003: {
    message: 'Username shouldn`t starts with _',
    status: 400,
  },
  USER_004: {
    message: 'Username should be longer than 8 and shorter than 50',
    status: 400,
  },
  USER_005: {
    message: 'Password is incorrect',
    status: 401,
  },
  USER_006: {
    message: 'Can`t change password for user without Local provider',
    status: 400,
  },
  USER_007: {
    message: 'Incorrect contact data',
    status: 400,
  },
  USER_008: {
    message: 'Incorrect data for this provider',
    status: 400,
  },
  USER_009: {
    message: 'Denied by authorization provider',
    status: 403,
  },
  USER_010: {
    message: 'RequestId is incorrect',
    status: 400,
  },
  USER_011: {
    message: 'Validation code is incorrect',
    status: 400,
  },
  USER_012: {
    message: 'User with this id is undefined',
    status: 400,
  },
  USER_013: {
    message: 'This endpoint service only Local Provider',
    status: 403,
  },
  USER_014: {
    message: 'User with this email is already exists',
    status: 400,
  },
  USER_015: {
    message: 'Invalid refresh token',
    status: 401,
  },
  USER_016: {
    message: 'User with this email is undefined',
    status: 404,
  },
  USER_017: {
    message: 'Provider or state is undefined',
    status: 400,
  },
  USER_018: {
    message: 'CSRF Protection failed',
    status: 403,
  },
  USER_019: {
    message: 'Credential undefined',
    status: 400,
  },
  USER_020: {
    message: 'Id of requested user must be provided',
    status: 400,
  },
  USER_021: {
    message: 'Invalid login data',
    status: 400,
  },
  USER_022: {
    message: 'Unauthorized',
    status: 401,
  },
  USER_023: {
    message: 'Scopes for github provider is not provided (FRONTEND_REL)',
    status: 500,
  },
  USER_024: {
    message: 'Damaged data about user from github provider',
    status: 400,
  },
  USER_025: {
    message: 'Github authorization failed',
    status: 401,
  },
  USER_026: {
    message: 'Invalid format of token ,try add Bearer to JWT',
    status: 401,
  },
  USER_027: {
    message: 'Authorization header is undefined',
    status: 401,
  },
  USER_028: {
    message: 'Google authentication failed',
    status: 401,
  },
  USER_029: {
    message: 'Email not verified',
    status: 403,
  },
  USER_30: {
    message: 'Invalid age',
    status: 400,
  },
  COMPETITION_001: {
    message: 'Dates are invalid',
    status: 400,
  },
  COMPETITION_002: {
    message:
      'Name of competition should be longer than 0 symb and shorter than 255 symb',
    status: 400,
  },
  COMPETITION_003: {
    message:
      'Description of competition should be longer than 0 symb and shorter than 1000 symb',
    status: 400,
  },
  COMPETITION_004: {
    message: 'Load competition from db is failed',
    status: 500,
  },
  COMPETITION_005: {
    message: 'Competition is readonly now',
    status: 403,
  },
  COMPETITION_006: {
    message: 'This action breaks status flow of competition',
    status: 403,
  },
  COMPETITION_007: {
    message: 'Round with this id is undefined in this competition',
    status: 404,
  },
  COMPETITION_008: {
    message: "Can't change status to scheduled in setter",
    status: 500,
  },
  COMPETITION_009: {
    message: 'Rule name should be longer than 0 and shorter than 255 symbols',
    status: 400,
  },
  COMPETITION_010: {
    message:
      'Rule description should be longer than 0 and shorter than 1000 symbols',
    status: 400,
  },
  COMPETITION_011: {
    message: 'Invalid icon selected for the rule',
    status: 400,
  },
  COMPETITION_012: {
    message: "User can't delete this competition",
    status: 403,
  },
  COMPETITION_013: {
    message: "User can't edit this competition",
    status: 403,
  },
  COMPETITION_014: {
    message: 'Competition with this id is undefined',
    status: 404,
  },
  COMPETITION_015: {
    message: 'Page is not found',
    status: 404,
  },
  COMPETITION_016: {
    message: 'Settings is incomplete',
    status: 400,
  },
  COMPETITION_017: {
    message: 'Setting type is invalid',
    status: 500,
  },
  COMPETITION_018: {
    message: 'Setting is invalid',
    status: 500,
  },
  COMPETITION_019: {
    message: 'You need to set battle bounds first, to create rounds',
    status: 400,
  },
  COMPETITION_020: {
    message: 'Competition is undefined',
    status: 400,
  },
  COMPETITION_021: {
    message: 'Round is out of bounds',
    status: 400,
  },
  COMPETITION_022: {
    message: 'Rounds are overlaping',
    status: 400,
  },
  ROUND_001: {
    message: 'Start date of round must be in the future',
    status: 400,
  },
  ROUND_002: {
    message: 'End date of round must be in the future',
    status: 400,
  },
  ROUND_003: {
    message: 'End date cannot be before or equal to start date',
    status: 400,
  },
  ROUND_004: {
    message: 'This action breaks status flow of round',
    status: 403,
  },
  ROUND_005: {
    message: 'Round is currently active and cannot be modified',
    status: 403,
  },
  ROUND_006: {
    message: 'Task is not found in this round',
    status: 404,
  },
  ROUND_007: {
    message: 'Round name or description length is invalid',
    status: 400,
  },
  TASK_001: {
    message: 'Task name should be longer than 0 and shorter than 255 symbols',
    status: 400,
  },
  TASK_002: {
    message:
      'Task description should be longer than 0 and shorter than 2000 symbols',
    status: 400,
  },
  TASK_003: {
    message: 'Invalid color configuration for task',
    status: 400,
  },
  STORAGE_001: {
    message: 'Storage operation failed',
    status: 500,
  },
  SERVICE_001: {
    message: 'Service is misconfigured',
    status: 500,
  },
  TEST_001: {
    message: 'Test endpoints is unavalible',
    status: 403,
  },
  COMMAND_001: {
    message: 'Command params are wrong',
    status: 400,
  },
  ROUND_008: {
    message: "This round wasn't found",
    status: 404,
  },
  ROUND_009: {
    message: "Invalid date span. Rounds mustn't be held at the same time.",
    status: 400,
  },
  ROUND_010: {
    message: 'This round is hidden',
    status: 400,
  },
  TASK_004: {
    message: 'The task was not found',
    status: 404,
  },
  USER_031: {
    message: "The user doesn't have enough rights to access this feature",
    status: 403,
  },
  TEAM_001: {
    message: 'Team cannot can be changed in competition',
    status: 403,
  },
  TEAM_002: {
    message: 'Status flow breaks',
    status: 400,
  },
  TEAM_003: {
    message: 'This member must accept invite to be added',
    status: 400,
  },
  TEAM_004: {
    message: 'User already has member invite or already in the team',
    status: 400,
  },
  TEAM_005: {
    message: 'This member is undefined!',
    status: 400,
  },
  TEAM_006: {
    message:
      'To invite member for a competition team must be in the registration status',
    status: 400,
  },
  TEAM_007: {
    message: 'User has no invites',
    status: 400,
  },
  TEAM_008: {
    message: 'Team has member invites, cannot start a registration',
    status: 400,
  },
  TEAM_009: {
    message: 'Cannot end registration of the team',
    status: 400,
  },
  TEAM_010: {
    message: 'Team is undefined',
    status: 404,
  },
  TEAM_011: {
    message: 'One of members is already in competition',
    status: 400,
  },
  TEAM_012: {
    message: "Team isn't aligned with setting",
    status: 400,
  },
  SCORE_001: {
    message: 'This score was not found',
    status: 404,
  },
  CRITERIA_001: {
    message: 'The criteria was not found',
    status: 404,
  },
  CRITERIA_002: {
    message: 'The name of this criteria is too big',
    status: 400,
  },
  CRITERIA_003: {
    message: 'The description of this criteria is too big',
    status: 400,
  },
  CRITERIA_004: {
    message: 'Did not fill in the name of the criteria',
    status: 400,
  },
  SUBMITION_001: {
    message: 'The submition was not found',
    status: 404,
  },
  SUBMITION_002: {
    message: 'Did not provide github url',
    status: 400,
  },
  SUBMITION_003: {
    message: 'Did not provide youtube url',
    status: 400,
  },
  SUBMITION_004: {
    message: 'Did not provide any related round',
    status: 400,
  },
  LEADERBOARD_001: {
    message: 'The place value is not valid. Must be 1 or bigger',
    status: 400,
  },
  LEADERBOARD_002: {
    message: 'This leaderboard was not found',
    status: 404,
  },
  SCORE_005: {
    message: 'The criteria value cannot be less than or uqual to zero',
    status: 400,
  },
  SUBMITION_005: {
    message: 'Round is already due. Cannot create submissions',
    status: 400,
  },
  ROUND_REVIEW_001: {
    message: "Cannot create review of this round since it hasn't finished yet",
    status: 400,
  },
  ROUND_REVIEW_002: {
    message: 'There are no scores provided',
    status: 400,
  },
  ROUND_011: {
    message: 'This team was not found in participants of this round',
    status: 404,
  },
  ROUND_REVIEW_003: {
    message: 'This round review was not found',
    status: 404,
  },
  TEAM_013: {
    message: 'This team was not found',
    status: 404,
  },
  LEADERBOARD_003: {
    message: 'No summary found in the review',
    status: 404,
  },
  ROUND_012: {
    message: 'This round is not listed in the competition',
    status: 404,
  },
  SCORE_002: {
    message: 'Duplicate scores for the same round are not allowed',
    status: 400,
  },
} as const;

export const DomainErrors = {
  RESTRICTED_CHANGE: 'DOM_001',
  RESTRICTED_QUERY: 'DOM_002',
  IMMUTABLE_VALUE: 'DOM_003',
  UNEXPECTED_VALUE: 'DOM_004',
  NO_CHANGE: 'DOM_005',
  DUPLICATION: 'DOM_006',
} as const;

export const NotificationErrors = {
  TEMPLATE_IS_UNDEFINED: 'NOTIFICATION_001',
  NOTIFICATION_IS_UNDEFINED: 'NOTIFICATION_002',
  TICKER_SERVICE_ERROR: 'NOTIFICATION_003',
} as const;

export const CommonErrors = {
  PAGE_IS_EMPTY: 'ERR_001',
  VALIDATION_ERROR: 'ERR_002',
} as const;

export const UserErrors = {
  PROVIDERS_DUPLICATION: 'USER_001',
  USER_ROLE_CANT_BE_CHANGED: 'USER_002',
  USERNAME_NOT_STARTS_WITH_: 'USER_003',
  USERNAME_LENGTH_RESTRICTION: 'USER_004',
  PASSWORD_IS_INCORRECT: 'USER_005',
  CHANGE_PASSWORD_FOR_NOT_LOCAL_PROVIDER: 'USER_006',
  INCORRECT_CONTACT_DATA: 'USER_007',
  INCORRECT_PROVIDER_DATA: 'USER_008',
  DENIED_BY_AUTH_PROVIDER: 'USER_009',
  REQUEST_ID_INCORRECT: 'USER_010',
  VALIDATION_CODE_INCORRECT: 'USER_011',
  USER_WITH_THIS_ID_UNDEFINED: 'USER_012',
  ONLY_FOR_LOCAL_PROVIDER: 'USER_013',
  USER_BY_THIS_EMAIL_IS_EXISTS: 'USER_014',
  REFRESH_TOKEN_IS_INVALID: 'USER_015',
  USER_BY_THIS_EMAIL_IS_UNDEFINED: 'USER_016',
  PROVIDER_OR_STATE_IS_UNDEFINED: 'USER_017',
  CSRF_PROTECTION_FAILED: 'USER_018',
  CREDENTIALS_ARE_UNDEFINED: 'USER_019',
  ID_OF_REQUESTED_USER_NOT_PROVIDED: 'USER_020',
  INVALID_LOGIN_DATA: 'USER_021',
  UNAUTHORIZED: 'USER_022',
  GITHUB_NO_SCOPES: 'USER_023',
  GITHUB_DAMAGED_DATA: 'USER_024',
  GITHUB_AUTHORIZATION_FAILED: 'USER_025',
  UNEXPECTED_FORMAT_OF_TOKEN: 'USER_026',
  NO_AUTHORIZATION_HEADER: 'USER_027',
  GOOGLE_AUTHORIZATION_FAILED: 'USER_028',
  EMAIL_NOT_VERIFIED: 'USER_029',
  INVALID_AGE: 'USER_030',
  NOT_ENOUGH_RIGHTS: 'USER_031',
} as const;

export const CompetitionErrors = {
  INVALID_DATES: 'COMPETITION_001',
  NAME_LENGTH_RESTRICTION: 'COMPETITION_002',
  DESCRIPTION_LENGTH_RESTRICTION: 'COMPETITION_003',
  LOAD_FROM_DB_FAILED: 'COMPETITION_004',
  COMPETITION_IS_READONLY: 'COMPETITION_005',
  STATUS_FLOW_BREAKS: 'COMPETITION_006',
  ROUND_UNDEFINED_IN_COMPETITION: 'COMPETITION_007',
  SETTER_SCHEDULED: 'COMPETITION_008',
  RULE_NAME_INVALID: 'COMPETITION_009',
  RULE_DESCRIPTION_INVALID: 'COMPETITION_010',
  RULE_ICON_INVALID: 'COMPETITION_011',
  CANNOT_DELETE: 'COMPETITION_012',
  CANNOT_EDIT: 'COMPETITION_013',
  UNDEFINED: 'COMPETITION_014',
  PAGE_NOT_FOUND: 'COMPETITION_015',
  NOT_ALL_SETTINGS_PROVIDED: 'COMPETITION_016',
  SETTING_TYPE_NOT_VALID: 'COMPETITION_017',
  SETTING_IS_INVALID: 'COMPETITION_018',
  COMPETITION_NOT_FOUND: 'COMPETITION_019',
  DATES_UNSET: 'COMPETITION_020',
  ROUND_OUT_OF_BOUNDS: 'COMPETITION_021',
  ROUND_OVERLAP: 'COMPETITION_022',
} as const;

export const RoundErrors = {
  START_DATE_INVALID: 'ROUND_001',
  END_DATE_INVALID: 'ROUND_002',
  INVALID_DATE_SEQUENCE: 'ROUND_003',
  STATUS_FLOW_BREAKS: 'ROUND_004',
  ROUND_IS_READONLY: 'ROUND_005',
  TASK_NOT_FOUND_IN_ROUND: 'ROUND_006',
  CONTENT_LENGTH_RESTRICTION: 'ROUND_007',
  ROUND_NOT_FOUND: 'ROUND_008',
  SPAN_IS_INVALID: 'ROUND_009',
  ROUND_IS_HIDDEN: 'ROUND_010',
} as const;

export const TaskErrors = {
  NAME_LENGTH_RESTRICTION: 'TASK_001',
  DESCRIPTION_LENGTH_RESTRICTION: 'TASK_002',
  INVALID_COLOR: 'TASK_003',
  TASK_NOT_FOUND: 'TASK_004',
} as const;

export const FileErrors = {
  FILE_WITH_THIS_ID_UNDEFINED: 'FILE_001',
  SIZE_EXCEEDED: 'FILE_002',
  UNSUPPORTED_TYPE: 'FILE_003',
  METADATA_IMMUTABLE: 'FILE_004',
  INVALID_SLOT: 'FILE_005',
  SLOT_MISMATCH: 'FILE_006',
  ENTITY_MISMATCH: 'FILE_007',
  RELATION_IMMUTABLE: 'FILE_008',
  INCOMPLETE_RELATION: 'FILE_009',
  INVALID_PREFIX: 'FILE_010',
  MIME_TYPE_IS_UNDEFINED: 'FILE_011',
  INVALID_RELATION_FORMAT: 'FILE_012',
  UNKNOWN_FAMILY: 'FILE_013',
  UNKNOWN_CODE: 'FILE_014',
  CONFIG_NOT_FOUND: 'FILE_015',
  AVATAR_URL_UNAVAILABLE: 'FILE_016',
  AVATAR_FETCH_FAILED: 'FILE_017',
  FILE_UNPROCESSED: 'FILE_018',
  FILE_TOO_LARGE: 'FILE_019',
} as const;

export const TeamErrors = {
  RESTRICTED_CHANGE: 'TEAM_001',
  STATUS_FLOW_BREAK: 'TEAM_002',
  MEMBER_MUST_ACCEPT_INVITE: 'TEAM_003',
  USER_ALREADY_MEMBER_OR_INVITED: 'TEAM_004',
  MEMBER_UNDEFINED: 'TEAM_005',
  REGISTRATION_REQUIRED_FOR_INVITE: 'TEAM_006',
  NO_INVITES_FOUND: 'TEAM_007',
  PENDING_INVITES_EXIST: 'TEAM_008',
  CANNOT_END_REGISTRATION: 'TEAM_009',
  TEAM_UNDEFINED: 'TEAM_010',
  MEMBER_ALREADY_IN_COMPETITION: 'TEAM_011',
  TEAM_NOT_ALIGNED_WITH_SETTINGS: 'TEAM_012',
} as const;

export const StorageErrors = {
  OPERATION_FAILED: 'STORAGE_001',
} as const;

export const ServiceErrors = {
  MISCONFIGURED: 'SERVICE_001',
} as const;

export const TestErrors = {
  TEST_ENDPOINTS_UNAVALIBLE: 'TEST_001',
};

export const CommandErrors = {
  COMMAND_PARAMS_WRONG: 'COMMAND_001',
};

export const ScoreErrors = {
  SCORE_NOT_FOUND: 'SCORE_001',
};

export const CriteriaErrors = {
  CRITERIA_NOT_FOUND: 'CRITERIA_001',
  NAME_IS_TOO_BIG: 'CRITERIA_002',
  DESCRIPTION_TOO_BIG: 'CRITERIA_003',
  NO_NAME: 'CRITERIA_004',
  NEGATIVE_OR_ZERO_SCORE: 'CRITERIA_005',
};

export const SubmitionErrors = {
  SUBMITION_NOT_FOUND: 'SUBMITION_001',
  NO_GITHUB_URL: 'SUBMITION_002',
  NO_YOUTUBE_URL: 'SUBMITION_003',
  NO_RELATED_ROUND: 'SUBMITION_004',
  CANNOT_SUBMIT: 'SUBMITION_005',
};

export const LeaderboardErrors = {
  INVALID_PLACE_VALUE: 'LEADERBOARD_001',
  LEADERBOARD_NOT_FOUND: 'LEADERBOARD_002',
};

export const RoundReviewErrors = {
  CANNOT_CREATE_REVIEW: 'ROUND_REVIEW_001',
  NO_SCORES_PROVIDED: 'ROUND_REVIEW_002',
};

export type ApiErrorCode = keyof typeof ApiErrorsCodeVal;

export class ApiError extends Error {
  readonly code: string;
  readonly status: number;
  constructor(
    code: ApiErrorCode,
    //@ts-expect-error ddd
    public readonly cause?: string,
  ) {
    const error = ApiErrorsCodeVal[code];

    super(error.message);
    this.code = code;
    this.status = error.status;
  }

  static throw(code: ApiErrorCode, cause?: string): never {
    throw new ApiError(code, cause);
  }
  static returnNew(code: ApiErrorCode, cause?: string): ApiError {
    return new ApiError(code, cause);
  }
}

export function documentError(errors: ApiErrorCode | ApiErrorCode[]) {
  const errorArray = Array.isArray(errors) ? errors : [errors];

  const groupedByStatus = errorArray.reduce(
    (acc, code) => {
      const errorVal = ApiErrorsCodeVal[code];
      if (!acc[errorVal.status]) acc[errorVal.status] = [];
      acc[errorVal.status].push({ code, ...errorVal });
      return acc;
    },
    {} as Record<number, any[]>,
  );

  const decorators = Object.entries(groupedByStatus).map(([status, items]) => {
    return ApiResponse({
      status: Number(status),
      description: `Possible errors for status ${status}`,
      content: {
        'application/json': {
          examples: (
            items as unknown as { code: string; message: string }[]
          ).reduce((exAcc, item) => {
            (exAcc as unknown as Record<string, unknown>)[item.code] = {
              summary: item.message,
              value: {
                code: item.code,
                message: item.message,
                cause: 'FIELD_NAME_OR_REASON',
                timestamp: new Date().toISOString(),
              },
            };
            return exAcc;
          }, {}),
        },
      },
    });
  });

  return applyDecorators(...decorators);
}
