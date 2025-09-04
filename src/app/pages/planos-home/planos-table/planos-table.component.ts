import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormatoMoedaPipe } from '../../../shared/pipes/formato-moeda.pipe';
import { ItemPlano } from '../../../shared/models/interfaces/responses/planos/ResponsePlano';

@Component({
  selector: 'app-planos-table',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatTableModule,
    MatInputModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatPaginatorModule,
    MatCardModule,
    FormatoMoedaPipe
  ],
  templateUrl: './planos-table.component.html',
  styleUrl: './planos-table.component.scss'
})
export class PlanosTableComponent {
  @Input() planoData: ItemPlano[] = [];
  @Input() isLoading = false;
  @Input() totalCount = 0;
  @Input() pageSize = 10;
  @Output() pageChange = new EventEmitter<PageEvent>();
  @Output() searchChange = new EventEmitter<string>();
  @Output() openFormEvent = new EventEmitter<any>();
  dataSource = new MatTableDataSource<ItemPlano>();
  displayedColumns: string[] = ['descricao', 'valorPlano', 'quantidadeUsuarios', 'vigenciaMeses', 'acoes'];

  ngOnChanges() {
    this.dataSource.data = this.planoData;
  }

  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchChange.emit(target.value);
  }

  onPage(event: PageEvent) {
    this.pageChange.emit(event);
  }

  openForm(plano?: ItemPlano) {
    this.openFormEvent.emit(plano);
  }
}
