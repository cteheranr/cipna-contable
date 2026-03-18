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
import { Pedido, Producto } from '../../shared/models/producto.model';

@Injectable({
  providedIn: 'root',
})
export class PedidosService {
  private firestore: Firestore = inject(Firestore);

  private get collectionRef() {
    return collection(this.firestore, 'PedidosUniformes');
  }

  getUniformes(): Observable<Producto[]> {
    const ref = collection(this.firestore, 'productos');
    const q = query(
      ref,
      where('categoria', '==', 'Uniforme'),
      where('activo', '==', true),
      orderBy('nombre', 'asc'),
    );

    return collectionData(q, { idField: 'id' }) as Observable<Producto[]>;
  }

  addPedidoUniforme(producto: Pedido) {
    return addDoc(this.collectionRef, producto);
  }

  getPedidos(): Observable<Pedido[]> {
    const q = query(this.collectionRef, orderBy('fecha', 'asc'));

    return collectionData(q, { idField: 'id' }) as Observable<Pedido[]>;
  }

  async abonarPedido(pedido: Pedido) {
    if (pedido.id) {
      const ref = doc(this.firestore, 'PedidosUniformes', pedido.id);

      await updateDoc(ref, {
        abono: pedido.abono,
        saldo: pedido.saldo,
        estadoPago: pedido.estadoPago,
        abonoTotal: pedido.abonoTotal,
      });
    }
  }
}
