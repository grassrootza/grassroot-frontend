export enum GroupJoinMethod {

  ADDED_BY_SYS_ADMIN = "ADDED_BY_SYS_ADMIN",
  SELF_JOINED = "SELF_JOINED",
  BULK_IMPORT = "BULK_IMPORT",

  ADDED_AT_CREATION = "ADDED_AT_CREATION",
  ADDED_BY_OTHER_MEMBER = "ADDED_BY_OTHER_MEMBER",

  CAMPAIGN_GENERAL = "CAMPAIGN_GENERAL",
  CAMPAIGN_PETITION = "CAMPAIGN_PETITION",

  USSD_JOIN_CODE = "USSD_JOIN_CODE",
  SMS_JOIN_WORD = "SMS_JOIN_WORD",
  URL_JOIN_WORD = "URL_JOIN_WORD",
  SEARCH_JOIN_WORD = "SEARCH_JOIN_WORD",
  JOIN_CODE_OTHER = "JOIN_CODE_OTHER",

  BROADCAST = "BROADCAST",
  BROADCAST_FB = "BROADCAST_FB",
  BROADCAST_TW = "BROADCAST_TW",

  FILE_IMPORT = "FILE_IMPORT",
  ADDED_SUBGROUP = "ADDED_SUBGROUP",
  COPIED_INTO_GROUP = "COPIED_INTO_GROUP"
}
