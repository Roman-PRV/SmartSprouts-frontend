import { type HTTP, type HTTPOptions } from "./libs/types/types";

class BaseHTTP implements HTTP {
	public load(path: string, options: HTTPOptions): Promise<Response> {
		const { credentials, headers, method, payload, signal } = options;

		return fetch(path, {
			body: payload,
			headers,
			method,
			...(credentials && { credentials }),
			...(signal && { signal }),
		});
	}
}

export { BaseHTTP };
