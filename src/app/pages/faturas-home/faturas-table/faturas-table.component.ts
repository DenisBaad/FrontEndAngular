import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ItemFatura, ResponseFatura } from '../../../shared/models/interfaces/responses/faturas/ResponseFatura';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
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
import { ItemCliente } from '../../../shared/models/interfaces/responses/clientes/ResponseCliente';
import { ItemPlano } from '../../../shared/models/interfaces/responses/planos/ResponsePlano';

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
export class FaturasTableComponent {
  @Input() faturasDatas: ItemFatura[] | undefined;
  @Input() planosDatas: ItemPlano[] | undefined;
  @Input() clientesDatas: ItemCliente[] | undefined;
  @Input() isLoading = false;
  @Input() totalCount = 0;
  @Input() pageSize = 10;
  @Output() pageChange = new EventEmitter<PageEvent>();
  @Output() openFormEvent = new EventEmitter<any>();
  dataSource = new MatTableDataSource<ItemFatura>();
  displayedColumns: string[] = ['status', 'inicioVigencia', 'fimVigencia', 'valorTotal', 'planoId', 'clienteId', 'acoes'];

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

  onPage(event: PageEvent) {
    this.pageChange.emit(event);
  }

  openForm(fatura?: ResponseFatura) {
    this.openFormEvent.emit(fatura);
  }
}
