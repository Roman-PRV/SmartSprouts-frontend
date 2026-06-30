import { type Language } from "~/libs/modules/localization/localization";

type RegenerateAudioPayload = {
	field: string;
	locale: Language;
};

export type { RegenerateAudioPayload };
