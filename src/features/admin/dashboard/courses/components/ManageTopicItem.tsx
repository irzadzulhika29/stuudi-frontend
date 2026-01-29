import { Trash2, ChevronDown, ChevronUp, Plus } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/shared/components/ui";
import Link from "next/link";
import { TopicMaterialItem } from "./smallcomponents/TopicMaterialItem";

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
  const [orderedMaterials, setOrderedMaterials] = useState<Material[]>(materials);
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
    [newMaterials[index], newMaterials[newIndex]] = [newMaterials[newIndex], newMaterials[index]];
    setOrderedMaterials(newMaterials);
    onMaterialsReorder?.(newMaterials);
  };

  return (
    <div className="mb-4 overflow-hidden rounded-xl bg-white shadow-sm">
      <div className="border-primary-light border-l-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-3">
              <button
                onClick={toggleExpand}
                className="text-neutral-400 transition-colors hover:text-neutral-600"
              >
                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              <h3 className="text-xl font-bold text-neutral-800">{title}</h3>
            </div>

            <div
              className={`transition-all duration-300 ${isExpanded ? "max-h-40 opacity-100" : "max-h-0 overflow-hidden opacity-0"}`}
            >
              <p className="ml-8 max-w-3xl text-sm leading-relaxed text-neutral-500">
                {description}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button className="p-2 text-neutral-300 transition-colors hover:text-red-500">
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      </div>

      <div
        className="overflow-hidden bg-white transition-all duration-300 ease-out"
        style={{
          maxHeight: isExpanded ? `${contentHeight + 200}px` : "0px",
        }}
      >
        <div ref={contentRef} className="px-5 pt-2 pb-6">
          <div className="my-6 flex justify-end gap-4">
            <Link
              href={`/dashboard-admin/courses/${courseId}/manage/${courseId}/material/new?topicId=${id}`}
            >
              <Button
                variant="outline"
                size="md"
                className="!text-primary !border-primary hover:!bg-primary hover:!text-white"
              >
                <Plus size={18} /> Tambah materi
              </Button>
            </Link>
            <Link
              href={`/dashboard-admin/courses/${courseId}/manage/${courseId}/quiz/new?topicId=${id}`}
            >
              <Button
                variant="outline"
                size="md"
                className="!text-primary !border-primary hover:!bg-primary hover:!text-white"
              >
                <Plus size={18} /> Tambah kuis
              </Button>
            </Link>
          </div>

          <div className="space-y-2 rounded-xl bg-neutral-100/50 p-2">
            {orderedMaterials.map((material, index) => (
              <TopicMaterialItem
                key={material.id}
                id={material.id}
                title={material.title}
                isCompleted={material.isCompleted}
                type={material.type}
                index={index}
                totalItems={orderedMaterials.length}
                courseId={courseId}
                onMoveUp={() => moveMaterial(index, "up")}
                onMoveDown={() => moveMaterial(index, "down")}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
