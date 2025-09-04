import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { EnumTipoCliente } from '../../../shared/models/enums/enumTipoCliente';
import { EnumStatusCliente } from '../../../shared/models/enums/enumStatusCliente';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-clientes-form',
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatDialogModule,
    MatSelectModule,
    MatFormField,
    MatTooltipModule,
    MatDatepickerModule,
    NgxMaskDirective
  ],
  templateUrl: './clientes-form.component.html',
  styleUrl: './clientes-form.component.scss'
})
export class ClientesFormComponent implements OnInit {
  @Output() handleFormSubmit = new EventEmitter<any>();
  private readonly destroy$: Subject<void> = new Subject();
  clienteForm!: FormGroup;
  mask: string | false | null = null;

  clienteTipo = [
    { label: 'Fisica', value: EnumTipoCliente.Fisica },
    { label: 'Juridica', value: EnumTipoCliente.Juridica }
  ]

  clienteStatus = [
    { label: 'Ativo', value: EnumStatusCliente.Ativo},
    { label: 'Inativo', value: EnumStatusCliente.Inativo},
  ]

  constructor(private fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public item: any, public dialogRef: MatDialogRef<ClientesFormComponent>) {}

  ngOnInit(): void {
    this.formCliente();
  }

  formCliente() {
    const cliente = this.item?.cliente ?? {};

    this.clienteForm = this.fb.group({
      codigo: [cliente.codigo ?? null, Validators.required],
      tipo: [cliente.tipo ?? null, Validators.required],
      cpfCnpj: [cliente.cpfCnpj ?? null, Validators.required],
      status: [cliente.status ?? EnumStatusCliente.Ativo, Validators.required],
      nome: [cliente.nome ?? null, Validators.required],
      identidade: [cliente.identidade ?? null],
      orgaoExpedidor: [cliente.orgaoExpedidor ?? null],
      dataNascimento: [cliente.dataNascimento ?? '', Validators.required],
      nomeFantasia: [cliente.nomeFantasia ?? null],
      contato: [cliente.contato ?? null, Validators.required],
    });
  }

  buttonResetOrCharge(){
    if (this.item.cliente) {
      this.clienteForm.patchValue({
        codigo: this.item.cliente.codigo,
        tipo: this.item.cliente.tipo,
        cpfCnpj: this.item.cliente.cpfCnpj,
        status: this.item.cliente.status,
        nome: this.item.cliente.nome,
        identidade: this.item.cliente.identidade,
        orgaoExpedidor: this.item.cliente.orgaoExpedidor,
        dataNascimento: this.item.cliente.dataNascimento,
        nomeFantasia: this.item.cliente.nomeFantasia,
        contato: this.item.cliente.contato
      })
    } else {
      this.clienteForm.reset();
    }
  }

  onSubmitForm() {
    if (this.clienteForm.valid) {
      const formValue = { ...this.clienteForm.value };

      if (formValue.contato && /^\d+$/.test(formValue.contato.replace(/\s/g, ''))) {
        formValue.contato = formValue.contato.replace(/\D/g, '');
      }

      this.handleFormSubmit.emit({ formValue, id: this.item.cliente?.id, dialogRef: this.dialogRef });
    }
  }

  onContatoInput() {
    const valor = this.clienteForm.get('contato')?.value || '';

    if (/^\d/.test(valor)) {
      this.mask = '(00) 00000-0000';
    } else {
      this.mask = null;
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
