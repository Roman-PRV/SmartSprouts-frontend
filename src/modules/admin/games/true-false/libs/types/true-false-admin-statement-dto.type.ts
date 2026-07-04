import { type AudioStatusMap } from "./audio-status.type";
import { type LocalizedString } from "./localized-string.type";

type TrueFalseAdminStatementDto = {
	explanation: Partial<LocalizedString>;
	explanation_audio: AudioStatusMap;
	id: number;
	is_true: boolean;
	level_id: number;
	statement: LocalizedString;
	statement_audio: AudioStatusMap;
};

export type { TrueFalseAdminStatementDto };
