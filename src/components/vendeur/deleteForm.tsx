'use client';
import { Button, Modal } from '@heroui/react';
import { Icon } from '@iconify/react';
import { useState } from 'react';
import { Typography } from '@/components/ui/typography';

interface DeleteConfirmDialogProps {
  productTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmDialog({ productTitle, onConfirm, onCancel }: DeleteConfirmDialogProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Modal isOpen={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Icon><Icon icon="lucide:alert-triangle" className="size-6 text-danger" /></Modal.Icon>
              <Modal.Heading>Confirmer la suppression</Modal.Heading>
              <Modal.CloseTrigger />
            </Modal.Header>
            <Modal.Body>
              <Typography.P>
                Êtes-vous sûr de vouloir supprimer "{productTitle}" ? Cette action est irréversible.
              </Typography.P>
            </Modal.Body>
            <Modal.Footer>
              <Button slot="close" variant="tertiary" onPress={onCancel}>
                Annuler
              </Button>
              <Button slot="close" variant="danger" onPress={onConfirm}>
                Supprimer
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}