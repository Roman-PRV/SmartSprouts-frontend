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

const notifyUnauthorized = (): void => {
	handler?.();
};

export { notifyUnauthorized, setUnauthorizedHandler };
