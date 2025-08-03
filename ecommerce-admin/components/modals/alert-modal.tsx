"use client";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { MountedCheck } from "@/lib/mounted-check";

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  title?: string;
  description?: string;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  title = "Are you sure?",
  description = "This action cannot be undone.",
}) => {
  return (
    <MountedCheck>
      <Modal
        title={title}
        description={description}
        isOpen={isOpen}
        onClose={onClose}
      >
        <div className="flex items-center justify-end w-full pt-6 space-x-2">
          <Button disabled={loading} variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={loading} variant="destructive" onClick={onConfirm}>
            Continue
          </Button>
        </div>
      </Modal>
    </MountedCheck>
  );
};
