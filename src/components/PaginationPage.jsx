"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function PaginateNew({
  endpage,
  currentPage,
  baseUrl = "",
  queryParams = {},
}) {
  const current = Number(currentPage);
  console.log("currentPage", currentPage);
  console.log("current", current);
  // Menghitung range halaman untuk masing-masing tampilan
  const getPageRange = (total, maxVisible) => {
    const half = Math.floor(maxVisible / 2);
    const start = Math.max(1, current - half);
    const end = Math.min(total, current + half);

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  // Mendapatkan range untuk mobile (3) dan desktop (5)
  const pagesMobile = getPageRange(endpage, 3);
  const pagesDesktop = getPageRange(endpage, 5);

  // Fungsi untuk membuat URL halaman dengan query params
  const getPageUrl = (page) => {
    const params = new URLSearchParams({
      ...queryParams,
      page: page.toString(),
    });
    return `${baseUrl}?${params.toString()}`;
  };

  const isPrevDisabled = current === 1;
  const isNextDisabled = current === endpage;

  // Komponen untuk tombol navigasi
  const NavigationButton = ({ disabled, href, direction, onClick }) => (
    <Link
      href={href}
      className={cn(
        "flex items-center justify-center h-10 w-10 rounded-lg border transition-all duration-200",
        disabled
          ? "border-gray-200 bg-gray-50 text-gray-300 cursor-not-allowed"
          : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400"
      )}
      aria-label={`Halaman ${
        direction === "left" ? "sebelumnya" : "selanjutnya"
      }`}
      onClick={onClick}
    >
      {direction === "left" ? (
        <ChevronLeft className="h-5 w-5" />
      ) : (
        <ChevronRight className="h-5 w-5" />
      )}
    </Link>
  );

  // Komponen untuk nomor halaman
  const PageNumber = ({ page, isCurrent }) => (
    <Link href={getPageUrl(page)}>
      <div
        className={cn(
          "flex items-center justify-center h-10 w-10 text-sm font-medium rounded-lg border transition-all duration-200",
          isCurrent
            ? "bg-core text-white border-core shadow-sm"
            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
        )}
      >
        {page}
      </div>
    </Link>
  );

  return (
    <nav
      className="flex justify-center items-center gap-3 py-6"
      aria-label="Pagination"
    >
      {/* Previous Button */}
      <NavigationButton
        disabled={isPrevDisabled}
        href={!isPrevDisabled ? getPageUrl(current - 1) : "#"}
        direction="left"
        onClick={(e) => isPrevDisabled && e.preventDefault()}
      />

      <div className="flex items-center gap-2">
        {/* First Page */}
        {pagesDesktop[0] > 1 && (
          <>
            <PageNumber page={1} isCurrent={current === 1} />
            {pagesDesktop[0] > 2 && (
              <span className="text-gray-500 px-0.5">...</span>
            )}
          </>
        )}

        {/* Page Numbers for Mobile */}
        <div className="flex gap-2 md:hidden">
          {pagesMobile.map((page) => (
            <PageNumber key={page} page={page} isCurrent={current === page} />
          ))}
        </div>

        {/* Page Numbers for Desktop */}
        <div className="hidden gap-2 md:flex">
          {pagesDesktop.map((page) => (
            <PageNumber key={page} page={page} isCurrent={current === page} />
          ))}
        </div>

        {/* Last Page */}
        {pagesDesktop[pagesDesktop.length - 1] < endpage && (
          <>
            {pagesDesktop[pagesDesktop.length - 1] < endpage - 1 && (
              <span className="text-gray-500 px-0.5">...</span>
            )}
            <PageNumber page={endpage} isCurrent={current === endpage} />
          </>
        )}
      </div>

      {/* Next Button */}
      <NavigationButton
        disabled={isNextDisabled}
        href={!isNextDisabled ? getPageUrl(current + 1) : "#"}
        direction="right"
        onClick={(e) => isNextDisabled && e.preventDefault()}
      />
    </nav>
  );
}
