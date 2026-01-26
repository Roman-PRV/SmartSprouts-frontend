import { getValidClassNames } from "~/libs/helpers/helpers";
import { useCallback } from "~/libs/hooks/hooks";

import { type DropdownOption } from "./dropdown-option.type";
import styles from "./styles.module.css";

type DropdownItemProperties<T> = {
	className?: string | undefined;
	id: string;
	isActive: boolean;
	isFocused: boolean;
	onKeyDown: (event: React.KeyboardEvent) => void;
	onMouseEnter: (index: number) => void;
	onSelect: (value: T) => void;
	option: DropdownOption<T>;
	optionIndex: number;
	role?: React.AriaRole | undefined;
};

const DropdownItem = <T extends number | string>({
	className,
	id,
	isActive,
	isFocused,
	onKeyDown,
	onMouseEnter,
	onSelect,
	option,
	optionIndex,
	role = "option",
}: DropdownItemProperties<T>): React.ReactElement => {
	const handleClick = useCallback((): void => {
		onSelect(option.value);
	}, [onSelect, option.value]);

	const handleMouseEnter = useCallback((): void => {
		onMouseEnter(optionIndex);
	}, [onMouseEnter, optionIndex]);

	return (
		<li className={styles["dropdown__item-wrapper"]} role="none">
			<button
				aria-label={option.ariaLabel ?? option.label}
				aria-selected={isActive}
				className={getValidClassNames(
					styles["dropdown__item"],
					isActive && styles["dropdown__item--active"],
					isFocused && styles["dropdown__item--focused"],
					className
				)}
				data-focused={isFocused}
				disabled={isActive}
				id={id}
				onClick={handleClick}
				onKeyDown={onKeyDown}
				onMouseEnter={handleMouseEnter}
				role={role}
				tabIndex={-1}
				type="button"
			>
				{option.label}
			</button>
		</li>
	);
};

export { DropdownItem };
