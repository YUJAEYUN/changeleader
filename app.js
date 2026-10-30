const systemTotals={"전체":12,"하나포털":3,"하나플러스":4,"컴플라이언스시스템":2,"정보보호포털":2,"법령통지시스템":1};
const statusTotals={all:12,approved:4,pending:6,rejected:2};
const statusLabel={all:"전체",approved:"승인완료",pending:"결재대기",rejected:"반려"};
const DAY_NAMES=["일","월","화","수","목","금","토"];
const loadedAt=new Date();
const dayKey=[loadedAt.getFullYear(),String(loadedAt.getMonth()+1).padStart(2,"0"),String(loadedAt.getDate()).padStart(2,"0")].join("-");
const READ_KEY="changeleader-read-"+dayKey;

function relativeDate(daysAgo){
  const d=new Date(loadedAt.getFullYear(),loadedAt.getMonth(),loadedAt.getDate());
  d.setDate(d.getDate()-daysAgo);
  return d;
}
function fmtDate(d){return `${d.getFullYear()}. ${String(d.getMonth()+1).padStart(2,"0")}. ${String(d.getDate()).padStart(2,"0")}`;}
function fmtAsOf(d){return `${fmtDate(d)}. (${DAY_NAMES[d.getDay()]}) ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")} 기준`;}
function isoDate(d){return `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,"0")}${String(d.getDate()).padStart(2,"0")}`;}
function docNo(prefix,seq){return `${prefix}-${loadedAt.getFullYear()}-${String(seq).padStart(5,"0")}`;}

const dates=[0,0,1,1,2,2,3,4,4,5,6,7].map(relativeDate);
const documents=[
  {id:1,status:"pending",number:docNo("HP",928),title:"마케팅 행사 운영비 승인 요청",system:"하나플러스",requester:"이서연",date:dates[0],summary:"금주 진행 예정인 고객 대상 마케팅 행사의 운영비 집행을 위한 승인 요청입니다.",isNew:true},
  {id:2,status:"pending",number:docNo("HPT",924),title:"시스템 개선 작업 승인 요청",system:"하나포털",requester:"이준호",date:dates[1],summary:"내부 업무 시스템 개선 작업 시행을 위한 승인 요청입니다.",isNew:true},
  {id:3,status:"approved",number:docNo("HP",927),title:"사내 교육 프로그램 결과 보고",system:"하나플러스",requester:"김민수",date:dates[2],summary:"사내 교육 프로그램 운영 결과 및 후속 조치 보고입니다."},
  {id:4,status:"pending",number:docNo("CP",411),title:"광고 심의 요청서",system:"컴플라이언스시스템",requester:"박지훈",date:dates[3],summary:"대외 광고 집행 전 컴플라이언스 심의를 요청합니다."},
  {id:5,status:"rejected",number:docNo("IS",352),title:"보안 취약점 조치 결과 보고",system:"정보보호포털",requester:"정다운",date:dates[4],summary:"보안 취약점 조치 결과에 대한 검토 문서입니다."},
  {id:6,status:"pending",number:docNo("HP",915),title:"서비스 개선 기획안 결재 요청",system:"하나플러스",requester:"김민수",date:dates[5],summary:"고객 서비스 개선을 위한 기획안 결재 요청입니다."},
  {id:7,status:"approved",number:docNo("HPT",920),title:"부서 공문 발송 승인",system:"하나포털",requester:"박민수",date:dates[6],summary:"대내외 공문 발송을 위한 승인 문서입니다."},
  {id:8,status:"approved",number:docNo("CP",188),title:"내부통제 점검 계획(안)",system:"컴플라이언스시스템",requester:"한지민",date:dates[7],summary:"분기 내부통제 점검 계획에 대한 승인 문서입니다."},
  {id:9,status:"pending",number:docNo("LS",89),title:"법령 개정사항 검토 요청",system:"법령통지시스템",requester:"오세훈",date:dates[8],summary:"신규 법령 개정사항의 업무 영향 검토 요청입니다."},
  {id:10,status:"pending",number:docNo("IS",341),title:"개인정보 처리방침 개정 검토",system:"정보보호포털",requester:"이지은",date:dates[9],summary:"개인정보 처리방침 개정안 검토 요청입니다."},
  {id:11,status:"approved",number:docNo("HP",925),title:"거래처 계약 검토 요청",system:"하나플러스",requester:"최유진",date:dates[10],summary:"신규 거래처 계약 체결을 위한 내부 검토 요청입니다."},
  {id:12,status:"rejected",number:docNo("HPT",910),title:"대외기관 문서 수신 보고",system:"하나포털",requester:"정다운",date:dates[11],summary:"대외기관 수신 문서에 대한 검토 및 보고 문서입니다."}
];

let savedRead={};
try{savedRead=JSON.parse(localStorage.getItem(READ_KEY)||"{}");}catch{}
const readState={};
documents.forEach(doc=>readState[doc.id]=doc.isNew?Boolean(savedRead[doc.id]):true);

const state={status:"all",system:"전체",search:"",dateFilter:"all",readFilter:"all",sortDesc:true,page:1,pageSize:10,ssoTarget:null,clickedId:null,activeDocId:null,activeTab:"dashboard"};

const icons={
  all:'<svg viewBox="0 0 24 24"><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v5h5"/><path d="M9 12h6M9 16h6"/></svg>',
  approved:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></svg>',
  pending:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v6l4 2"/></svg>',
  rejected:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="m9 9 6 6M15 9l-6 6"/></svg>'
};
function systemIcon(name){
  if(name==="정보보호포털") return '<svg viewBox="0 0 24 24"><path d="M12 3 4 6v5c0 5 3.4 8.3 8 10 4.6-1.7 8-5 8-10V6z"/><path d="m9 12 2 2 4-4"/></svg>';
  if(name==="법령통지시스템") return '<svg viewBox="0 0 24 24"><path d="M12 3v18M5 7h14"/><path d="m5 7-3 6h6zM19 7l-3 6h6z"/><path d="M8 21h8"/></svg>';
  return icons.all;
}
function envelopeIcon(isRead){
  return isRead
    ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10l8-6 8 6v9H4z"/><path d="m4 11 8 6 8-6"/><path d="m4 10 8 5 8-5"/></svg>'
    : '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="6" width="16" height="12" rx="2"/><path d="m4 8 8 6 8-6"/></svg>';
}
function appIcon(name){
  const paths={
    "전체":'<path d="M5 5h5v5H5zM14 5h5v5h-5zM5 14h5v5H5zM14 14h5v5h-5z"/>',
    "하나포털":'<path d="M6 4h8l4 4v12H6z"/><path d="M14 4v5h5"/><path d="M9 13h6M9 16h4"/>',
    "하나플러스":'<path d="M12 5v14M5 12h14"/><path d="m15 16 2 2 4-5"/>',
    "컴플라이언스시스템":'<path d="M12 3 5 6v5c0 4.5 2.8 7.4 7 9 4.2-1.6 7-4.5 7-9V6z"/><path d="m9 12 2 2 4-4"/>',
    "정보보호포털":'<path d="M12 3 5 6v5c0 4.5 2.8 7.4 7 9 4.2-1.6 7-4.5 7-9V6z"/><rect x="9" y="10" width="6" height="5" rx="1"/><path d="M10.5 10V8.7a1.5 1.5 0 0 1 3 0V10"/>',
    "법령통지시스템":'<path d="M12 4v16M6 7h12"/><path d="m6 7-3 6h6zM18 7l-3 6h6z"/><path d="M8 20h8"/>'
  };
  return '<span class="app-icon-tile"><svg viewBox="0 0 24 24" aria-hidden="true">'+paths[name]+'</svg></span>';
}
function saveReadState(){localStorage.setItem(READ_KEY,JSON.stringify(readState));}
function setRead(id,value){readState[id]=value;saveReadState();renderNotices();renderDocuments();if(state.activeTab==="detail"&&state.activeDocId===id)renderDocumentView(id);}
function unreadNewDocs(){return documents.filter(d=>d.isNew&&!readState[d.id]);}

function renderWorkspaceTabs(){
  const root=document.getElementById("workspaceTabs");
  let detail="";
  if(state.activeDocId){
    const doc=documents.find(d=>d.id===state.activeDocId);
    if(doc){
      const shortTitle=doc.title.length>18?doc.title.slice(0,18)+"…":doc.title;
      detail=`<button class="workspace-tab ${state.activeTab==="detail"?"active":""}" data-tab-id="detail" type="button"><span class="tab-label">결재 상세 · ${shortTitle}</span><span class="tab-close" data-close-detail>×</span></button>`;
    }
  }
  root.innerHTML=`<button class="workspace-tab ${state.activeTab==="dashboard"?"active":""}" data-tab-id="dashboard" type="button"><span class="tab-label">결재 대시보드</span></button>${detail}`;
  root.querySelector("[data-tab-id='dashboard']").addEventListener("click",()=>activateTab("dashboard"));
  const detailTab=root.querySelector("[data-tab-id='detail']");
  if(detailTab) detailTab.addEventListener("click",e=>{if(!e.target.closest("[data-close-detail]"))activateTab("detail");});
  const close=root.querySelector("[data-close-detail]");
  if(close) close.addEventListener("click",e=>{e.stopPropagation();closeDetailTab();});
}
function activateTab(tab){
  state.activeTab=tab;
  document.getElementById("ssoView").hidden=true;
  if(tab==="dashboard"){
    document.getElementById("dashboardView").hidden=false;
    document.getElementById("documentView").hidden=true;
  }else if(tab==="detail"&&state.activeDocId){
    document.getElementById("dashboardView").hidden=true;
    document.getElementById("documentView").hidden=false;
    renderDocumentView(state.activeDocId);
  }
  renderWorkspaceTabs();
}
function openDocumentTab(id){
  state.activeDocId=id;
  setRead(id,true);
  state.activeTab="detail";
  document.getElementById("dashboardView").hidden=true;
  document.getElementById("ssoView").hidden=true;
  document.getElementById("documentView").hidden=false;
  renderDocumentView(id);
  renderWorkspaceTabs();
}
function closeDetailTab(){
  state.activeDocId=null;
  state.activeTab="dashboard";
  document.getElementById("dashboardView").hidden=false;
  document.getElementById("documentView").hidden=true;
  document.getElementById("ssoView").hidden=true;
  renderWorkspaceTabs();
}
function renderDocumentView(id){
  const doc=documents.find(d=>d.id===id);if(!doc)return;
  document.getElementById("docSystemLabel").textContent=doc.system;
  document.getElementById("docViewTitle").textContent=doc.title;
  document.getElementById("docMeta").innerHTML=`<span>${doc.number}</span><span>${doc.requester}</span><span>${fmtDate(doc.date)}</span><span class="status-badge ${doc.status}">${statusLabel[doc.status]}</span>`;
  document.getElementById("documentSummaryGrid").innerHTML=[
    ["문서번호",doc.number],["요청자",doc.requester],["요청일",fmtDate(doc.date)],["시스템",doc.system]
  ].map(([k,v])=>`<div class="summary-cell"><span>${k}</span><strong>${v}</strong></div>`).join("");
  document.getElementById("docSummaryText").textContent=doc.summary;
  const approve=document.getElementById("docApprovalBtn");
  approve.hidden=doc.status!=="pending";
  approve.onclick=()=>showSso(doc.system,doc.id);
}
function renderStatusTabs(){
  const root=document.getElementById("statusTabs");
  root.innerHTML=Object.keys(statusLabel).map(key=>`<button class="status-tab ${state.status===key?"active":""}" data-status="${key}" type="button">${icons[key]}<span>${statusLabel[key]}</span><span class="status-count">${statusTotals[key]}</span></button>`).join("");
  root.querySelectorAll("[data-status]").forEach(btn=>btn.addEventListener("click",()=>{state.status=btn.dataset.status;state.page=1;renderDashboard();}));
}
function renderSystemCards(){
  const systems=[["전체","전체 결재 건수",""],["하나포털","하나포털","(문서 수발신)"],["하나플러스","하나플러스","(업무 전자결재)"],["컴플라이언스시스템","컴플라이언스시스템",""],["정보보호포털","정보보호포털",""],["법령통지시스템","법령통지시스템",""]];
  const root=document.getElementById("systemCards");
  root.innerHTML=systems.map(([key,name,sub])=>`<button class="system-card ${key==="전체"?"total":""} ${state.system===key?"selected":""}" data-system="${key}" type="button"><div class="system-card-header">${appIcon(key)}<div class="system-card-copy"><div class="system-name">${name}</div><div class="system-sub">${sub||"&nbsp;"}</div></div></div><div class="system-metric"><span class="system-number">${systemTotals[key]}</span><span class="system-unit">건</span></div></button>`).join("");
  root.querySelectorAll("[data-system]").forEach(btn=>btn.addEventListener("click",()=>{state.system=btn.dataset.system;state.page=1;renderDashboard();}));
}
function dateValue(d){return Number(isoDate(d));}
function filteredDocuments(){
  let rows=documents.filter(doc=>{
    const statusOk=state.status==="all"||doc.status===state.status;
    const systemOk=state.system==="전체"||doc.system===state.system;
    const q=state.search.trim().toLowerCase();
    const searchOk=!q||[doc.number,doc.title,doc.system,doc.requester].some(v=>v.toLowerCase().includes(q));
    const days=Math.round((new Date(loadedAt.getFullYear(),loadedAt.getMonth(),loadedAt.getDate())-new Date(doc.date.getFullYear(),doc.date.getMonth(),doc.date.getDate()))/86400000);
    const dateOk=state.dateFilter==="all"||(state.dateFilter==="today"&&days===0)||(state.dateFilter==="recent"&&days<=2);
    const readOk=state.readFilter==="all"||(state.readFilter==="unread"&&!readState[doc.id])||(state.readFilter==="read"&&readState[doc.id]);
    return statusOk&&systemOk&&searchOk&&dateOk&&readOk;
  });
  rows.sort((a,b)=>state.sortDesc?dateValue(b.date)-dateValue(a.date):dateValue(a.date)-dateValue(b.date));
  return rows;
}
function titleFor(count){
  let heading="전체 결재 문서";
  if(state.system!=="전체"&&state.status!=="all")heading=`${state.system} ${statusLabel[state.status]} 문서`;
  else if(state.system!=="전체")heading=`${state.system} 결재 문서`;
  else if(state.status!=="all")heading=`${statusLabel[state.status]} 문서`;
  return `${heading} <strong>${count}건</strong>`;
}
function renderDocuments(){
  const all=filteredDocuments();const pages=Math.max(1,Math.ceil(all.length/state.pageSize));if(state.page>pages)state.page=pages;
  const start=(state.page-1)*state.pageSize;const rows=all.slice(start,start+state.pageSize);
  document.getElementById("documentTitle").innerHTML=titleFor(all.length);document.getElementById("totalCountText").textContent=`총 ${all.length}건`;document.getElementById("sortArrow").textContent=state.sortDesc?"↓":"↑";
  const body=document.getElementById("documentRows");
  body.innerHTML=rows.map((doc,index)=>`<tr class="${!readState[doc.id]?"unread-row":""}" data-row-id="${doc.id}">
    <td class="num-col">${start+index+1}</td>
    <td class="read-col"><span class="mail-state ${readState[doc.id]?"read":"unread"}" aria-label="${readState[doc.id]?"읽음 문서":"안읽음 문서"}" title="${readState[doc.id]?"읽음":"안읽음"}">${envelopeIcon(readState[doc.id])}</span></td>
    <td><span class="status-badge ${doc.status}">${statusLabel[doc.status]}</span></td>
    <td title="${doc.number}">${doc.number}</td>
    <td title="${doc.title}">${doc.title}${doc.isNew&&!readState[doc.id]?'<span class="new-badge">NEW</span>':""}</td>
    <td title="${doc.system}">${doc.system}</td><td>${doc.requester}</td><td>${fmtDate(doc.date)}</td>
    <td><button class="action-button ${state.clickedId===doc.id?"clicked":""}" data-action-id="${doc.id}" type="button">${doc.status==="pending"?"결재하러 가기 ↗":"상세보기 ↗"}</button></td>
  </tr>`).join("");
  document.getElementById("emptyState").hidden=all.length!==0;
  body.querySelectorAll("[data-row-id]").forEach(row=>row.addEventListener("click",e=>{if(e.target.closest("[data-action-id]"))return;openDocumentTab(Number(row.dataset.rowId));}));
  body.querySelectorAll("[data-action-id]").forEach(btn=>btn.addEventListener("click",e=>{
    e.stopPropagation();const doc=documents.find(d=>d.id===Number(btn.dataset.actionId));if(!doc)return;setRead(doc.id,true);
    if(doc.status==="pending"){state.clickedId=doc.id;renderDocuments();setTimeout(()=>showSso(doc.system,doc.id),220);}else openDocumentTab(doc.id);
  }));
  renderPagination(pages);
}
function renderPagination(pages){
  const root=document.getElementById("pagination");const buttons=[];
  buttons.push(`<button type="button" data-page="first" ${state.page===1?"disabled":""}>«</button><button type="button" data-page="prev" ${state.page===1?"disabled":""}>‹</button>`);
  for(let i=1;i<=pages;i++)buttons.push(`<button type="button" class="${i===state.page?"current":""}" data-page="${i}">${i}</button>`);
  buttons.push(`<button type="button" data-page="next" ${state.page===pages?"disabled":""}>›</button><button type="button" data-page="last" ${state.page===pages?"disabled":""}>»</button>`);
  root.innerHTML=buttons.join("");
  root.querySelectorAll("[data-page]").forEach(btn=>btn.addEventListener("click",()=>{const v=btn.dataset.page;if(v==="first")state.page=1;else if(v==="prev")state.page=Math.max(1,state.page-1);else if(v==="next")state.page=Math.min(pages,state.page+1);else if(v==="last")state.page=pages;else state.page=Number(v);renderDocuments();}));
}
function renderNotices(){
  const unread=unreadNewDocs();document.getElementById("noticeCount").textContent=unread.length;document.getElementById("noticeCount").hidden=unread.length===0;document.getElementById("noticeDot").hidden=unread.length===0;document.getElementById("noticeUnreadText").textContent=`${unread.length}건`;
  const root=document.getElementById("noticeItems");
  root.innerHTML=unread.length?unread.map(doc=>`<button class="notice-item" type="button" data-notice-id="${doc.id}"><span class="notice-item-dot"></span><span><strong>${doc.title}</strong><span>${doc.system} · ${doc.requester} · ${fmtDate(doc.date)}</span></span></button>`).join(""):'<div class="notice-item"><span></span><span><strong>새로운 결재가 없습니다.</strong><span>모든 신규 결재를 확인했습니다.</span></span></div>';
  root.querySelectorAll("[data-notice-id]").forEach(btn=>btn.addEventListener("click",()=>{document.getElementById("noticePopover").hidden=true;openDocumentTab(Number(btn.dataset.noticeId));}));
}
function renderDashboard(){
  state.activeTab="dashboard";document.getElementById("dashboardView").hidden=false;document.getElementById("documentView").hidden=true;document.getElementById("ssoView").hidden=true;
  renderStatusTabs();renderSystemCards();renderDocuments();renderWorkspaceTabs();renderNotices();
  document.getElementById("documentSearch").value=state.search;document.getElementById("pageSizeSelect").value=String(state.pageSize);
  document.querySelectorAll("[data-date-filter]").forEach(btn=>btn.classList.toggle("active",btn.dataset.dateFilter===state.dateFilter));
  document.querySelectorAll("[data-read-filter]").forEach(btn=>btn.classList.toggle("active",btn.dataset.readFilter===state.readFilter));
}
let redirectTimers=[];
function clearRedirectTimers(){
  redirectTimers.forEach(clearTimeout);
  redirectTimers=[];
}
function setNativeTransitionPhase(phase){
  const transition=document.getElementById("nativeTransition");
  if(transition)transition.dataset.phase=phase;
}
function showSso(target,docId){
  const doc=docId?documents.find(d=>d.id===docId):null;
  if(docId){state.activeDocId=docId;setRead(docId,true);}
  state.activeTab="detail";
  state.ssoTarget=target;

  document.getElementById("dashboardView").hidden=true;
  document.getElementById("documentView").hidden=true;
  document.getElementById("ssoView").hidden=false;
  renderWorkspaceTabs();

  document.getElementById("ssoTargetLabel").textContent=target;
  document.getElementById("ssoTargetTitle").textContent=target;
  document.getElementById("transitionArrivedTitle").textContent=target;
  document.getElementById("transitionSourceSystem").textContent=target;
  document.getElementById("transitionDocTitle").textContent=doc?doc.title:"선택한 결재 문서";

  const icon=appIcon(target);
  document.getElementById("transitionTargetIcon").innerHTML=icon;
  document.getElementById("transitionArrivedIcon").innerHTML=icon;

  clearRedirectTimers();
  setNativeTransitionPhase("idle");
  document.getElementById("nativeAuthText").textContent="SSO 인증 중";

  if(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches){
    document.getElementById("nativeAuthText").textContent="SSO 인증 완료";
    setNativeTransitionPhase("complete");
    return;
  }

  redirectTimers.push(setTimeout(()=>setNativeTransitionPhase("auth"),120));
  redirectTimers.push(setTimeout(()=>{
    document.getElementById("nativeAuthText").textContent="SSO 인증 완료";
    setNativeTransitionPhase("confirmed");
  },480));
  redirectTimers.push(setTimeout(()=>setNativeTransitionPhase("transfer"),820));
  redirectTimers.push(setTimeout(()=>setNativeTransitionPhase("complete"),1480));
}
let aggregationTimers=[];
let aggregationAnimations=[];
let aggregationRunning=false;

function clearAggregationAnimation(){
  aggregationTimers.forEach(clearTimeout);
  aggregationTimers=[];
  aggregationAnimations.forEach(animation=>{try{animation.cancel();}catch{}});
  aggregationAnimations=[];
  aggregationRunning=false;
  const layer=document.getElementById("aggregationLayer");
  const hub=document.getElementById("aggregationHub");
  const complete=document.getElementById("aggregationComplete");
  if(layer)layer.classList.remove("active");
  if(hub)hub.classList.remove("receiving");
  if(complete)complete.classList.remove("show");
  document.querySelectorAll(".system-card").forEach(card=>card.classList.remove("sync-source","sync-done"));
  document.querySelectorAll(".aggregation-packet").forEach(packet=>packet.remove());
}

function createAggregationPacket(layer,startX,startY,endX,endY,delay){
  const packet=document.createElement("span");
  packet.className="aggregation-packet";
  packet.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h12"/><path d="m13 8 4 4-4 4"/></svg>';
  packet.style.left=(startX-12)+"px";
  packet.style.top=(startY-12)+"px";
  layer.appendChild(packet);
  const animation=packet.animate([
    {opacity:0,transform:"translate(0,0) scale(.72)"},
    {opacity:1,offset:.12},
    {opacity:1,transform:`translate(${endX-startX}px,${endY-startY}px) scale(1)`,offset:.84},
    {opacity:0,transform:`translate(${endX-startX}px,${endY-startY}px) scale(.62)`}
  ],{duration:720,delay,easing:"cubic-bezier(.25,.75,.2,1)",fill:"forwards"});
  aggregationAnimations.push(animation);
  animation.finished.then(()=>packet.remove()).catch(()=>{});
}

function runAggregationAnimation(){
  clearAggregationAnimation();
  const layer=document.getElementById("aggregationLayer");
  const hub=document.getElementById("aggregationHub");
  const complete=document.getElementById("aggregationComplete");
  const area=document.getElementById("systemArea");
  if(!layer||!hub||!complete||!area)return;

  const cards=[...document.querySelectorAll("#systemCards .system-card")].filter(card=>card.dataset.system!=="전체");
  if(cards.length!==5)return;

  aggregationRunning=true;
  layer.classList.add("active");

  if(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches){
    cards.forEach(card=>card.classList.add("sync-done"));
    complete.classList.add("show");
    aggregationTimers.push(setTimeout(()=>clearAggregationAnimation(),1100));
    return;
  }

  requestAnimationFrame(()=>{
    const areaRect=area.getBoundingClientRect();
    const hubRect=hub.getBoundingClientRect();
    const endX=hubRect.left-areaRect.left+hubRect.width/2;
    const endY=hubRect.top-areaRect.top+hubRect.height/2;

    cards.forEach((card,index)=>{
      const rect=card.getBoundingClientRect();
      const startX=rect.left-areaRect.left+rect.width/2;
      const startY=rect.top-areaRect.top+rect.height/2;
      const delay=150+index*145;

      aggregationTimers.push(setTimeout(()=>card.classList.add("sync-source"),delay));
      createAggregationPacket(layer,startX,startY,endX,endY,delay+80);
      aggregationTimers.push(setTimeout(()=>{
        card.classList.remove("sync-source");
        card.classList.add("sync-done");
        hub.classList.remove("receiving");
        void hub.offsetWidth;
        hub.classList.add("receiving");
      },delay+760));
    });

    const finishAt=150+(cards.length-1)*145+980;
    aggregationTimers.push(setTimeout(()=>{
      hub.classList.remove("receiving");
      complete.classList.remove("show");
      void complete.offsetWidth;
      complete.classList.add("show");
    },finishAt));
    aggregationTimers.push(setTimeout(()=>clearAggregationAnimation(),finishAt+1150));
  });
}

function resetFilters(){state.status="all";state.system="전체";state.search="";state.dateFilter="all";state.readFilter="all";state.sortDesc=true;state.page=1;state.pageSize=10;state.clickedId=null;renderDashboard();}
let toastTimer;function toast(msg){const el=document.getElementById("toast");el.textContent=msg;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),1500);}
function closePopovers(except){if(except!=="notice")document.getElementById("noticePopover").hidden=true;if(except!=="profile")document.getElementById("profilePopover").hidden=true;}

const STARSOON_URL="https://hanapoweronstore.ai/mascot/a5_thumbs_up.png";
const starsoonProbe=new Image();
starsoonProbe.addEventListener("load",()=>document.querySelectorAll(".avatar.starsoon").forEach(el=>el.classList.add("starsoon-loaded")));
starsoonProbe.src=STARSOON_URL;

document.getElementById("asOfText").textContent=fmtAsOf(loadedAt);
document.getElementById("documentSearch").addEventListener("input",e=>{state.search=e.target.value;state.page=1;renderDocuments();});
document.getElementById("globalSearch").addEventListener("keydown",e=>{if(e.key==="Enter"){state.search=e.target.value;state.page=1;renderDashboard();toast("통합검색 결과를 결재 문서에 반영했습니다.");}});
document.getElementById("filterBtn").addEventListener("click",()=>{const p=document.getElementById("filterPanel");p.hidden=!p.hidden;});
document.querySelectorAll("[data-date-filter]").forEach(btn=>btn.addEventListener("click",()=>{state.dateFilter=btn.dataset.dateFilter;state.page=1;renderDashboard();}));
document.querySelectorAll("[data-read-filter]").forEach(btn=>btn.addEventListener("click",()=>{state.readFilter=btn.dataset.readFilter;state.page=1;renderDashboard();}));
document.getElementById("filterReset").addEventListener("click",()=>{state.dateFilter="all";state.readFilter="all";state.search="";state.page=1;renderDashboard();});
document.getElementById("sortDateBtn").addEventListener("click",()=>{state.sortDesc=!state.sortDesc;renderDocuments();});
document.getElementById("pageSizeSelect").addEventListener("change",e=>{state.pageSize=Number(e.target.value);state.page=1;renderDocuments();});
document.getElementById("refreshBtn").addEventListener("click",e=>{e.currentTarget.classList.remove("spin");requestAnimationFrame(()=>e.currentTarget.classList.add("spin"));resetFilters();aggregationTimers.push(setTimeout(runAggregationAnimation,90));});
document.getElementById("backDashboardBtn").addEventListener("click",()=>{clearRedirectTimers();setNativeTransitionPhase("idle");state.activeDocId?activateTab("detail"):renderDashboard();});
document.getElementById("noticeBtn").addEventListener("click",()=>{const p=document.getElementById("noticePopover");const open=p.hidden;closePopovers("notice");p.hidden=!open;});
document.getElementById("profileBtn").addEventListener("click",()=>{const p=document.getElementById("profilePopover");const open=p.hidden;closePopovers("profile");p.hidden=!open;});
document.querySelectorAll(".profile-popover>button").forEach(btn=>btn.addEventListener("click",()=>toast("프로토타입 메뉴입니다.")));
document.querySelectorAll("[data-top]").forEach(btn=>btn.addEventListener("click",()=>{document.querySelectorAll("[data-top]").forEach(x=>x.classList.remove("active"));btn.classList.add("active");toast(`${btn.dataset.top} 메뉴를 선택했습니다.`);}));
document.querySelectorAll("[data-side]").forEach(btn=>btn.addEventListener("click",()=>{document.querySelectorAll("[data-side]").forEach(x=>x.classList.remove("active"));btn.classList.add("active");if(btn.dataset.side==="결재 대시보드")renderDashboard();else toast(`${btn.dataset.side} 메뉴는 발표 시연 범위 밖입니다.`);}));
document.querySelector("[data-nav='home']").addEventListener("click",()=>{resetFilters();toast("하나포털 HOME");});
document.addEventListener("click",e=>{if(!e.target.closest("#noticeBtn")&&!e.target.closest("#noticePopover"))document.getElementById("noticePopover").hidden=true;if(!e.target.closest("#profileBtn")&&!e.target.closest("#profilePopover"))document.getElementById("profilePopover").hidden=true;});

function goStep(step){
  if(step===1)resetFilters();
  if(step===2){state.status="pending";state.system="전체";state.search="";state.page=1;renderDashboard();}
  if(step===3){state.status="pending";state.system="하나플러스";state.search="";state.page=1;renderDashboard();}
  if(step===4){state.status="pending";state.system="하나플러스";renderDashboard();openDocumentTab(1);}
  if(step===5){state.status="pending";state.system="하나플러스";showSso("하나플러스",1);}
}
document.addEventListener("keydown",e=>{if(["1","2","3","4","5"].includes(e.key)&&!["INPUT","SELECT","TEXTAREA"].includes(document.activeElement.tagName))goStep(Number(e.key));if(e.key==="Escape"){closePopovers();if(!document.getElementById("ssoView").hidden){clearRedirectTimers();setNativeTransitionPhase("idle");state.activeDocId?activateTab("detail"):renderDashboard();}}});

renderDashboard();
aggregationTimers.push(setTimeout(runAggregationAnimation,180));