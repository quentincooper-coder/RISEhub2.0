// Field definitions follow the RISE Backlog.xlsx template; overlapping SREx fields use the Initiative / backlog record.
export type FieldDef = { key: string; label: string; type?: "text" | "number" | "textarea" | "select"; options?: string[] };
export const backlogGroups: { title: string; fields: FieldDef[] }[] = [
 {title:"Initiative Details & Status",fields:[
  {key:"source",label:"Source of Initiative"},{key:"pillar",label:"Pillar"},{key:"strategicArea",label:"Retailer Key Cost / Revenue Center"},{key:"brandApplicability",label:"Brand applicability"},{key:"descriptionExtended",label:"Detailed description",type:"textarea"}]},
 {title:"Business Case & Expected Benefits",fields:[
  {key:"retailerBenefitRating",label:"Financial Benefit for retailers per year (Rating)"},
  {key:"retailerBenefitEUR",label:"Financial Benefit per retailer per year (EUR)",type:"number"},
  {key:"importerBenefitEUR",label:"Financial Benefit for importer (EUR)",type:"number"},
  {key:"hqBenefitEUR",label:"Financial Benefit for HQ (EUR)",type:"number"},
  {key:"customerSatisfaction",label:"Customer Satisfaction Impact"},
  {key:"additionalBusinessCase",label:"Additional business case notes",type:"textarea"},
  {key:"hqInvestmentEUR",label:"Initial Investment HQ (EUR)",type:"number"},
  {key:"importerInvestmentEUR",label:"Initial Investment Importer (EUR)",type:"number"},
  {key:"dealerInvestmentEUR",label:"Initial Investment Dealer (EUR)",type:"number"},
  {key:"runningCostsEUR",label:"Running Costs (EUR)",type:"number"}]},
 {title:"Risks & Validation",fields:[
  {key:"potentialRisks",label:"Potential Risks",type:"textarea"},
  {key:"pilotingMarkets",label:"Piloting Markets"},
  {key:"pilotingStatus",label:"Piloting Status"},
  {key:"pilotDetails",label:"Pilot Details",type:"textarea"},
  {key:"validatingMarkets",label:"Validating Markets"},
  {key:"marketValidationStatus",label:"Market Validation Status"}]},
 {title:"Implementation Preparation",fields:[
  {key:"implementationPriority",label:"Implementation Priority"},
  {key:"scalability",label:"Scalability"},
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
 {key:"feasibility",label:"Feasibility of Implementation",type:"textarea"},
 {key:"valueTrigger",label:"Value trigger",type:"textarea"},
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
export const backlogPriorities=["","Wave 1 (Quick wins)","Wave 2","Wave 3","High","Medium","Low"] as const;
