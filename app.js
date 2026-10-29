const OFFICIAL_SYMBOL = "https://raw.githubusercontent.com/YUJAEYUN/hana_securities_ppt_design/main/hana-ppt-skill/assets/logo/HanaSecurities_symbol-mark.png";

const systemTotals = {
  "전체": 12,
  "하나포털": 3,
  "하나플러스": 4,
  "컴플라이언스시스템": 2,
  "정보보호포털": 2,
  "법령통지시스템": 1,
};

const statusTotals = { all: 12, approved: 4, pending: 6, rejected: 2 };
const statusLabel = { all: "전체", approved: "승인완료", pending: "결재대기", rejected: "반려" };

const documents = [
  { id:1,status:"pending", number:"HP-2026-00928",title:"마케팅 행사 운영비 승인 요청",system:"하나플러스",requester:"이서연",date:"2026. 09. 08",summary:"마케팅 행사 운영을 위한 예산 집행 승인 요청입니다." },
  { id:2,status:"approved",number:"HP-2026-00927",title:"사내 교육 프로그램 결과 보고",system:"하나플러스",requester:"김민수",date:"2026. 09. 08",summary:"사내 교육 프로그램 운영 결과와 후속 조치 보고입니다." },
  { id:3,status:"pending", number:"CP-2026-00411",title:"광고 심의 요청서",system:"컴플라이언스시스템",requester:"박지훈",date:"2026. 09. 07",summary:"대외 광고 집행 전 컴플라이언스 심의를 요청합니다." },
  { id:4,status:"rejected",number:"IS-2026-00352",title:"보안 취약점 조치 결과 보고",system:"정보보호포털",requester:"정다운",date:"2026. 09. 07",summary:"보안 취약점 조치 결과에 대한 검토 문서입니다." },
  { id:5,status:"approved",number:"HP-2026-00925",title:"거래처 계약 검토 요청",system:"하나플러스",requester:"최유진",date:"2026. 09. 06",summary:"신규 거래처 계약 체결을 위한 내부 검토 요청입니다." },
  { id:6,status:"pending", number:"HPT-2026-00924",title:"시스템 개선 작업 승인 요청",system:"하나포털",requester:"이준호",date:"2026. 09. 06",summary:"내부 시스템 개선 작업 시행을 위한 승인 요청입니다." },
  { id:7,status:"approved",number:"CP-2026-00188",title:"내부통제 점검 계획(안)",system:"컴플라이언스시스템",requester:"한지민",date:"2026. 09. 05",summary:"분기 내부통제 점검 계획에 대한 승인 문서입니다." },
  { id:8,status:"pending", number:"LS-2026-00089",title:"법령 개정사항 검토 요청",system:"법령통지시스템",requester:"오세훈",date:"2026. 09. 05",summary:"신규 법령 개정사항의 업무 영향 검토 요청입니다." },
  { id:9,status:"approved",number:"HPT-2026-00920",title:"부서 공문 발송 승인",system:"하나포털",requester:"박민수",date:"2026. 09. 04",summary:"대내외 공문 발송을 위한 승인 문서입니다." },
  { id:10,status:"pending",number:"IS-2026-00341",title:"개인정보 처리방침 개정 검토",system:"정보보호포털",requester:"이지은",date:"2026. 09. 04",summary:"개인정보 처리방침 개정안 검토 요청입니다." },
  { id:11,status:"pending",number:"HP-2026-00915",title:"서비스 개선 기획안 결재 요청",system:"하나플러스",requester:"김민수",date:"2026. 09. 03",summary:"고객 서비스 개선 기획안에 대한 결재 요청입니다." },
  { id:12,status:"rejected",number:"HPT-2026-00910",title:"대외기관 문서 수신 보고",system:"하나포털",requester:"정다운",date:"2026. 09. 03",summary:"대외기관 수신 문서에 대한 검토 및 보고 문서입니다." },
];

const state = {
  status:"all",
  system:"전체",
  search:"",
  dateFilter:"all",
  sortDesc:true,
  page:1,
  pageSize:10,
  ssoTarget:null,
  clickedId:null,
};

const icons = {
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

function renderStatusTabs(){
  const root=document.getElementById("statusTabs");
  root.innerHTML=Object.keys(statusLabel).map(key=>`
    <button class="status-tab ${state.status===key?"active":""}" data-status="${key}" type="button">
      ${icons[key]}<span>${statusLabel[key]}</span><span class="status-count">${statusTotals[key]}</span>
    </button>`).join("");
  root.querySelectorAll("[data-status]").forEach(btn=>btn.addEventListener("click",()=>{
    state.status=btn.dataset.status; state.page=1; render();
  }));
}

function renderSystemCards(){
  const systems=[
    ["전체","전체 결재 건수",""],
    ["하나포털","하나포털","(문서 수발신)"],
    ["하나플러스","하나플러스","(업무 전자결재)"],
    ["컴플라이언스시스템","컴플라이언스시스템",""],
    ["정보보호포털","정보보호포털",""],
    ["법령통지시스템","법령통지시스템",""],
  ];
  const root=document.getElementById("systemCards");
  root.innerHTML=systems.map(([key,name,sub])=>`
    <button class="system-card ${key==="전체"?"total":""} ${state.system===key?"selected":""}" data-system="${key}" type="button">
      <div class="system-name">${name}</div>
      <div class="system-sub">${sub||"&nbsp;"}</div>
      <div class="system-metric">${systemIcon(key)}<span class="system-number">${systemTotals[key]}</span><span class="system-unit">건</span></div>
    </button>`).join("");
  root.querySelectorAll("[data-system]").forEach(btn=>btn.addEventListener("click",()=>{
    state.system=btn.dataset.system; state.page=1; render();
  }));
}

function dateValue(d){return Number(d.replaceAll(".","").replaceAll(" ",""));}

function filteredDocuments(){
  let rows=documents.filter(doc=>{
    const statusOk=state.status==="all"||doc.status===state.status;
    const systemOk=state.system==="전체"||doc.system===state.system;
    const q=state.search.trim().toLowerCase();
    const searchOk=!q||[doc.number,doc.title,doc.system,doc.requester].some(v=>v.toLowerCase().includes(q));
    const dv=dateValue(doc.date);
    let dateOk=true;
    if(state.dateFilter==="today") dateOk=dv===20260908;
    if(state.dateFilter==="recent") dateOk=dv>=20260906;
    return statusOk&&systemOk&&searchOk&&dateOk;
  });
  rows.sort((a,b)=>state.sortDesc?dateValue(b.date)-dateValue(a.date):dateValue(a.date)-dateValue(b.date));
  return rows;
}

function titleFor(count){
  let heading="전체 결재 문서";
  if(state.system!=="전체"&&state.status!=="all") heading=`${state.system} ${statusLabel[state.status]} 문서`;
  else if(state.system!=="전체") heading=`${state.system} 결재 문서`;
  else if(state.status!=="all") heading=`${statusLabel[state.status]} 문서`;
  return `${heading} <strong>${count}건</strong>`;
}

function renderDocuments(){
  const all=filteredDocuments();
  const pages=Math.max(1,Math.ceil(all.length/state.pageSize));
  if(state.page>pages) state.page=pages;
  const start=(state.page-1)*state.pageSize;
  const rows=all.slice(start,start+state.pageSize);
  document.getElementById("documentTitle").innerHTML=titleFor(all.length);
  document.getElementById("totalCountText").textContent=`총 ${all.length}건`;
  document.getElementById("sortArrow").textContent=state.sortDesc?"↓":"↑";
  const body=document.getElementById("documentRows");
  body.innerHTML=rows.map((doc,index)=>`
    <tr data-row-id="${doc.id}">
      <td class="num-col">${start+index+1}</td>
      <td><span class="status-badge ${doc.status}">${statusLabel[doc.status]}</span></td>
      <td title="${doc.number}">${doc.number}</td>
      <td title="${doc.title}">${doc.title}</td>
      <td title="${doc.system}">${doc.system}</td>
      <td>${doc.requester}</td>
      <td>${doc.date}</td>
      <td>
        <button class="action-button ${state.clickedId===doc.id?"clicked":""}" data-action-id="${doc.id}" type="button">
          ${doc.status==="pending"?"결재하러 가기 ↗":"상세보기 ↗"}
        </button>
      </td>
    </tr>`).join("");
  document.getElementById("emptyState").hidden=all.length!==0;
  body.querySelectorAll("[data-action-id]").forEach(btn=>btn.addEventListener("click",()=>{
    const doc=documents.find(d=>d.id===Number(btn.dataset.actionId));
    if(!doc)return;
    if(doc.status==="pending"){
      state.clickedId=doc.id;
      renderDocuments();
      setTimeout(()=>showSso(doc.system),230);
    }else{
      openDrawer(doc);
    }
  }));
  body.querySelectorAll("[data-row-id]").forEach(row=>row.addEventListener("dblclick",()=>{
    const doc=documents.find(d=>d.id===Number(row.dataset.rowId));
    if(doc)openDrawer(doc);
  }));
  renderPagination(pages);
}

function renderPagination(pages){
  const root=document.getElementById("pagination");
  const buttons=[];
  buttons.push(`<button type="button" data-page="first" ${state.page===1?"disabled":""}>«</button>`);
  buttons.push(`<button type="button" data-page="prev" ${state.page===1?"disabled":""}>‹</button>`);
  for(let i=1;i<=pages;i++) buttons.push(`<button type="button" class="${i===state.page?"current":""}" data-page="${i}">${i}</button>`);
  buttons.push(`<button type="button" data-page="next" ${state.page===pages?"disabled":""}>›</button>`);
  buttons.push(`<button type="button" data-page="last" ${state.page===pages?"disabled":""}>»</button>`);
  root.innerHTML=buttons.join("");
  root.querySelectorAll("[data-page]").forEach(btn=>btn.addEventListener("click",()=>{
    const value=btn.dataset.page;
    if(value==="first")state.page=1;
    else if(value==="prev")state.page=Math.max(1,state.page-1);
    else if(value==="next")state.page=Math.min(pages,state.page+1);
    else if(value==="last")state.page=pages;
    else state.page=Number(value);
    renderDocuments();
  }));
}

function render(){
  document.getElementById("dashboardView").hidden=false;
  document.getElementById("ssoView").hidden=true;
  renderStatusTabs();
  renderSystemCards();
  renderDocuments();
  document.getElementById("documentSearch").value=state.search;
  document.getElementById("pageSizeSelect").value=String(state.pageSize);
  document.querySelectorAll("[data-date-filter]").forEach(btn=>btn.classList.toggle("active",btn.dataset.dateFilter===state.dateFilter));
}

function openDrawer(doc){
  document.getElementById("drawerNumber").textContent=doc.number;
  document.getElementById("drawerBody").innerHTML=[
    ["상태",statusLabel[doc.status]],
    ["문서명",doc.title],
    ["시스템명",doc.system],
    ["요청자",doc.requester],
    ["요청일",doc.date],
    ["요약",doc.summary],
  ].map(([k,v])=>`<div class="detail-row"><span>${k}</span><strong>${v}</strong></div>`).join("");
  document.getElementById("detailDrawer").classList.add("open");
  document.getElementById("detailDrawer").setAttribute("aria-hidden","false");
  document.getElementById("drawerDim").hidden=false;
}

function closeDrawer(){
  document.getElementById("detailDrawer").classList.remove("open");
  document.getElementById("detailDrawer").setAttribute("aria-hidden","true");
  document.getElementById("drawerDim").hidden=true;
}

function showSso(target){
  state.ssoTarget=target;
  document.getElementById("dashboardView").hidden=true;
  document.getElementById("ssoView").hidden=false;
  ["ssoTargetTitle","ssoTargetLabel","ssoTargetInline"].forEach(id=>document.getElementById(id).textContent=target);
  const bar=document.getElementById("progressBar");
  const label=document.getElementById("progressLabel");
  const finish=document.getElementById("finishSsoBtn");
  bar.classList.remove("animate"); finish.hidden=true; label.textContent="안전하게 연결 중입니다...";
  requestAnimationFrame(()=>bar.classList.add("animate"));
  setTimeout(()=>{label.textContent=`${target} 연결이 완료되었습니다.`;finish.hidden=false;},1650);
}

function resetFilters(){
  state.status="all";state.system="전체";state.search="";state.dateFilter="all";state.sortDesc=true;state.page=1;state.pageSize=10;state.clickedId=null;
  render();
}

let toastTimer;
function toast(message){
  const el=document.getElementById("toast");
  el.textContent=message;el.classList.add("show");
  clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),1500);
}

function closePopovers(except){
  if(except!=="notice")document.getElementById("noticePopover").hidden=true;
  if(except!=="profile")document.getElementById("profilePopover").hidden=true;
}

document.getElementById("documentSearch").addEventListener("input",e=>{state.search=e.target.value;state.page=1;renderDocuments();});
document.getElementById("globalSearch").addEventListener("keydown",e=>{if(e.key==="Enter"){document.getElementById("documentSearch").value=e.target.value;state.search=e.target.value;state.page=1;renderDocuments();toast("통합검색 결과를 결재 문서에 반영했습니다.");}});
document.getElementById("filterBtn").addEventListener("click",()=>{const p=document.getElementById("filterPanel");p.hidden=!p.hidden;});
document.querySelectorAll("[data-date-filter]").forEach(btn=>btn.addEventListener("click",()=>{state.dateFilter=btn.dataset.dateFilter;state.page=1;render();}));
document.getElementById("filterReset").addEventListener("click",()=>{state.dateFilter="all";state.search="";state.page=1;render();});
document.getElementById("sortDateBtn").addEventListener("click",()=>{state.sortDesc=!state.sortDesc;renderDocuments();});
document.getElementById("pageSizeSelect").addEventListener("change",e=>{state.pageSize=Number(e.target.value);state.page=1;renderDocuments();});
document.getElementById("refreshBtn").addEventListener("click",e=>{e.currentTarget.classList.remove("spin");requestAnimationFrame(()=>e.currentTarget.classList.add("spin"));resetFilters();toast("최신 결재 현황으로 갱신했습니다.");});
document.getElementById("drawerClose").addEventListener("click",closeDrawer);
document.getElementById("drawerDim").addEventListener("click",closeDrawer);
document.getElementById("backDashboardBtn").addEventListener("click",render);
document.getElementById("finishSsoBtn").addEventListener("click",()=>{toast(`${state.ssoTarget} 연결 완료 — 실제 운영 화면으로 연결되는 구간입니다.`);});
document.getElementById("noticeBtn").addEventListener("click",()=>{const p=document.getElementById("noticePopover");const opening=p.hidden;closePopovers("notice");p.hidden=!opening;});
document.getElementById("profileBtn").addEventListener("click",()=>{const p=document.getElementById("profilePopover");const opening=p.hidden;closePopovers("profile");p.hidden=!opening;});
document.querySelectorAll(".popover button").forEach(btn=>btn.addEventListener("click",()=>{closePopovers();if(btn.dataset.step)goStep(Number(btn.dataset.step));else toast("프로토타입 메뉴입니다.");}));
document.querySelectorAll("[data-top]").forEach(btn=>btn.addEventListener("click",()=>{document.querySelectorAll("[data-top]").forEach(x=>x.classList.remove("active"));btn.classList.add("active");toast(`${btn.dataset.top} 메뉴를 선택했습니다.`);}));
document.querySelectorAll("[data-side]").forEach(btn=>btn.addEventListener("click",()=>{document.querySelectorAll("[data-side]").forEach(x=>x.classList.remove("active"));btn.classList.add("active");if(btn.dataset.side==="결재 대시보드")render();else toast(`${btn.dataset.side} 메뉴는 발표 시연 범위 밖입니다.`);}));
document.querySelector("[data-nav='home']").addEventListener("click",()=>{resetFilters();toast("하나포털 HOME");});
document.addEventListener("click",e=>{if(!e.target.closest("#noticeBtn")&&!e.target.closest("#noticePopover"))document.getElementById("noticePopover").hidden=true;if(!e.target.closest("#profileBtn")&&!e.target.closest("#profilePopover"))document.getElementById("profilePopover").hidden=true;});

function goStep(step){
  if(step===1){resetFilters();}
  if(step===2){state.status="pending";state.system="전체";state.search="";state.page=1;render();}
  if(step===3){state.status="pending";state.system="하나플러스";state.search="";state.page=1;render();}
  if(step===4){state.status="pending";state.system="하나플러스";state.search="";state.page=1;state.clickedId=1;render();}
  if(step===5){state.status="pending";state.system="하나플러스";state.search="";state.page=1;showSso("하나플러스");}
}
document.addEventListener("keydown",e=>{
  if(["1","2","3","4","5"].includes(e.key)&&!["INPUT","SELECT","TEXTAREA"].includes(document.activeElement.tagName))goStep(Number(e.key));
  if(e.key==="Escape"){closeDrawer();closePopovers();if(!document.getElementById("ssoView").hidden)render();}
});

render();
