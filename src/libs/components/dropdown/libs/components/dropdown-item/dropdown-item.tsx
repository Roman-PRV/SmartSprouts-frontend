import { getValidClassNames } from "~/libs/helpers/helpers";
import { memo, useCallback } from "~/libs/hooks/hooks";

import { type DropdownItemProperties } from "../../types/dropdown-item-properties.type";
import styles from "./styles.module.css";

const DropdownItem = memo(function DropdownItem<T extends number | string>({
	id,
	isActive,
	isFocused,
	onKeyDown,
	onMouseEnter,
	onSelect,
	option,
	optionIndex,
}: DropdownItemProperties<T>) {
	const handleClick = useCallback(() => {
		onSelect(option.value);
	}, [onSelect, option.value]);

	const handleMouseEnter = useCallback(() => {
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
}) as <T extends number | string>(properties: DropdownItemProperties<T>) => React.ReactElement;

export { DropdownItem };
export { type DropdownItemProperties } from "../../types/dropdown-item-properties.type";
