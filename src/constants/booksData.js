let books;

async function load() {
  if (!books) books = await fetch("/books.json").then((r) => r.json());
  return books;
}

function unique(arr) {
  const seen = new Set();
  return arr.filter((b) => {
    const idStr = String(b.id);
    if (seen.has(idStr)) return false;
    seen.add(idStr);
    return true;
  });
}

function paginate(arr, page, perPage, maxPages = Infinity) {
  const totalPages = Math.min(Math.ceil(arr.length / perPage) || 1, maxPages);
  const start = (page - 1) * perPage;

  return {
    books: arr.slice(start, start + perPage),
    totalPages,
  };
}

export async function getBooksByTopic(topic, limit, excludeId) {
  const normalizedTopic = topic?.trim().toLowerCase();

  let all = unique(await load()).filter(
    (b) => b.topic?.trim().toLowerCase() === normalizedTopic,
  );

  if (excludeId) {
    all = all.filter((b) => String(b.id) !== String(excludeId));
  }

  return limit ? all.slice(0, limit) : all;
}

export async function getPopularBooksFlat(limit) {
  const all = unique(await load()).sort(
    (a, b) => (b.download_count || 0) - (a.download_count || 0),
  );

  return limit ? all.slice(0, limit) : all;
}

export async function getPopularPage(page, perPage, maxPages) {
  return paginate(await getPopularBooksFlat(), page, perPage, maxPages);
}

export async function getTopicPage(topic, page, perPage, maxPages) {
  const normalizedTopic = topic?.trim().toLowerCase();
  const all = unique(
    (await load()).filter(
      (b) => b.topic?.trim().toLowerCase() === normalizedTopic,
    ),
  );
  return paginate(all, page, perPage, maxPages);
}

export async function getAllBooksPage(page, perPage, skipFirst = 0) {
  return paginate(unique(await load()).slice(skipFirst), page, perPage);
}

export async function getBookPage(id) {
  const all = await load();
  return all.find((b) => String(b.id) === String(id));
}

export async function searchBooks(query, limit = 5) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const all = unique(await load());
  return all.filter((b) => b.title?.toLowerCase().includes(q)).slice(0, limit);
}

export async function searchBooksFull(
  query,
  page = 1,
  limit = 12,
  maxPages = 5,
) {
  const q = query.trim().toLowerCase();
  if (!q) return { books: [], totalPages: 1 };

  const all = unique(await load());
  const filtered = all.filter((b) => b.title?.toLowerCase().includes(q));

  const computedPages = Math.ceil(filtered.length / limit) || 1;
  const totalPages = Math.min(computedPages, maxPages);

  const startIndex = (page - 1) * limit;
  const books = filtered.slice(startIndex, startIndex + limit);

  return { books, totalPages };
}

export function formatAuthorName(author) {
  if (!author) return "مؤلف غير معروف";

  const parts = author.split(",").map((p) => p.trim());

  if (parts.length === 1) return author;

  const lastName = parts[0];
  const firstName = parts[1] || "";

  const isJustDates = /^\d{3,4}(-\d{0,4})?\.?$/.test(firstName);
  if (isJustDates || !firstName) return lastName;

  return `${firstName} ${lastName}`;
}
