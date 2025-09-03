import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ResponseFatura } from '../../../shared/models/interfaces/responses/faturas/ResponseFatura';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { EnumStatusFatura } from '../../../shared/models/enums/enumStatusFatura';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { FormatoMoedaPipe } from '../../../shared/pipes/formato-moeda.pipe';
import { ResponseCliente } from '../../../shared/models/interfaces/responses/clientes/ResponseCliente';
import { ResponsePlano } from '../../../shared/models/interfaces/responses/planos/ResponsePlano';

@Component({
  selector: 'app-faturas-table',
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
  templateUrl: './faturas-table.component.html',
  styleUrl: './faturas-table.component.scss'
})
export class FaturasTableComponent implements AfterViewInit {
  @Input() faturasDatas: ResponseFatura[] | undefined;
  @Input() planosDatas: ResponsePlano[] | undefined;
  @Input() clientesDatas: ResponseCliente[] | undefined;
  @Input() isLoading = false;
  @Output() openFormEvent = new EventEmitter<any>();
  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  dataSource = new MatTableDataSource<ResponseFatura>();
  displayedColumns: string[] = ['status', 'inicioVigencia', 'fimVigencia', 'valorTotal', 'planoId', 'clienteId', 'acoes'];

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges() {
    if (this.faturasDatas) {
      this.dataSource.data = this.faturasDatas;
    }
  }

  statusFatura(status: EnumStatusFatura) {
    const statuss = {
      [EnumStatusFatura.Aberto]: 'Aberto',
      [EnumStatusFatura.Atrasado]: 'Atrasado',
      [EnumStatusFatura.Pago]: 'Pago'
    }
    return statuss [status]
  }

  search(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value.trim().toLowerCase();

    this.dataSource.data = this.faturasDatas?.filter(fatura => {
      const nomeCliente = this.getNomeCliente(fatura.clienteId).toLowerCase();
      return nomeCliente.includes(value);
    }) || [];
  }

  public getPlanoDescricao(planoId: string): string {
    return this.planosDatas?.find(cat => cat.id === planoId)?.descricao ?? 'Plano não encontrado';
  }

  public getNomeCliente(clienteId: string): string {
    return this.clientesDatas?.find(cat => cat.id === clienteId)?.nome ?? 'Cliente não encontrado';
  }

  openForm(fatura?: ResponseFatura) {
    this.openFormEvent.emit(fatura);
  }
}
