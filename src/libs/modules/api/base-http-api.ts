import { type ContentType, NotificationMessage, ServerErrorType } from "~/libs/enums/enums.js";
import { configureString } from "~/libs/helpers/helpers.js";
import { type Storage, StorageKey } from "~/libs/modules/storage/storage.js";
import { type ServerErrorResponse, type ValueOf } from "~/libs/types/types.js";

import { type HTTP, HTTPCode, HTTPError, HTTPHeader } from "../http/http.js";
import { type HTTPApi, type HTTPApiOptions, type HTTPApiResponse } from "./libs/types/types.js";

type Constructor = {
	baseUrl: string;
	http: HTTP;
	path: string;
	storage: Storage;
};

class BaseHTTPApi implements HTTPApi {
	private baseUrl: string;

	private http: HTTP;

	private path: string;

	private storage: Storage;

	public constructor({ baseUrl, http, path, storage }: Constructor) {
		this.baseUrl = baseUrl;
		this.http = http;
		this.path = path;
		this.storage = storage;
	}

	public async load(path: string, options: HTTPApiOptions): Promise<HTTPApiResponse> {
		const { contentType, hasAuth, method, payload = null } = options;

		this.ensureUserIsOnline();

		const headers = await this.getHeaders(hasAuth, contentType);

		const response = await this.http.load(path, {
			headers,
			method,
			payload,
		});

		return (await this.checkResponse(response)) as HTTPApiResponse;
	}

	protected getFullEndpoint<T extends Record<string, string>>(
		...parameters: [...string[], T]
	): string {
		const copiedParameters = [...parameters];

		const options = copiedParameters.pop() as T;

		return configureString(this.baseUrl, this.path, ...(copiedParameters as string[]), options);
	}

	private async checkResponse(response: Response): Promise<Response> {
		if (!response.ok) {
			await this.handleError(response);
		}

		return response;
	}

	private ensureUserIsOnline(): void {
		if (typeof navigator !== "undefined" && !navigator.onLine) {
			throw new HTTPError({
				details: [],
				errorType: ServerErrorType.NO_INTERNET,
				message: NotificationMessage.NO_INTERNET,
				status: HTTPCode.TIMEOUT,
			});
		}
	}

	private async getHeaders(
		hasAuth: boolean,
		contentType?: ValueOf<typeof ContentType>
	): Promise<Headers> {
		const headers = new Headers();

		if (contentType) {
			headers.append(HTTPHeader.CONTENT_TYPE, contentType);
		}

		if (hasAuth) {
			const token = await this.storage.get<string>(StorageKey.TOKEN);

			headers.append(HTTPHeader.AUTHORIZATION, `Bearer ${token ?? ""}`);
		}

		return headers;
	}

	private async handleError(response: Response): Promise<never> {
		let parsedException: ServerErrorResponse;

		try {
			parsedException = (await response.json()) as ServerErrorResponse;
		} catch {
			parsedException = {
				errorType: ServerErrorType.COMMON,
				message: response.statusText,
			};
		}

		const isCustomException = Boolean(parsedException.errorType);

		throw new HTTPError({
			details: "details" in parsedException ? parsedException.details : [],
			errorType: isCustomException ? parsedException.errorType : ServerErrorType.COMMON,
			message: parsedException.message,
			status: response.status as ValueOf<typeof HTTPCode>,
		});
	}
}

export { BaseHTTPApi };
