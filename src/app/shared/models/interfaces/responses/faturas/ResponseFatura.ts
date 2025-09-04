import { EnumStatusFatura } from "../../../enums/enumStatusFatura";
import { ItemCliente } from "../clientes/ResponseCliente";
import { ItemPlano } from "../planos/ResponsePlano";

export interface ResponseFatura {
  items: ItemFatura[];
  totalCount: number;
}

export interface ItemFatura {
  id?: string;
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
  cliente: ItemCliente;
  plano: ItemPlano;
}

