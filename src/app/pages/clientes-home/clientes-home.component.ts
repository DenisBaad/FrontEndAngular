import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ClientesService } from '../../services/clientes.service';
import { ResponseCliente } from '../../shared/models/interfaces/responses/clientes/ResponseCliente';
import { ClientesTableComponent } from './clientes-table/clientes-table.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ClientesFormComponent } from './clientes-form/clientes-form.component';

@Component({
  selector: 'app-clientes-home',
  imports: [ClientesTableComponent],
  templateUrl: './clientes-home.component.html',
  styleUrls: ['./clientes-home.component.scss'],
})
export class ClientesHomeComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();
  clienteData: ResponseCliente[] | undefined;
  public isLoading = true;

  constructor(private clientesService: ClientesService, private snackBar: MatSnackBar, private dialog: MatDialog){}

  ngOnInit(): void {
    this.getClientes();
  }

  getClientes() {
    this.isLoading = true;

    this.clientesService.getClientes()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) => {
        this.clienteData = response;
        this.isLoading = false;
      },
      error: (err) => {
          console.error('Erro ao buscar clientes', err);
          this.isLoading = false;
        }
    })
  }

  handleClienteEvent(cliente?: ResponseCliente) {
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
    if (err?.error?.errors && Array.isArray(err.error.errors)) {
      const lista = err.error.errors.map((el: string) => `* ${el}`).join('\n');
      return 'Erros encontrados:\n' + lista;
    } else if (err?.error?.errors) {
      return err.error.errors;
    }
    return 'Erro desconhecido. Detalhes indisponíveis.';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
