"use client";
import { usePathname, useSearchParams } from 'next/navigation';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination"

export function BrowsePagePagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  // Generate page numbers to display
  const generatePaginationItems = () => {
    const items = [];
    const showAroundCurrent = 2; // How many pages to show before and after current page

    // Previous button
    items.push(
        <PaginationItem key="prev">
          <PaginationPrevious
              href={currentPage > 1 ? createPageURL(currentPage - 1) : "#"}
              className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
    );

    // First page
    if (currentPage > showAroundCurrent + 1) {
      items.push(
          <PaginationItem key={1}>
            <PaginationLink href={createPageURL(1)}>1</PaginationLink>
          </PaginationItem>
      );
      if (currentPage > showAroundCurrent + 2) {
        items.push(
            <PaginationItem key="ellipsis1">
              <PaginationEllipsis />
            </PaginationItem>
        );
      }
    }

    // Pages around current page
    for (let i = Math.max(1, currentPage - showAroundCurrent);
         i <= Math.min(totalPages, currentPage + showAroundCurrent);
         i++) {
      items.push(
          <PaginationItem key={i}>
            <PaginationLink
                href={createPageURL(i)}
                isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
      );
    }

    // Last page
    if (currentPage < totalPages - showAroundCurrent) {
      if (currentPage < totalPages - showAroundCurrent - 1) {
        items.push(
            <PaginationItem key="ellipsis2">
              <PaginationEllipsis />
            </PaginationItem>
        );
      }
      items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink href={createPageURL(totalPages)}>
              {totalPages}
            </PaginationLink>
          </PaginationItem>
      );
    }

    // Next button
    items.push(
        <PaginationItem key="next">
          <PaginationNext
              href={currentPage < totalPages ? createPageURL(currentPage + 1) : "#"}
              className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>
    );

    return items;
  };

  return (
      <div className="flex justify-center py-4">
        <Pagination>
          <PaginationContent>
            {generatePaginationItems()}
          </PaginationContent>
        </Pagination>
      </div>
  );
}

export default BrowsePagePagination;