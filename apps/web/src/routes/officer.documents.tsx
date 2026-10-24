import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Eye, FileText, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useApp } from "@/lib/app-state";
import { apiRequest, type ApiDocument } from "@/lib/api";
import { formatBytes } from "@/lib/document-config";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageHeader } from "@/components/gov/ui";
import { DocumentViewer } from "@/components/gov/DocumentViewer";

interface Extraction { id: string; status: string }
export const Route = createFileRoute("/officer/documents")({
  head: () => ({ meta: [{ title: "Documents — Mira" }, { name: "description", content: "Private citizen documents available to your authorized review scope." }] }),
  component: Docs,
});

function Docs() {
  const { state } = useApp();
  const [documents, setDocuments] = useState<ApiDocument[]>([]);
  const [selected, setSelected] = useState<ApiDocument | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const session = state.session;

  const refresh = useCallback(async () => {
    if (!session?.apiToken && !session?.isDemo) return;
    setLoading(true); setError("");
    try {
      const result = await apiRequest<{ data: ApiDocument[] }>(session, "/api/v1/documents");
      setDocuments(result.data.filter((doc) => doc.status !== "REVOKED"));
    } catch (reason) {
      console.error("Officer document list request failed.", { name: reason instanceof Error ? reason.name : "UnknownError" });
      setError("We couldn't load documents for review. Please try again.");
    }
    finally { setLoading(false); }
  }, [session?.apiToken, session?.apiUserId, session?.isDemo]);
  useEffect(() => { void refresh(); }, [refresh]);

  const verify = async (doc: ApiDocument) => {
    if (!session) return;
    try {
      const result = await apiRequest<{ data: Extraction[] }>(session, `/api/v1/documents/${doc.id}/extractions`);
      const pending = result.data.filter((field) => !["OFFICER_VERIFIED", "SOURCE_VERIFIED"].includes(field.status));
      if (!pending.length) { toast.info("This document has no unverified extracted fields."); return; }
      for (const field of pending) await apiRequest(session, `/api/v1/documents/${doc.id}/verify-extraction`, {
        method: "POST",
        body: JSON.stringify({ extraction_id: field.id, decision: "VERIFIED", verification_method: "MANUAL_INSPECTION", reason: "Officer reviewed the extracted document fields." }),
      });
      toast.success("Extracted document fields verified.");
      await refresh();
    } catch (reason) { toast.error(reason instanceof Error ? reason.message : "Verification failed."); }
  };

  return <div>
    <PageHeader title="Documents" desc="Review citizen documents available to your authorized role and application scope." actions={<Button variant="outline" onClick={() => void refresh()} disabled={loading}><RefreshCw className="mr-2 h-4 w-4" />Refresh</Button>} />
    {error && <div role="alert" className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</div>}
    {!session?.apiToken && !session?.isDemo ? <div className="rounded-xl border bg-white p-8 text-center text-sm text-slate-600">Secure sign in is required to review private documents.</div> : <div className="overflow-x-auto rounded-xl border bg-white"><Table>
      <TableHeader><TableRow><TableHead>Document</TableHead><TableHead>Owner</TableHead><TableHead>Uploaded</TableHead><TableHead>Verification</TableHead><TableHead>File status</TableHead><TableHead /></TableRow></TableHeader>
      <TableBody>{documents.map((doc) => <TableRow key={doc.id}><TableCell><div className="flex items-center gap-2"><FileText className="h-4 w-4 text-slate-400" /><div><p className="max-w-56 truncate text-sm font-medium">{doc.original_filename}</p><p className="text-xs text-slate-500">{doc.document_type.replaceAll("_", " ")} · {formatBytes(doc.size_bytes)}</p></div></div></TableCell><TableCell className="font-mono text-xs">{doc.owner_id}</TableCell><TableCell>{new Date(doc.created_at).toLocaleDateString("en-IN")}</TableCell><TableCell><span className="rounded-full bg-amber-50 px-2 py-1 text-xs text-amber-800">{doc.verification_status.replaceAll("_", " ")}</span></TableCell><TableCell>{doc.status}</TableCell><TableCell><div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => setSelected(doc)}><Eye className="mr-1 h-3.5 w-3.5" />View</Button>{doc.verification_status !== "VERIFIED" && <Button size="sm" onClick={() => void verify(doc)}>Review fields</Button>}</div></TableCell></TableRow>)}
        {!documents.length && <TableRow><TableCell colSpan={6} className="h-28 text-center text-sm text-slate-500">{loading ? "Loading documents…" : "No documents are available in your current scope."}</TableCell></TableRow>}
      </TableBody>
    </Table></div>}
    {session && <DocumentViewer document={selected} session={session} onClose={() => setSelected(null)} onChanged={() => void refresh()} />}
  </div>;
}
