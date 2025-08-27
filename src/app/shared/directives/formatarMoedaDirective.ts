import { Directive, ElementRef, HostListener, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';
@Directive({
    selector: '[appFormatarMoeda]',
})
export class FormatarMoedaDirective implements OnInit {
  constructor(private el: ElementRef, private control: NgControl) {}

  ngOnInit() {
    const initialValue = this.control?.control?.value;
    if (initialValue != null) {
      this.format(initialValue.toString(), true); 
    }
  }

  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    this.format(value, false);
  }

  private format(value: string, isInit: boolean): void {
    let digits = value.replace(/\D/g, '');
    if (!digits) {
      this.el.nativeElement.value = '';
      this.control?.control?.setValue(null, { emitEvent: false });
      return;
    }

    let numberValue: number;
    if (isInit) {
      numberValue = parseFloat(digits);
    } else {
      numberValue = parseInt(digits, 10) / 100;
    }

    this.control?.control?.setValue(numberValue, { emitEvent: false });

    const formattedValue = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(numberValue);
    this.el.nativeElement.value = formattedValue;

    this.el.nativeElement.setSelectionRange(this.el.nativeElement.value.length, this.el.nativeElement.value.length);
  }
}

