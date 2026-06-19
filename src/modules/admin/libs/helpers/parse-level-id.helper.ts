const MIN_LEVEL_ID = 1;

const parseLevelId = (raw?: string): null | number => {
	if (!raw) {
		return null;
	}

	const parsed = Number(raw);

	if (!Number.isInteger(parsed) || parsed < MIN_LEVEL_ID) {
		return null;
	}

	return parsed;
};

export { parseLevelId };
