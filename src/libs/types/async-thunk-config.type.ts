import { type store } from "~/libs/modules/store/store.js";

type AsyncThunkConfig = {
	dispatch: typeof store.instance.dispatch;
	extra: typeof store.extraArguments;
	rejectValue: {
		errors?: Record<string, string[]> | undefined;
		message: string;
	};
	state: ReturnType<typeof store.instance.getState>;
};

export { type AsyncThunkConfig };
