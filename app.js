const systemTotals = {
  "전체": 12,
  "하나포털": 3,
  "하나플러스": 4,
  "컴플라이언스시스템": 2,
  "정보보호포털": 2,
  "법령통지시스템": 1,
};

const statusTotals = {
  all: 12,
  approved: 4,
  pending: 6,
  rejected: 2,
};

const labels = {
  all: "전체",
  approved: "승인완료",
  pending: "결재대기",
  rejected: "반려",
};

const documents = [
  { id: 1, status: "pending", number: "HP-2026-00928", title: "마케팅 행사 운영비 승인 요청", system: "하나플러스", requester: "이서연", date: "2026. 09. 08" },
  { id: 2, status: "approved", number: "HP-2026-00927", title: "사내 교육 프로그램 결과 보고", system: "하나플러스", requester: "김민수", date: "2026. 09. 08" },
  { id: 3, status: "pending", number: "CP-2026-00411", title: "광고 심의 요청서", system: "컴플라이언스시스템", requester: "박지훈", date: "2026. 09. 07" },
  { id: 4, status: "rejected", number: "IS-2026-00352", title: "보안 취약점 조치 결과 보고", system: "정보보호포털", requester: "정다운", date: "2026. 09. 07" },
  { id: 5, status: "approved", number: "HP-2026-00925", title: "거래처 계약 검토 요청", system: "하나플러스", requester: "최유진", date: "2026. 09. 06" },
  { id: 6, status: "pending", number: "HPT-2026-00924", title: "시스템 개선 작업 승인 요청", system: "하나포털", requester: "이준호", date: "2026. 09. 06" },
  { id: 7, status: "approved", number: "CP-2026-00188", title: "내부통제 점검 계획(안)", system: "컴플라이언스시스템", requester: "한지민", date: "2026. 09. 05" },
  { id: 8, status: "pending", number: "LS-2026-00089", title: "법령 개정사항 검토 요청", system: "법령통지시스템", requester: "오세훈", date: "2026. 09. 05" },
  { id: 9, status: "approved", number: "HPT-2026-00920", title: "부서 공문 발송 승인", system: "하나포털", requester: "박민수", date: "2026. 09. 04" },
  { id: 10, status: "pending", number: "IS-2026-00341", title: "개인정보 처리방침 개정 검토", system: "정보보호포털", requester: "이지은", date: "2026. 09. 04" },
  { id: 11, status: "pending", number: "HP-2026-00915", title: "서비스 개선 기획안 결재 요청", system: "하나플러스", requester: "김민수", date: "2026. 09. 03" },
  { id: 12, status: "rejected", number: "HPT-2026-00910", title: "대외기관 문서 수신 보고", system: "하나포털", requester: "정다운", date: "2026. 09. 03" },
];

const state = {
  status: "all",
  system: "전체",
  sso: false,
};

const sideNavItems = [
  ["grid", "업무"],
  ["mail", "메일"],
  ["docClock", "결재"],
  ["people", "조직"],
  ["list", "결재 대시보드"],
  ["folder", "문서"],
  ["calendar", "일정"],
  ["chat", "메신저"],
  ["link", "링크"],
  ["home", "홈"],
  ["pie", "현황"],
];

const icons = {
  grid: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>',
  mail: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 7 9-7"/></svg>',
  docClock: '<svg viewBox="0 0 24 24"><path d="M5 3h10l4 4v7"/><path d="M15 3v5h5"/><circle cx="15.5" cy="16.5" r="4.5"/><path d="M15.5 14v3l2 1"/></svg>',
  people: '<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0"/><circle cx="17" cy="9" r="2"/><path d="M16 15a5 5 0 0 1 5 5"/></svg>',
  list: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h8"/></svg>',
  folder: '<svg viewBox="0 0 24 24"><path d="M3 7h7l2 2h9v10H3z"/><path d="M3 7V5h7l2 2"/></svg>',
  calendar: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18"/></svg>',
  chat: '<svg viewBox="0 0 24 24"><path d="M4 4h16v12H9l-5 4z"/><path d="M8 9h8M8 12h5"/></svg>',
  link: '<svg viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-2 2"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l2-2"/></svg>',
  home: '<svg viewBox="0 0 24 24"><path d="m3 11 9-8 9 8"/><path d="M5 10v11h14V10"/><path d="M9 21v-7h6v7"/></svg>',
  pie: '<svg viewBox="0 0 24 24"><path d="M12 3v9h9"/><path d="M20 16a9 9 0 1 1-12-12"/></svg>',
};

function systemIcon(system) {
  if (system === "정보보호포털") {
    return '<svg viewBox="0 0 24 24"><path d="M12 3 4 6v5c0 5 3.4 8.3 8 10 4.6-1.7 8-5 8-10V6z"/><path d="m9 12 2 2 4-4"/></svg>';
  }
  if (system === "법령통지시스템") {
    return '<svg viewBox="0 0 24 24"><path d="M12 3v18M5 7h14"/><path d="m5 7-3 6h6zM19 7l-3 6h6z"/><path d="M8 21h8"/></svg>';
  }
  return '<svg viewBox="0 0 24 24"><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v5h5"/><path d="M9 12h6M9 16h6"/></svg>';
}

function renderSideNav() {
  const nav = document.getElementById("sideNav");
  nav.innerHTML = sideNavItems.map(([key, label], index) => `
    <button class="side-button ${index === 4 ? "active" : ""}" type="button" aria-label="${label}">
      ${icons[key]}
    </button>
  `).join("");
}

function renderStatusTabs() {
  const el = document.getElementById("statusTabs");
  el.innerHTML = Object.keys(labels).map(key => `
    <button class="status-tab ${state.status === key ? "active" : ""}" data-status="${key}" type="button">
      <span>${labels[key]}</span><span class="count">${statusTotals[key]}</span>
    </button>
  `).join("");

  el.querySelectorAll("[data-status]").forEach(button => {
    button.addEventListener("click", () => {
      state.status = button.dataset.status;
      render();
    });
  });
}

function renderSystemCards() {
  const el = document.getElementById("systemCards");
  const systems = [
    ["전체", "전체 결재 건수", ""],
    ["하나포털", "하나포털", "(문서 수발신)"],
    ["하나플러스", "하나플러스", "(업무 전자결재)"],
    ["컴플라이언스시스템", "컴플라이언스시스템", ""],
    ["정보보호포털", "정보보호포털", ""],
    ["법령통지시스템", "법령통지시스템", ""],
  ];

  el.innerHTML = systems.map(([key, name, sub]) => `
    <button class="system-card ${key === "전체" ? "total" : ""} ${state.system === key ? "selected" : ""}" data-system="${key}" type="button">
      <div class="name">${name}</div>
      <div class="sub">${sub || "&nbsp;"}</div>
      <div class="metric">
        ${systemIcon(key)}
        <span class="number">${systemTotals[key]}</span>
        <span class="unit">건</span>
      </div>
    </button>
  `).join("");

  el.querySelectorAll("[data-system]").forEach(button => {
    button.addEventListener("click", () => {
      state.system = button.dataset.system;
      render();
    });
  });
}

function filteredDocuments() {
  return documents.filter(doc => {
    const statusMatch = state.status === "all" || doc.status === state.status;
    const systemMatch = state.system === "전체" || doc.system === state.system;
    return statusMatch && systemMatch;
  });
}

function renderDocuments() {
  const rows = filteredDocuments();
  const titleEl = document.getElementById("documentTitle");
  const totalText = document.getElementById("totalCountText");

  let prefix = "";
  if (state.system !== "전체") prefix += state.system + " ";
  if (state.status !== "all") prefix += labels[state.status] + " ";
  if (!prefix) prefix = "전체 ";

  titleEl.innerHTML = `${prefix}결재 문서 <strong>${rows.length}건</strong>`;
  totalText.textContent = `총 ${rows.length}건`;

  const body = document.getElementById("documentRows");
  body.innerHTML = rows.map(doc => {
    const canGo = doc.status === "pending";
    return `
      <tr>
        <td class="col-check"><span class="fake-check"></span></td>
        <td><span class="status-badge ${doc.status}">${labels[doc.status]}</span></td>
        <td>${doc.number}</td>
        <td>${doc.title}</td>
        <td>${doc.system}</td>
        <td>${doc.requester}</td>
        <td>${doc.date}</td>
        <td>
          <button
            class="go-button ${canGo ? "" : "disabled"}"
            data-go-id="${doc.id}"
            type="button"
            ${canGo ? "" : "disabled"}
          >${canGo ? "결재하러 가기 ↗" : "상세보기 ↗"}</button>
        </td>
      </tr>
    `;
  }).join("");

  body.querySelectorAll("[data-go-id]").forEach(button => {
    button.addEventListener("click", () => {
      const doc = documents.find(item => item.id === Number(button.dataset.goId));
      if (!doc || doc.status !== "pending") return;

      if (doc.system !== "하나플러스") {
        state.system = doc.system;
        render();
        return;
      }

      button.classList.add("is-clicked");
      window.setTimeout(() => showSso(), 260);
    });
  });
}

function render() {
  state.sso = false;
  document.getElementById("dashboardView").hidden = false;
  document.getElementById("ssoView").hidden = true;
  renderStatusTabs();
  renderSystemCards();
  renderDocuments();
}

function showSso() {
  state.sso = true;
  document.getElementById("dashboardView").hidden = true;
  document.getElementById("ssoView").hidden = false;
  const icon = document.getElementById("dashboardNodeIcon");
  icon.innerHTML = systemIcon("하나플러스");

  const progress = document.getElementById("progressBar");
  const label = document.getElementById("progressLabel");
  const returnBtn = document.getElementById("returnBtn");
  progress.classList.remove("animate");
  returnBtn.hidden = true;
  label.textContent = "안전하게 연결 중입니다...";

  requestAnimationFrame(() => {
    progress.classList.add("animate");
  });

  window.setTimeout(() => {
    label.textContent = "하나플러스 결재 화면 연결이 완료되었습니다.";
    returnBtn.hidden = false;
  }, 1750);
}

function goStep(step) {
  if (step === 1) {
    state.status = "all";
    state.system = "전체";
    render();
  } else if (step === 2) {
    state.status = "pending";
    state.system = "전체";
    render();
  } else if (step === 3) {
    state.status = "pending";
    state.system = "하나플러스";
    render();
  } else if (step === 4) {
    state.status = "pending";
    state.system = "하나플러스";
    render();
    window.setTimeout(() => {
      const first = document.querySelector("[data-go-id]");
      if (first) first.classList.add("is-clicked");
    }, 40);
  } else if (step === 5) {
    state.status = "pending";
    state.system = "하나플러스";
    showSso();
  }
}

document.getElementById("refreshBtn").addEventListener("click", event => {
  event.currentTarget.classList.remove("refreshing");
  requestAnimationFrame(() => event.currentTarget.classList.add("refreshing"));
});

document.getElementById("returnBtn").addEventListener("click", () => {
  state.status = "pending";
  state.system = "하나플러스";
  render();
});

document.getElementById("homeTab").addEventListener("click", () => {
  state.status = "all";
  state.system = "전체";
  render();
});

document.addEventListener("keydown", event => {
  if (event.key >= "1" && event.key <= "5") {
    goStep(Number(event.key));
  }
  if (event.key === "Escape" && state.sso) {
    state.status = "pending";
    state.system = "하나플러스";
    render();
  }
});

renderSideNav();
render();