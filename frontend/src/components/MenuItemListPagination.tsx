import { Button } from '../components/ui';
import { Icon } from '../components/icons';

interface MenuItemListPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function MenuItemListPagination({
  currentPage,
  totalPages,
  onPageChange,
}: MenuItemListPaginationProps) {
  if (totalPages <= 1) {
    return null;
  }

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <nav className="ds-pagination" aria-label="Menu pagination">
      <Button
        variant="ghost"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!canGoPrevious}
      >
        <Icon name="chevron-left" size={16} />
        Previous
      </Button>
      <span className="ds-muted">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant="ghost"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!canGoNext}
      >
        Next
        <Icon name="chevron-right" size={16} />
      </Button>
    </nav>
  );
}