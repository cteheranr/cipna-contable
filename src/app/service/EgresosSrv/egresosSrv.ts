import { Injectable, inject, signal } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  CollectionReference,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Egresos } from '../../shared/models/egresos.model';

@Injectable({
  providedIn: 'root',
})
export class EgresosService {
  
  private firestore: Firestore = inject(Firestore);

  private get collectionRef() {
    return collection(this.firestore, 'egresos');
  }

  getEgresos(): Observable<Egresos[]> {
    return collectionData(this.collectionRef, { idField: 'id' }) as Observable<Egresos[]>;
  }

  addEgresos(egreso: Egresos) {
    return addDoc(this.collectionRef, egreso);
  }

}


