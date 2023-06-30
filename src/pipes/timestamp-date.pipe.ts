import { Pipe, PipeTransform } from '@angular/core';
import firebase from 'firebase/compat/app';
import 'firebase/firestore';

@Pipe({
  name: 'timestampDate'
})
export class TimestampDatePipe implements PipeTransform {
  transform(timestamp: firebase.firestore.Timestamp): string {
    const date = timestamp.toDate();
    return date.toLocaleDateString(); // Puedes usar otros métodos para formatear la fecha según tus necesidades
  }
}