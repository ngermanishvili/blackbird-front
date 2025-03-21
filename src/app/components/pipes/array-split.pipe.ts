import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'splitArray',
    pure: true,
    standalone: true,
})
export class SplitArrayPipe implements PipeTransform {
    transform(value: string): any[] {
        return value ? value.split(', ').map(item => item.trim()) : [];
    }
}
