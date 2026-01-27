import { useState } from "react";
import { Modal } from "@/shared/components/ui/Modal";
import { Button, Input } from "@/shared/components/ui";

interface AddTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (title: string, description: string) => void;
}

export function AddTopicModal({ isOpen, onClose, onAdd }: AddTopicModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleClose = () => {
    setName("");
    setDescription("");
    onClose();
  };

  const handleAdd = () => {
    if (!name.trim()) return;
    onAdd(name.trim(), description.trim());
    // Note: We don't clear state here immediately in case the parent wants to handle loading/errors
    // But per original logic, it clears on close. The parent calls close on success.
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Tambah Topic Baru" size="xl">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-700">Nama Topic</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Masukkan nama topic"
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-neutral-700">Deskripsi Topic</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Masukkan deskripsi topic"
            className="h-32 w-full resize-none rounded-lg border border-neutral-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-[#FF9D00] focus:outline-none"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="outline" onClick={handleClose} className="px-6">
            Batal
          </Button>
          <Button
            onClick={handleAdd}
            className="bg-[#D77211] px-6 hover:bg-[#C06010]"
            disabled={!name.trim()}
          >
            Tambah Topic
          </Button>
        </div>
      </div>
    </Modal>
  );
}
