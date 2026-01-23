import { getValidClassNames } from "~/libs/helpers/helpers";
import { useCallback } from "~/libs/hooks/hooks";

import { type DropdownItemProperties } from "../../types/dropdown-item-properties.type";
import styles from "./styles.module.css";

const DropdownItem = <T extends number | string>({
	id,
	isActive,
	isFocused,
	onKeyDown,
	onMouseEnter,
	onSelect,
	option,
	optionIndex,
}: DropdownItemProperties<T>): React.ReactElement => {
	const handleClick = useCallback((): void => {
		onSelect(option.value);
	}, [onSelect, option.value]);

	const handleMouseEnter = useCallback((): void => {
		onMouseEnter(optionIndex);
	}, [onMouseEnter, optionIndex]);

	return (
		<li
			aria-selected={isActive}
			className={getValidClassNames(
				styles["dropdown__item"],
				isActive && styles["dropdown__item--active"],
				isFocused && styles["dropdown__item--focused"]
			)}
			id={id}
			onClick={handleClick}
			onKeyDown={onKeyDown}
			onMouseEnter={handleMouseEnter}
			role="option"
			tabIndex={-1}
		>
			{option.label}
		</li>
	);
};

export { DropdownItem };
