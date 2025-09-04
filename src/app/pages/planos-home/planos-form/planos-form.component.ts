import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormatarMoedaDirective } from '../../../shared/directives/formatarMoedaDirective';

@Component({
  selector: 'app-planos-form',
  imports: [
    CommonModule,
    MatDialogModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    FlexLayoutModule,
    FormatarMoedaDirective,
  ],
  templateUrl: './planos-form.component.html',
  styleUrl: './planos-form.component.scss'
})
export class PlanosFormComponent implements OnInit {
  @Output() handleFormSubmit = new EventEmitter<any>();
  private readonly destroy$: Subject<void> = new Subject<void>();
  form!: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public item: any, public dialogRef: MatDialogRef<PlanosFormComponent>, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.formPlano();
  }

  formPlano() {
    const plano = this.item?.plano ?? {};

    this.form = this.fb.group({
      descricao: [plano.descricao ?? '', Validators.required],
      valorPlano: [plano.valorPlano ?? null, [Validators.required, Validators.maxLength(40)]],
      quantidadeUsuarios: [plano.quantidadeUsuarios ?? null, [Validators.required, Validators.maxLength(40)]],
      vigenciaMeses: [plano.vigenciaMeses ?? null, Validators.required],
    });
  }

  onClearForm(): void {
    if (this.item.plano) {
      this.form.patchValue({
        descricao: this.item.plano.descricao,
        valorPlano: this.item.plano.valorPlano,
        quantidadeUsuarios: this.item.plano.quantidadeUsuarios,
        vigenciaMeses: this.item.plano.vigenciaMeses,
      });
    } else {
      this.form.reset();
    }
  }

  onSubmitForm(): void {
    if (this.form.valid) {
      const formValue = { ...this.form.value };

      this.handleFormSubmit.emit({ formValue, id: this.item.plano?.id, dialogRef: this.dialogRef });
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
