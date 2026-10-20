"use client";
import { useMemo,useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Search } from "lucide-react";
import { backlogPriorities,backlogStages } from "@/lib/backlog-fields";
type Row={id:string;code:string|null;name:string;owner:string;stage:string;status:string;priority:string;readiness:number};
export function BacklogTable({rows}:{rows:Row[]}){
 const router=useRouter();
 const [filter,setFilter]=useState("");const [busy,setBusy]=useState<string|null>(null);const [error,setError]=useState("");
 const [statusSaveState,setStatusSaveState]=useState<Record<string,"saving"|"saved"|"error">>({});
 const [editingStatusId,setEditingStatusId]=useState<string|null>(null);
 const [newStatus,setNewStatus]=useState("");
 const [draft,setDraft]=useState(rows);const [name,setName]=useState("");const [adding,setAdding]=useState(false);
 const filtered=useMemo(()=>draft.filter(r=>[r.name,r.code,r.owner,r.stage,r.status].join(" ").toLowerCase().includes(filter.toLowerCase())),[draft,filter]);
 async function save(id:string,values:Record<string,string>){
  setBusy(id);setError("");
  const previous=draft;setDraft(s=>s.map(r=>r.id===id?{...r,...values}:r));
  try{const response=await fetch("/api/backlog/"+id,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({section:"overview",...values})});
  if(!response.ok)throw Error((await response.json()).error||"Unable to save");router.refresh();}
  catch(e){setDraft(previous);setError(e instanceof Error?e.message:"Unable to save");}
  finally{setBusy(null);}
 }
 async function saveStatus(id:string,value:string){
  const trimmed=value.trim();
  if(!trimmed)return;
  setBusy(id);setError("");setStatusSaveState(s=>({...s,[id]:"saving"}));
  const previous=draft.find(r=>r.id===id)?.status??"";
  try{
   const response=await fetch("/api/backlog/"+id,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({section:"status",value:trimmed})});
   if(!response.ok)throw Error((await response.json()).error||"Unable to save status");
   setDraft(rows=>rows.map(r=>r.id===id?{...r,status:trimmed}:r));
   setStatusSaveState(s=>({...s,[id]:"saved"}));
   setEditingStatusId(null);setNewStatus("");
   router.refresh();
  }catch(e){
   setDraft(rows=>rows.map(r=>r.id===id?{...r,status:previous}:r));
   setStatusSaveState(s=>({...s,[id]:"error"}));
   setError(e instanceof Error?e.message:"Unable to save status");
  }finally{setBusy(null);}
 }
 async function create(){
  if(!name.trim())return;setBusy("new");setError("");
  try{
   const response=await fetch("/api/backlog",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name})});
   const data=await response.json();if(!response.ok)throw Error(data.error||"Unable to create");
   router.push("/initiatives/"+data.id);router.refresh();
  }catch(e){setError(e instanceof Error?e.message:"Unable to create");setBusy(null);}
 }
 return <div className="space-y-5">
  <div className="flex flex-wrap items-center justify-between gap-3">
   <div className="relative max-w-sm flex-1"><Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground"/><input aria-label="Search backlog" value={filter} onChange={e=>setFilter(e.target.value)} placeholder="Search backlog..." className="w-full rounded-lg border bg-background py-2 pl-9 pr-3 text-sm"/></div>
   <button type="button" onClick={()=>setAdding(v=>!v)} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"><Plus className="h-4 w-4"/>New Initiative</button>
  </div>
  {adding&&<div className="rounded-xl border bg-card p-4"><label className="block text-sm font-medium">Initiative name <span className="text-red-500">*</span></label><div className="mt-2 flex flex-wrap gap-2"><input value={name} maxLength={250} onChange={e=>setName(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")void create();}} autoFocus placeholder="Enter initiative name" className="min-w-52 flex-1 rounded-lg border bg-background px-3 py-2 text-sm"/><button disabled={!name.trim()||busy==="new"} onClick={()=>void create()} className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50">Create</button><button onClick={()=>setAdding(false)} className="rounded-lg border px-4 py-2 text-sm">Cancel</button></div><p className="mt-2 text-xs text-muted-foreground">ID is assigned automatically. Stage: Ideation.</p></div>}
  {error&&<p role="alert" className="text-sm text-red-600">{error}</p>}
  <div className="overflow-x-auto rounded-xl border bg-card"><table className="w-full min-w-[1150px] text-left text-sm">
   <thead className="bg-muted/50 text-xs text-muted-foreground"><tr><th className="p-3">ID</th><th className="p-3">Initiative</th><th className="p-3">Phase</th><th className="p-3">Priority</th><th className="p-3">Owner</th><th className="p-3">Status</th><th className="p-3">SREx Readiness</th></tr></thead>
   <tbody>{filtered.map(r=><tr key={r.id} className="border-t hover:bg-muted/20">
    <td className="p-3 text-muted-foreground">{r.code||"—"}</td><td className="p-3 font-medium"><Link href={`/initiatives/${r.id}`} className="hover:underline">{r.name}</Link></td>
    <td className="p-2"><select aria-label={`Phase for ${r.name}`} disabled={busy===r.id} value={r.stage} onChange={e=>void save(r.id,{stage:e.target.value})} className="w-full rounded border bg-background px-2 py-2">{backlogStages.map(s=><option key={s} value={s}>{s[0]+s.slice(1).toLowerCase()}</option>)}</select></td>
    <td className="p-2"><select aria-label={`Priority for ${r.name}`} disabled={busy===r.id} value={r.priority} onChange={e=>void save(r.id,{priority:e.target.value})} className="w-full rounded border bg-background px-2 py-2">{backlogPriorities.map(p=><option key={p} value={p}>{p||"Not set"}</option>)}</select></td>
    <td className="p-2"><input aria-label={`Owner for ${r.name}`} defaultValue={r.owner} key={r.id+"-"+r.owner} onBlur={e=>{if(e.target.value!==r.owner)void save(r.id,{owner:e.target.value});}} onKeyDown={e=>{if(e.key==="Enter")e.currentTarget.blur();}} className="w-44 rounded border bg-background px-2 py-2" placeholder="Not assigned"/></td>
    <td className="p-2">{editingStatusId===r.id?
     <input aria-label={`New status for ${r.name}`} autoFocus disabled={busy===r.id} value={newStatus} maxLength={2000}
      onChange={e=>setNewStatus(e.target.value)}
      onKeyDown={e=>{if(e.key==="Enter"){e.preventDefault();if(newStatus.trim())void saveStatus(r.id,newStatus);}else if(e.key==="Escape"){setEditingStatusId(null);setNewStatus("");}}}
      className={`w-64 rounded border bg-background px-2 py-2 text-foreground ${statusSaveState[r.id]==="error"?"border-destructive":""}`}
      placeholder="Enter new status, press Enter"/>
    :<button type="button" disabled={busy===r.id} aria-label={`Add new status for ${r.name}`}
       title="Click to add a new status. Existing entries cannot be edited."
       onClick={()=>{setEditingStatusId(r.id);setNewStatus("");setStatusSaveState(s=>({...s,[r.id]:"saved"}));}}
       className="min-h-9 w-64 rounded border bg-background px-2 py-2 text-left text-muted-foreground hover:bg-muted/40 disabled:opacity-50">
       {r.status||"Add status..."}
     </button>}</td>
    <td className="p-3"><div className="flex items-center gap-2"><div className="h-2 w-20 rounded-full bg-muted"><div className="h-2 rounded-full bg-emerald-500" style={{width:r.readiness+"%"}}/></div><span className="tabular-nums">{r.readiness}%</span></div></td>
   </tr>)}</tbody>
  </table>{filtered.length===0&&<p className="p-8 text-center text-sm text-muted-foreground">No backlog initiatives found.</p>}</div>
 </div>;
}
