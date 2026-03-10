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
import { Observable } from 'rxjs';
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

}


