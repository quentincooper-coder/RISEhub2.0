import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/shared/page-header";
import { ReportsClient } from "@/components/reports/reports-client";

export default async function ReportsPage() {
  const [markets, initiatives, tasks, risks, activities] = await Promise.all([
    prisma.market.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true, code: true } }),
    prisma.initiative.findMany({ orderBy: { code: "asc" }, select: { id: true, code: true, name: true } }),
    prisma.task.findMany({ select: { assignee: true } }),
    prisma.risk.findMany({ select: { owner: true } }),
    prisma.activity.findMany({ select: { actor: true } }),
  ]);

  const persons = Array.from(new Set([...tasks.map(t => t.assignee), ...risks.map(r => r.owner), ...activities.map(a => a.actor)].map(name => name.trim()).filter(Boolean))).sort((a, b) => a.localeCompare(b));

  return (
    <div>
      <PageHeader title="Reports" description="Create traceable project reports and export the underlying data as CSV." />
      <ReportsClient markets={markets} initiatives={initiatives} persons={persons} />
    </div>
  );
}
