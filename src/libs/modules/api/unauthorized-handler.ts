type UnauthorizedHandler = () => void;

let handler: null | UnauthorizedHandler = null;

/**
 * Registers what happens when an authenticated request is rejected with 401.
 * Set once at store construction; keeps the API layer store-agnostic (the
 * handler is injected, not imported).
 */
const setUnauthorizedHandler = (unauthorizedHandler: UnauthorizedHandler): void => {
	handler = unauthorizedHandler;
};

/**
 * Fires the registered handler. Null-safe by design: the Store registers the
 * handler synchronously at construction, before any authenticated request can
 * run, so a 401 is never silently swallowed for lack of a handler.
 */
const notifyUnauthorized = (): void => {
	handler?.();
};

/** Test-only: clears the registered handler so cases don't leak state between them. */
const resetUnauthorizedHandler = (): void => {
	handler = null;
};

export { notifyUnauthorized, resetUnauthorizedHandler, setUnauthorizedHandler };
