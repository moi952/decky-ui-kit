import React, { useState } from "react";
import { DialogButton } from "@decky/ui";
import { InlineConfirm } from "../../src/InlineConfirm";
import { ControlConfig } from "../controls";
import { Section } from "./Section";
import { Playground } from "./Playground";
import { DemoPage } from "./DemoPage";

const controls: ControlConfig[] = [
  { key: "description", label: "description", type: "text" },
  { key: "cancelLabel", label: "cancelLabel", type: "text" },
  { key: "confirmLabel", label: "confirmLabel", type: "text" },
  { key: "size", label: "size", type: "select", options: ["small", "medium", "large"] },
  { key: "variant", label: "variant", type: "select", options: ["danger", "primary"] },
];

const initialValues = {
  description: "Remove the wrapper from Half-Life 2?",
  cancelLabel: "Cancel",
  confirmLabel: "Remove",
  size: "small",
  variant: "danger",
};

const genCode = (values: Record<string, any>) => {
  const props: string[] = [`  description="${values.description}"`];
  if (values.cancelLabel !== "Cancel") props.push(`  cancelLabel="${values.cancelLabel}"`);
  if (values.confirmLabel !== "Delete") props.push(`  confirmLabel="${values.confirmLabel}"`);
  if (values.size !== "small") props.push(`  size="${values.size}"`);
  if (values.variant !== "danger") props.push(`  variant="${values.variant}"`);
  props.push(`  onCancel={onCancel}`, `  onConfirm={onConfirm}`);
  return `<InlineConfirm\n${props.join("\n")}\n/>`;
};

export const InlineConfirmDemo: React.FC = () => {
  const [playgroundOpen, setPlaygroundOpen] = useState(true);
  const [open1, setOpen1] = useState(true);

  return (
    <DemoPage
      playground={
        <Playground
          controls={controls}
          initialValues={initialValues}
          genCode={genCode}
          render={(values) =>
            playgroundOpen ? (
              <InlineConfirm
                description={values.description}
                cancelLabel={values.cancelLabel}
                confirmLabel={values.confirmLabel}
                size={values.size}
                variant={values.variant}
                onCancel={() => setPlaygroundOpen(false)}
                onConfirm={() => setPlaygroundOpen(false)}
              />
            ) : (
              <DialogButton onClick={() => setPlaygroundOpen(true)} style={{ width: "fit-content" }}>
                Delete
              </DialogButton>
            )
          }
        />
      }
    >
      <Section
        title="shown inline, not a modal"
        description="Sits directly below whatever triggered it — a description line plus an equal-width Cancel/Confirm pair."
        code={`{confirming ? (\n  <InlineConfirm\n    description="Remove the wrapper from Half-Life 2?"\n    confirmLabel="Remove"\n    onCancel={() => setConfirming(false)}\n    onConfirm={() => { removeWrapper(); setConfirming(false); }}\n  />\n) : (\n  <DialogButton onClick={() => setConfirming(true)}>Remove wrapper</DialogButton>\n)}`}
      >
        {open1 ? (
          <InlineConfirm
            description="Remove the wrapper from Half-Life 2?"
            confirmLabel="Remove"
            onCancel={() => setOpen1(false)}
            onConfirm={() => setOpen1(false)}
          />
        ) : (
          <DialogButton onClick={() => setOpen1(true)} style={{ width: "fit-content" }}>
            Remove wrapper
          </DialogButton>
        )}
      </Section>

      <Section
        title='size="medium"'
        code={`<InlineConfirm\n  description="Delete this custom variable?"\n  size="medium"\n  onCancel={onCancel}\n  onConfirm={onConfirm}\n/>`}
      >
        <InlineConfirm
          description="Delete this custom variable?"
          size="medium"
          onCancel={() => {}}
          onConfirm={() => {}}
        />
      </Section>

      <Section
        title='variant="primary"'
        description="A blue confirm button for a non-destructive confirmation."
        code={`<InlineConfirm\n  description="Apply this preset to every game?"\n  confirmLabel="Apply"\n  variant="primary"\n  onCancel={onCancel}\n  onConfirm={onConfirm}\n/>`}
      >
        <InlineConfirm
          description="Apply this preset to every game?"
          confirmLabel="Apply"
          variant="primary"
          onCancel={() => {}}
          onConfirm={() => {}}
        />
      </Section>
    </DemoPage>
  );
};
