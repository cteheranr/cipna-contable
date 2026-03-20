import { Injectable, inject } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  doc,
  Firestore,
  orderBy,
  query,
  updateDoc,
  where,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Pedido, PedidoLibro, Producto } from '../../shared/models/producto.model';

@Injectable({
  providedIn: 'root',
})
export class PedidosLibrosService {
  private firestore: Firestore = inject(Firestore);

  private get collectionRef() {
    return collection(this.firestore, 'PedidosLibros');
  }

  getLibros(): Observable<Producto[]> {
    const ref = collection(this.firestore, 'productos');
    const q = query(
      ref,
      where('categoria', '==', 'Libro'),
      where('activo', '==', true),
      orderBy('nombre', 'asc'),
    );

    return collectionData(q, { idField: 'id' }) as Observable<Producto[]>;
  }

  addPedidoLibro(producto: PedidoLibro) {
    return addDoc(this.collectionRef, producto);
  }

  getPedidosLibros(): Observable<PedidoLibro[]> {
    const q = query(this.collectionRef, orderBy('fecha', 'asc'));

    return collectionData(q, { idField: 'id' }) as Observable<PedidoLibro[]>;
  }

//   async abonarPedido(pedido: Pedido) {
//     if (pedido.id) {
//       const ref = doc(this.firestore, 'PedidosUniformes', pedido.id);

//       await updateDoc(ref, {
//         abono: pedido.abono,
//         saldo: pedido.saldo,
//         estadoPago: pedido.estadoPago,
//         abonoTotal: pedido.abonoTotal,
//       });
//     }
//   }
}
