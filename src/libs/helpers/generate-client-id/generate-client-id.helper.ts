const BASE36_RADIX = 36;
const RANDOM_BYTE_COUNT = 8;
const PAD_LENGTH = 2;
const COUNTER_STEP = 1;

let fallbackCounter = 0;

const generateClientId = (): string => {
	if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
		const bytes = new Uint8Array(RANDOM_BYTE_COUNT);

		crypto.getRandomValues(bytes);

		return Array.from(bytes, (byte) =>
			byte.toString(BASE36_RADIX).padStart(PAD_LENGTH, "0")
		).join("");
	}

	fallbackCounter += COUNTER_STEP;

	return `${Date.now().toString(BASE36_RADIX)}-${fallbackCounter.toString(BASE36_RADIX)}`;
};

export { generateClientId };
