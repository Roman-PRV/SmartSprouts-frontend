/**
 * Reveal-after-submit shape. `stars` is present only for found items (1..3);
 * omitted for missed items (BE: whenNotNull).
 */
type FindTheWrongRevealItemDto = {
	explanation: string;
	explanation_audio_url: null | string;
	id: number;
	name: string;
	name_audio_url: null | string;
	stars?: number;
};

export { type FindTheWrongRevealItemDto };
