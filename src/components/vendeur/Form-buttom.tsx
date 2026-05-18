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

interface AddProductButtonProps {
  sellerId?: string;
}

export function AddProductButton({ sellerId }: AddProductButtonProps) {
  const [isOpen, setIsOpen] = React.useState(false);
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

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setImagePreview('');
    setIsOpen(false);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Button variant="primary" onPress={() => setIsOpen(true)}>
        <Icon icon="lucide:plus" className="size-4" />
        Ajouter un produit
      </Button>

      <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
        <Modal.Backdrop>
          <Modal.Container>
            <Modal.Dialog className="w-[95vw] max-w-lg md:w-full">
              <Modal.Header>
                <Modal.Heading>Ajouter un produit</Modal.Heading>
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

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <TextField
                      name="prix"
                      isRequired
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

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                    <Button variant="secondary" onPress={closeModal}>
                      Annuler
                    </Button>
                    <Button type="submit" variant="primary">
                      <Icon icon="lucide:plus" className="size-4" />
                      Ajouter
                    </Button>
                  </Modal.Footer>
                </Form>
              </Modal.Body>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </>
  );
}