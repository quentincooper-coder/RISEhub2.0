import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { backlogGroups,backlogPriorities,backlogStages,srexFields,srexReadiness } from "@/lib/backlog-fields";
import { Prisma } from "@/generated/prisma/client";
const backlogKeys=new Set(backlogGroups.flatMap(g=>g.fields.map(f=>f.key)));
const srexKeys=new Set(srexFields.map(f=>f.key));
export async function PATCH(req:Request,{params}:{params:Promise<{id:string}>}){
 const {id}=await params;
 try{
  const body=await req.json() as Record<string,unknown>;
  const existing=await prisma.initiative.findUnique({where:{id},include:{backlogData:true,srexData:true}});
  if(!existing)return NextResponse.json({error:"Not found"},{status:404});
  if(body.action==="release"||body.action==="return"){
   const release=body.action==="release";
   if(existing.isReleased===release)return NextResponse.json({ok:true});
   const sr=srexReadiness((existing.srexData?.fields??{}) as Record<string,unknown>);
   await prisma.$transaction([
    prisma.initiative.update({where:{id},data:{isReleased:release,releasedAt:release?new Date():null,stage:release?"ROLLOUT":"EVALUATION"}}),
    prisma.activity.create({data:{type:release?"INITIATIVE_RELEASED":"INITIATIVE_RETURNED",entityType:"Initiative",entityId:id,actor:"User",description:release?`Released ${existing.name} for implementation (SREx ${sr.percent}% complete)`:`Returned ${existing.name} to backlog`}})
   ]);
  } else if(body.section==="overview"){
   const update:Prisma.InitiativeUpdateInput={};
   if(typeof body.owner==="string")update.owner=body.owner.trim().slice(0,250);
   if(typeof body.stage==="string"&&backlogStages.includes(body.stage as typeof backlogStages[number])&&!existing.isReleased)update.stage=body.stage;
   if(typeof body.priority==="string"&&backlogPriorities.includes(body.priority as typeof backlogPriorities[number])){
    await prisma.backlogData.upsert({where:{initiativeId:id},create:{initiativeId:id,fields:{...((existing.backlogData?.fields??{}) as object),priority:body.priority}},update:{fields:{...((existing.backlogData?.fields??{}) as object),priority:body.priority}}});
   }
   if(Object.keys(update).length)await prisma.initiative.update({where:{id},data:update});
  }else if(body.section==="backlog"||body.section==="srex"){
   const keys=body.section==="backlog"?backlogKeys:srexKeys;
   if(typeof body.fields!=="object"||body.fields===null||Array.isArray(body.fields))return NextResponse.json({error:"Invalid fields"},{status:400});
   const input=body.fields as Record<string,unknown>;
   if(Object.keys(input).some(k=>!keys.has(k)||typeof input[k]!=="string"||String(input[k]).length>20000))return NextResponse.json({error:"Invalid field"},{status:400});
   const old=(body.section==="backlog"?existing.backlogData?.fields:existing.srexData?.fields)??{};
   const merged={...(old as object),...input};
   if(body.section==="backlog")await prisma.backlogData.upsert({where:{initiativeId:id},create:{initiativeId:id,fields:merged},update:{fields:merged}});
   else await prisma.srexData.upsert({where:{initiativeId:id},create:{initiativeId:id,fields:merged},update:{fields:merged}});
  }else{return NextResponse.json({error:"Invalid action"},{status:400});}
  revalidatePath("/backlog");revalidatePath("/initiatives");revalidatePath("/dashboard");revalidatePath(`/initiatives/${id}`);
  return NextResponse.json({ok:true});
 }catch(e){console.error("Backlog update failed",e);return NextResponse.json({error:"Save failed"},{status:500});}
}
