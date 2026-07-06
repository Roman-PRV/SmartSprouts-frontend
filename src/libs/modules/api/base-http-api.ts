import { ContentType, NotificationMessage, ServerErrorType } from "~/libs/enums/enums";
import { configureString } from "~/libs/helpers/helpers";
import { type Storage, StorageKey } from "~/libs/modules/storage/storage";
import { type ServerErrorResponse, type ValueOf } from "~/libs/types/types";

import { type HTTP, HTTPCode, HTTPError, HTTPHeader } from "../http/http";
import { getCurrentLocale } from "../localization/helpers/get-current-locale.helper";
import { type HTTPApi, type HTTPApiOptions, type HTTPApiResponse } from "./libs/types/types";

type Constructor = {
	baseUrl: string;
	http: HTTP;
	path: string;
	storage: Storage;
};

type FormDataRequestOptions = {
	formData: FormData;
	method: HTTPApiOptions["method"];
	signal?: AbortSignal | undefined;
};

type RequestOptions = {
	credentials?: HTTPApiOptions["credentials"];
	hasAuth?: boolean;
	method: HTTPApiOptions["method"];
	payload?: unknown;
	signal?: AbortSignal | undefined;
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
		const { contentType, credentials, hasAuth, method, payload = null, signal } = options;

		this.ensureUserIsOnline();

		const headers = await this.getHeaders(hasAuth, contentType);

		const response = await this.http.load(path, {
			headers,
			method,
			payload,
			...(credentials && { credentials }),
			...(signal && { signal }),
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

	/** Authenticated multipart (FormData) request that parses and returns the response body as `T`. */
	protected async requestFormData<T>(
		path: string,
		{ formData, method, signal }: FormDataRequestOptions
	): Promise<T> {
		const response = await this.load(path, {
			hasAuth: true,
			method,
			payload: formData,
			...(signal && { signal }),
		});

		return await response.json<T>();
	}

	/** Authenticated JSON request that parses and returns the response body as `T`. */
	protected async requestJson<T>(path: string, options: RequestOptions): Promise<T> {
		const response = await this.load(path, this.buildJsonLoadOptions(options));

		return await response.json<T>();
	}

	/** Authenticated JSON request with no response body to read (e.g. DELETE, fire-and-forget POST). */
	protected async requestVoid(path: string, options: RequestOptions): Promise<void> {
		await this.load(path, this.buildJsonLoadOptions(options));
	}

	private buildJsonLoadOptions({
		credentials,
		hasAuth = true,
		method,
		payload,
		signal,
	}: RequestOptions): HTTPApiOptions {
		return {
			hasAuth,
			method,
			...(credentials && { credentials }),
			...(payload !== undefined && {
				contentType: ContentType.JSON,
				payload: JSON.stringify(payload),
			}),
			...(signal && { signal }),
		};
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

		headers.append(HTTPHeader.ACCEPT_LANGUAGE, getCurrentLocale());
		headers.append(HTTPHeader.ACCEPT, ContentType.JSON);

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
			errors: "errors" in parsedException ? parsedException.errors : undefined,
			errorType: isCustomException ? parsedException.errorType : ServerErrorType.COMMON,
			message: parsedException.message,
			status: response.status as ValueOf<typeof HTTPCode>,
		});
	}
}

export { type RequestOptions, BaseHTTPApi };
