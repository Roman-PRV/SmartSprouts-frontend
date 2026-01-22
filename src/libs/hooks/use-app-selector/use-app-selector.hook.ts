import { useSelector } from "react-redux";

import { type store } from "~/libs/modules/store/store";

const useAppSelector = useSelector.withTypes<ReturnType<typeof store.instance.getState>>();

export { useAppSelector };
