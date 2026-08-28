import React from "react";
export interface InlineConfirmProps {
    description: React.ReactNode;
    onCancel: () => void;
    onConfirm: () => void;
    cancelLabel?: React.ReactNode;
    confirmLabel?: React.ReactNode;
    size?: "small" | "medium" | "large";
    variant?: "danger" | "primary";
}
export declare const InlineConfirm: React.FC<InlineConfirmProps>;
