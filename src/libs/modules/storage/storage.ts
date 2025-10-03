import { BaseStorage } from "./base-storage.module";

const storage = new BaseStorage(globalThis.localStorage);

export { storage };
export { StorageKey } from "./libs/enums/storage-key.enum.js";
export { type Storage } from "./libs/types/storage.type.js";
