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
}
export declare const FieldTextInput: React.FC<FieldTextInputProps>;
