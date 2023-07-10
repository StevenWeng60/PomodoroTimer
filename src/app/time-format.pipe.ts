import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeFormat'
})

export class TimeFormatPipe implements PipeTransform {

  transform(value: number): unknown {
    let minutes = (Math.floor(value / 60));
    let seconds = (value % 60)

    let stringMinutes: string = minutes.toString();
    let stringSeconds: string = seconds.toString();
    if(minutes < 10) {
      stringMinutes = '0' + minutes;
    }
    if(seconds < 10) {
      stringSeconds = '0' + seconds;
    }

    return `${stringMinutes}:${stringSeconds}`;
  }

}
