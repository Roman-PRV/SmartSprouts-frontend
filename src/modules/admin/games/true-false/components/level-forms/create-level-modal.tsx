import { Modal } from "~/libs/components/components";
import { GameKey } from "~/libs/enums/enums";
import { useCallback, useNavigate, useTranslation } from "~/libs/hooks/hooks";
import { type GameDescriptionDto } from "~/libs/types/types";
import { buildAdminEditorUrl } from "~/modules/admin/libs/helpers/build-admin-editor-url.helper";

import { ImageLevelCreateForm } from "./image-level-create-form";
import { TextLevelCreateForm } from "./text-level-create-form";

type Properties = {
	game: GameDescriptionDto;
	isOpen: boolean;
	onClose: () => void;
};

/**
 * Create-level modal for both true/false games. The level body form differs per
 * game (image upload vs translatable text), so it branches on the game key.
 */
const CreateLevelModal: React.FC<Properties> = ({ game, isOpen, onClose }) => {
	const { t } = useTranslation();
	const navigate = useNavigate();

	const handleSuccess = useCallback(
		(levelId: number) => {
			onClose();
			void navigate(buildAdminEditorUrl(game.id, levelId));
		},
		[game.id, navigate, onClose]
	);

	const isTextGame = game.key === GameKey.TRUE_FALSE_TEXT;

	return (
		<Modal
			closeOnBackdropClick={false}
			isOpen={isOpen}
			onClose={onClose}
			title={t("admin.trueFalse.level.create.modalTitle")}
		>
			{isTextGame ? (
				<TextLevelCreateForm gameId={game.id} onCancel={onClose} onSuccess={handleSuccess} />
			) : (
				<ImageLevelCreateForm gameId={game.id} onCancel={onClose} onSuccess={handleSuccess} />
			)}
		</Modal>
	);
};

export { CreateLevelModal };
