import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EmptyComponent } from "../../empty/empty.component";
import { LoaderComponent } from "../../loader/loader.component";

@Component({
  selector: 'app-table-list',
  standalone: true,
  imports: [EmptyComponent, LoaderComponent],
  templateUrl: './table-list.component.html',
  styleUrl: './table-list.component.css'
})
export class TableListComponent {
  @Input() title: string = '';
  @Input() data: any[] = [];
  @Input() columns: { key: string, label: string }[] = [];
  @Input() fetched = false;
  @Output() view = new EventEmitter<string>();
  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<string>();
}
