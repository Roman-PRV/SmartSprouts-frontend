import { config } from "~/libs/modules/config/config";

import { Store } from "./store.module";

const store = new Store(config);

export { store };
