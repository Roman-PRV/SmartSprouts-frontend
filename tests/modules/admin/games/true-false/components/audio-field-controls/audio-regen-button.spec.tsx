// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AudioRegenButton } from "~/modules/admin/games/true-false/components/audio-field-controls/audio-regen-button";

const LABEL = "Regenerate title audio (en)";

describe("AudioRegenButton", () => {
	afterEach(() => {
		cleanup();
	});

	it("is disabled when the audio is fresh", () => {
		render(<AudioRegenButton label={LABEL} onRegenerate={vi.fn()} state="fresh" />);

		expect(screen.getByRole("button", { name: LABEL })).toBeDisabled();
	});

	it("is enabled and fires onRegenerate when stale", async () => {
		const onRegenerate = vi.fn();
		render(<AudioRegenButton label={LABEL} onRegenerate={onRegenerate} state="stale" />);

		const button = screen.getByRole("button", { name: LABEL });
		expect(button).toBeEnabled();

		await userEvent.click(button);

		expect(onRegenerate).toHaveBeenCalledTimes(1);
	});

	it("is enabled and fires onRegenerate when the audio is missing", async () => {
		const onRegenerate = vi.fn();
		render(<AudioRegenButton label={LABEL} onRegenerate={onRegenerate} state="missing" />);

		const button = screen.getByRole("button", { name: LABEL });
		expect(button).toBeEnabled();

		await userEvent.click(button);

		expect(onRegenerate).toHaveBeenCalledTimes(1);
	});

	it("is disabled and shows a spinner while generating", () => {
		render(<AudioRegenButton label={LABEL} onRegenerate={vi.fn()} state="generating" />);

		const button = screen.getByRole("button", { name: LABEL });
		expect(button).toBeDisabled();
		expect(button).toHaveAttribute("aria-busy", "true");
		expect(screen.getByRole("status")).toBeInTheDocument();
	});
});
