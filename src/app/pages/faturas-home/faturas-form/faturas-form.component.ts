import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { FormatarMoedaDirective } from '../../../shared/directives/formatarMoedaDirective';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ItemPlano } from '../../../shared/models/interfaces/responses/planos/ResponsePlano';
import { ItemCliente } from '../../../shared/models/interfaces/responses/clientes/ResponseCliente';
import { EnumStatusFatura } from '../../../shared/models/enums/enumStatusFatura';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-faturas-form',
  imports: [
    CommonModule,
    MatDialogModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    FlexLayoutModule,
    FormatarMoedaDirective,
    MatSelectModule,
    MatDatepickerModule,
    MatFormField,
    MatIconModule
  ],
  templateUrl: './faturas-form.component.html',
  styleUrl: './faturas-form.component.scss'
})
export class FaturasFormComponent implements OnInit {
  @Output() handleFormSubmit = new EventEmitter<any>();
  form!: FormGroup;
  planos: ItemPlano[] | undefined;
  clientes: ItemCliente[] | undefined;

  faturaStatusOptions = [
    { label: 'Aberto', value: EnumStatusFatura.Aberto },
    { label: 'Atrasado', value: EnumStatusFatura.Atrasado },
    { label: 'Pago', value: EnumStatusFatura.Pago },
  ];

  constructor(@Inject(MAT_DIALOG_DATA) public item: any, public dialogRef: MatDialogRef<FaturasFormComponent>, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.planos = this.item.planos ?? [];
    this.clientes = this.item.clientes ?? [];
    this.initialFormFatura();
  }

  initialFormFatura(){
    this.form = this.fb.group({
      status: ['', Validators.required],
      inicioVigencia: [null , [Validators.required]],
      fimVigencia: [null , [Validators.maxLength(40), Validators.required]],
      dataVencimento: [null , [Validators.required]],
      valorTotal: [null, [Validators.required]],
      planoId: ['', [Validators.required]],
      clienteId: ['', [Validators.required]],
      });
      if (this.item.fatura) {
        this.form.patchValue({
          status: this.item.fatura.status,
          inicioVigencia: this.item.fatura.inicioVigencia,
          fimVigencia: this.item.fatura.fimVigencia,
          dataVencimento: this.item.fatura.dataVencimento,
          valorTotal: this.item.fatura.valorTotal,
          planoId: this.item.fatura.planoId,
          clienteId: this.item.fatura.clienteId
        });
    }
  }

  onClearForm(): void {
    if (this.item.fatura) {
      this.form.patchValue({
        status: this.item.fatura.status,
        inicioVigencia: this.item.fatura.inicioVigencia,
        fimVigencia: this.item.fatura.fimVigencia,
        dataVencimento: this.item.fatura.dataVencimento,
        valorTotal: this.item.fatura.valorTotal,
        planoId: this.item.fatura.planoId,
        clienteId: this.item.fatura.clienteId
      });
    } else {
      this.form.reset();
    }
  }

  onSubmitForm(): void {
    if (this.form.valid) {
      const formValue = { ...this.form.value };

      this.handleFormSubmit.emit({ formValue, id: this.item.fatura?.id, dialogRef: this.dialogRef });
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
