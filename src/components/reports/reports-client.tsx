"use client";

import { useMemo, useState } from "react";
import { FileText, SlidersHorizontal, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

type Market = { id: string; name: string; code: string };
type Initiative = { id: string; code: string | null; name: string };
type Props = { markets: Market[]; initiatives: Initiative[]; persons: string[] };

const fieldClass = "h-10 w-full rounded-md border border-input bg-background px-3 text-sm";
const sample = "Show me the progress of all initiatives in the Czech market over the last three months, including open tasks, key challenges and next steps.";

export function ReportsClient({ markets, initiatives, persons }: Props) {
  const [marketId, setMarketId] = useState("");
  const [initiativeId, setInitiativeId] = useState("");
  const [weeks, setWeeks] = useState("");
  const [person, setPerson] = useState("");
  const [prompt, setPrompt] = useState(sample);

  const query = useMemo(() => new URLSearchParams(
    Object.entries({ marketId, initiativeId, weeks, person }).filter(([, value]) => value)
  ).toString(), [marketId, initiativeId, weeks, person]);
  const managementUrl = "/reports/management" + (query ? "?" + query : "");
  const selectedCount = [marketId, initiativeId, weeks, person].filter(Boolean).length;

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card className="h-full">
        <CardHeader>
          <div className="flex items-center gap-2"><SlidersHorizontal className="h-5 w-5 text-[#239276]" /><CardTitle>Custom Report</CardTitle></div>
          <CardDescription>Combine any of the four filters to create a personalized report. Unselected filters include all available data.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <label className="grid gap-1.5 text-sm font-medium">Market
            <select className={fieldClass} value={marketId} onChange={(e) => setMarketId(e.target.value)}>
              <option value="">All markets</option>
              {markets.map((m) => <option key={m.id} value={m.id}>{m.name} ({m.code})</option>)}
            </select>
          </label>
          <label className="grid gap-1.5 text-sm font-medium">Initiative
            <select className={fieldClass} value={initiativeId} onChange={(e) => setInitiativeId(e.target.value)}>
              <option value="">All initiatives</option>
              {initiatives.map((i) => <option key={i.id} value={i.id}>{i.code ? i.code + " — " : ""}{i.name}</option>)}
            </select>
          </label>
          <label className="grid gap-1.5 text-sm font-medium">Time period
            <select className={fieldClass} value={weeks} onChange={(e) => setWeeks(e.target.value)}>
              <option value="">All time</option>
              <option value="4">Last 4 weeks</option>
              <option value="12">Last 12 weeks</option>
              <option value="26">Last 6 months</option>
              <option value="52">Last 12 months</option>
            </select>
          </label>
          <label className="grid gap-1.5 text-sm font-medium">Person
            <select className={fieldClass} value={person} onChange={(e) => setPerson(e.target.value)}>
              <option value="">All persons</option>
              {persons.map((name) => <option key={name} value={name}>{name}</option>)}
            </select>
          </label>
          <div className="rounded-lg border bg-secondary/40 p-3 text-sm text-muted-foreground">
            {selectedCount === 0 ? "No filters selected — report covers all available data." : selectedCount + " of 4 filters selected."}
          </div>
          <Button asChild className="w-full bg-[#78FAAE] text-[#0E3A2F] hover:bg-[#63e89a]">
            <a href={managementUrl}><FileText className="mr-2 h-4 w-4" />Generate Report</a>
          </Button>
        </CardContent>
      </Card>
      <Card className="h-full">
        <CardHeader>
          <div className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-[#239276]" /><CardTitle>AI-supported Report</CardTitle></div>
          <CardDescription>Describe what you want to know in your own words.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <label htmlFor="report-ai-prompt" className="text-sm font-medium">What would you like to know?</label>
          <Textarea id="report-ai-prompt" rows={9} value={prompt} onChange={(e) => setPrompt(e.target.value)} />
          <p className="text-sm text-muted-foreground">The AI will eventually suggest relevant markets, initiatives, time periods and data sources before generating a report.</p>
          <div className="rounded-lg border border-[#239276]/25 bg-[#78FAAE]/10 p-4 text-sm">
            <p className="font-semibold">AI integration coming soon</p>
            <p className="mt-1 text-muted-foreground">This is a prepared interface. Your text is not sent to any AI service and no AI-generated report is available yet.</p>
          </div>
          <Button disabled className="w-full"><Sparkles className="mr-2 h-4 w-4" />Generate AI Report (coming soon)</Button>
        </CardContent>
      </Card>
    </div>
  );
}
