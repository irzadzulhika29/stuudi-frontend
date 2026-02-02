import { Modal } from "@/shared/components/ui/Modal";
import { TabSwitchDetail } from "../types/cheatingReportTypes";

interface TabSwitchDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamName: string;
  tabSwitchDetails: TabSwitchDetail[];
}

export function TabSwitchDetailModal({
  isOpen,
  onClose,
  teamName,
  tabSwitchDetails,
}: TabSwitchDetailModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Detail Tab Switches - ${teamName}`} size="lg">
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          Total {tabSwitchDetails.length} kali perpindahan tab terdeteksi
        </p>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Switch #
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Waktu</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Elapsed Time
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tabSwitchDetails.map((detail, idx) => (
                <tr key={idx} className="transition-colors hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">
                    #{detail.switch_number}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(detail.switched_at).toLocaleString("id-ID", {
                      dateStyle: "short",
                      timeStyle: "medium",
                    })}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700">
                      {detail.time_elapsed}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Modal>
  );
}
