const NOT_FOUND_INDEX = -1;
const NAME_OFFSET = 1;
const EMPTY_LENGTH = 0;
const PATH_START = 0;

const QUERY_SEPARATOR = "?";
const PATH_SEPARATOR = "/";

/**
 * Extracts a file name from a URL or path, dropping query string and parent
 * directories. Returns `null` when input is empty/null or when the URL
 * resolves to no segment (e.g. trailing slash).
 */
const extractFileName = (url: null | string): null | string => {
	if (!url) {
		return null;
	}

	const queryIndex = url.indexOf(QUERY_SEPARATOR);
	const path = queryIndex === NOT_FOUND_INDEX ? url : url.slice(PATH_START, queryIndex);
	const lastSlash = path.lastIndexOf(PATH_SEPARATOR);
	const candidate =
		lastSlash === NOT_FOUND_INDEX ? path : path.slice(lastSlash + NAME_OFFSET);

	return candidate.length > EMPTY_LENGTH ? candidate : null;
};

export { extractFileName };
