'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@nyvora/ui/components/ui/card';
import { Button } from '@nyvora/ui/components/ui/button';
import { Badge } from '@nyvora/ui/components/ui/badge';
import { Input } from '@nyvora/ui/components/ui/input';
import { Label } from '@nyvora/ui/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@nyvora/ui/components/ui/select';
import { AlertTriangle, Package, ArrowDown, ArrowUp } from 'lucide-react';
import { useProducts, useWarehouses, useUpdateStock } from '@/lib/hooks';
import { api } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

export default function StockPage() {
  const [selectedProduct, setSelectedProduct] = React.useState('');
  const [selectedWarehouse, setSelectedWarehouse] = React.useState('');
  const [quantity, setQuantity] = React.useState('');
  const [movementType, setMovementType] = React.useState('in');
  const [reason, setReason] = React.useState('');

  const { data: productsData, isLoading: productsLoading } = useProducts({ limit: 100 });
  const { data: warehousesData } = useWarehouses();
  const updateStockMutation = useUpdateStock();

  const products = productsData?.products || productsData?.data || [];
  const warehouses = warehousesData?.warehouses || warehousesData?.data || [];

  // Fetch low stock products
  const { data: lowStockData } = useQuery({
    queryKey: ['low-stock'],
    queryFn: () => api.get<any>('/inventory/stock/low'),
  });
  const lowStockProducts = lowStockData?.data || [];

  const handleMovement = async () => {
    if (!selectedProduct || !selectedWarehouse || !quantity) return;

    await updateStockMutation.mutateAsync({
      productId: selectedProduct,
      warehouseId: selectedWarehouse,
      quantity: Number(quantity),
      type: movementType,
      reason: reason || undefined,
    });

    setQuantity('');
    setReason('');
  };

  if (productsLoading) {
    return <div className="text-muted-foreground">Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Gestión de Stock</h2>
        <p className="text-sm text-muted-foreground">
          Administra el inventario de productos
        </p>
      </div>

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
          <CardHeader className="flex flex-row items-center gap-2 pb-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <CardTitle className="text-orange-600 text-base">
              Stock Bajo ({lowStockProducts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStockProducts.slice(0, 5).map((item: any) => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <span>{item.product?.name || item.productId}</span>
                  <Badge variant="outline" className="text-orange-600">
                    {item.quantity} / {item.minimumQuantity} mín
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Movement Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Registrar Movimiento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Producto</Label>
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar producto..." />
                </SelectTrigger>
                <SelectContent>
                  {products.map((p: any) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} ({p.sku})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Almacén</Label>
              <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar almacén..." />
                </SelectTrigger>
                <SelectContent>
                  {warehouses.map((w: any) => (
                    <SelectItem key={w.id} value={w.id}>
                      {w.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select value={movementType} onValueChange={setMovementType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in">
                    <span className="flex items-center gap-2">
                      <ArrowDown className="h-4 w-4 text-green-600" />
                      Entrada
                    </span>
                  </SelectItem>
                  <SelectItem value="out">
                    <span className="flex items-center gap-2">
                      <ArrowUp className="h-4 w-4 text-red-600" />
                      Salida
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Cantidad</Label>
              <Input
                type="number"
                placeholder="0"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label>Razón (opcional)</Label>
              <Input
                placeholder="Ej: Compra, Venta, Ajuste..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>
          </div>

          <Button
            onClick={handleMovement}
            disabled={!selectedProduct || !selectedWarehouse || !quantity || updateStockMutation.isPending}
          >
            <Package className="mr-2 h-4 w-4" />
            {updateStockMutation.isPending ? 'Registrando...' : 'Registrar Movimiento'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
