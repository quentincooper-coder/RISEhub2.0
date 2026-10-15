"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MeetingForm } from "@/components/forms/meeting-form";
import { meetingTypeLabel } from "@/lib/status";

type Meeting = {
 id:string;title:string;type:string;scope:string;date:Date;notes:string;
 participants:string|null;location:string|null;documentUrl:string|null;
 marketId:string|null;initiativeId:string|null;
};
type Initiative={id:string;code:string|null;name:string};
type Market={id:string;code:string;name:string};

export function InitiativeMeetingsList({meetings,initiative,markets}:{meetings:Meeting[];initiative:Initiative;markets:Market[]}){
 const router=useRouter();
 const [selected,setSelected]=useState<Meeting|null>(null);
 return <>
  <div className="space-y-3">
   {meetings.length===0?<p className="text-sm text-muted-foreground">No initiative meetings scheduled.</p>:
   meetings.map(m=><button key={m.id} type="button" onClick={()=>setSelected(m)} className="flex w-full items-center justify-between rounded-lg border p-3 text-left transition-colors hover:bg-secondary/40" aria-label={`View or edit meeting ${m.title}`}>
    <div><p className="text-sm font-medium">{m.title}</p><p className="text-xs text-muted-foreground">{format(new Date(m.date),"EEE, MMM d yyyy")} · {meetingTypeLabel(m.type)}</p><p className="mt-1 text-xs text-muted-foreground">Click to view or edit</p></div>
    <Pencil className="h-4 w-4 shrink-0 text-muted-foreground"/>
   </button>)}
  </div>
  <Dialog open={selected!==null} onOpenChange={open=>{if(!open)setSelected(null)}}>
   <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
    <DialogHeader><DialogTitle>Edit Meeting</DialogTitle></DialogHeader>
    {selected&&<MeetingForm key={selected.id} meeting={selected} markets={markets} initiatives={[initiative]} onSuccess={()=>{setSelected(null);router.refresh()}}/>}
   </DialogContent>
  </Dialog>
 </>;
}
