import React from "react";
interface DropdownOption {
    value: string;
    label: string;
}
export interface AnchoredDropdownProps {
    options: DropdownOption[];
    selectedValue: string;
    onChange: (value: string) => void;
    variant?: "row" | "boxed";
    focusStyle?: "fill" | "outline";
    size?: "default" | "small";
    bgColor?: string;
    textColor?: string;
    borderColor?: string;
    blurBackground?: boolean;
    multiple?: boolean;
    selectedValuesLayout?: "inline" | "stacked";
    selectedCountLabel?: (count: number) => React.ReactNode;
    onSecondaryButton?: () => void;
    onSecondaryActionDescription?: React.ReactNode;
    onOptionsButton?: () => void;
    onOptionsActionDescription?: React.ReactNode;
    maxDisplayLines?: number;
    maxVisibleOptions?: number;
    highlightOnFocus?: boolean;
    bottomSeparator?: boolean;
}
export declare const AnchoredDropdown: React.FC<AnchoredDropdownProps>;
export {};
