import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ResponsePlano } from '../../shared/models/interfaces/responses/planos/ResponsePlano';
import { PlanoService } from '../../services/plano.service';
import { PlanosTableComponent } from "./planos-table/planos-table.component";
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PlanosFormComponent } from './planos-form/planos-form.component';

@Component({
  selector: 'app-planos-home',
  imports: [PlanosTableComponent],
  templateUrl: './planos-home.component.html',
  styleUrl: './planos-home.component.scss'
})
export class PlanosHomeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  public planoData!: ResponsePlano[] | undefined;
  public isLoading = true;

  constructor(private planosService: PlanoService, private snackBar: MatSnackBar, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.getPlanos();
  }

  getPlanos() {
    this.isLoading = true;

    this.planosService.Get()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (response) => {
        this.planoData = response;
        this.isLoading = false;
      },
      error: (err) => {
          console.error('Erro ao buscar planos', err);
          this.isLoading = false;
        }
    })
  }

  handlePlanoEvent(plano?: ResponsePlano) {
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


