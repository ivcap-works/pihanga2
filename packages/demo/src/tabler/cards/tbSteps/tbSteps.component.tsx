import { Card, PiCardSimpleProps } from "@pihanga/core";
import React from "react";

export type StepEvent = {
  id: string;
  currentStepID: number;
  currentStep: string;
};

export type ComponentProps = {
  id: string; // identifier for actions
  title?: string;
  steps: Step[];
  vertical?: boolean;
  selfManaged?: boolean; // when set, 'activeSteps' are managed by component
  activeStep?: number; // starts with 0
  lastStepIsConfirm?: boolean;
  gap?: string; // gap (in CSS units) between step viz and step card
  defNextLabel?: string;
  defConfirmLabel?: string;
  showCounter?: boolean;
  stepClassNames?: string[]; // class names to add to each step <li>
};

type Step = {
  id: string; // used in event
  label?: string;
  card: string;
  nextButtonLabel?: string;
  nextButtonClass?: string;
  nextButtonDisabled?: boolean;
  hideNavigationButtons?: boolean; // if true hide Cancel and Back buttons
};

type ComponentT = ComponentProps & {
  onConfirm: (ev: StepEvent) => void;
  onNextStep: (ev: StepEvent) => void;
  onPreviousStep: (ev: StepEvent) => void;
  onCancel: (ev: StepEvent) => void;
};

export const Component = (
  props: PiCardSimpleProps<ComponentT>
): React.ReactNode => {
  const {
    id,
    title,
    steps,
    vertical,
    selfManaged,
    activeStep,
    showCounter,
    stepClassNames = [],
    lastStepIsConfirm,
    gap = "1em",
    defNextLabel = "Next",
    defConfirmLabel = "Confirm",
    onConfirm,
    onNextStep,
    onPreviousStep,
    onCancel,
    cardName,
  } = props;
  const [managedStepID, setManagedStepID] = React.useState(0);

  var stepID: number;
  if (selfManaged) {
    stepID = managedStepID;
  } else {
    if (!activeStep) {
      console.log(
        "stepper is not self managed and activeStep is not set - id:",
        id
      );
      stepID = 0;
    } else {
      stepID = activeStep;
    }
  }

  const activeCard = steps[stepID] ? steps[stepID].card : "unknown";

  function renderHeader(): React.ReactNode {
    if (!title) return null;

    return (
      <div className="card-header card-header-light">
        <h3 className="card-title">{title}</h3>
      </div>
    );
  }

  function renderNavigator(): React.ReactNode {
    var cls = stepClassNames ? stepClassNames : [];
    if (showCounter) {
      cls.push("steps-counter");
    }
    if (vertical) {
      cls.push("steps-vertical");
    }
    const style = gap ? { marginBottom: gap } : {};
    return (
      <ul className={`steps ${cls.join(" ")}`} style={style}>
        {steps.map(renderStepItem)}
      </ul>
    );
  }

  function renderStepItem(step: Step, idx: number): React.ReactNode {
    const cls = `step-item${stepID === idx ? " active" : ""}`;
    const label = step.label ? step.label : "";
    return (
      <li className={cls} key={idx}>
        {label}
      </li>
    );
  }

  function renderFooter(): React.ReactNode {
    let bkCls = "btn btn-link";
    if (stepID === 0) {
      bkCls += " disabled";
    }
    const cancelCls = "btn btn-link";
    const step = steps[stepID];

    return (
      <div className="card-footer">
        <div className="d-flex">
          {!step.hideNavigationButtons && (
            <button onClick={onPrevClicked} className={bkCls}>
              Back
            </button>
          )}
          <span className="ms-auto">
            {!step.hideNavigationButtons && (
              <button onClick={onCancelClicked} className={cancelCls}>
                Cancel
              </button>
            )}
            {renderNextButton()}
          </span>
        </div>
      </div>
    );
  }

  function renderNextButton(): React.ReactNode {
    const step = steps[stepID];
    const isLast = stepID >= steps.length - 1;
    let label = step.nextButtonLabel;
    if (!label) {
      label = isLast ? defConfirmLabel : defNextLabel;
    }
    let cls = "btn " + (step.nextButtonClass || "btn-primary");
    if (step.nextButtonDisabled === undefined) {
      if (isLast) cls += " disabled";
    } else if (step.nextButtonDisabled) {
      cls += " disabled";
    }

    // if (isLast && lastStepIsConfirm) {
    //   if (confirmLabel) {
    //     label = confirmLabel
    //   }
    //   if (confirmClass) {
    //     cls += confirmClass
    //   } else {
    //     cls += "btn-primary"
    //   }
    // } else {
    //   cls += "btn-primary"
    //   if (isLast) cls += " disabled"
    // }

    return (
      <button onClick={onNextClicked} className={cls}>
        {label}
      </button>
    );
  }

  function onNextClicked(): void {
    const isLast = stepID >= steps.length - 1;
    if (selfManaged) {
      setManagedStepID(isLast ? 0 : stepID + 1);
    }
    onButton(isLast && lastStepIsConfirm ? onConfirm : onNextStep);
  }

  function onPrevClicked(): void {
    if (selfManaged && stepID > 0) {
      setManagedStepID(stepID - 1);
    }
    onButton(onPreviousStep);
  }

  function onCancelClicked(): void {
    if (selfManaged) {
      setManagedStepID(0);
    }
    onButton(onCancel);
  }

  function onButton(hdl: (ev: StepEvent) => void): void {
    const step = steps[stepID];
    hdl({
      id,
      currentStepID: stepID,
      currentStep: step.id,
    });
  }

  const bodyStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: vertical ? "row" : "column",
    // gap: gap || '0',
  };

  let navStyle: React.CSSProperties;
  if (vertical) {
    navStyle = {
      width: "auto",
      paddingRight: `calc(0.5 * ${gap})`,
      marginRight: `calc(0.5 * ${gap})`,
      borderRight: "1px solid lightGray",
    };
  } else {
    navStyle = {
      marginBottom: gap,
      borderBottom: "1px solid lightGray",
    };
  }

  const cardStyle: React.CSSProperties = {
    flex: 1,
  };

  return (
    <div
      className={`card tb-steps tb-steps-${cardName}`}
      data-pihanga={cardName}
    >
      {renderHeader()}
      <div className="card-body" style={bodyStyle}>
        <div style={navStyle}>{renderNavigator()}</div>
        <div style={cardStyle}>
          <Card cardName={activeCard} />
        </div>
      </div>
      {renderFooter()}
    </div>
  );
};
