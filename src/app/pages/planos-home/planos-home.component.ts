import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ItemPlano } from '../../shared/models/interfaces/responses/planos/ResponsePlano';
import { PlanoService } from '../../services/plano.service';
import { PlanosTableComponent } from "./planos-table/planos-table.component";
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PlanosFormComponent } from './planos-form/planos-form.component';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-planos-home',
  imports: [PlanosTableComponent],
  templateUrl: './planos-home.component.html',
  styleUrl: './planos-home.component.scss'
})
export class PlanosHomeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  public planoData!: ItemPlano[] | undefined;
  public isLoading = true;
  public totalCount = 0;
  public pageNumber = 0;
  public pageSize = 10;
  public searchValue = '';

  constructor(private planosService: PlanoService, private snackBar: MatSnackBar, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.getPlanos();
  }

  getPlanos() {
    this.isLoading = true;

    this.planosService.Get(this.pageNumber + 1, this.pageSize, this.searchValue)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.planoData = response.items;
          this.totalCount = response.totalCount;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Erro ao buscar planos', err);
          this.isLoading = false;
        }
      });
  }

  onPageChange(event: PageEvent) {
    this.pageNumber = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getPlanos();
  }

  onSearch(value: string) {
    this.searchValue = value;
    this.pageNumber = 0;
    this.getPlanos();
  }

  handlePlanoEvent(plano?: ItemPlano) {
    const dialogRef = this.dialog.open(PlanosFormComponent, {
      width: '80%',
      data: plano ? { plano } : {}
    });

    dialogRef.componentInstance.handleFormSubmit
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => this.handleFormSubmit(data));
  }

  handleFormSubmit({ formValue, id, dialogRef }: { formValue: any; id?: string; dialogRef?: MatDialogRef<any>; }) {
    if (id) {
      this.planosService.Put(formValue, id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.snackBar.open('Plano editado com sucesso!', 'Fechar', { duration: 3000 });
            this.getPlanos();
            if (dialogRef) dialogRef.close();
          },
          error: (err) => {
            const message = this.getErrorMessage(err);
            this.snackBar.open(message, 'Fechar', { duration: 5000 });
          }
        });
    } else {
      this.planosService.Post(formValue)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.snackBar.open('Plano cadastrado com sucesso!', 'Fechar', { duration: 3000 });
            this.getPlanos();
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


