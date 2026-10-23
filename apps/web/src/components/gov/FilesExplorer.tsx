import { useState } from "react";
import {
  Clock,
  Download,
  Eye,
  FileCheck2,
  FileText,
  Filter,
  FolderArchive,
  FolderOpen,
  History,
  Layers,
  Plus,
  Search,
  ShieldAlert,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/lib/app-state";
import { type FileRecord, type FileVersionEntry } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface FilesExplorerProps {
  title?: string;
  subtitle?: string;
  allowedCategories?: FileRecord["category"][];
}

export function FilesExplorer({
  title = "Mira Document Vault & Evidence Files",
  subtitle = "Cryptographically attested, versioned documents and civil registry artifacts.",
  allowedCategories,
}: FilesExplorerProps) {
  const { state, addFileVersion } = useApp();

  const [activeCategory, setActiveCategory] = useState<FileRecord["category"] | "All">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFileForVersions, setSelectedFileForVersions] = useState<FileRecord | null>(null);

  // New Version Upload Modal
  const [uploadFileTarget, setUploadFileTarget] = useState<FileRecord | null>(null);
  const [newVersionReason, setNewVersionReason] = useState("");
  const [newVersionFilename, setNewVersionFilename] = useState("");

  const categories: (FileRecord["category"] | "All")[] = allowedCategories
    ? ["All", ...allowedCategories]
    : [
        "All",
        "My Files",
        "Application Files",
        "Household Files",
        "Evidence",
        "Requested Documents",
        "Archived",
      ];

  const filteredFiles = state.files.filter((file) => {
    if (activeCategory !== "All" && file.category !== activeCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesName = file.name.toLowerCase().includes(q);
      const matchesType = file.type.toLowerCase().includes(q);
      const matchesUploader = file.uploadedBy.toLowerCase().includes(q);
      if (!matchesName && !matchesType && !matchesUploader) return false;
    }
    return true;
  });

  const handleUploadNewVersionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFileTarget || !newVersionReason.trim() || !newVersionFilename.trim()) {
      toast.error("Please specify a replacement filename and reason for versioning.");
      return;
    }

    addFileVersion(uploadFileTarget.id, {
      filename: newVersionFilename.trim(),
      sizeBytes: Math.round(uploadFileTarget.sizeBytes * 1.05),
      reason: newVersionReason.trim(),
    });

    toast.success(`Version ${uploadFileTarget.currentVersion + 1} logged`, {
      description: `Previous version preserved in immutable history.`,
    });

    setUploadFileTarget(null);
    setNewVersionReason("");
    setNewVersionFilename("");
  };

  const statusBadge = (status: FileRecord["verificationStatus"]) => {
    switch (status) {
      case "Verified":
        return "bg-teal/15 text-teal border-teal/20";
      case "Action Required":
      case "Mismatch Detected":
        return "bg-amber-100 text-amber-800 border-amber-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-navy">{title}</h1>
          <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="text-xs h-9 gap-1.5"
            onClick={() => toast.info("Select file from local storage to upload")}
          >
            <Upload className="h-3.5 w-3.5" />
            Upload New File
          </Button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 border-b pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
              activeCategory === cat
                ? "bg-gov text-white font-semibold shadow-xs"
                : "text-slate-600 hover:bg-slate-100",
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="h-3.5 w-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by filename, document type or citizen uploader…"
            className="h-8 pl-8 text-xs bg-white"
          />
        </div>
        <span className="text-xs text-muted-foreground font-mono">
          Showing {filteredFiles.length} file records
        </span>
      </div>

      {/* Files Table / Grid */}
      <div className="rounded-xl border bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b text-slate-600 font-semibold">
              <tr>
                <th className="p-3">File Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Size</th>
                <th className="p-3">Uploaded By</th>
                <th className="p-3">Version</th>
                <th className="p-3">Verification</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-slate-700">
              {filteredFiles.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    No files found in this category.
                  </td>
                </tr>
              ) : (
                filteredFiles.map((file) => (
                  <tr key={file.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-3 font-semibold text-navy">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gov shrink-0" />
                        <span className="truncate max-w-[200px]" title={file.name}>
                          {file.name}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 text-slate-500">{file.category}</td>
                    <td className="p-3 font-mono text-slate-500">
                      {Math.round(file.sizeBytes / 1024)} KB
                    </td>
                    <td className="p-3">
                      <div className="truncate max-w-[140px]">
                        <span className="font-medium text-slate-900">{file.uploadedBy}</span>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          {file.uploadedDate}
                        </span>
                      </div>
                    </td>
                    <td className="p-3">
                      <button
                        type="button"
                        onClick={() => setSelectedFileForVersions(file)}
                        className="inline-flex items-center gap-1 font-mono font-bold text-gov hover:underline text-[11px]"
                      >
                        <History className="h-3 w-3" />
                        v{file.currentVersion}
                      </button>
                    </td>
                    <td className="p-3">
                      <span
                        className={cn(
                          "rounded text-[10px] font-semibold px-2 py-0.5 border",
                          statusBadge(file.verificationStatus),
                        )}
                      >
                        {file.verificationStatus}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-xs text-gov gap-1"
                        onClick={() => toast.success(`Downloading ${file.name}…`)}
                      >
                        <Download className="h-3 w-3" />
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 px-2 text-xs gap-1"
                        onClick={() => {
                          setUploadFileTarget(file);
                          setNewVersionFilename(`${file.name.replace(/\.[^/.]+$/, "")}_updated.pdf`);
                        }}
                      >
                        <Upload className="h-3 w-3" />
                        Replace
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* VERSION HISTORY DIALOG */}
      <Dialog
        open={!!selectedFileForVersions}
        onOpenChange={(o) => !o && setSelectedFileForVersions(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="h-4 w-4 text-gov" />
              File Version Ledger
            </DialogTitle>
            <DialogDescription>
              {selectedFileForVersions?.name} (Current: v{selectedFileForVersions?.currentVersion})
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 pt-2 text-xs">
            <p className="text-muted-foreground">
              Government archival rule: Prior document versions are never deleted. They are preserved for auditability and verification attribution.
            </p>

            <div className="relative pl-4 space-y-4 before:absolute before:left-1 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {selectedFileForVersions?.versions.map((v) => (
                <div key={v.versionNumber} className="relative">
                  <div className="absolute -left-4 top-1.5 h-2 w-2 rounded-full bg-gov ring-4 ring-white" />
                  <div className="rounded border bg-slate-50 p-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-navy font-mono">
                        Version {v.versionNumber}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-mono">
                        {v.uploadedAt}
                      </span>
                    </div>
                    <p className="font-mono text-slate-600 truncate">{v.filename}</p>
                    <p className="text-slate-700 italic text-[11px] pt-1">
                      Reason: "{v.reason}"
                    </p>
                    <span className="text-[10px] text-slate-400 block pt-1">
                      Uploaded by: {v.uploadedBy}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedFileForVersions(null)}
            >
              Close Ledger
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* UPLOAD REPLACEMENT VERSION DIALOG */}
      <Dialog
        open={!!uploadFileTarget}
        onOpenChange={(o) => !o && setUploadFileTarget(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Replacement Document Version</DialogTitle>
            <DialogDescription>
              Creating Version {uploadFileTarget ? uploadFileTarget.currentVersion + 1 : 2} for {uploadFileTarget?.name}.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUploadNewVersionSubmit} className="space-y-3 pt-2 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">New File Name</label>
              <Input
                value={newVersionFilename}
                onChange={(e) => setNewVersionFilename(e.target.value)}
                required
                className="text-xs h-9"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Reason for Replacement</label>
              <Input
                placeholder="e.g. Uploaded attested copy with clear seal per Officer request"
                value={newVersionReason}
                onChange={(e) => setNewVersionReason(e.target.value)}
                required
                className="text-xs h-9"
              />
            </div>

            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Replacing this document generates an immutable audit entry and prompts the assigned Verification Officer to review the new file.
            </p>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setUploadFileTarget(null)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-gov hover:bg-gov/90 text-white"
              >
                Commit New Version
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
