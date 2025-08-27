import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { EnumTipoCliente } from '../../../shared/models/enums/enumTipoCliente';
import { EnumStatusCliente } from '../../../shared/models/enums/enumStatusCliente';
import { ResponseCliente } from '../../../shared/models/interfaces/responses/clientes/ResponseCliente';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
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
export class ClientesTableComponent implements AfterViewInit {
  @Input() clienteData: ResponseCliente[] | undefined;
  @Input() isLoading = false;
  @Output() openFormEvent = new EventEmitter<any>();
  @Output() ativarInativarEvent = new EventEmitter<string>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  EnumStatusCliente = EnumStatusCliente;
  displayedColumns: string[] = ['codigo', 'tipo', 'cpfCnpj', 'status', 'nome', 'identidade', 'orgaoExpedidor', 'dataNascimento', 'nomeFantasia', 'acoes'];
  dataSource = new MatTableDataSource<ResponseCliente>();

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnChanges() {
    if (this.clienteData) {
      this.dataSource.data = this.clienteData;
    }
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

  search(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value.trim().toLowerCase();

    this.dataSource.data = this.clienteData?.filter(cliente => cliente.nome.trim().toLowerCase().includes(value)) || []
  }

  openForm(plano?: ResponseCliente) {
    this.openFormEvent.emit(plano);
  }

  ativarInativarCliente(id: string) {
    this.ativarInativarEvent.emit(id);
  }
}
