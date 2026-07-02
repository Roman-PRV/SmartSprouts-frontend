import { toast } from "sonner";

import { useAppDispatch, useCallback, useTranslation } from "~/libs/hooks/hooks";

import { createStatement, updateStatement } from "../../api/true-false-admin";
import { type StatementFormValues } from "../../libs/validation-schemas/statement.validation-schema";

type UseStatementSubmitOptions = {
	gameId: string;
	onSuccess?: () => void;
} & ({ levelId: number; statementId?: undefined } | { levelId?: undefined; statementId: number });

/**
 * Shared submit handler for the statement create modal and inline edit form:
 * dispatches create/update and reports success/error via toast. The create
 * variant carries the parent levelId; the edit variant carries the statementId.
 */
const useStatementSubmit = (
	options: UseStatementSubmitOptions
): ((values: StatementFormValues) => Promise<void>) => {
	const dispatch = useAppDispatch();
	const { t } = useTranslation();
	const { gameId, onSuccess } = options;

	return useCallback(
		async (values: StatementFormValues): Promise<void> => {
			const isCreate = options.statementId === undefined;
			const payload = {
				explanation: values.explanation,
				is_true: values.is_true,
				statement: values.statement,
			};

			try {
				const request =
					options.statementId === undefined
						? dispatch(createStatement({ gameId, levelId: options.levelId, payload }))
						: dispatch(updateStatement({ gameId, payload, statementId: options.statementId }));

				await request.unwrap();

				toast.success(
					t(
						isCreate
							? "admin.trueFalse.statement.create.success"
							: "admin.trueFalse.statement.edit.success"
					)
				);
				onSuccess?.();
			} catch {
				toast.error(
					t(
						isCreate
							? "admin.trueFalse.statement.create.error"
							: "admin.trueFalse.statement.edit.error"
					)
				);
			}
		},
		[dispatch, gameId, onSuccess, options.levelId, options.statementId, t]
	);
};

export { useStatementSubmit };
