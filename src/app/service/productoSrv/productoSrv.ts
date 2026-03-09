import { Injectable, inject } from '@angular/core';
import { signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { addDoc, collection, collectionData, Firestore } from '@angular/fire/firestore';
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
    console.log("entro");
    return collectionData(this.collectionRef, { idField: 'id' }) as Observable<Producto[]>;
  }

  addProductos(producto: Producto) {
    return addDoc(this.collectionRef, producto);
  }
}
