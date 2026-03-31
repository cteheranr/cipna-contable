import { Injectable, inject, signal } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query, // Importante añadir query
  CollectionReference,
} from '@angular/fire/firestore';
import { map, Observable, of } from 'rxjs';
import { Estudiante } from '../shared/models/estudiantes.model';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private firestore: Firestore = inject(Firestore);

  private get collectionRef() {
    return collection(this.firestore, 'estudiantes');
  }

  getStudents(): Observable<Estudiante[]> {
    return collectionData(this.collectionRef, { idField: 'id' }) as Observable<Estudiante[]>;
  }

  addStudent(estudiante: Estudiante) {
    return addDoc(this.collectionRef, estudiante);
  }

  updateStudent(id: string, estudiante: Partial<Estudiante>) {
    const studentDocRef = doc(this.firestore, `estudiantes/${id}`);
    return updateDoc(studentDocRef, estudiante);
  }

  deleteStudent(id: string) {
    const studentDocRef = doc(this.firestore, `estudiantes/${id}`);
    return deleteDoc(studentDocRef);
  }

  search(termino: string): Observable<Estudiante[]> {
    if (!termino.trim() || termino.length < 3) {
      return of([]); // Retorna array vacío si la búsqueda es muy corta
    }

    const termLower = termino.toLowerCase();


    return collectionData(this.collectionRef, { idField: 'id' }).pipe(
      map(
        (students: any[]) =>
          students
            .filter(
              (s) =>
                s.nombres.toLowerCase().includes(termLower) ||
                s.apellidos.toLowerCase().includes(termLower) ||
                s.numeroDocumento.includes(termino),
            )
            .slice(0, 10),
      ),
    );
  }
}
