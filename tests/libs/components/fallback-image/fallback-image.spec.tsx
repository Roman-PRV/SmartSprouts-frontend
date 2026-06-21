// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach, describe, expect, it } from "vitest";

import defaultPlaceholder from "~/assets/img/default-icon.svg";
import { FallbackImage } from "~/libs/components/fallback-image/fallback-image";

const SRC = "https://cdn.example.com/real-image.png";
const CUSTOM_FALLBACK = "https://cdn.example.com/custom-placeholder.png";

describe("FallbackImage", () => {
	afterEach(() => {
		cleanup();
	});

	it("renders the provided src by default", () => {
		render(<FallbackImage alt="Real" src={SRC} />);

		expect(screen.getByRole("img")).toHaveAttribute("src", SRC);
	});

	it("swaps to the bundled placeholder when the image fails to load", () => {
		render(<FallbackImage alt="Real" src={SRC} />);

		const image = screen.getByRole("img");
		fireEvent.error(image);

		expect(image).toHaveAttribute("src", defaultPlaceholder);
	});

	it("does not re-swap when the placeholder itself fails (loop guard)", () => {
		render(<FallbackImage alt="Real" src={SRC} />);

		const image = screen.getByRole("img");
		fireEvent.error(image);
		fireEvent.error(image);

		expect(image).toHaveAttribute("src", defaultPlaceholder);
	});

	it("uses a custom fallbackSrc when provided", () => {
		render(<FallbackImage alt="Real" fallbackSrc={CUSTOM_FALLBACK} src={SRC} />);

		const image = screen.getByRole("img");
		fireEvent.error(image);

		expect(image).toHaveAttribute("src", CUSTOM_FALLBACK);
	});

	it("re-arms with the new source when the src prop changes", () => {
		const NEXT_SRC = "https://cdn.example.com/next-image.png";
		const { rerender } = render(<FallbackImage alt="Real" src={SRC} />);

		const image = screen.getByRole("img");
		fireEvent.error(image);
		expect(image).toHaveAttribute("src", defaultPlaceholder);

		rerender(<FallbackImage alt="Next" src={NEXT_SRC} />);

		expect(screen.getByRole("img")).toHaveAttribute("src", NEXT_SRC);
	});

	it("forwards passthrough img attributes", () => {
		render(<FallbackImage alt="Real" className="cover" loading="lazy" src={SRC} />);

		const image = screen.getByRole("img");
		expect(image).toHaveClass("cover");
		expect(image).toHaveAttribute("loading", "lazy");
	});
});
