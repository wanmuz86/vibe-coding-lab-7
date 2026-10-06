import type { DomainErrorCode } from "@/modules/shared/errors";

export const NOTICE_MESSAGES = {
  forbidden: "You do not have permission to do that.",
  invalid: "That change is not allowed for this ticket.",
  missing: "That ticket could not be found.",
} as const;

export type NoticeCode = keyof typeof NOTICE_MESSAGES;

const NOTICE_BY_CODE: Record<DomainErrorCode, NoticeCode> = {
  FORBIDDEN: "forbidden",
  INVALID: "invalid",
  NOT_FOUND: "missing",
};

export function noticeForDomainCode(code: DomainErrorCode): NoticeCode {
  return NOTICE_BY_CODE[code];
}

export function readNotice(value: string | string[] | undefined): string | null {
  const code = Array.isArray(value) ? value[0] : value;
  if (!code || !(code in NOTICE_MESSAGES)) {
    return null;
  }
  return NOTICE_MESSAGES[code as NoticeCode];
}
