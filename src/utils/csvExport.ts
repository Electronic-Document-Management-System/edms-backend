export const convertToCSV = (rows: Record<string, any>[]): string => {
    if (rows.length === 0) return '';

    const headers = Object.keys(rows[0]);
    const csvRows = [
        headers.join(','),
        ...rows.map((row) =>
            headers
                .map((header) => {
                    const value = row[header] ?? '';
                    const escaped = String(value).replace(/"/g, '""');
                    return `"${escaped}"`;
                })
                .join(',')
        ),
    ];

    return csvRows.join('\n');
};