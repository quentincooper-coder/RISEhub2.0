"use client";
import {useEffect,useRef,useState} from "react";
import {useRouter} from "next/navigation";
import {backlogGroups,srexFields,srexReadiness,type FieldDef} from "@/lib/backlog-fields";
type Data=Record<string,string>;
function FormSection({title,fields,values,onChange}:{title:string;fields:FieldDef[];values:Data;onChange:(key:string,value:string)=>void}){
 return <section className="space-y-4"><h3 className="border-b pb-2 text-base font-semibold">{title}</h3><div className="grid gap-4 md:grid-cols-2">{fields.map(f=><label key={f.key} className={`block space-y-1 text-sm ${f.type==="textarea"?"md:col-span-2":""}`}><span className="font-medium">{f.label}</span>{f.type==="textarea"?<textarea value={values[f.key]??""} onChange={e=>onChange(f.key,e.target.value)} rows={3} className="w-full rounded-lg border bg-background px-3 py-2"/>:f.type==="select"?<select value={values[f.key]??""} onChange={e=>onChange(f.key,e.target.value)} className="w-full rounded-lg border bg-background px-3 py-2"><option value="">Not set</option>{values[f.key]&&!f.options?.includes(values[f.key])?<option value={values[f.key]}>{values[f.key]} (previous value)</option>:null}{f.options?.map(option=><option key={option} value={option}>{option}</option>)}</select>:f.key==="retailerBenefitEUR"?<div className="flex items-center gap-2"><input type="number" step="100" value={values[f.key]??""} onChange={e=>onChange(f.key,e.target.value)} className="min-w-0 flex-1 rounded-lg border bg-background px-3 py-2"/><span className="shrink-0 font-medium text-muted-foreground">€</span></div>:<input type={f.type==="number"?"number":"text"} value={values[f.key]??""} onChange={e=>onChange(f.key,e.target.value)} className="w-full rounded-lg border bg-background px-3 py-2"/>}</label>)}</div></section>;
}
export function InitiativeBacklogDetails({initiativeId,isReleased,backlog,srex,shared}:{initiativeId:string;isReleased:boolean;backlog:Data;srex:Data;shared:{code:string;name:string;owner:string;brand:string;csat:string;benefit:string}}){
 const router=useRouter();
 const [tab,setTab]=useState<"backlog"|"srex">("backlog");
 const [backlogValues,setBacklog]=useState(backlog);
 const [srexValues,setSrex]=useState(srex);
 const [busy,setBusy]=useState(false);
 const [message,setMessage]=useState("");
 const [confirm,setConfirm]=useState(false);
 const [saveStatus,setSaveStatus]=useState<"saved"|"pending"|"saving"|"error">("saved");
 const drafts=useRef({backlog:{...backlog},srex:{...srex}});
 const dirty=useRef({backlog:new Set<string>(),srex:new Set<string>()});
 const timer=useRef<ReturnType<typeof setTimeout>|null>(null);
 const queue=useRef<Promise<void>>(Promise.resolve());
 const latestError=useRef(false);
 const readiness=srexReadiness(srexValues);
 // Keep edits to both tabs independently. All writes run sequentially to prevent stale JSON updates.
 function enqueueSave(){
  if(timer.current){clearTimeout(timer.current);timer.current=null;}
  const changes=(["backlog","srex"] as const).flatMap(section=>{
   const keys=[...dirty.current[section]];
   if(!keys.length)return [];
   dirty.current[section].clear();
   return [{section,fields:Object.fromEntries(keys.map(key=>[key,drafts.current[section][key]??""]))}];
  });
  if(!changes.length)return queue.current;
  setSaveStatus("saving");
  queue.current=queue.current.catch(()=>{}).then(async()=>{
   for(const change of changes){
    try{
     const response=await fetch("/api/backlog/"+initiativeId,{
      method:"PATCH",headers:{"Content-Type":"application/json"},
      body:JSON.stringify(change)
     });
     if(!response.ok)throw Error("Autosave failed");
     latestError.current=false;
     setSaveStatus("saved");
    }catch{
     // Restore unsaved values and keep them available for the next save attempt.
     for(const [key,value] of Object.entries(change.fields)){
      if(!dirty.current[change.section].has(key)){
       dirty.current[change.section].add(key);
       drafts.current[change.section][key]=value;
      }
     }
     latestError.current=true;
     setSaveStatus("error");
     return;
    }
   }
  });
  return queue.current;
 }
 function scheduleSave(){
  setSaveStatus("pending");
  if(timer.current)clearTimeout(timer.current);
  timer.current=setTimeout(()=>{void enqueueSave();},650);
 }
 function setField(key:string,value:string){
  const section=tab;
  drafts.current[section][key]=value;
  dirty.current[section].add(key);
  (section==="backlog"?setBacklog:setSrex)(old=>({...old,[key]:value}));
  setMessage("");
  scheduleSave();
 }
 useEffect(()=>{
  const warn=(event:BeforeUnloadEvent)=>{
   if(dirty.current.backlog.size||dirty.current.srex.size||saveStatus==="saving"){
    event.preventDefault();
   }
  };
  window.addEventListener("beforeunload",warn);
  return ()=>{
   if(timer.current)clearTimeout(timer.current);
   window.removeEventListener("beforeunload",warn);
  };
 },[saveStatus]);
 async function switchLifecycle(){
  setBusy(true);setMessage("");
  try{
   await enqueueSave();
   await queue.current;
   if(latestError.current||dirty.current.backlog.size||dirty.current.srex.size){
    setMessage("Your edits could not be saved. Please retry before changing lifecycle.");
    return;
   }
   const response=await fetch("/api/backlog/"+initiativeId,{
    method:"PATCH",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({action:isReleased?"return":"release"})
   });
   if(!response.ok)throw Error("Could not change initiative status");
   setConfirm(false);
   router.push(isReleased?"/backlog":"/initiatives");
   router.refresh();
  }catch(e){setMessage(e instanceof Error?e.message:"Unable to update");}
  finally{setBusy(false);}
 }
 function retry(){latestError.current=false;void enqueueSave();}
 return <div className="space-y-5 rounded-xl border bg-card p-5">
  <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-lg font-semibold">Backlog & SREx Content</h2><p className="text-sm text-muted-foreground">One initiative, one source of truth.</p></div><div className="flex items-center gap-2"><span className="text-sm">SREx: {readiness.percent}%</span><div className="h-2 w-24 rounded-full bg-muted"><div className="h-2 rounded-full bg-emerald-500" style={{width:readiness.percent+"%"}}/></div></div></div>
  <div className="flex flex-wrap gap-2"><button onClick={()=>{void enqueueSave();setTab("backlog");setMessage("");}} className={`rounded-lg px-4 py-2 text-sm ${tab==="backlog"?"bg-primary text-primary-foreground":"border"}`}>Backlog Details</button><button onClick={()=>{void enqueueSave();setTab("srex");setMessage("");}} className={`rounded-lg px-4 py-2 text-sm ${tab==="srex"?"bg-primary text-primary-foreground":"border"}`}>SREx Content</button></div>
  {tab==="backlog"?<div className="space-y-8">{backlogGroups.map(g=><FormSection key={g.title} title={g.title} fields={g.fields} values={backlogValues} onChange={setField}/>)}</div>:
  <div className="space-y-6"><p className="text-sm text-muted-foreground">Content prepared externally can be pasted here. Fields already stored elsewhere do not contribute to readiness. Enter "Not applicable" when a section does not apply.</p>
   <div className="grid gap-2 rounded-lg bg-muted/40 p-4 text-sm md:grid-cols-2"><p><b>ID:</b> {shared.code}</p><p><b>Initiative:</b> {shared.name}</p><p><b>Owner:</b> {shared.owner||"Not set"}</p><p><b>Brand relevance:</b> {shared.brand||"Not set"}</p><p><b>Customer satisfaction:</b> {shared.csat||"Not set"}</p><p><b>Annual financial benefit:</b> {shared.benefit||"Not set"}</p></div>
   <FormSection title="SREx Content" fields={srexFields} values={srexValues} onChange={setField}/><p className="text-xs text-muted-foreground">{readiness.filled} of {readiness.total} independent text fields completed.</p>
  </div>}
  <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
   <button disabled={busy} onClick={()=>{void enqueueSave();setConfirm(true);}} className="rounded-lg border px-4 py-2 text-sm font-medium">{isReleased?"Return to Backlog":"Release for Implementation"}</button>
   <div className="flex items-center gap-3">
    <span role="status" aria-live="polite" className={`text-sm ${saveStatus==="error"?"text-destructive":"text-muted-foreground"}`}>{message||({saved:"All changes saved",pending:"Unsaved changes – saving shortly...",saving:"Saving changes...",error:"Autosave failed – changes not saved"}[saveStatus])}</span>
    {saveStatus==="error"&&<button type="button" onClick={retry} className="rounded-lg border px-3 py-2 text-sm">Retry save</button>}
   </div>
  </div>
  {confirm&&<div role="dialog" aria-modal="true" aria-label="Confirm lifecycle change" className="rounded-lg border border-amber-400 bg-background p-5 shadow-lg"><h3 className="font-semibold">{isReleased?"Return initiative to Backlog?":"Release for Implementation?"}</h3><p className="mt-2 text-sm text-muted-foreground">{isReleased?"All tasks, meetings, markets and SREx content will be retained and remain editable. The initiative will stop counting as active.":readiness.percent<100?`Warning: SREx content is only ${readiness.percent}% complete. Release is still allowed.`:"SREx content is complete."}</p><p className="mt-1 text-xs text-muted-foreground">Any unsaved edits are saved automatically before proceeding.</p><div className="mt-4 flex justify-end gap-2"><button onClick={()=>setConfirm(false)} className="rounded border px-3 py-2 text-sm">Cancel</button><button disabled={busy} onClick={()=>void switchLifecycle()} className="rounded bg-primary px-3 py-2 text-sm text-primary-foreground disabled:opacity-50">Confirm</button></div></div>}
 </div>;
}
