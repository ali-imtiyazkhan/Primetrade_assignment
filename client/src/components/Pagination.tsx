'use client';

interface Props {
  page: number;
  pages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, pages, onPageChange }: Props) {
  if (pages <= 1) return null;

  const getPages = () => {
    const items: (number | string)[] = [];
    const delta = 2;
    const left = Math.max(2, page - delta);
    const right = Math.min(pages - 1, page + delta);

    items.push(1);
    if (left > 2) items.push('...');
    for (let i = left; i <= right; i++) items.push(i);
    if (right < pages - 1) items.push('...');
    if (pages > 1) items.push(pages);

    return items;
  };

  const btnClass = (active = false) =>
    `px-3 py-1.5 text-sm rounded-lg transition cursor-pointer ${
      active ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    }`;

  return (
    <div className="flex items-center justify-center gap-1 mt-6">
      <button disabled={page <= 1} onClick={() => onPageChange(page - 1)} className={btnClass()}>&larr; Prev</button>
      {getPages().map((p, i) =>
        typeof p === 'string' ? (
          <span key={`ellipsis-${i}`} className="px-2 text-gray-400">...</span>
        ) : (
          <button key={p} onClick={() => onPageChange(p)} className={btnClass(p === page)}>{p}</button>
        )
      )}
      <button disabled={page >= pages} onClick={() => onPageChange(page + 1)} className={btnClass()}>Next &rarr;</button>
    </div>
  );
}
