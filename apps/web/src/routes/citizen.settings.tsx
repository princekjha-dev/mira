import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "@/lib/app-state";
import { CITIZEN } from "@/lib/data";
import { LANGUAGES } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { PageHeader, Panel, Pill } from "@/components/gov/ui";
import { AccessibilityControls } from "@/components/gov/AccessibilityDialog";

export const Route = createFileRoute("/citizen/settings")({
  head: () => ({ meta: [{ title: "Settings — Citizen" }, { name: "description", content: "Language, accessibility, notifications, privacy and security settings." }, { property: "og:title", content: "Settings" }, { property: "og:description", content: "Manage your preferences." }] }),
  component: Settings,
});

function Settings() {
  const { state, set, logout } = useApp();
  const nav = useNavigate();
  const [links, setLinks] = useState([
    { k: "Civil registration (birth/death)", on: true }, { k: "Revenue — income certificates", on: true },
    { k: "Land records (Tehsil)", on: true }, { k: "Rural Development — BPL list", on: true }, { k: "Bank account (DBT)", on: false },
  ]);
  const [revoke, setRevoke] = useState<string | null>(null);
  return (
    <div>
      <PageHeader title="Settings" />
      <Tabs defaultValue="language" className="space-y-4">
        <TabsList className="h-auto flex-wrap">
          {["language", "accessibility", "notifications", "privacy", "records", "security", "help"].map((t) => <TabsTrigger key={t} value={t} className="capitalize">{t === "records" ? "Connected records" : t === "privacy" ? "Privacy & consent" : t === "security" ? "Login / security" : t}</TabsTrigger>)}
        </TabsList>
        <TabsContent value="language"><Panel title="Language"><div className="grid grid-cols-2 gap-2 sm:grid-cols-4">{LANGUAGES.map((l) => <Button key={l.code} variant={state.lang === l.code ? "default" : "outline"} onClick={() => { set({ lang: l.code }); toast.success(`Language set to ${l.label}`); }}>{l.label}</Button>)}</div></Panel></TabsContent>
        <TabsContent value="accessibility"><Panel title="Accessibility"><AccessibilityControls /></Panel></TabsContent>
        <TabsContent value="notifications"><Panel title="Notification preferences"><div className="space-y-4">
          {([["sms", "SMS to " + CITIZEN.mobile], ["email", "Email to " + CITIZEN.email], ["app", "In-app notifications"]] as const).map(([k, l]) => (
            <div key={k} className="flex items-center justify-between"><Label htmlFor={k}>{l}</Label><Switch id={k} checked={state.notifPrefs[k]} onCheckedChange={(v) => { set((s) => ({ notifPrefs: { ...s.notifPrefs, [k]: v } })); toast.success("Preference saved"); }} /></div>
          ))}</div></Panel></TabsContent>
        <TabsContent value="privacy"><Panel title="Privacy & consent"><p className="text-sm text-muted-foreground">You have given consent for departments to access linked records only when processing your applications. Every access is recorded in the audit log.</p>
          <ul className="mt-3 space-y-2 text-sm"><li className="flex justify-between"><span>Consent for scheme verification</span><Pill t="ok">Active</Pill></li><li className="flex justify-between"><span>Consent for household benefit check</span><Pill t="ok">Active</Pill></li></ul>
          <Button variant="outline" className="mt-4" onClick={() => toast.success("Your data access report has been prepared", { description: "Available in Notifications within 24 hours (demo)." })}>Request my data access report</Button></Panel></TabsContent>
        <TabsContent value="records"><Panel title="Connected records"><ul className="divide-y">{links.map((l, i) => (
          <li key={l.k} className="flex items-center justify-between py-3 text-sm"><span>{l.k}</span><div className="flex items-center gap-3"><Pill t={l.on ? "ok" : "neutral"}>{l.on ? "Linked" : "Not linked"}</Pill>
            <Button size="sm" variant="outline" onClick={() => l.on ? setRevoke(l.k) : (setLinks(links.map((x, j) => (j === i ? { ...x, on: true } : x))), toast.success(`${l.k} linked`))}>{l.on ? "Unlink" : "Link"}</Button></div></li>
        ))}</ul></Panel></TabsContent>
        <TabsContent value="security"><Panel title="Login / security"><dl className="space-y-2 text-sm"><div className="flex justify-between"><dt>Sign-in method</dt><dd>Aadhaar OTP (demo)</dd></div><div className="flex justify-between"><dt>Registered mobile</dt><dd>{CITIZEN.mobile}</dd></div><div className="flex justify-between"><dt>Last sign-in</dt><dd>This session</dd></div></dl>
          <Button variant="outline" className="mt-4" onClick={() => toast.success("Signed out of all other devices")}>Sign out of other devices</Button></Panel></TabsContent>
        <TabsContent value="help"><Panel title="Help"><p className="text-sm">Visit <Link to="/help" className="text-gov underline">Help & Support</Link> for FAQs, or <Link to="/citizen/grievances" className="text-gov underline">raise a grievance</Link>.</p></Panel></TabsContent>
      </Tabs>
      <div className="mt-6"><Button variant="destructive" onClick={() => { logout(); toast.success("Logged out"); nav({ to: "/" }); }}>Logout</Button></div>
      <AlertDialog open={!!revoke} onOpenChange={(o) => !o && setRevoke(null)}>
        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Unlink {revoke}?</AlertDialogTitle><AlertDialogDescription>Applications that need this record will ask you to upload documents manually instead.</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => { setLinks(links.map((x) => (x.k === revoke ? { ...x, on: false } : x))); toast.success("Record unlinked"); }}>Unlink</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
