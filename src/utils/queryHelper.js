export function getQueryParams(url) {
  const { searchParams } = new URL(url);

  const page = parseInt(searchParams.get("page")) || 1;
  const limit = parseInt(searchParams.get("limit")) || 10;
  const offset = (page - 1) * limit;
  const search = searchParams.get("search") || "";
  const sortField = searchParams.get("sortField") || "created_at";
  const sortOrder = searchParams.get("sortOrder") || "desc";

  return { page, limit, offset, search, sortField, sortOrder };
}

export function buildSearchCondition(field, searchValue) {
  return searchValue
    ? {
        [field]: {
          contains: searchValue,
        },
      }
    : {};
}

export function getPaginationMeta(totalItems, limit, page) {
  return {
    totalItems,
    totalPages: Math.ceil(totalItems / limit),
    currentPage: page,
  };
}
