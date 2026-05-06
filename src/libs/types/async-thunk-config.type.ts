import { type store } from "~/libs/modules/store/store";
import { type ThunkErrorPayload } from "~/libs/types/thunk-error.payload.type";

type AsyncThunkConfig = {
	dispatch: typeof store.instance.dispatch;
	extra: typeof store.extraArguments;
	rejectValue: ThunkErrorPayload;
	state: ReturnType<typeof store.instance.getState>;
};

export { type AsyncThunkConfig };
