import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ClientesService } from '../../services/clientes.service';
import { ItemCliente } from '../../shared/models/interfaces/responses/clientes/ResponseCliente';
import { ClientesTableComponent } from './clientes-table/clientes-table.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ClientesFormComponent } from './clientes-form/clientes-form.component';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-clientes-home',
  imports: [ClientesTableComponent],
  templateUrl: './clientes-home.component.html',
  styleUrls: ['./clientes-home.component.scss'],
})
export class ClientesHomeComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  clienteData: ItemCliente[] = [];
  public isLoading = true;
  public totalCount = 0;
  public pageNumber = 0;
  public pageSize = 10;
  public searchValue = '';

  constructor(private clientesService: ClientesService, private snackBar: MatSnackBar, private dialog: MatDialog){}

  ngOnInit(): void {
    this.getClientes();
  }

  getClientes() {
    this.isLoading = true;

    this.clientesService.getClientes(this.pageNumber + 1, this.pageSize, this.searchValue)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) => {
        this.clienteData = response.items;
        this.totalCount = response.totalCount;
        this.isLoading = false;
      },
      error: (err) => {
          console.error('Erro ao buscar clientes', err);
          this.isLoading = false;
        }
    })
  }

  onPageChange(event: PageEvent) {
    this.pageNumber = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getClientes();
  }

  onSearch(value: string) {
    this.searchValue = value;
    this.pageNumber = 0;
    this.getClientes();
  }

  handleClienteEvent(cliente?: ItemCliente) {
    const dialogRef = this.dialog.open(ClientesFormComponent, {
      width: '80%',
      data: cliente ? { cliente } : {}
    });

    dialogRef.componentInstance.handleFormSubmit
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => this.handleFormSubmit(data));
  }

  handleFormSubmit({ formValue, id, dialogRef }: { formValue: any; id?: string; dialogRef?: MatDialogRef<any>; }) {
    if (id) {
      this.clientesService.putCliente(id, formValue)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.snackBar.open('cliente editado com sucesso!', 'Fechar', { duration: 3000 });
            this.getClientes();
            if (dialogRef) dialogRef.close();
          },
          error: (err) => {
            const message = this.getErrorMessage(err);
            this.snackBar.open(message, 'Fechar', { duration: 5000 });
          }
        });
    } else {
      this.clientesService.postCliente(formValue)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.snackBar.open('Cliente cadastrado com sucesso!', 'Fechar', { duration: 3000 });
            this.getClientes();
            if (dialogRef) dialogRef.close();
          },
          error: (err) => {
            const message = this.getErrorMessage(err);
            this.snackBar.open(message, 'Fechar', { duration: 5000 });
          }
        });
      }
  }

  handleAtivarInativar(id: string) {
    this.clientesService.ativarInativarCliente(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.snackBar.open('Status do cliente alterado com sucesso!', 'Sucesso', { duration: 2000 });
          this.getClientes();
        },
        error: () => this.snackBar.open('Erro ao alterar cliente!', 'Erro', { duration: 2000 })
      });
  }

  private getErrorMessage(err: any): string {
    const lista = err?.error?.messages?.map((el: string) => `* ${el}`).join('\n');
    return lista ? `Erros encontrados:\n${lista}` : 'Erro desconhecido. Detalhes indisponíveis.';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
