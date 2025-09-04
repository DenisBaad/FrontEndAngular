import { Component, EventEmitter, Input, Output } from '@angular/core';
import { EnumTipoCliente } from '../../../shared/models/enums/enumTipoCliente';
import { EnumStatusCliente } from '../../../shared/models/enums/enumStatusCliente';
import { ItemCliente } from '../../../shared/models/interfaces/responses/clientes/ResponseCliente';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-clientes-table',
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
    MatSelectModule,
  ],
  templateUrl: './clientes-table.component.html',
  styleUrl: './clientes-table.component.scss'
})
export class ClientesTableComponent {
  @Input() clienteData: ItemCliente[] = [];
  @Input() isLoading = false;
  @Input() totalCount = 0;
  @Input() pageSize = 10;
  @Output() pageChange = new EventEmitter<PageEvent>();
  @Output() searchChange = new EventEmitter<string>();
  @Output() openFormEvent = new EventEmitter<any>();
  @Output() ativarInativarEvent = new EventEmitter<string>();
  EnumStatusCliente = EnumStatusCliente;
  displayedColumns: string[] = ['codigo', 'tipo', 'cpfCnpj', 'status', 'nome', 'identidade', 'orgaoExpedidor', 'dataNascimento', 'nomeFantasia', 'acoes'];
  dataSource = new MatTableDataSource<ItemCliente>();

  ngOnChanges() {
    this.dataSource.data = this.clienteData;
  }

  tipoCliente(tipo: EnumTipoCliente) {
    const tipos = {
      [EnumTipoCliente.Fisica]: 'Fisica',
      [EnumTipoCliente.Juridica]: 'Juridica'
    }
    return tipos [tipo]
  }

  statusCliente(status: EnumStatusCliente) {
    const statuss = {
      [EnumStatusCliente.Ativo]: 'Ativo',
      [EnumStatusCliente.Inativo]: 'Inativo'
    }
    return statuss [status]
  }

  onSearch(event: Event) {
    const target = event.target as HTMLInputElement;
    this.searchChange.emit(target.value);
  }

  onPage(event: PageEvent) {
    this.pageChange.emit(event);
  }

  openForm(plano?: ItemCliente) {
    this.openFormEvent.emit(plano);
  }

  ativarInativarCliente(id: string) {
    this.ativarInativarEvent.emit(id);
  }
}
