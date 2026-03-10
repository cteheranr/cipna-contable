import { Injectable, inject } from '@angular/core';
import { signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { addDoc, collection, collectionData, Firestore, orderBy, query } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Producto } from '../../shared/models/producto.model';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  private firestore: Firestore = inject(Firestore);

  private get collectionRef() {
    return collection(this.firestore, 'productos');
  }

  getProductos(): Observable<Producto[]> {
    const q = query(this.collectionRef, orderBy('nombre', 'asc'));

    return collectionData(q, { idField: 'id' }) as Observable<Producto[]>;
  }

  addProductos(producto: Producto) {
    return addDoc(this.collectionRef, producto);
  }
}
