export function formatUserId(id: number | string): string {
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
    if (isNaN(numericId)) return `U-${id}`;
    return `U-${numericId.toString().padStart(3, '0')}`;
}

export function formatSKU(brand: string, category: string, id: number): string {
    const brandCode = (brand || "XX").substring(0, 2).toUpperCase();
    const catCode = (category || "XX").substring(0, 2).toUpperCase();
    const idCode = id.toString().padStart(3, '0');
    return `${brandCode}-${catCode}-${idCode}`;
}

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
}
