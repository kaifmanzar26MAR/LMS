import { IconBadge } from "@/components/icon-badge";
import { LucideIcon } from "lucide-react";
import { ReactElement, ReactNode } from "react";
import { IconType } from "react-icons";

interface InfoCardProps {
  icon: LucideIcon;
  label: string;
  numberOfItems: number;
  variant?: "default" | "sucess";
}

const InfoCard = ({
  icon: Icon,
  label,
  numberOfItems,
  variant,
}: InfoCardProps) => {
  console.log(label, numberOfItems);
  return (
    <div className="border rounded-md flex items-center gap-x-2 p-3">
      <IconBadge variant={variant} icon={Icon} size={"sm"} />
      <div>
        <p className="font-medium">
            {label}
        </p>
        <p className="text-gray-500 text-sm">
            {numberOfItems} {numberOfItems===1 ? "Course": "Courses"}
        </p>
      </div>
    </div>
  );
};

export default InfoCard;
