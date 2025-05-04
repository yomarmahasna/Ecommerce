import { Component, Input } from '@angular/core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [NgxDatatableModule ],
  templateUrl: './data-table.component.html'
})
export class DataTableComponent {
  @Input() rows: any[] = [];
  @Input() columns: { prop: string, name: string }[] = [];
  @Input() pageSize = 15;
}
