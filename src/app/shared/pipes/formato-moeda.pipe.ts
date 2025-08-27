import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatoMoeda'
})
export class FormatoMoedaPipe implements PipeTransform {
  transform(value: number | string): string {
    if (value == null) return '';
    const numberValue = typeof value === 'string' ? parseFloat(value.replace(',', '.')) : value;
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(numberValue);
  }
}
