import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appZeroinfront]'
})
export class ZeroinfrontDirective {

  constructor(private el: ElementRef) {}

  @HostListener('input')
  oninput(): void {
    const inputValue = this.el.nativeElement.value;
    const formattedValue = this.formatZeroInFront(inputValue);
    this.el.nativeElement.value = formattedValue;
  }

  formatZeroInFront(inputValue: string): string {
    if (inputValue.length === 1){
      return '0' + inputValue;
    }
    else if (inputValue.length > 2){
      return inputValue.substring(0, 2);
    }
    return inputValue;
  }

}
