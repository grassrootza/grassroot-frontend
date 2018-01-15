export enum GroupJoinMethod {

  ADDED_BY_SYS_ADMIN = "Added by admin",
  SELF_JOINED = "Self joined",
  BULK_IMPORT = "Bulk import",

  ADDED_AT_CREATION = "Added at creation",
  ADDED_BY_OTHER_MEMBER = "Added by member",

  CAMPAIGN_GENERAL = "Campaign",
  CAMPAIGN_PETITION = "Petition",

  USSD_JOIN_CODE = "USSD",
  SMS_JOIN_WORD = "SMS",
  URL_JOIN_WORD = "Landing page",
  SEARCH_JOIN_WORD = "Search",
  JOIN_CODE_OTHER = "Join code",

  BROADCAST = "Broadcast",
  BROADCAST_FB = "Facebook",
  BROADCAST_TW = "Twitter",

  FILE_IMPORT = "File import",
  ADDED_SUBGROUP = "Subgroup",
  COPIED_INTO_GROUP = "Copied"
}
