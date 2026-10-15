import Link from "next/link";
import { ListChecks, LoaderCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/shared/page-header";
import { TasksClient } from "@/components/tasks/tasks-client";
import { Card, CardContent } from "@/components/ui/card";

export default async function TasksPage({ searchParams }: { searchParams: Promise<{ status?: string; area?: string }> }) {
  const { status, area } = await searchParams;
  const [tasks, initiatives, markets] = await Promise.all([
    prisma.task.findMany({
      orderBy: { dueDate: "asc" },
      include: {
        initiative: { select: { id: true, code: true, name: true, isReleased: true } },
        market: { select: { id: true, code: true, name: true } },
      },
    }),
    prisma.initiative.findMany({
      orderBy: { code: "asc" },
      select: { id: true, code: true, name: true },
    }),
    prisma.market.findMany({
      orderBy: { name: "asc" },
      select: { id: true, code: true, name: true },
    }),
  ]);

  const visibleTasks=tasks.filter(t=>area==="BACKLOG"?t.initiative?.isReleased===false:area==="ACTIVE"?t.initiative?.isReleased!==false:true);
  const activeTasks = tasks.filter((task) => task.status !== "DONE").length;
  const inProgressTasks = tasks.filter((task) => task.status === "IN_PROGRESS").length;

  return (
    <div>
      <PageHeader
        title="Task Tracker"
        description="Track execution work across markets and initiatives."
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link href="/tasks?status=ACTIVE#tasks" className="group">
          <Card className="h-full transition-shadow group-hover:shadow-md">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Tasks</p>
                <p className="mt-1 text-3xl font-semibold text-foreground">{activeTasks}</p>
                <p className="mt-1 text-xs text-muted-foreground">all open execution tasks</p>
              </div>
              <ListChecks className="h-7 w-7 text-primary" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/tasks?status=IN_PROGRESS#tasks" className="group">
          <Card className="h-full transition-shadow group-hover:shadow-md">
            <CardContent className="flex items-center justify-between p-5">
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                <p className="mt-1 text-3xl font-semibold text-foreground">{inProgressTasks}</p>
                <p className="mt-1 text-xs text-muted-foreground">tasks currently being worked</p>
              </div>
              <LoaderCircle className="h-7 w-7 text-primary" />
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="mb-4 flex flex-wrap gap-2 text-sm"><a href="/tasks?area=ALL#tasks" className="rounded border px-3 py-2">All</a><a href="/tasks?area=BACKLOG#tasks" className="rounded border px-3 py-2">Backlog</a><a href="/tasks?area=ACTIVE#tasks" className="rounded border px-3 py-2">Active</a></div>
      <div id="tasks">
        <TasksClient tasks={visibleTasks} initiatives={initiatives} markets={markets} initialStatus={status ?? "ALL"} />
      </div>
    </div>
  );
}
