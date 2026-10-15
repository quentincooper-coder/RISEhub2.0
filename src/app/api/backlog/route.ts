import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function POST(req:Request){
 try {
  const body=await req.json();
  const name=typeof body.name==="string"?body.name.trim():"";
  if(!name||name.length>250)return NextResponse.json({error:"Initiative name is required (max 250 characters)."}, {status:400});
  const item=await prisma.initiative.create({data:{name,description:"",owner:"",stage:"IDEATION",isReleased:false}});
  const code="BL-"+item.id.slice(-8).toUpperCase();
  await prisma.initiative.update({where:{id:item.id},data:{code}});
  return NextResponse.json({id:item.id,code},{status:201});
 }catch(e){console.error("Backlog create failed",e);return NextResponse.json({error:"Could not create initiative"},{status:500});}
}
