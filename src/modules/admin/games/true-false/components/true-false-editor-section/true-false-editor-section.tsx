import { FallbackMessage, Loader } from "~/libs/components/components";
import { DataStatus, GameKey } from "~/libs/enums/enums";
import { useAppDispatch, useAppSelector, useEffect, useTranslation } from "~/libs/hooks/hooks";
import { type AdminLevelEditorSectionProperties } from "~/modules/admin/libs/types/admin-level-editor-section-properties.type";

import { actions, getLevel } from "../../api/true-false-admin";
import { useTrueFalseAudio } from "../../hooks/hooks";
import { ImageLevelEditorForm } from "../level-forms/image-level-editor-form";
import { TextLevelEditorForm } from "../level-forms/text-level-editor-form";
import sectionStyles from "../section.module.css";
import { StatementsAdminPanel } from "../statements-admin-panel/statements-admin-panel";
import styles from "./styles.module.css";

const TrueFalseEditorSection: React.FC<AdminLevelEditorSectionProperties> = ({ game, levelId }) => {
	const { t } = useTranslation();
	const dispatch = useAppDispatch();
	const { currentLevel, loadStatus } = useAppSelector((state) => state.trueFalseAdmin);
	const audio = useTrueFalseAudio(game.id, levelId);

	useEffect(() => {
		const promise = dispatch(getLevel({ gameId: game.id, levelId }));

		return (): void => {
			promise.abort();
			dispatch(actions.clearCurrentLevel());
		};
	}, [dispatch, game.id, levelId]);

	// Only block the whole editor on the initial load. Background re-fetches
	// during audio polling keep `currentLevel`, so the form (and its
	// "generating" indicators) must stay mounted instead of flashing a loader.
	if (!currentLevel) {
		if (loadStatus === DataStatus.REJECTED) {
			return <FallbackMessage message={t("admin.trueFalse.editor.loadError")} />;
		}

		return <Loader variant="inline" />;
	}

	const isTextGame = game.key === GameKey.TRUE_FALSE_TEXT;

	return (
		<section className={styles["editor"]}>
			<h2 className={sectionStyles["section__title"]}>{t("admin.trueFalse.editor.title")}</h2>

			<div className={styles["editor__level"]}>
				{isTextGame ? (
					<TextLevelEditorForm audio={audio} gameId={game.id} level={currentLevel} />
				) : (
					<ImageLevelEditorForm audio={audio} gameId={game.id} level={currentLevel} />
				)}
			</div>

			<StatementsAdminPanel
				audio={audio}
				gameId={game.id}
				levelId={levelId}
				statements={currentLevel.statements ?? []}
			/>
		</section>
	);
};

export { TrueFalseEditorSection };
