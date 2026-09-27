import { APIPath } from "~/libs/enums/enums";
import { BaseHTTPApi } from "~/libs/modules/api/api";
import { type HTTP } from "~/libs/modules/http/http";
import { HTTPMethod } from "~/libs/modules/http/libs/enums/enums";
import { type Storage } from "~/libs/modules/storage/storage";

import { EntitlementApiPath } from "./libs/enums/enums";
import { type EntitlementResponseDto } from "./libs/types/types";

type Constructor = {
	baseUrl: string;
	http: HTTP;
	storage: Storage;
};

class EntitlementApi extends BaseHTTPApi {
	public constructor({ baseUrl, http, storage }: Constructor) {
		super({ baseUrl, http, path: APIPath.ENTITLEMENT, storage });
	}

	public async getEntitlement(): Promise<EntitlementResponseDto> {
		const url = this.getFullEndpoint(EntitlementApiPath.ROOT, {});

		return await this.requestJson<EntitlementResponseDto>(url, { method: HTTPMethod.GET });
	}
}

export { EntitlementApi };
