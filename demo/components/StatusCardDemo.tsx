import React from "react";
import { DialogButton } from "@decky/ui";
import { StatusCard } from "../../src/StatusCard";
import { ControlConfig } from "../controls";
import { Section } from "./Section";
import { Playground } from "./Playground";
import { DemoPage } from "./DemoPage";

// A DialogButton on real Steam already looks good on its own — this demo
// only mocks @decky/ui with a bare <button>, so the action gets a bit of
// its own styling here to read as a real call-to-action rather than a
// default browser button.
const ActionButtonPreview: React.FC<{
  children: React.ReactNode;
  onClick: () => void;
}> = ({ children, onClick }) => (
  <DialogButton
    onClick={onClick}
    style={{
      width: "100%",
      padding: "10px 16px",
      fontSize: 13,
      fontWeight: 700,
      background: "#66c0f4",
      color: "#0c1116",
    }}
  >
    {children}
  </DialogButton>
);

const controls: ControlConfig[] = [
  { key: "variant", label: "variant", type: "select", options: ["success", "error", "info"] },
  { key: "title", label: "title", type: "text" },
  { key: "description", label: "description", type: "text" },
  { key: "withAction", label: "with an action (children)", type: "checkbox" },
  {
    key: "actionLabel",
    label: "action label",
    type: "text",
    showIf: (values) => values.withAction,
  },
];

const initialValues = {
  variant: "success",
  title: "Everything is up to date",
  description: "",
  withAction: false,
  actionLabel: "Reboot now",
};

const genCode = (values: Record<string, any>) => {
  const props: string[] = [];
  if (values.variant !== "success") props.push(`  variant="${values.variant}"`);
  props.push(`  title="${values.title}"`);
  if (values.description) props.push(`  description="${values.description}"`);
  const open = `<StatusCard\n${props.join("\n")}`;
  if (!values.withAction) return `${open}\n/>`;
  return `${open}\n>\n  <DialogButton onClick={...}>${values.actionLabel}</DialogButton>\n</StatusCard>`;
};

export const StatusCardDemo: React.FC = () => (
  <DemoPage
    playground={
      <Playground
        controls={controls}
        initialValues={initialValues}
        genCode={genCode}
        render={(values) => (
          <StatusCard
            variant={values.variant}
            title={values.title}
            description={values.description || undefined}
          >
            {values.withAction && (
              <ActionButtonPreview onClick={() => {}}>
                {values.actionLabel}
              </ActionButtonPreview>
            )}
          </StatusCard>
        )}
      />
    }
  >
    <Section
      title="success, with an action"
      description="Icon and title colored by variant; a child button sits below the description — e.g. a Reboot now action once an install finishes and everything's current."
      code={`<StatusCard title="Everything is up to date">\n  <DialogButton onClick={reboot}>Reboot now</DialogButton>\n</StatusCard>`}
    >
      <StatusCard title="Everything is up to date">
        <ActionButtonPreview onClick={() => {}}>Reboot now</ActionButtonPreview>
      </StatusCard>
    </Section>

    <Section
      title='variant="error"'
      code={`<StatusCard\n  variant="error"\n  title="Install failed"\n  description="Check the log for details."\n>\n  <DialogButton onClick={retry}>Try again</DialogButton>\n</StatusCard>`}
    >
      <StatusCard
        variant="error"
        title="Install failed"
        description="Check the log for details."
      >
        <ActionButtonPreview onClick={() => {}}>Try again</ActionButtonPreview>
      </StatusCard>
    </Section>

    <Section
      title='variant="info", with a dismiss button'
      description="Not a finished-state verdict like success/error — a plain announcement/notice instead (e.g. 'check out my other plugins'). There's no first-class dismiss prop: the same children slot that fits an action button fits a dismiss button just as well."
      code={`<StatusCard\n  variant="info"\n  title="New plugin available!"\n  description="Check out my other Decky plugins."\n>\n  <DialogButton onClick={dismiss}>Got it</DialogButton>\n</StatusCard>`}
    >
      <StatusCard
        variant="info"
        title="New plugin available!"
        description="Check out my other Decky plugins."
      >
        <ActionButtonPreview onClick={() => {}}>Got it</ActionButtonPreview>
      </StatusCard>
    </Section>

    <Section
      title="title only, no description or children"
      code={`<StatusCard title="Everything is up to date" />`}
    >
      <StatusCard title="Everything is up to date" />
    </Section>
  </DemoPage>
);
