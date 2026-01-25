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
	itemClassName?: string;
	itemRole?: React.AriaRole;
	menuClassName?: string;
	menuId?: string;
	menuRole?: React.AriaRole;
	onSelect: (value: T) => void;
	options: DropdownOption<T>[];
	placeholder?: string;
	renderToggle?: (properties: RenderToggleProperties) => React.ReactElement;
	toggleId?: string;
	toggleRole?: "button" | "combobox";
	value: T;
};

type RenderToggleProperties = {
	"aria-activedescendant"?: string | undefined;
	"aria-controls": string;
	"aria-disabled": boolean;
	"aria-expanded": boolean;
	"aria-haspopup": "dialog" | "grid" | "listbox" | "menu" | "tree" | boolean;
	"aria-label": string;
	disabled: boolean;
	id: string;
	isOpen: boolean;
	onClick: () => void;
	onKeyDown: (event: React.KeyboardEvent) => void;
	ref: React.Ref<HTMLButtonElement>;
	role: "button" | "combobox";
	type: "button";
};

const ROLE_TO_HAS_POPUP: Record<string, RenderToggleProperties["aria-haspopup"]> = {
	dialog: "dialog",
	grid: "grid",
	listbox: "listbox",
	menu: "menu",
	tree: "tree",
};

const Dropdown = <T extends number | string>({
	className,
	disabled = false,
	itemClassName,
	itemRole,
	menuClassName,
	menuId: menuIdProperty,
	menuRole = "listbox",
	onSelect,
	options,
	placeholder = "Select option",
	renderToggle,
	toggleId: toggleIdProperty,
	toggleRole = "combobox",
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
		const target = event.target;

		if (
			dropdownReference.current &&
			target instanceof Node &&
			!dropdownReference.current.contains(target)
		) {
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
		if (isOpen && focusedIndex >= FIRST_INDEX) {
			const element = menuReference.current?.children[focusedIndex];

			if (element instanceof HTMLElement) {
				element.scrollIntoView({
					block: "nearest",
				});
			}
		}
	}, [isOpen, focusedIndex]);

	const uniqueId = useId();
	const toggleId = toggleIdProperty ?? `dropdown-toggle-${uniqueId}`;
	const menuId = menuIdProperty ?? `dropdown-menu-${uniqueId}`;
	const activeDescendantId =
		isOpen && focusedIndex >= FIRST_INDEX ? `${menuId}-option-${String(focusedIndex)}` : undefined;

	const ariaHasPopup = ROLE_TO_HAS_POPUP[menuRole as string] ?? true;

	return (
		<div
			className={getValidClassNames(
				styles["dropdown"],
				disabled && styles["dropdown--disabled"],
				className
			)}
			ref={dropdownReference}
		>
			{renderToggle ? (
				renderToggle({
					"aria-activedescendant": activeDescendantId,
					"aria-controls": menuId,
					"aria-disabled": disabled,
					"aria-expanded": isOpen,
					"aria-haspopup": ariaHasPopup,
					"aria-label": `Select option, current: ${selectedOption?.label ?? placeholder}`,
					disabled: disabled,
					id: toggleId,
					isOpen: isOpen,
					onClick: handleToggle,
					onKeyDown: handleKeyDown,
					ref: toggleButtonReference,
					role: toggleRole,
					type: "button",
				})
			) : (
				<button
					aria-activedescendant={activeDescendantId}
					aria-controls={menuId}
					aria-disabled={disabled}
					aria-expanded={isOpen}
					aria-haspopup={ariaHasPopup}
					aria-label={`Select option, current: ${selectedOption?.label ?? placeholder}`}
					className={styles["dropdown__toggle"]}
					disabled={disabled}
					id={toggleId}
					onClick={handleToggle}
					onKeyDown={handleKeyDown}
					ref={toggleButtonReference}
					role={toggleRole}
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
			)}
			{isOpen && (
				<ul
					aria-labelledby={toggleId}
					className={getValidClassNames(styles["dropdown__menu"], menuClassName)}
					id={menuId}
					ref={menuReference}
					role={menuRole}
				>
					{options.map((option, index) => (
						<DropdownItem
							className={itemClassName}
							id={`${menuId}-option-${String(index)}`}
							isActive={option.value === value}
							isFocused={index === focusedIndex}
							key={option.value}
							onKeyDown={handleKeyDown}
							onMouseEnter={setFocusedIndex}
							onSelect={handleSelect}
							option={option}
							optionIndex={index}
							role={itemRole}
						/>
					))}
				</ul>
			)}
		</div>
	);
};

export { Dropdown };
export type { DropdownOption } from "./libs/components/dropdown-item/dropdown-option.type";
export type { RenderToggleProperties };
