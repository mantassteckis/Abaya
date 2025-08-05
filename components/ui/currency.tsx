"use client";

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

const formatter = new Intl.NumberFormat("en-Us", {
  style: "currency",
  currency: "AED",
});

interface CurrencyProps {
  value?: string | number;
  className?: string[];
}

const Currency: React.FC<CurrencyProps> = ({ value, className }) => {
  return (
    <span className={cn("font-semibold", ...(className || []))}>
      {formatter.format(Number(value))}
    </span>
  );
};

export default Currency;
