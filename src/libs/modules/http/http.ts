import { BaseHTTP } from "./base-http.module";

const http = new BaseHTTP();

export { http };
export { HTTPCode, HTTPHeader } from "./libs/enums/enums";
export { HTTPError } from "./libs/exceptions/exceptions";
export { type HTTP, type HTTPOptions } from "./libs/types/types";
