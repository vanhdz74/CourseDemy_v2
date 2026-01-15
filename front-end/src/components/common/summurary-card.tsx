"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>

      <CardContent>
        <div className={`text-2xl font-bold ${valueClassName || ""}`}>
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
