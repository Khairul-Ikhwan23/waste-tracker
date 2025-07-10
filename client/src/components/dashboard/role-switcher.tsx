import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { User, Building, Truck, Shield } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { USER_TYPES } from "@/lib/data";

const roleIcons = {
  'Household': User,
  'Business': Building,
  'Waste Operator': Truck,
  'Admin': Shield
};

const roleColors = {
  'Household': 'bg-blue-100 text-blue-800',
  'Business': 'bg-purple-100 text-purple-800',
  'Waste Operator': 'bg-green-100 text-green-800',
  'Admin': 'bg-red-100 text-red-800'
};

export default function RoleSwitcher() {
  const { currentRole, switchRole } = useUser();

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium text-gray-600 hidden sm:block">Role:</span>
      <Select value={currentRole} onValueChange={switchRole}>
        <SelectTrigger className="w-36 sm:w-48 mobile-touch-target">
          <SelectValue>
            <div className="flex items-center space-x-2">
              {(() => {
                const Icon = roleIcons[currentRole as keyof typeof roleIcons];
                return <Icon className="w-4 h-4" />;
              })()}
              <span className="hidden sm:inline mobile-text-size">{currentRole}</span>
            </div>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {USER_TYPES.map((role) => {
            const Icon = roleIcons[role as keyof typeof roleIcons];
            return (
              <SelectItem key={role} value={role} className="mobile-touch-target">
                <div className="flex items-center space-x-2">
                  <Icon className="w-4 h-4" />
                  <span>{role}</span>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      <Badge className={`${roleColors[currentRole as keyof typeof roleColors]} hidden sm:inline-flex`}>
        {currentRole}
      </Badge>
    </div>
  );
}