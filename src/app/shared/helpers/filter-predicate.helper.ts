export function createFilterPredicate<T>() {
    return (data: T, filter: string): boolean => {

        const { columnFilters, globalFilter } = JSON.parse(filter);
console.log('globalFilter', globalFilter);
        // Check column-specific filters
        for (const key in columnFilters) {
            if (columnFilters[key]) {
                const typedKey = key as keyof T;
                const value = data[typedKey]?.toString().toLowerCase();

                const filterValue = columnFilters[key].toLowerCase();

                if (!value?.includes(filterValue)) {
                    return false; // Exclude row if it doesn't match a column filter
                }
            }
        }

        // Check global filter
        if (globalFilter) {
            const globalSearch = globalFilter.toLowerCase();
            const rowValues = Object.values(data as keyof T)
                .map((val) => val?.toString().toLowerCase())
                .join(' '); // Concatenate all row values for global search
            if (!rowValues.includes(globalSearch)) {
                return false; // Exclude row if it doesn't match the global search term
            }
        }

        return true; // Include row if all filters match
    };
}