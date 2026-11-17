// helper functions, to get query parameters
export function getQueryString (value: unknown, defaultValue: string): string {
    return typeof value === "string" ? value : defaultValue;
};

export function getQueryInt (value: unknown, defaultValue: number): number {
const num = parseInt(getQueryString(value, defaultValue.toString()));
    return typeof num === "number" ? num : defaultValue;
};

// idk why this is not in the default Math library.
export function clamp(value: number, min: number, max: number) : number {
    return Math.max(min, Math.min(max, value));
};