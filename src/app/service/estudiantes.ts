import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Estudiante } from '../shared/models/estudiantes.model';
import { Firestore, collection, addDoc, collectionData, doc, getDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class EstudiantesService {
  constructor(private firestore: Firestore) {}

  getStudens(): Observable<Estudiante[]> {
    const studentsRef = collection(this.firestore, 'estudiantes');
    return collectionData(studentsRef, { idField: 'id' }) as Observable<Estudiante[]>;
  }
}
