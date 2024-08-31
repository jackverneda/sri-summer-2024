import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration',
})
export class DurationPipe implements PipeTransform {
  transform(value: string): string {
    let result = '';
    let comp = value.split(':');
    let hours = Number(comp[0]);
    let mins = Number(comp[1]);
    let secs = Number(comp[2]);
    return `${hours > 0 ? hours + 'h' : ''} ${mins > 0 ? mins + 'm' : ''} ${secs > 0 ? secs + 's' : ''}`;
  }
}
