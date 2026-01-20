import { Plus } from "lucide-react";
import { ManageTopicItem, Material } from "./ManageTopicItem";
import { Button } from "@/shared/components/ui";
import Link from "next/link";

interface Topic {
  id: string;
  title: string;
  description: string;
  materials: Material[];
  status: "completed" | "in-progress" | "locked";
}

interface ManageTopicListProps {
  courseId: string;
  topics: Topic[];
}

export function ManageTopicList({ courseId, topics }: ManageTopicListProps) {
  return (
    <div className="space-y-6">
      <div className="flex gap-4 mb-8">
        <Link
          className="flex-1"
          href={`/dashboard-admin/courses/${courseId}/manage/${courseId}/material/new`}
        >
          <Button className="w-full hover:text-gray-800 hover:bg-white" variant="outline" size="md">
            <Plus className="mr-2" size={20} /> Add New Topic
          </Button>
        </Link>
        <Link
        className="flex-1"
          href={`/dashboard-admin/courses/${courseId}/manage/${courseId}/quiz/new`}
        
        >
          <Button className="w-full hover:text-gray-800 hover:bg-white" variant="outline" size="md">
            <Plus className="mr-2" size={20} /> Add Exam
          </Button>
        </Link>
      </div>

      <div className="space-y-4">
        {topics.map((topic) => (
          <ManageTopicItem
            key={topic.id}
            id={topic.id}
            courseId={courseId}
            title={topic.title}
            description={topic.description}
            materials={topic.materials}
            status={topic.status}
            isExpanded={true} // Default expanded for manage view or configurable
          />
        ))}
      </div>
    </div>
  );
}
