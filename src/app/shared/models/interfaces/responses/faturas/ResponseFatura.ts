import { EnumStatusFatura } from "../../../enums/enumStatusFatura";

export interface ResponseFatura {
  _id?: string;
  clienteId: string;
  planoId: string;
  status: EnumStatusFatura;
  inicioVigencia: Date;
  fimVigencia: Date;
  dataPagamento: Date;
  dataVencimento: Date;
  valorTotal: number;
  valorDesconto: number;
  valorPagamento: number;
}

