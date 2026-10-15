// Field definitions follow the RISE Backlog.xlsx template; overlapping SREx fields use the Initiative / backlog record.
export type FieldDef = { key: string; label: string; type?: "text" | "number" | "textarea" | "select"; options?: string[] };
export const backlogGroups: { title: string; fields: FieldDef[] }[] = [
 {title:"Initiative Details & Status",fields:[
  {key:"source",label:"Source of Initiative",type:"select",options:["Škoda HQ (RISE Team)","Importer","Dealer","Experts"]},{key:"pillar",label:"Pillar",type:"select",options:["Retail Franchise Attractive","Retail Process Efficiency","Sales Steering","Distribution, Cost, Fleet and Remarketing","Customer Experience with Human Touch","Digital Interactions Optimization and AI"]},{key:"strategicArea",label:"Retailer Key Cost / Revenue Center",type:"select",options:["Standards & Housing","People, Processes & Systems","Money & Financing","Additional Business"]},{key:"brandApplicability",label:"Brand applicability",type:"select",options:["Škoda Exclusive","Multi-Brand"]},{key:"descriptionExtended",label:"Detailed description",type:"textarea"}]},
 {title:"Business Case & Expected Benefits",fields:[
  {key:"retailerBenefitRating",label:"Financial Benefit for retailers per year (Rating)",type:"select",options:["None (0k EUR)","Low (<5k EUR)","Medium (<15k EUR)","High (>15k EUR)"]},
  {key:"retailerBenefitEUR",label:"Financial Benefit per retailer per year (EUR)",type:"number"},
  {key:"importerBenefitEUR",label:"Financial Benefit for importer (EUR)",type:"number"},
  {key:"hqBenefitEUR",label:"Financial Benefit for HQ (EUR)",type:"number"},
  {key:"customerSatisfaction",label:"Customer Satisfaction Impact",type:"select",options:["-1 - negative","0 - low / no","+ 1 - medium","+2 - high","+3 - wow factor"]},
  {key:"additionalBusinessCase",label:"Additional business case notes",type:"textarea"},
  {key:"hqInvestmentEUR",label:"Initial Investment HQ (EUR)",type:"number"},
  {key:"importerInvestmentEUR",label:"Initial Investment Importer (EUR)",type:"number"},
  {key:"dealerInvestmentEUR",label:"Initial Investment Dealer (EUR)",type:"number"},
  {key:"runningCostsEUR",label:"Running Costs (EUR)",type:"number"}]},
 {title:"Risks & Validation",fields:[
  {key:"riskLevel",label:"Potential Risk Level",type:"select",options:["Low","Medium","High"]},{key:"potentialRisks",label:"Potential Risks – Description",type:"textarea"},
  {key:"pilotingMarkets",label:"Piloting Markets"},
  {key:"pilotingStatus",label:"Piloting Status",type:"select",options:["Planned","Ongoing","Piloted"]},
  {key:"pilotDetails",label:"Pilot Details",type:"textarea"},
  {key:"validatingMarkets",label:"Validating Markets"},
  {key:"marketValidationStatus",label:"Market Validation Status",type:"select",options:["Not assessed","In progress","Validated","Not validated"]}]},
 {title:"Implementation Preparation",fields:[
  {key:"implementationPriority",label:"Implementation Priority",type:"select",options:["Requested","Recommended","Minimum Standard"]},
  {key:"scalability",label:"Scalability",type:"select",options:["Low (single EU markets)","Medium (selected EU markets)","High (Europe-wide)"]},
  {key:"kpi1",label:"Key KPI (1)"},{key:"kpi2",label:"Key KPI (2)"},{key:"kpi3",label:"Key KPI (3)"},
  {key:"supportNeeded",label:"Support needed to get ready for market implementation",type:"textarea"},
  {key:"statusNotes",label:"Status Update / Notes",type:"textarea"}]}
];
export const srexFields: FieldDef[]=[
 {key:"shortDescription",label:"Short description",type:"textarea"},
 {key:"painPoints",label:"Current Pain Points",type:"textarea"},
 {key:"targetPicture",label:"Target Picture",type:"textarea"},
 {key:"implementationInMarkets",label:"Implementation in markets",type:"textarea"},
 {key:"pilotingRolledOut",label:"Markets piloting / rolled-out",type:"textarea"},
 {key:"whenReady",label:"When ready for markets"},
 {key:"feasibility",label:"Feasibility of Implementation",type:"select",options:["0","1 - Trivial","2 - Very Low","3 - Routine","4 - Low Complexity","5 - Manageable","6 - Moderately challenging","7 - Challenging","8 - High Complexity","9 - Very High","10 - Moonshot"]},
 {key:"valueTrigger",label:"Value trigger",type:"select",options:["Cost decrease","Revenue increase","Customer experience","Process optimization","Enabler"]},
 {key:"valueModel",label:"Value model",type:"textarea"},
 {key:"assumptions",label:"Assumptions",type:"textarea"},
 {key:"prerequisites",label:"Prerequisites",type:"textarea"},
 {key:"referenceLink",label:"Link to further relevant information"}
];
// SREx overlaps (name, ID, owner, brand, CSAT, financial benefit) come from the common initiative / backlog fields.
export function srexReadiness(data: Record<string,unknown> | null | undefined){
 const filled=srexFields.filter(f=>{const value=String(data?.[f.key]??"").trim();return value.length>0;}).length;
 return {filled,total:srexFields.length,percent:Math.round(filled/srexFields.length*100)};
}
export const backlogStages=["IDEATION","EVALUATION","DETAILING","DEVELOPMENT"] as const;
export const backlogPriorities=["","Wave 1 (Quick wins)","Wave 2 (Big tickets)","Wave 3","Wave 4"] as const;
