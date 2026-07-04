import { type LocalizedString } from "./localized-string.type";

type CreateTrueFalseStatementPayload = {
	explanation?: Partial<LocalizedString>;
	is_true: boolean;
	statement: LocalizedString;
};

type UpdateTrueFalseStatementPayload = {
	explanation?: Partial<LocalizedString>;
	is_true: boolean;
	statement: LocalizedString;
};

export type { CreateTrueFalseStatementPayload, UpdateTrueFalseStatementPayload };
