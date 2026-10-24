import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  Navigation,
  MapPin,
  Camera,
  CheckCircle2,
  HardDrive,
} from "lucide-react";
import {
  ProfilePage,
  ProfileSection,
  ProfileRow,
} from "@/components/mira/profile";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/officer/settings")({
  head: () => ({
    meta: [
      { title: "Profile & Field Operations — Field Official" },
      {
        name: "description",
        content:
          "Field verification officer identity, GPS tracking status, and offline route sync.",
      },
    ],
  }),
  component: OfficerProfileRoute,
});

function OfficerProfileRoute() {
  const [offlineRoute, setOfflineRoute] = useState(true);
  const [highPrecisionGps, setHighPrecisionGps] = useState(true);

  return (
    <ProfilePage
      roleSpecificSection={
        <ProfileSection
          title="Field Operations & Geotagging"
          description="GPS inspection parameters and offline cluster route synchronization"
        >
          <ProfileRow
            icon={Navigation}
            title="Daily Inspection Route Sync"
            description="Pre-fetches cluster route maps and household files for disconnected rural zones"
            action={
              <Switch
                checked={offlineRoute}
                onCheckedChange={(val) => {
                  setOfflineRoute(val);
                  toast.success(
                    val
                      ? "Offline route sync enabled"
                      : "Offline route sync disabled",
                  );
                }}
              />
            }
          />

          <ProfileRow
            icon={MapPin}
            title="High-Precision Differential GPS"
            description="Enforces sub-meter geotagging accuracy for dwelling inspection photographs"
            action={
              <Switch
                checked={highPrecisionGps}
                onCheckedChange={(val) => {
                  setHighPrecisionGps(val);
                  toast.success(
                    val
                      ? "Sub-meter GNSS enabled"
                      : "Standard cellular GPS fallback active",
                  );
                }}
              />
            }
          />

          <ProfileRow
            icon={Camera}
            title="Biometric & Presence Confirmation"
            description="UIDAI RD Service facial recognition driver on field tablet"
            value={
              <span className="inline-flex items-center gap-1 font-mono text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="h-3 w-3" />
                Driver Active (L1 Biometric)
              </span>
            }
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  toast.success("Biometric test scan successful (Demo)")
                }
                className="h-7 text-xs ml-2"
              >
                Test RD
              </Button>
            }
            isLast
          />
        </ProfileSection>
      }
    />
  );
}
