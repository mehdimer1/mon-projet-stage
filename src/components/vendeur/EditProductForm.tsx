'use client';

import * as React from 'react';
import Image from 'next/image';
import {
  Button,
  Description,
  FieldError,
  Form,
  Input,
  Label,
  Modal,
  TextArea,
  TextField,
} from '@heroui/react';
import { Icon } from '@iconify/react';

interface Product {
  id: string;
  title: string;
  price: number;
  image: string;
  description: string;
}

interface EditProductFormProps {
  product: Product;
  onSave: (data: { title: string; price: number; description: string; imageUrl?: string }) => void;
  onClose: () => void;
}

export function EditProductForm({ product, onSave, onClose }: EditProductFormProps) {
  const [isOpen, setIsOpen] = React.useState(true);
  const [imagePreview, setImagePreview] = React.useState<string>('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetImage = () => {
    setImagePreview('');
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formDataNew = new FormData(e.currentTarget);
    const data: Record<string, string> = {};
    formDataNew.forEach((value, key) => {
      data[key] = value.toString();
    });

    onSave({
      title: data.nomProduit || product.title,
      price: Number(data.prix) || product.price,
      description: data.paragraphe || product.description,
      imageUrl: imagePreview || undefined,
    });
    onClose();
  };

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className="max-w-lg">
            <Modal.Header>
              <Modal.Heading>Modifier le produit</Modal.Heading>
              <Modal.CloseTrigger>
                <Icon icon="lucide:x" className="cursor-pointer" />
              </Modal.CloseTrigger>
            </Modal.Header>
            <Modal.Body className="min-h-96 p-4">
          <Form className="flex flex-col gap-5" onSubmit={onSubmit}>
            <div>
              <span className="mb-2 block text-sm font-medium">Image du produit</span>
              <div className="flex items-center gap-4">
                <label className="border-default-300 hover:border-primary flex size-24 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  {imagePreview ? (
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      width={96}
                      height={96}
                      className="h-full w-full rounded-lg object-cover"
                    />
                  ) : product.image ? (
                    <Image
                      src={product.image}
                      alt={product.title}
                      width={96}
                      height={96}
                      className="h-full w-full rounded-lg object-cover"
                    />
                  ) : (
                    <div className="text-default-400 flex flex-col items-center">
                      <Icon icon="lucide:upload" className="size-6" />
                      <span className="mt-1 text-xs">Upload</span>
                    </div>
                  )}
                </label>
                {imagePreview && (
                  <Button variant="ghost" size="sm" onPress={resetImage}>
                    Supprimer
                  </Button>
                )}
              </div>
            </div>

            <TextField
              name="nomProduit"
              isRequired
              defaultValue={product.title}
              validate={(value) => {
                if (value.length < 3) return 'Le nom doit contenir au moins 3 caractères';
                if (value.length > 100) return 'Le nom ne doit pas dépasser 100 caractères';
                return null;
              }}
            >
              <Label>Nom du produit</Label>
              <Input placeholder="Entrez le nom du produit" variant="secondary" />
              <FieldError />
            </TextField>

            <div className="grid grid-cols-2 gap-4">
              <TextField
                name="prix"
                isRequired
                defaultValue={String(product.price)}
                validate={(value) => {
                  if (!value) return 'Le prix est requis';
                  return null;
                }}
              >
                <Label>Prix de vente</Label>
                <Input placeholder="0.00" type="number" variant="secondary" />
                <FieldError />
              </TextField>

              <TextField
                name="prixOriginal"
                isRequired
                defaultValue={String(product.price)}
                validate={(value) => {
                  if (!value) return 'Le prix original est requis';
                  return null;
                }}
              >
                <Label>Prix original</Label>
                <Input placeholder="0.00" type="number" variant="secondary" />
                <FieldError />
              </TextField>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <TextField name="remise" defaultValue="">
                <Label>Remise (%)</Label>
                <Input placeholder="20" type="number" variant="secondary" />
                <Description>Pourcentage de réduction (0-100)</Description>
              </TextField>

              <TextField
                name="garanti"
                isRequired
                validate={(value) => {
                  if (!value) return 'La garantie est requise';
                  return null;
                }}
              >
                <Label>Garantie</Label>
                <Input placeholder="Ex: 2 ans" variant="secondary" />
                <FieldError />
              </TextField>
            </div>

            <TextField
              name="paragraphe"
              isRequired
              defaultValue={product.description}
              validate={(value) => {
                if (value.length < 20)
                  return 'La description doit contenir au moins 20 caractères';
                if (value.length > 5000)
                  return 'La description ne doit pas dépasser 5000 caractères';
                return null;
              }}
            >
              <Label>Description</Label>
              <TextArea
                placeholder="Décrivez votre produit en détail..."
                rows={4}
                variant="secondary"
              />
              <FieldError />
            </TextField>

            <Modal.Footer>
              <Button variant="secondary" onPress={handleClose}>
                Annuler
              </Button>
              <Button type="submit" variant="primary">
                <Icon icon="lucide:pencil" className="size-4" />
                Modifier
              </Button>
            </Modal.Footer>
          </Form>
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}