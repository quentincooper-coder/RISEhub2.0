import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/shared/page-header";
import { MeetingsClient } from "@/components/meetings/meetings-client";

export default async function MeetingsPage({searchParams}:{searchParams:Promise<{area?:string}>}) {
  const {area}=await searchParams;
  const [meetings, markets, initiatives] = await Promise.all([
    prisma.meeting.findMany({
      orderBy: { date: "desc" },
      include: {
        market: { select: { id: true, code: true, name: true } },
        initiative: { select: { id: true, code: true, name: true, isReleased: true } },
      },
    }),
    prisma.market.findMany({
      orderBy: { code: "asc" },
      select: { id: true, code: true, name: true },
    }),
    prisma.initiative.findMany({
      orderBy: { code: "asc" },
      select: { id: true, code: true, name: true },
    }),
  ]);

  return (
    <div>
      <PageHeader
        title="Meetings"
        description="Status reviews, steering committees, and workshops across the program."
      />
      <div className="mb-4 flex flex-wrap gap-2 text-sm"><a href="/meetings?area=ALL" className="rounded border px-3 py-2">All</a><a href="/meetings?area=BACKLOG" className="rounded border px-3 py-2">Backlog</a><a href="/meetings?area=ACTIVE" className="rounded border px-3 py-2">Active</a></div>
      <MeetingsClient meetings={meetings.filter(m=>area==="BACKLOG"?m.initiative?.isReleased===false:area==="ACTIVE"?m.initiative?.isReleased!==false:true)} markets={markets} initiatives={initiatives} />
    </div>
  );
}
