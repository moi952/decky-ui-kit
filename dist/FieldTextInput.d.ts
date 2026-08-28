import React from "react";
export interface FieldTextInputProps {
    label?: React.ReactNode;
    value: string;
    onChange: (value: string) => void;
    size?: "default" | "small";
    mustBeNumeric?: boolean;
    bottomSeparator?: boolean;
    highlightOnFocus?: boolean;
    labelPosition?: "top" | "left" | "right";
    placeholder?: string;
    iconStart?: React.ReactNode;
    iconEnd?: React.ReactNode;
}
export declare const FieldTextInput: React.FC<FieldTextInputProps>;
