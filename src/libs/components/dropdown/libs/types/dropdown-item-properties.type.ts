import { type DropdownOption } from "./dropdown-option.type";

type DropdownItemProperties<T> = {
	id: string;
	isActive: boolean;
	isFocused: boolean;
	onKeyDown: (event: React.KeyboardEvent) => void;
	onMouseEnter: (index: number) => void;
	onSelect: (value: T) => void;
	option: DropdownOption<T>;
	optionIndex: number;
};

export { type DropdownItemProperties };
