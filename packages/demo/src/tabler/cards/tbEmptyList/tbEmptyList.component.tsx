import { PiCardSimpleProps } from "@pihanga/core";
import React from "react";
import { IconPlus } from "@tabler/icons-react";

export type ComponentProps = {
  title?: string;
  subTitle?: React.ReactNode;
  actionButtonTitle?: string;
  actionButtonOnClick?: () => void;
};

export const Component = ({
  title,
  subTitle,
  actionButtonTitle,
  actionButtonOnClick,
}: PiCardSimpleProps<ComponentProps>): React.ReactNode => {
  return (
    <div className="empty">
      <p className="empty-title">{title || "No data available."}</p>
      {subTitle && <p className="empty-subtitle text-muted">{subTitle}</p>}

      {actionButtonTitle && actionButtonOnClick ? (
        <div className="empty-action">
          <a
            href="."
            className="btn btn-primary"
            onClick={(e): void => {
              e.preventDefault();
              actionButtonOnClick && actionButtonOnClick();
            }}
          >
            <IconPlus />
            {actionButtonTitle}
          </a>
        </div>
      ) : null}
    </div>
  );
};
