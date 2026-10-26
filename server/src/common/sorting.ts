export const PAGE_SIZE = 10;

// Prisma throws on an unknown orderBy key, and the sort field arrives from the
// query string, so each resource states what it will sort on.
export function buildOrderBy(
  sortBy: string | undefined,
  allowed: string[],
  fallback: Record<string, 'asc' | 'desc'>,
) {
  if (!sortBy) return fallback;

  const [field, direction] = sortBy.split('-');
  if (!allowed.includes(field)) return fallback;

  return { [field]: direction === 'asc' ? 'asc' : 'desc' } as Record<
    string,
    'asc' | 'desc'
  >;
}

export function buildPagination(page?: number) {
  const current = Number.isFinite(page) && page > 0 ? page : 1;
  return { skip: (current - 1) * PAGE_SIZE, take: PAGE_SIZE };
}
