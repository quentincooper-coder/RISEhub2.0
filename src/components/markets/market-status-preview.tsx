"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Clock3, FileText, History, Pencil, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type StatusEntry = { text: string; createdAt: string };

export function MarketStatusPreview({ marketName }: { marketName: string }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [entries, setEntries] = useState<StatusEntry[]>([]);
  const latest = entries[0];

  function addPreview() {
    if (!draft.trim()) return;
    setEntries((previous) => [{ text: draft.trim(), createdAt: new Date().toISOString() }, ...previous]);
    setDraft("");
    setEditing(false);
  }

  return (
    <Card className="self-start">
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="text-base">Market Status</CardTitle>
          <span className="rounded-full border border-[#239276]/30 bg-[#78FAAE]/15 px-2.5 py-1 text-[11px] font-medium text-[#239276]">UI Preview</span>
        </div>

      </CardHeader>
      <CardContent className="space-y-2 pb-4">
        <div className="rounded-lg border bg-secondary/30 p-3">
          <p className="text-xs font-semibold text-muted-foreground">Current status</p>
          <p className="mt-1 line-clamp-2 whitespace-pre-wrap text-sm leading-5">{latest?.text || "No market status has been recorded yet."}</p>
          {latest && <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground"><Clock3 className="h-3.5 w-3.5" />{new Date(latest.createdAt).toLocaleString("en-GB")}</p>}
        </div>
        {editing ? <div className="space-y-2">
          <label className="block text-sm font-medium" htmlFor="market-status-preview">New status update</label>
          <textarea id="market-status-preview" className="min-h-28 w-full rounded-md border bg-background p-3 text-sm" placeholder="What is the current situation, next steps and expected feedback?" value={draft} onChange={(event) => setDraft(event.target.value)}/>
          <div className="flex gap-2"><Button type="button" onClick={addPreview} disabled={!draft.trim()}>Add to preview</Button><Button type="button" variant="outline" onClick={() => setEditing(false)}>Cancel</Button></div>
        </div> : <Button type="button" variant="outline" className="w-full" onClick={() => setEditing(true)}><Pencil className="h-4 w-4" />Update Status</Button>}
        <Button type="button" variant="ghost" className="w-full justify-between" aria-expanded={detailsOpen} onClick={() => setDetailsOpen((open) => !open)}><span>{detailsOpen ? "Hide details" : "Show details"}</span>{detailsOpen ? <ChevronUp className="h-4 w-4"/> : <ChevronDown className="h-4 w-4"/>}</Button>
        {detailsOpen && <div className="space-y-3 border-t pt-3"><Button type="button" variant="ghost" className="w-full justify-between" onClick={() => setHistoryOpen((open) => !open)}><span className="flex items-center gap-2"><History className="h-4 w-4" />Status history</span><span>{entries.length}</span></Button>
        {historyOpen && <div className="space-y-2 border-l-2 border-[#78FAAE] pl-4">{entries.length ? entries.map((entry, index) => <div key={entry.createdAt + index} className="border-b pb-2 last:border-b-0"><p className="text-xs text-muted-foreground">{new Date(entry.createdAt).toLocaleString("en-GB")}</p><p className="mt-1 whitespace-pre-wrap text-sm">{entry.text}</p></div>) : <p className="text-sm text-muted-foreground">No previous status entries.</p>}</div>}
        <div className="rounded-lg border border-dashed p-3">
          <div className="flex items-center gap-2 text-sm font-medium"><FileText className="h-4 w-4" />Meeting Minutes</div>
          <p className="mt-1 text-xs text-muted-foreground">Market meeting minutes will be available as a source for status updates.</p>
          <Button disabled type="button" variant="outline" size="sm" className="mt-3 w-full"><Sparkles className="h-4 w-4" />Suggest status from minutes (coming soon)</Button>
        </div>
        <p className="text-xs text-muted-foreground">UI preview only: status updates are not saved permanently; no AI is active.</p></div>
      </CardContent>
    </Card>
  );
}
