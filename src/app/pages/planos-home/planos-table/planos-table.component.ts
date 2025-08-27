import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormatoMoedaPipe } from '../../../shared/pipes/formato-moeda.pipe';
import { ResponsePlano } from '../../../shared/models/interfaces/responses/planos/ResponsePlano';

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
export class PlanosTableComponent implements AfterViewInit {
  @Input() planoData: ResponsePlano[] | undefined;
  @Input() isLoading = false;
  @Output() openFormEvent = new EventEmitter<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  dataSource = new MatTableDataSource<ResponsePlano>();
  displayedColumns: string[] = ['descricao', 'valorPlano', 'quantidadeUsuarios', 'vigenciaMeses', 'acoes'];

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges() {
    if (this.planoData) {
      this.dataSource.data = this.planoData;
    }
  }

  search(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value.trim().toLowerCase();

    this.dataSource.data = this.planoData?.filter(plano => plano.descricao.trim().toLowerCase().includes(value)) || []
  }

  openForm(plano?: ResponsePlano) {
    this.openFormEvent.emit(plano);
  }
}
