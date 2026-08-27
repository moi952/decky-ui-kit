import React from "react";
export interface CollapsibleSectionProps {
    label: string;
    expanded: boolean;
    onToggle: () => void;
    children: React.ReactNode;
}
export declare const CollapsibleSection: React.FC<CollapsibleSectionProps>;
