"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/modules/shared/components/ui/card";

type Props = {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  valueClassName?: string;
};

const SummaryCard: React.FC<Props> = ({
  title,
  value,
  description,
  icon,
  valueClassName,
}) => {
  return (
    <div className="rounded-3xl border border-border/80 bg-card p-5 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/40">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {title}
        </span>
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          {icon}
        </div>
      </div>

      <div className="mt-3">
        <div
          className={`text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground ${
            valueClassName || ""
          }`}
        >
          {value}
        </div>

        {description && (
          <p className="mt-1 text-xs text-muted-foreground font-medium">{description}</p>
        )}
      </div>
    </div>
  );
};

export default SummaryCard;

