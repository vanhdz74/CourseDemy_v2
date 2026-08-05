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
    <Card className="gap-3 p-5">
      <CardHeader className="flex flex-row items-center justify-between p-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
          {icon}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div
          className={`text-2xl font-bold tracking-tight ${
            valueClassName || ""
          }`}
        >
          {value}
        </div>

        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
