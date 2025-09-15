import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(...inputs));
}


export const parse = (data, { fields }) => {
  const replacer = (key, value) => (value === null ? '' : value);
  const csv = [
    fields.join(','), // header row
    ...data.map((row) =>
      fields.map((fieldName) => JSON.stringify(row[fieldName], replacer)).join(',')),
  ].join('\r\n');
  return csv;
};
