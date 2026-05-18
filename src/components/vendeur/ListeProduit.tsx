'use client';
import { Avatar, Button, Chip, Table, cn } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useMemo, useState } from 'react';
import type { SortDescriptor } from 'react-aria-components';
import { EditProductForm } from './EditProductForm';
import { DeleteConfirmDialog } from './deleteForm';

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  status: 'actif' | 'archive' | 'en_attente';
  imageUrl?: string;
}

interface ListeProduitProps {
  sellerId?: string;
}

const MOCK_PRODUCTS: Product[] = [
  { id: 1, title: 'Produit A', price: 99, description: 'Description du produit A', status: 'actif' },
  { id: 2, title: 'Produit B', price: 149, description: 'Description du produit B', status: 'actif' },
  { id: 3, title: 'Produit C', price: 299, description: 'Description du produit C', status: 'en_attente' },
  { id: 4, title: 'Produit D', price: 49, description: 'Description du produit D', status: 'archive' },
  { id: 5, title: 'Produit E', price: 199, description: 'Description du produit E', status: 'actif' },
];

function SortableColumnHeader({
  children,
  sortDirection,
}: {
  children: React.ReactNode;
  sortDirection?: 'ascending' | 'descending';
}) {
  return (
    <span className="flex items-center justify-between">
      {children}
      {!!sortDirection && (
        <Icon
          icon="gravity-ui:chevron-up"
          className={cn(
            'size-3 transform transition-transform duration-100 ease-out',
            sortDirection === 'descending' ? 'rotate-180' : ''
          )}
        />
      )}
    </span>
  );
}

const STATUS_MAP: Record<Product['status'], { label: string; color: 'success' | 'default' | 'warning' }> = {
  actif: { label: 'Actif', color: 'success' },
  archive: { label: 'Archivé', color: 'default' },
  en_attente: { label: 'En attente', color: 'warning' },
};

export function ListeProduit({ sellerId }: ListeProduitProps) {
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'title',
    direction: 'ascending',
  });
  const [page, setPage] = useState(1);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<{ id: number; title: string } | null>(null);
  const itemsPerPage = 5;

  const products = MOCK_PRODUCTS;

  const sortedProducts = useMemo(() => {
    const sortCol = String(sortDescriptor.column ?? 'title') as 'title' | 'price';
    return [...products].sort((a, b) => {
      const first = a[sortCol];
      const second = b[sortCol];
      let cmp: number;
      if (typeof first === 'number' && typeof second === 'number') {
        cmp = first - second;
      } else {
        cmp = String(first).localeCompare(String(second));
      }
      if (sortDescriptor.direction === 'descending') {
        cmp *= -1;
      }
      return cmp;
    });
  }, [products, sortDescriptor]);

  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return sortedProducts.slice(start, start + itemsPerPage);
  }, [sortedProducts, page]);

  const handleDelete = () => {
    setDeletingProduct(null);
  };

  const handleSave = (id: number, data: { title: string; price: number; description: string; imageUrl?: string }) => {
    console.log('Save product:', id, data);
  };

  return (
    <>
      <Table>
        <Table.ScrollContainer>
          <Table.Content aria-label="Table des produits" className="min-w-225" onSortChange={setSortDescriptor} sortDescriptor={sortDescriptor}>
            <Table.Header>
              <Table.Column className="pr-0">
                <span className="flex items-center">Sélection</span>
              </Table.Column>
              <Table.Column id="image" className="after:hidden">
                Image
              </Table.Column>
              <Table.Column allowsSorting id="title" isRowHeader>
                {({ sortDirection }) => (
                  <SortableColumnHeader sortDirection={sortDirection}>Produit</SortableColumnHeader>
                )}
              </Table.Column>
              <Table.Column allowsSorting id="price">
                {({ sortDirection }) => (
                  <SortableColumnHeader sortDirection={sortDirection}>Prix</SortableColumnHeader>
                )}
              </Table.Column>
              <Table.Column id="status">Statut</Table.Column>
              <Table.Column className="text-end">Actions</Table.Column>
            </Table.Header>
            <Table.Body>
              {paginatedProducts.map((product) => (
                <Table.Row key={product.id}>
                  <Table.Cell className="pr-0">
                    <input type="checkbox" aria-label={`Sélectionner ${product.title}`} />
                  </Table.Cell>
                  <Table.Cell>
                    <Avatar size="sm">
                      <Avatar.Fallback>{product.title.substring(0, 2).toUpperCase()}</Avatar.Fallback>
                    </Avatar>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">{product.title}</span>
                      <span className="text-muted line-clamp-1 text-xs">
                        {product.description}
                      </span>
                    </div>
                  </Table.Cell>
                  <Table.Cell className="font-medium whitespace-nowrap">
                    {product.price} MAD
                  </Table.Cell>
                  <Table.Cell>
                    <Chip color={STATUS_MAP[product.status].color} size="sm" variant="soft">
                      {STATUS_MAP[product.status].label}
                    </Chip>
                  </Table.Cell>
                  <Table.Cell>
                    <div className="flex items-center gap-1 justify-end">
                      <Button
                        isIconOnly
                        size="sm"
                        variant="tertiary"
                        onPress={() => setEditingProduct(product)}
                      >
                        <Icon className="size-4" icon="gravity-ui:pencil" />
                      </Button>
                      <Button
                        isIconOnly
                        size="sm"
                        variant="danger-soft"
                        onPress={() =>
                          setDeletingProduct({ id: product.id, title: product.title })
                        }
                      >
                        <Icon className="size-4" icon="gravity-ui:trash-bin" />
                      </Button>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>

      {totalPages > 1 ? (
        <div className="flex items-center justify-center gap-2 py-4">
          <Button
            isIconOnly
            size="sm"
            variant="ghost"
            isDisabled={page === 1}
            onPress={() => setPage((p) => Math.max(1, p - 1))}
          >
            <Icon icon="lucide:chevron-left" />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Button
              key={p}
              size="sm"
              variant={p === page ? 'primary' : 'ghost'}
              onPress={() => setPage(p)}
            >
              {p}
            </Button>
          ))}
          <Button
            isIconOnly
            size="sm"
            variant="ghost"
            isDisabled={page === totalPages}
            onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            <Icon icon="lucide:chevron-right" />
          </Button>
        </div>
      ) : null}

      {editingProduct ? (
        <EditProductForm
          product={{
            id: String(editingProduct.id),
            title: editingProduct.title,
            price: editingProduct.price,
            image: editingProduct.imageUrl || '',
            description: editingProduct.description,
          }}
          onSave={(data) => handleSave(editingProduct.id, data)}
          onClose={() => setEditingProduct(null)}
        />
      ) : null}

      {deletingProduct ? (
        <DeleteConfirmDialog
          productTitle={deletingProduct.title}
          onConfirm={handleDelete}
          onCancel={() => setDeletingProduct(null)}
        />
      ) : null}
    </>
  );
}