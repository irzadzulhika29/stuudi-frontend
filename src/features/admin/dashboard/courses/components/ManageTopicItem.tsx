import {
  Trash2,
  Edit2,
  Lock,
  Check,
  ChevronRight,
  Plus,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/shared/components/ui";
import Link from "next/link";
import { TopicCard } from "./smallcomponents/TopicCard";

export interface Material {
  id: string;
  title: string;
  isCompleted: boolean;
  type?: "material" | "quiz";
}

export interface ManageTopicItemProps {
  id: string;
  courseId: string;
  title: string;
  description: string;
  materials: Material[];
  status?: "completed" | "in-progress" | "locked";
  isExpanded?: boolean;
  onMaterialsReorder?: (materials: Material[]) => void;
}

export function ManageTopicItem({
  id,
  courseId,
  title,
  description,
  materials,
  isExpanded: defaultExpanded = false,
  onMaterialsReorder,
}: ManageTopicItemProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [orderedMaterials, setOrderedMaterials] =
    useState<Material[]>(materials);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    setOrderedMaterials(materials);
  }, [materials]);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [orderedMaterials, isExpanded]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const moveMaterial = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= orderedMaterials.length) return;

    const newMaterials = [...orderedMaterials];
    [newMaterials[index], newMaterials[newIndex]] = [
      newMaterials[newIndex],
      newMaterials[index],
    ];
    setOrderedMaterials(newMaterials);
    onMaterialsReorder?.(newMaterials);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-4">
      <div className="p-5 border-l-4 border-primary-light">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <button
                onClick={toggleExpand}
                className="text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                {isExpanded ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </button>
              <h3 className="text-xl font-bold text-neutral-800">{title}</h3>
            </div>

            <div
              className={`transition-all duration-300 ${isExpanded ? "opacity-100 max-h-40" : "opacity-0 max-h-0 overflow-hidden"}`}
            >
              <p className="text-sm text-neutral-500 leading-relaxed max-w-3xl ml-8">
                {description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button className="text-neutral-300 hover:text-red-500 transition-colors p-2">
              <Trash2 size={20} />
            </button>
           
          </div>
        </div>
      </div>

      <div
        className="transition-all duration-300 ease-out overflow-hidden bg-white"
        style={{
          maxHeight: isExpanded ? `${contentHeight + 200}px` : "0px",
        }}
      >
        <div ref={contentRef} className="px-5 pb-6 pt-2">
          <div className="flex gap-4 justify-end my-6">
            <Link
              href={`/dashboard-admin/courses/${courseId}/manage/${courseId}/material/${id}`}
            >
              <Button variant="outline" size="md" className="!text-primary !border-primary hover:!bg-primary hover:!text-white">
                <Plus size={18} /> Tambah materi
              </Button>
            </Link>
            <Link
              href={`/dashboard-admin/courses/${courseId}/manage/${courseId}/material/${id}`}
            >
              <Button variant="outline" size="md" className="!text-primary !border-primary hover:!bg-primary hover:!text-white">
                <Plus size={18} /> Tambah kuis
              </Button>
            </Link>
          </div>

          <div className="space-y-2 bg-neutral-100/50 rounded-xl p-2">
            {orderedMaterials.map((material, index) => (
              <TopicCard
                key={material.id}
                id={material.id}
                title={material.title}
                isCompleted={material.isCompleted}
                type={material.type}
                index={index}
                totalItems={orderedMaterials.length}
                onMoveUp={() => moveMaterial(index, "up")}
                onMoveDown={() => moveMaterial(index, "down")}
                onEdit={() => {
                  // TODO: Handle edit action
                  console.log("Edit material:", material.id);
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
