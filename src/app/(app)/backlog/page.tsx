import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/shared/page-header";
import { BacklogTable } from "@/components/backlog/backlog-table";
import { srexReadiness } from "@/lib/backlog-fields";
export const dynamic="force-dynamic";export const revalidate=0;
export default async function BacklogPage(){
 const initiatives=await prisma.initiative.findMany({where:{isReleased:false},orderBy:{createdAt:"desc"},include:{backlogData:true,srexData:true}});
 return <div className="space-y-6"><PageHeader title="Backlog" description="Pipeline of initiatives under preparation. Release to Implementation when ready."/>
  <BacklogTable rows={initiatives.map(i=>({id:i.id,code:i.code,name:i.name,owner:i.owner,stage:i.stage,priority:String(((i.backlogData?.fields??{}) as Record<string,unknown>).priority??""),readiness:srexReadiness((i.srexData?.fields??{}) as Record<string,unknown>).percent}))}/>
 </div>;
}
