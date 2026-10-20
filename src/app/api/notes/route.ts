import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const content = typeof body.content === "string" ? body.content.trim() : "";
    const marketId = typeof body.marketId === "string" && body.marketId ? body.marketId : null;
    const initiativeId = typeof body.initiativeId === "string" && body.initiativeId !== "GENERAL" && body.initiativeId ? body.initiativeId : null;
    if (!content || (!marketId && !initiativeId)) return NextResponse.json({ error: "Note and a market or initiative are required." }, { status: 400 });
    const [market,initiative] = await Promise.all([
      marketId ? prisma.market.findUnique({ where:{id:marketId},select:{id:true} }) : Promise.resolve(null),
      initiativeId ? prisma.initiative.findUnique({ where:{id:initiativeId},select:{id:true} }) : Promise.resolve(null),
    ]);
    if ((marketId && !market) || (initiativeId && !initiative)) return NextResponse.json({ error:"Market or initiative not found." },{status:400});
    const note = await prisma.note.create({ data:{content,marketId,initiativeId} });
    // Activity is supplementary: never report a failed note when its insert succeeded.
    try {
      await prisma.activity.create({data:{type:"NOTE_CREATED",description:initiativeId?"Added an initiative note":"Added a market note",entityType:initiativeId?"Initiative":"Market",entityId:initiativeId??marketId!,actor:"You"}});
    } catch (activityError) {
      console.error("Note saved, but activity logging failed", activityError);
    }
    if(initiativeId)revalidatePath(`/initiatives/${initiativeId}`);
    if(marketId)revalidatePath(`/markets/${marketId}`);
    return NextResponse.json(note,{status:201});
  } catch (error) {
    console.error("Could not save note",error);
    return NextResponse.json({ error:"Could not save note. Please try again." },{status:500});
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const id = typeof body.id === "string" ? body.id : "";
    const marketId = typeof body.marketId === "string" ? body.marketId : "";
    if (!id || !marketId) return NextResponse.json({ error: "Note and market are required." }, { status: 400 });
    const deleted = await prisma.note.deleteMany({ where: { id, marketId } });
    if (deleted.count === 0) return NextResponse.json({ error: "Note not found." }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not delete note." }, { status: 500 });
  }
}
