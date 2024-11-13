"use client";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
import { usePathname, useSearchParams } from 'next/navigation';

export function BrowsePagePagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const rangeStart = Math.max(1, currentPage - 2);
    const rangeEnd = Math.min(totalPages, currentPage + 2);

    // Always show the first page and two pages before and after the current page
    if (rangeStart > 2) pageNumbers.push(1);
    if (rangeStart > 3) pageNumbers.push("...");

    for (let i = rangeStart; i <= rangeEnd; i++) {
      pageNumbers.push(i);
    }

    // Always show the last page and ellipsis before it if necessary
    if (rangeEnd < totalPages - 2) pageNumbers.push("...");
    if (rangeEnd < totalPages) pageNumbers.push(totalPages);

    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  return (
      <div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                  href={currentPage > 1 ? createPageURL(currentPage - 1) : "#"}
              />
            </PaginationItem>

            {pageNumbers.map((page, index) => (
                <PaginationItem key={index}>
                  {page === "..." ? (
                      <PaginationEllipsis />
                  ) : (
                      <PaginationLink
                          href={createPageURL(page as number)}
                      >
                        {page}
                      </PaginationLink>
                  )}
                </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                  href={currentPage < totalPages ? createPageURL(currentPage + 1) : "#"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
  );
}
