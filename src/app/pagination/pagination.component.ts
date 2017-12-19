import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnChanges {

  public selectedPage: number = 0;

  @Input()
  public totalPages: number = 0;

  @Input()
  public shownPages: number = 3;

  @Output()
  public onPageSelected: EventEmitter<number> = new EventEmitter();

  public pagesList: number[] = [];

  constructor() {
  }


  ngOnChanges(changes: SimpleChanges): void {
    this.selectPage(0);
  }

  selectPage(pageNo: number) {
    this.selectedPage = pageNo;
    let start = Math.floor(pageNo / this.shownPages) * this.shownPages;
    let end = Math.min(start + this.shownPages, this.totalPages);
    this.pagesList.splice(0, this.pagesList.length);
    for (let i = start; i < end; i++) {
      this.pagesList.push(i);
    }
  }

  pageClicked(pageNo: number) {
    this.selectPage(pageNo);
    this.onPageSelected.emit(pageNo);
  }

  nextPageClicked() {
    let nextPage = Math.min(this.selectedPage + 1, this.totalPages - 1);
    this.pageClicked(nextPage);
  }

  prevPageClicked() {
    let prevPage = Math.max(this.selectedPage - 1, 0);
    this.pageClicked(prevPage);
  }

}
