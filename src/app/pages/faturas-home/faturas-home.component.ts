import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ItemFatura } from '../../shared/models/interfaces/responses/faturas/ResponseFatura';
import { FaturaService } from '../../services/fatura.service';
import { ItemPlano } from '../../shared/models/interfaces/responses/planos/ResponsePlano';
import { ItemCliente } from '../../shared/models/interfaces/responses/clientes/ResponseCliente';
import { ClientesService } from '../../services/clientes.service';
import { PlanoService } from '../../services/plano.service';
import { FaturasTableComponent } from './faturas-table/faturas-table.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FaturasFormComponent } from './faturas-form/faturas-form.component';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-faturas-home',
  imports: [FaturasTableComponent],
  templateUrl: './faturas-home.component.html',
  styleUrl: './faturas-home.component.scss'
})
export class FaturasHomeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  public faturasDatas: ItemFatura[] = [];
  public isLoading = true;
  public planosDatas: ItemPlano[] = [];
  public clientesDatas: ItemCliente[] = [];
  public totalCount = 0;
  public pageNumber = 0;
  public pageSize = 10;

  constructor(private faturaService: FaturaService, private planoService: PlanoService, private clienteService: ClientesService, private snackBar: MatSnackBar, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.getPlanos();
    this.getClientes();
    this.getFaturas();
  }

  public getPlanos(): void {
    this.planoService.Get(1, 1000000, '')
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) => {
      this.planosDatas = response.items;
    },
    error: (err) => {
      console.error('Erro ao buscar planos', err);
      }
    })
  }

  public getClientes(): void {
    this.clienteService.getClientes(1, 1000000, '')
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) => {
      this.clientesDatas = response.items;
      },
      error: (err) => {
        console.error('Erro ao buscar clientes', err);
      }
    })
  }

  getFaturas(): void {
    this.isLoading = true;

    this.faturaService.Get(this.pageNumber + 1, this.pageSize)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) => {
      this.faturasDatas = response.items;
      this.totalCount = response.totalCount;
      this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao buscar faturas', err);
        this.isLoading = false;
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.pageNumber = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getPlanos();
  }

  handleFaturaEvent(fatura?: ItemFatura) {
    const dialogRef = this.dialog.open(FaturasFormComponent, {
      width: '80%',
       data: fatura
      ? { fatura, planos: this.planosDatas, clientes: this.clientesDatas }
      : { planos: this.planosDatas, clientes: this.clientesDatas }
    });

    dialogRef.componentInstance.handleFormSubmit
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => this.handleFormSubmit(data));
  }

  handleFormSubmit({ formValue, id, dialogRef }: { formValue: any; id?: string; dialogRef?: MatDialogRef<any>; }) {
    if (id) {
      this.faturaService.Put(formValue, id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.snackBar.open('Fatura editada com sucesso!', 'Fechar', { duration: 3000 });
            this.getFaturas();
            if (dialogRef) dialogRef.close();
          },
          error: (err) => {
            const message = this.getErrorMessage(err);
            this.snackBar.open(message, 'Fechar', { duration: 5000 });
          }
        });
    } else {
      this.faturaService.Post(formValue)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.snackBar.open('Fatura cadastrada com sucesso!', 'Fechar', { duration: 3000 });
            this.getFaturas();
            if (dialogRef) dialogRef.close();
          },
          error: (err) => {
            const message = this.getErrorMessage(err);
            this.snackBar.open(message, 'Fechar', { duration: 5000 });
          }
        });
      }
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
