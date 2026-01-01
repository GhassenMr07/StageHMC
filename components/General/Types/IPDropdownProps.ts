export interface IPDropdownProps<T> {
modelValue: T;
availableItems?: T[];
compareItems?: (a: T, b: T) => boolean;
extractDisplayValue?: (item: T) => string;
filterItems?: (item: T, searchText: string) => boolean;
roundedL?: boolean;
roundedR?: boolean;
bgWhite?: boolean;
disabled?: boolean;
}

export type IPDropdownEvents<T> = (
  event: "update:modelValue" | "update",
  payload: T
  ) => void;

export interface IPDropdownItemWrapper<T> {
    _value: T;
    _displayValue: string;
    }
