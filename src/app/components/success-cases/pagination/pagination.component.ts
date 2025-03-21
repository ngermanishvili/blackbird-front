import { NgFor, NgIf } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [NgIf, NgFor],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss'
})
export class PaginationComponent {
  @Input() paginationData: any;
  @Output() pageChange = new EventEmitter<number>();
  activePage: number = 1;

  getDisplayedLinks(): any[] {
    if (!this.paginationData || !this.paginationData.links) return [];

    const currentPage = this.paginationData.current_page;
    const totalPages = this.paginationData.last_page;
    const maxDisplayed = 4; // Number of page links to display around the active page

    const links = this.paginationData.links.filter((link: any) => link.url);

    // Display links around the current page
    let start = Math.max(currentPage - Math.floor(maxDisplayed / 2), 1);
    let end = Math.min(currentPage + Math.floor(maxDisplayed / 2), totalPages);

    // Adjust the range if there are not enough pages before or after
    if (currentPage - start < Math.floor(maxDisplayed / 2)) {
      end = Math.min(start + maxDisplayed - 1, totalPages);
    }
    if (end - currentPage < Math.floor(maxDisplayed / 2)) {
      start = Math.max(end - maxDisplayed + 1, 1);
    }

    // Include ellipses if there are skipped pages
    const displayedLinks = links.filter((link: any) => {
      const page = parseInt(new URL(link.url).searchParams.get('page') || '0', 10);
      return page >= start && page <= end;
    });

    // Add ellipses if needed
    const result: any[] = [];
    if (start > 1) {
      result.push({ label: '...', url: null });
    }
    result.push(...displayedLinks);
    if (end < totalPages) {
      result.push({ label: '...', url: null });
    }

    return result;
  }

  isActive(page: number): boolean {
    return this.paginationData.current_page === page;
  }
  displayLabbel(item: string): string | null {
    if (item.includes('Previous') || item.includes('Next')) {
      return null
    }
    return item
  }

  goToPage(url: string | null): void {
    // console.log(url);

    if (url) {
      const page = new URL(url).searchParams.get('page');
      this.activePage = Number(page);

      if (page) {
        this.pageChange.emit(Number(page));
      }
    }
  }
}