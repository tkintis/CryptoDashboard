export function formatLargeNumber(value: number): string {
    if (value >= 1e12) {
        return `${(value / 1e12).toFixed(1)}T`; // Format trillions
    } else if (value >= 1e9) {
        return `${(value / 1e9).toFixed(1)}B`; // Format billions
    } else if (value >= 1e6) {
        return `${(value / 1e6).toFixed(1)}M`; // Format millions
    } else if (value >= 1e3) {
        return `${(value / 1e3).toFixed(1)}K`; // Format thousands
    }
    return value.toString(); // Return as-is for smaller numbers
}