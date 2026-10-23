import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/app-state";

export function AccessibilityControls() {
  const { state, set } = useApp();
  const rows: { k: "highContrast" | "reducedMotion" | "srMode"; label: string; hint: string }[] = [
    { k: "highContrast", label: "High contrast", hint: "Stronger text and border contrast" },
    { k: "reducedMotion", label: "Reduced motion", hint: "Turns off animations and transitions" },
    { k: "srMode", label: "Screen-reader-friendly mode", hint: "Stronger focus outlines and underlined links" },
  ];
  return (
    <div className="space-y-5">
      <div>
        <p className="mb-2 text-sm font-medium">Font size</p>
        <div className="flex gap-2" role="group" aria-label="Font size">
          {[{ v: -1, l: "A-" }, { v: 0, l: "A" }, { v: 1, l: "A+" }, { v: 2, l: "A++" }].map((o) => (
            <Button key={o.v} size="sm" variant={state.fontScale === o.v ? "default" : "outline"} aria-pressed={state.fontScale === o.v} onClick={() => set({ fontScale: o.v })}>{o.l}</Button>
          ))}
        </div>
      </div>
      {rows.map((r) => (
        <div key={r.k} className="flex items-center justify-between gap-4">
          <div><Label htmlFor={r.k}>{r.label}</Label><p className="text-xs text-muted-foreground">{r.hint}</p></div>
          <Switch id={r.k} checked={state[r.k]} onCheckedChange={(v) => set({ [r.k]: v } as never)} />
        </div>
      ))}
    </div>
  );
}

export function AccessibilityDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Accessibility settings</DialogTitle><DialogDescription>Changes apply instantly and are remembered on this device.</DialogDescription></DialogHeader>
        <AccessibilityControls />
      </DialogContent>
    </Dialog>
  );
}
