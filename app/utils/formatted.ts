import dateOptions from "./dateOptions.json";

// Helper function to format the minutes into hours and minutes
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours > 0 ? `${hours} hour${hours > 1 ? "s" : ""}` : ""} ${
    remainingMinutes > 0
      ? `${remainingMinutes} minute${remainingMinutes > 1 ? "s" : ""}`
      : ""
  }`.trim();
};

export const formatDesc = (desc: string): string => {
  return desc
    ?.replace(/<br\s*\/?>/gi, "")
    .replace(/\(Source:.*?\)/g, "")
    .replace(/\s*--\s*/g, " ") // Add a space after removing --
    .trim();
};

/**
 * Formats a date string into a localized date string.
 *
 * @param date - The date string to format. Can be any valid date string or null/undefined.
 * @returns A formatted date string, or 'Unknown' if the input is invalid.
 */
export const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) return "Unknown";

  try {
    const localDate = date instanceof Date ? date : new Date(date);
    if (isNaN(localDate.getTime())) throw new Error("Invalid date");

    return localDate.toLocaleDateString(
      "en-US",
      dateOptions as Intl.DateTimeFormatOptions
    );
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Invalid Date";
  }
};
