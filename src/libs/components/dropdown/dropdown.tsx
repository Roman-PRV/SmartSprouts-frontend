import { FIRST_INDEX } from "~/libs/constants/constants";
import { getValidClassNames } from "~/libs/helpers/helpers";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "~/libs/hooks/hooks";

import { DropdownItem } from "./libs/components/dropdown-item/dropdown-item";
import { type DropdownOption } from "./libs/components/dropdown-item/dropdown-option.type";
import { INDEX_INCREMENT, INITIAL_FOCUSED_INDEX } from "./libs/constants/constants";
import styles from "./styles.module.css";

type Properties<T> = {
	className?: string;
	disabled?: boolean;
	onSelect: (value: T) => void;
	options: DropdownOption<T>[];
	placeholder?: string;
	value: T;
};

const Dropdown = <T extends number | string>({
	className,
	disabled = false,
	onSelect,
	options,
	placeholder = "Select option",
	value,
}: Properties<T>): React.ReactElement => {
	const [isOpen, setIsOpen] = useState(false);
	const [focusedIndex, setFocusedIndex] = useState<number>(INITIAL_FOCUSED_INDEX);
	const dropdownReference = useRef<HTMLDivElement>(null);
	const toggleButtonReference = useRef<HTMLButtonElement>(null);
	const menuReference = useRef<HTMLUListElement>(null);

	const selectedOption = useMemo(() => {
		return options.find((option) => option.value === value);
	}, [options, value]);

	const selectedIndex = useMemo(() => {
		return options.findIndex((option) => option.value === value);
	}, [options, value]);

	const handleToggle = useCallback(() => {
		if (disabled) {
			return;
		}

		setIsOpen((previous) => !previous);
		setFocusedIndex(Math.max(selectedIndex, FIRST_INDEX));
	}, [disabled, selectedIndex]);

	const handleSelect = useCallback(
		(optionValue: T) => {
			onSelect(optionValue);
			setIsOpen(false);
			toggleButtonReference.current?.focus();
		},
		[onSelect]
	);

	const handleClickOutside = useCallback((event: MouseEvent) => {
		if (dropdownReference.current && !dropdownReference.current.contains(event.target as Node)) {
			setIsOpen(false);
		}
	}, []);

	const openDropdown = useCallback(() => {
		setIsOpen(true);
		setFocusedIndex(Math.max(selectedIndex, FIRST_INDEX));
	}, [selectedIndex]);

	const selectCurrentOption = useCallback(() => {
		if (focusedIndex >= FIRST_INDEX && options[focusedIndex]) {
			handleSelect(options[focusedIndex].value);
		}
	}, [focusedIndex, options, handleSelect]);

	const moveFocusDown = useCallback(() => {
		setFocusedIndex((previous) =>
			previous < options.length - INDEX_INCREMENT ? previous + INDEX_INCREMENT : previous
		);
	}, [options.length]);

	const moveFocusUp = useCallback(() => {
		setFocusedIndex((previous) =>
			previous > FIRST_INDEX ? previous - INDEX_INCREMENT : FIRST_INDEX
		);
	}, []);

	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent) => {
			if (disabled) {
				return;
			}

			const { key } = event;

			const openOrSelect = (): void => {
				if (isOpen) {
					selectCurrentOption();
				} else {
					openDropdown();
				}
			};

			const handleArrow = (direction: "down" | "up"): void => {
				if (isOpen) {
					if (direction === "down") {
						moveFocusDown();
					} else {
						moveFocusUp();
					}
				} else {
					openDropdown();
				}
			};

			switch (key) {
			case " ":

				// eslint-disable-next-line no-fallthrough
			case "Enter": {
				event.preventDefault();
				openOrSelect();
				break;
			}

			case "ArrowDown": {
				event.preventDefault();
				handleArrow("down");
				break;
			}

			case "ArrowUp": {
				event.preventDefault();
				handleArrow("up");
				break;
			}

			case "End": {
				if (isOpen) {
					event.preventDefault();
					setFocusedIndex(options.length - INDEX_INCREMENT);
				}

				break;
			}

			case "Escape": {
				event.preventDefault();
				setIsOpen(false);
				toggleButtonReference.current?.focus();
				break;
			}

			case "Home": {
				if (isOpen) {
					event.preventDefault();
					setFocusedIndex(FIRST_INDEX);
				}

				break;
			}

			case "Tab": {
				if (isOpen) {
					setIsOpen(false);
				}

				break;
			}

			default: {
				break;
			}
			}
		},
		[
			disabled,
			isOpen,
			openDropdown,
			selectCurrentOption,
			moveFocusDown,
			moveFocusUp,
			options.length,
		]
	);

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		document.addEventListener("mousedown", handleClickOutside);

		return (): void => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen, handleClickOutside]);

	useEffect(() => {
		if (isOpen && focusedIndex >= FIRST_INDEX && menuReference.current) {
			const focusedElement = menuReference.current.children[focusedIndex];
			focusedElement?.scrollIntoView({ block: "nearest" });
		}
	}, [isOpen, focusedIndex]);

	const uniqueId = useId();
	const toggleId = `dropdown-toggle-${uniqueId}`;
	const menuId = `dropdown-menu-${uniqueId}`;
	const activeDescendantId =
		isOpen && focusedIndex >= FIRST_INDEX ? `${menuId}-option-${String(focusedIndex)}` : undefined;

	return (
		<div
			className={getValidClassNames(
				styles["dropdown"],
				disabled && styles["dropdown--disabled"],
				className
			)}
			ref={dropdownReference}
		>
			<button
				aria-activedescendant={activeDescendantId}
				aria-controls={menuId}
				aria-disabled={disabled}
				aria-expanded={isOpen}
				aria-haspopup="listbox"
				aria-label={`Select option, current: ${selectedOption?.label ?? placeholder}`}
				className={styles["dropdown__toggle"]}
				disabled={disabled}
				id={toggleId}
				onClick={handleToggle}
				onKeyDown={handleKeyDown}
				ref={toggleButtonReference}
				role="combobox"
				type="button"
			>
				<span className={styles["dropdown__label"]}>{selectedOption?.label ?? placeholder}</span>
				<span
					aria-hidden="true"
					className={getValidClassNames(
						styles["dropdown__arrow"],
						isOpen && styles["dropdown__arrow--open"]
					)}
				>
					▼
				</span>
			</button>
			{isOpen && (
				<ul
					aria-labelledby={toggleId}
					className={styles["dropdown__menu"]}
					id={menuId}
					ref={menuReference}
					role="listbox"
				>
					{options.map((option, index) => (
						<DropdownItem
							id={`${menuId}-option-${String(index)}`}
							isActive={option.value === value}
							isFocused={index === focusedIndex}
							key={option.value}
							onKeyDown={handleKeyDown}
							onMouseEnter={setFocusedIndex}
							onSelect={handleSelect}
							option={option}
							optionIndex={index}
						/>
					))}
				</ul>
			)}
		</div>
	);
};

export { Dropdown };
export type { DropdownOption } from "./libs/components/dropdown-item/dropdown-option.type";
