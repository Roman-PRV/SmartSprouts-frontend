import { type AudioStatusMap } from "./audio-status.type";
import { type LocalizedString } from "./localized-string.type";
import { type TrueFalseAdminStatementDto } from "./true-false-admin-statement-dto.type";

/**
 * Unified admin level shape across both true/false games. The list endpoint
 * fills only the slim fields (id/title/image_url/statements_count); the
 * single-level endpoint additionally fills the per-game body (`text` for the
 * text game), per-locale audio status, and the embedded statements.
 */
type TrueFalseAdminLevelDto = {
	id: number;
	image_url: null | string;
	statements?: TrueFalseAdminStatementDto[];
	statements_count?: number;
	text?: LocalizedString;
	text_audio?: AudioStatusMap;
	title: LocalizedString;
	title_audio?: AudioStatusMap;
};

export type { TrueFalseAdminLevelDto };
