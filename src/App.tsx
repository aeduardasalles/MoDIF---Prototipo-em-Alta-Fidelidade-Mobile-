import { useState, createContext, useContext } from "react";
import ementaPdf from "@/imports/ementa_disciplina_simulada.pdf";

/* ══════════════════════════════════════════
   THEME CONTEXT
══════════════════════════════════════════ */
type FontSize  = "normal" | "grande" | "extra";
type ColorMode = "normal" | "alto-contraste" | "protecao" | "mono";
interface ThemeCtx {
  dark: boolean; setDark: (v: boolean) => void;
  fontSize: FontSize; setFontSize: (v: FontSize) => void;
  colorMode: ColorMode; setColorMode: (v: ColorMode) => void;
}
const Theme = createContext<ThemeCtx>({
  dark: false, setDark: () => {},
  fontSize: "normal", setFontSize: () => {},
  colorMode: "normal", setColorMode: () => {},
});
const useTheme = () => useContext(Theme);

const T = {
  bg:         { backgroundColor: "var(--c-bg)" },
  surface:    { backgroundColor: "var(--c-surface)" },
  text:       { color: "var(--c-text)" },
  textMuted:  { color: "var(--c-text-muted)" },
  textFaint:  { color: "var(--c-text-faint)" },
  accent:     { backgroundColor: "var(--c-accent)", color: "var(--c-accent-fg)" },
  accentText: { color: "var(--c-accent)" },
  chip:       { backgroundColor: "var(--c-chip-bg)", color: "var(--c-chip-text)" },
  nav:        { backgroundColor: "var(--c-nav-bg)" },
  subdue:     { backgroundColor: "var(--c-subdue)" },
};

/* ══════════════════════════════════════════
   DATA TYPES & CONSTANTS
══════════════════════════════════════════ */
type Screen =
  | "home" | "disciplina"
  | "portal" | "ensino"
  | "atividades-hub" | "consulta" | "alteracao" | "alteracao-form"
  | "registro-1" | "registro-2" | "registro-sucesso";

type TipoAtividade = "extensao" | "complementares";
type ExtStatus     = "aprovado" | "pendente" | "reprovado";

interface ExtAtividade {
  id: number; tipo: TipoAtividade; titulo: string; categoria: string;
  instituicao: string; dataInicio: string; dataFim: string;
  horas: number; status: ExtStatus; comprovante: string;
}

interface FormData {
  tipo: TipoAtividade; titulo: string; categoria: string;
  instituicao: string; data: string; horas: string;
  comprovante: string;
}

const META_EXTENSAO      = 200;
const META_COMPLEMENTARES = 200;

const categorias = [
  "Pesquisa e Iniciação Científica", "Monitoria e Tutoria",
  "Evento Cultural ou Científico",   "Projeto Social / Voluntariado",
  "Estágio Não-Obrigatório",         "Curso / Workshop / Minicurso",
  "Publicação Acadêmica",            "Representação Estudantil",
  "Atividade Artística ou Esportiva","Outro",
];

const disciplines = [
  { id: 1, code: "MCTA001", name: "Bases Computacionais da Ciência",  professor: "Prof. Dr. Carlos Mendes",     horario: "Ter/Qui 10h–12h",    sala: "L401-2", creditos: 4 },
  { id: 2, code: "MCTA028", name: "Processamento da Informação",       professor: "Prof.ª Dra. Ana Paula Lima",  horario: "Seg/Qua 08h–10h",    sala: "L402-1", creditos: 6 },
  { id: 3, code: "MCTB006", name: "Cálculo Diferencial e Integral I",  professor: "Prof. Dr. Ricardo Ferreira", horario: "Seg/Qua/Sex 14h–16h", sala: "S207",   creditos: 6 },
  { id: 4, code: "MCTB014", name: "Funções de Uma Variável",           professor: "Prof.ª Dra. Mariana Souza",  horario: "Ter/Qui 16h–18h",    sala: "S104",   creditos: 4 },
];

const arquivos = [
  { id: 1, name: "Ementa da Disciplina",  tipo: "PDF", tamanho: "124 KB", data: "15/02/2025", isPdf: true  },
  { id: 2, name: "Plano de Ensino",       tipo: "PDF", tamanho: "340 KB", data: "15/02/2025", isPdf: false },
  { id: 3, name: "Cronograma de Aulas",   tipo: "PDF", tamanho: "89 KB",  data: "20/02/2025", isPdf: false },
  { id: 4, name: "Lista 1 - Exercícios",  tipo: "PDF", tamanho: "256 KB", data: "01/03/2025", isPdf: false },
];

const initialAtividades: ExtAtividade[] = [
  { id: 1, tipo: "extensao",       titulo: "Monitoria de Cálculo I",          categoria: "Monitoria e Tutoria",             instituicao: "UFABC",              dataInicio: "01/03/2025", dataFim: "30/06/2025", horas: 60, status: "aprovado",  comprovante: "declaracao_monitoria.pdf" },
  { id: 2, tipo: "extensao",       titulo: "Semana da Computação UFABC",      categoria: "Evento Cultural ou Científico",   instituicao: "UFABC",              dataInicio: "10/05/2025", dataFim: "14/05/2025", horas: 20, status: "aprovado",  comprovante: "certificado_secomp.pdf" },
  { id: 3, tipo: "extensao",       titulo: "Oficina de Robótica Educacional", categoria: "Projeto Social / Voluntariado",   instituicao: "ONG TechEduca",      dataInicio: "05/07/2025", dataFim: "05/07/2025", horas: 8,  status: "pendente",  comprovante: "declaracao_robotica.pdf" },
  { id: 4, tipo: "complementares", titulo: "IC – Redes Neurais Aplicadas",    categoria: "Pesquisa e Iniciação Científica", instituicao: "UFABC – Lab. de IA", dataInicio: "01/02/2025", dataFim: "31/07/2025", horas: 80, status: "reprovado", comprovante: "relatorio_ic.pdf" },
  { id: 5, tipo: "complementares", titulo: "Curso de Python para Dados",      categoria: "Curso / Workshop / Minicurso",    instituicao: "Coursera / Google",  dataInicio: "10/01/2025", dataFim: "28/02/2025", horas: 40, status: "aprovado",  comprovante: "certificado_python.pdf" },
  { id: 6, tipo: "complementares", titulo: "Representação no DCE",            categoria: "Representação Estudantil",        instituicao: "UFABC",              dataInicio: "01/08/2024", dataFim: "31/12/2024", horas: 36, status: "aprovado",  comprovante: "declaracao_dce.pdf" },
];

/* ══════════════════════════════════════════
   ICONS
══════════════════════════════════════════ */
const Ico = {
  chevDown: (open: boolean) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform .2s" }}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  ),
  chevRight: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--c-text-faint)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  chevLeft: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  ),
  download: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  file: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--c-red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  ),
  bell: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" />
    </svg>
  ),
  settings: () => (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
  ),
  check: () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  plus: (size = 16) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  ),
  search: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  edit: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  upload: () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--c-accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  ),
  clock: (color = "var(--c-red)") => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  checkCircle: (color = "var(--c-accent)") => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
};

function NavIcon({ id, active }: { id: string; active: boolean }) {
  const c = active ? "var(--c-accent)" : "var(--c-nav-icon)";
  if (id === "inicio") return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
  if (id === "portal") return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    </svg>
  );
  if (id === "ensino") return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
    </svg>
  );
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
    </svg>
  );
}

/* ══════════════════════════════════════════
   REUSABLE PRIMITIVES
══════════════════════════════════════════ */
function StatusBadge({ status }: { status: ExtStatus }) {
  const m = {
    aprovado:  { label: "Aprovado",  bg: "color-mix(in srgb,var(--c-accent) 15%,transparent)", color: "var(--c-accent)" },
    pendente:  { label: "Pendente",  bg: "color-mix(in srgb,var(--c-amber) 18%,transparent)",  color: "var(--c-amber)" },
    reprovado: { label: "Reprovado", bg: "color-mix(in srgb,var(--c-red) 15%,transparent)",    color: "var(--c-red)" },
  }[status];
  return (
    <span className="text-[10px] font-bold rounded-lg px-2 py-0.5 flex-shrink-0"
      style={{ backgroundColor: m.bg, color: m.color }}>{m.label}</span>
  );
}

function StatusDot({ status }: { status: ExtStatus }) {
  const c = status === "aprovado" ? "var(--c-accent)" : status === "pendente" ? "var(--c-amber)" : "var(--c-red)";
  return <span className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1" style={{ backgroundColor: c }} />;
}

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!on)} className="relative w-11 h-6 rounded-full transition-colors flex-shrink-0"
      style={{ backgroundColor: on ? "var(--c-accent)" : "var(--c-border-mild)" }}>
      <span className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all"
        style={{ left: on ? "calc(100% - 1.375rem)" : "0.125rem" }} />
    </button>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl shadow-sm ${className}`}
      style={{ ...T.surface, border: "1px solid var(--c-border-mild)" }}>
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[10px] font-semibold uppercase tracking-widest" style={T.textFaint}>{children}</p>;
}

/* ══════════════════════════════════════════
   INFOGRAPHIC — Horas que Faltam
══════════════════════════════════════════ */
function HorasFaltamChart({ atividades }: { atividades: ExtAtividade[] }) {
  function calc(tipo: TipoAtividade) {
    const meta = tipo === "extensao" ? META_EXTENSAO : META_COMPLEMENTARES;
    const filtered = atividades.filter(a => a.tipo === tipo);
    const aprovadas = filtered.filter(a => a.status === "aprovado").reduce((s, a) => s + a.horas, 0);
    const pendentes = filtered.filter(a => a.status === "pendente").reduce((s, a) => s + a.horas, 0);
    const faltam = Math.max(0, meta - aprovadas);
    const pct = Math.min(100, Math.round((aprovadas / meta) * 100));
    return { meta, aprovadas, pendentes, faltam, pct };
  }

  const ext  = calc("extensao");
  const comp = calc("complementares");

  function Ring({ pct, faltam, color, label }: { pct: number; faltam: number; color: string; label: string }) {
    const r = 42; const cx = 52; const cy = 52;
    const circ = 2 * Math.PI * r;
    const dash = (pct / 100) * circ;
    return (
      <div className="flex flex-col items-center gap-2">
        <svg width="104" height="104" viewBox="0 0 104 104">
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--c-border-mild)" strokeWidth="12" />
          <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="12"
            strokeDasharray={`${dash} ${circ - dash}`}
            strokeLinecap="round"
            style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%", transition: "stroke-dasharray .4s ease" }} />
          <text x={cx} y={cy - 5} textAnchor="middle" style={{ fontSize: "1.28em", fontWeight: 800, fill: color, fontFamily: "Inter,sans-serif" }}>{faltam}h</text>
          <text x={cx} y={cy + 11} textAnchor="middle" style={{ fontSize: "0.57em", fill: "var(--c-text-faint)", fontFamily: "Inter,sans-serif" }}>faltam</text>
        </svg>
        <p className="text-xs font-semibold text-center" style={{ color }}>{label}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* dois anéis lado a lado */}
      <div className="flex justify-around">
        <Ring pct={ext.pct}  faltam={ext.faltam}  color="var(--c-red)"    label="Extensão" />
        <Ring pct={comp.pct} faltam={comp.faltam} color="var(--c-accent)" label="Complementares" />
      </div>
      {/* barras de progresso detalhadas */}
      {[
        { label: "Extensão",        data: ext,  color: "var(--c-red)" },
        { label: "Complementares",  data: comp, color: "var(--c-accent)" },
      ].map(({ label, data, color }) => (
        <div key={label} className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold" style={{ color }}>{label}</span>
            <span className="text-xs" style={T.textFaint}>{data.aprovadas}h de {data.meta}h · {data.pct}%</span>
          </div>
          <div className="h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--c-border-mild)" }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${data.pct}%`, backgroundColor: color }} />
          </div>
          <div className="flex gap-3">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
              <span className="text-[10px]" style={T.textFaint}>Aprovadas: <strong style={T.text}>{data.aprovadas}h</strong></span>
            </div>
            {data.pendentes > 0 && (
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--c-amber)" }} />
                <span className="text-[10px]" style={T.textFaint}>Pendentes: <strong style={T.text}>{data.pendentes}h</strong></span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════
   MENU DRAWER  (design image-4)
══════════════════════════════════════════ */
function MenuDrawer({ open, onClose, onNavigate }: {
  open: boolean; onClose: () => void; onNavigate: (s: Screen) => void;
}) {
  const { dark, setDark, colorMode, setColorMode, fontSize, setFontSize } = useTheme();
  const fontSizes: FontSize[] = ["normal", "grande", "extra", "extra"];
  const fontLabels = ["A", "A", "A", "A"];
  const fontScales = ["text-xs", "text-sm", "text-base", "text-lg"];

  return (
    <>
      {open && <div className="absolute inset-0 bg-black/50 z-40 rounded-[2.5rem]" onClick={onClose} />}
      <div className="absolute top-0 left-0 h-full w-[270px] z-50 shadow-2xl flex flex-col overflow-hidden"
        style={{ ...T.surface, transform: open ? "translateX(0)" : "translateX(-100%)", transition: "transform .28s cubic-bezier(.4,0,.2,1)", borderRadius: "2.5rem 0 0 2.5rem" }}>

        {/* header */}
        <div className="px-5 pt-10 pb-5 header-bar" style={{ background: "var(--c-accent)", borderRadius: "2.5rem 0 0 0" }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-white/70 text-[10px] font-semibold uppercase tracking-widest">SIGAA</p>
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-white text-sm">AX</div>
          </div>
          <p className="text-white font-bold text-base leading-tight">Aluno X</p>
          <p className="text-white/70 text-xs mt-0.5">Ciência da Computação · 5° período</p>
        </div>

        {/* nav links */}
        <div className="py-2" style={{ borderBottom: "1px solid var(--c-border-mild)" }}>
          {[
            { label: "Início",            icon: "🏠", screen: "home" as Screen },
            { label: "Registro de Horas", icon: "📝", screen: "registro-1" as Screen },
            { label: "Minhas Atividades", icon: "📊", screen: "atividades-hub" as Screen },
            { label: "Estágios",          icon: "💼", screen: null },
            { label: "Pesquisas",         icon: "🔬", screen: null },
            { label: "Fórum",             icon: "💬", screen: null },
            { label: "Dúvidas",           icon: "❓", screen: null },
            { label: "Ajuda",             icon: "🆘", screen: null },
          ].map(item => (
            <button key={item.label}
              onClick={() => { if (item.screen) onNavigate(item.screen); onClose(); }}
              className="w-full flex items-center gap-3 px-5 py-3 transition-opacity hover:opacity-70 text-left">
              <span className="text-lg w-6">{item.icon}</span>
              <span className="text-sm font-medium" style={T.text}>{item.label}</span>
            </button>
          ))}
        </div>

        {/* accessibility — integrado no menu (design image-4) */}
        <div className="px-5 py-4 flex-1 overflow-y-auto space-y-4">
          {/* modo claro/escuro */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">☀️</span>
              <span className="text-sm font-medium" style={T.text}>Modo claro</span>
            </div>
            <Toggle on={!dark} onChange={v => setDark(!v)} />
          </div>

          {/* alto contraste */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">👁</span>
              <span className="text-sm font-medium" style={T.text}>Alto contraste</span>
            </div>
            <Toggle on={colorMode === "alto-contraste"} onChange={v => setColorMode(v ? "alto-contraste" : "normal")} />
          </div>

          {/* proteção ocular */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">🌙</span>
              <span className="text-sm font-medium" style={T.text}>Proteção ocular</span>
            </div>
            <Toggle on={colorMode === "protecao"} onChange={v => setColorMode(v ? "protecao" : "normal")} />
          </div>

          {/* tamanho da fonte */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={T.textFaint}>Tamanho da fonte</p>
            <div className="flex gap-2">
              {(["normal","grande","extra"] as FontSize[]).map((fs, i) => (
                <button key={fs} onClick={() => setFontSize(fs)}
                  className={`flex-1 h-10 rounded-xl font-bold flex items-center justify-center ${fontScales[i]}`}
                  style={fontSize === fs ? T.accent : { ...T.subdue, ...T.text, border: "1.5px solid var(--c-border-mild)" }}>
                  <span style={fontSize === fs ? { color: "var(--c-accent-fg)" } : {}}>A</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* footer */}
        <div className="px-5 pb-6" style={{ borderTop: "1px solid var(--c-border-mild)" }}>
          <button className="flex items-center gap-2.5 text-sm font-medium py-3" style={{ color: "var(--c-red)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sair
          </button>
          <p className="text-[10px]" style={T.textFaint}>SIGAA · v2.4.1 · UFABC</p>
        </div>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════
   SETTINGS SHEET (gear icon)
══════════════════════════════════════════ */
function SettingsSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { dark, setDark, fontSize, setFontSize, colorMode, setColorMode } = useTheme();
  const colorOptions = [
    { id: "normal" as ColorMode,         label: "Padrão",          preview: "#e8f5ef" },
    { id: "mono" as ColorMode,           label: "Monocromático",   preview: "#d1d5db" },
    { id: "protecao" as ColorMode,       label: "Proteção Ocular", preview: "#f5efe0" },
    { id: "alto-contraste" as ColorMode, label: "Alto Contraste",  preview: "#111100" },
  ];
  return (
    <>
      {open && <div className="absolute inset-0 bg-black/50 z-40 rounded-[2.5rem]" onClick={onClose} />}
      <div className="absolute bottom-0 left-0 right-0 z-50 rounded-t-3xl shadow-2xl overflow-hidden"
        style={{ ...T.surface, transform: open ? "translateY(0)" : "translateY(100%)", transition: "transform .3s cubic-bezier(.4,0,.2,1)", maxHeight: "85%" }}>
        <div className="flex justify-center pt-3 pb-1"><div className="w-10 h-1 rounded-full" style={{ backgroundColor: "var(--c-border-mild)" }} /></div>
        <div className="px-5 pb-2 flex items-center justify-between">
          <p className="font-bold text-base" style={T.text}>Acessibilidade</p>
          <button onClick={onClose} className="w-7 h-7 rounded-full flex items-center justify-center" style={T.subdue}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={T.textMuted}>
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto px-5 pb-8 space-y-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={T.textFaint}>Aparência</p>
            <div className="rounded-2xl p-1 flex gap-1" style={T.subdue}>
              {[{ val: false, label: "☀️  Claro" }, { val: true, label: "🌙  Escuro" }].map(({ val, label }) => (
                <button key={String(val)} onClick={() => setDark(val)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
                  style={dark === val ? { ...T.accent, boxShadow: "0 1px 4px rgba(0,0,0,.25)" } : T.textMuted}>{label}</button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={T.textFaint}>Tamanho do Texto</p>
            <div className="flex gap-2">
              {(["normal","grande","extra"] as FontSize[]).map((fs, i) => (
                <button key={fs} onClick={() => setFontSize(fs)} className="flex-1 h-12 rounded-2xl font-bold flex items-center justify-center transition-all"
                  style={fontSize === fs ? { ...T.accent, border: "1.5px solid var(--c-accent)" } : { ...T.subdue, border: "1.5px solid var(--c-border-mild)", ...T.text }}>
                  <span className={i === 0 ? "text-sm" : i === 1 ? "text-base" : "text-xl"}
                    style={fontSize === fs ? { color: "var(--c-accent-fg)" } : {}}>A</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-3" style={T.textFaint}>Filtro de Cor</p>
            <div className="grid grid-cols-2 gap-2">
              {colorOptions.map(({ id, label, preview }) => (
                <button key={id} onClick={() => setColorMode(id)} className="flex flex-col items-center gap-2 py-3 px-2 rounded-2xl transition-all"
                  style={colorMode === id ? { border: "2px solid var(--c-accent)", ...T.chip } : { border: "2px solid transparent", ...T.subdue }}>
                  <div className="w-10 h-10 rounded-xl border-2 flex items-center justify-center"
                    style={{ backgroundColor: preview, borderColor: colorMode === id ? "var(--c-accent)" : "var(--c-border-mild)" }}>
                    {colorMode === id && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={id === "alto-contraste" ? "#ffff00" : "#1a6b48"} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
                  </div>
                  <span className="text-xs font-medium text-center leading-tight" style={T.text}>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════
   TOAST
══════════════════════════════════════════ */
function Toast({ name, onClose }: { name: string; onClose: () => void }) {
  return (
    <div className="absolute bottom-20 left-3 right-3 z-50">
      <div className="rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3" style={T.accent}>
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--c-accent-fg)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold" style={{ color: "var(--c-accent-fg)" }}>Download iniciado</p>
          <p className="text-xs opacity-80 truncate" style={{ color: "var(--c-accent-fg)" }}>{name}</p>
        </div>
        <button onClick={onClose} className="opacity-60 hover:opacity-100" style={{ color: "var(--c-accent-fg)" }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   SCREEN: HOME  (design image-5)
══════════════════════════════════════════ */
function HomeScreen({ atividades, onSelectDiscipline, onGoAtividades }: {
  atividades: ExtAtividade[];
  onSelectDiscipline: (d: typeof disciplines[0]) => void;
  onGoAtividades: () => void;
}) {
  const [activeTab, setActiveTab] = useState("Disciplinas");
  const sorted = [...disciplines].sort((a, b) => a.name.localeCompare(b.name));

  const horasExt  = atividades.filter(a => a.tipo === "extensao"       && a.status === "aprovado").reduce((s, a) => s + a.horas, 0);
  const horasComp = atividades.filter(a => a.tipo === "complementares" && a.status === "aprovado").reduce((s, a) => s + a.horas, 0);

  // últimas 3 atividades (qualquer tipo), mais recentes primeiro
  const ultimas = [...atividades].reverse().slice(0, 3);

  return (
    <div className="px-4 py-4 space-y-4">
      {/* banner boas-vindas */}
      <div className="rounded-2xl p-4 header-bar" style={{ background: "var(--c-accent)" }}>
        <p className="text-[10px] font-semibold uppercase tracking-widest opacity-70 mb-1" style={{ color: "var(--c-accent-fg)" }}>BEM-VINDO(A)</p>
        <p className="font-bold text-lg leading-tight" style={{ color: "var(--c-accent-fg)" }}>Aluno X</p>
        <p className="text-xs opacity-70 mt-0.5" style={{ color: "var(--c-accent-fg)" }}>Ciência da Computação · 5° período</p>
      </div>

      {/* stats horas */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="p-3.5">
          <div className="flex items-center gap-2 mb-1">{Ico.checkCircle()}</div>
          <p className="text-2xl font-bold" style={T.accentText}>{horasComp}h</p>
          <p className="text-xs mt-0.5" style={T.textFaint}>Horas Complementares</p>
        </Card>
        <Card className="p-3.5">
          <div className="flex items-center gap-2 mb-1">{Ico.clock()}</div>
          <p className="text-2xl font-bold" style={{ color: "var(--c-red)" }}>{horasExt}h</p>
          <p className="text-xs mt-0.5" style={T.textFaint}>Horas de Extensão</p>
        </Card>
      </div>

      {/* card de acesso rápido às atividades */}
      <button onClick={onGoAtividades} className="w-full text-left" >
        <Card className="p-4 flex items-start gap-3 hover:opacity-80 transition-opacity active:scale-[.98]">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={T.chip}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--c-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold" style={T.text}>Atividades Complementares e de Extensão</p>
            <p className="text-xs mt-0.5 leading-snug" style={T.textMuted}>Cadastre e acompanhe suas horas complementares e atividades de extensão.</p>
            <p className="text-xs font-semibold mt-2" style={T.accentText}>Acessar &rsaquo;</p>
          </div>
        </Card>
      </button>

      {/* últimas atividades */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={T.textFaint}>Últimas Atividades</p>
        <Card>
          {ultimas.map((a, i) => (
            <div key={a.id} className="flex items-start gap-3 px-4 py-3"
              style={i > 0 ? { borderTop: "1px solid var(--c-border-mild)" } : {}}>
              <StatusDot status={a.status} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-snug truncate" style={T.text}>{a.titulo}</p>
                <p className="text-xs mt-0.5" style={T.textFaint}>{a.horas}h · {a.dataInicio}</p>
              </div>
              <StatusBadge status={a.status} />
            </div>
          ))}
        </Card>
      </div>

      {/* disciplinas */}
      <Card className="overflow-hidden">
        <div className="px-4 pt-3.5">
          <SectionLabel>Minhas Disciplinas</SectionLabel>
          <div className="flex mt-3" style={{ borderBottom: "1px solid var(--c-border-mild)" }}>
            {["Disciplinas", "Notas", "Faltas"].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className="flex-1 text-sm font-medium pb-2.5 relative"
                style={activeTab === tab ? { color: "var(--c-accent)" } : T.textFaint}>
                {tab}
                {activeTab === tab && <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full" style={{ backgroundColor: "var(--c-accent)" }} />}
              </button>
            ))}
          </div>
        </div>
        <div className="px-4 py-2">
          {activeTab === "Disciplinas" && sorted.map(d => (
            <button key={d.id} onClick={() => onSelectDiscipline(d)}
              className="w-full text-left flex items-center gap-3 py-3 rounded-xl px-2 -mx-2 hover:opacity-70 transition-opacity"
              style={{ borderBottom: "1px solid var(--c-border-mild)" }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={T.chip}>
                <span className="text-[11px] font-bold" style={T.accentText}>{d.code.slice(-3)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-snug" style={T.text}>{d.name}</p>
                <p className="text-xs mt-0.5" style={T.textFaint}>{d.code} · {d.creditos} cr.</p>
              </div>
              {Ico.chevRight()}
            </button>
          ))}
          {activeTab === "Notas"  && <p className="text-center text-sm py-6" style={T.textFaint}>Nenhuma nota lançada ainda.</p>}
          {activeTab === "Faltas" && <p className="text-center text-sm py-6" style={T.textFaint}>Frequência disponível após o início das aulas.</p>}
        </div>
      </Card>
    </div>
  );
}

/* ══════════════════════════════════════════
   SCREEN: DISCIPLINA DETAIL
══════════════════════════════════════════ */
function DisciplinaScreen({ disciplina, downloadingId, onDownload }: {
  disciplina: typeof disciplines[0]; downloadingId: number | null; onDownload: (a: typeof arquivos[0]) => void;
}) {
  const [arquivosOpen, setArquivosOpen] = useState(false);
  const [openSec, setOpenSec] = useState<Record<string, boolean>>({});
  const toggleSec = (s: string) => setOpenSec(p => ({ ...p, [s]: !p[s] }));

  const tarefas = [
    { titulo: "Lista 2 – Derivadas", prazo: "12/09/2025", status: "pendente" },
    { titulo: "Trabalho em Grupo – Algoritmos", prazo: "20/09/2025", status: "pendente" },
    { titulo: "Lista 1 – Limites", prazo: "29/08/2025", status: "entregue" },
  ];
  const foruns = [
    { titulo: "Dúvida sobre integração por partes", autor: "Lucas M.", respostas: 4, data: "28/08" },
    { titulo: "Material extra — vídeo aula derivadas", autor: "Prof. Ricardo", respostas: 12, data: "25/08" },
    { titulo: "Formação de grupos para o trabalho", autor: "Juliana P.", respostas: 7, data: "22/08" },
  ];
  const conteudo = [
    { unidade: "1", titulo: "Limites e Continuidade", topicos: ["Definição de limite", "Limites laterais", "Continuidade de funções"] },
    { unidade: "2", titulo: "Derivadas", topicos: ["Regra do produto e quociente", "Regra da cadeia", "Derivadas de funções trigonométricas"] },
    { unidade: "3", titulo: "Aplicações da Derivada", topicos: ["Otimização", "Regra de L'Hôpital", "Esboço de gráficos"] },
    { unidade: "4", titulo: "Integrais", topicos: ["Integral indefinida", "Teorema Fundamental do Cálculo", "Integração por substituição"] },
  ];

  return (
    <div className="px-4 py-4 space-y-3">
      <Card className="p-4">
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: "Professor", value: disciplina.professor.replace(/Prof\.?ª? Dr\.?a?\.? /, "") },
            { label: "Horário",   value: disciplina.horario },
            { label: "Sala",      value: disciplina.sala },
            { label: "Créditos",  value: `${disciplina.creditos} créditos` },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl px-3 py-2.5" style={T.subdue}>
              <p className="text-[10px] font-semibold uppercase tracking-wide" style={T.textFaint}>{label}</p>
              <p className="text-xs font-semibold mt-0.5 leading-tight" style={T.text}>{value}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="overflow-hidden">
        <button onClick={() => setArquivosOpen(o => !o)} className="w-full flex items-center gap-3 px-4 py-4 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={T.chip}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--c-accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
            </svg>
          </div>
          <div className="flex-1 text-left">
            <SectionLabel>Seção</SectionLabel>
            <p className="text-sm font-semibold mt-0.5" style={T.text}>Arquivos da Disciplina</p>
          </div>
          <span style={T.textFaint}>{Ico.chevDown(arquivosOpen)}</span>
        </button>
        {arquivosOpen && (
          <div style={{ borderTop: "1px solid var(--c-border-mild)" }}>
            <div className="px-4 py-1.5 flex justify-between" style={T.subdue}>
              <span className="text-[10px]" style={T.textFaint}>{arquivos.length} arquivo(s)</span>
              <span className="text-[10px]" style={T.textFaint}>Por data</span>
            </div>
            {arquivos.map(arq => (
              <div key={arq.id} className="px-4 py-3.5 flex items-center gap-3" style={{ borderTop: "1px solid var(--c-border-mild)" }}>
                {Ico.file()}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={T.text}>{arq.name}</p>
                  <p className="text-xs mt-0.5" style={T.textFaint}>{arq.tipo} · {arq.tamanho} · {arq.data}</p>
                </div>
                <a href={arq.isPdf ? ementaPdf : "#"} download={arq.isPdf ? "ementa_disciplina.pdf" : undefined}
                  onClick={e => { if (!arq.isPdf) e.preventDefault(); onDownload(arq); }}
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all"
                  style={downloadingId === arq.id
                    ? { ...T.accent, transform: "scale(.9)" }
                    : T.chip}>
                  {downloadingId === arq.id
                    ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--c-accent-fg)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    : Ico.download()}
                </a>
              </div>
            ))}
            <div className="px-4 pb-4 pt-2">
              <div className="rounded-xl p-3 flex items-start gap-2" style={T.chip}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--c-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <p className="text-xs leading-snug" style={T.accentText}>Clique em <strong>Ementa da Disciplina</strong> para baixar o arquivo PDF.</p>
              </div>
            </div>
          </div>
        )}
      </Card>
      {/* Tarefas */}
      <Card className="overflow-hidden">
        <button onClick={() => toggleSec("tarefas")} className="w-full flex items-center gap-3 px-4 py-4 hover:opacity-70 transition-opacity">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={T.chip}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--c-accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" /></svg>
          </div>
          <p className="flex-1 text-left text-sm font-semibold" style={T.text}>Tarefas</p>
          <span className="text-[10px] font-semibold rounded-lg px-2 py-0.5 mr-1" style={T.chip}>{tarefas.length}</span>
          <span style={T.textFaint}>{Ico.chevDown(!!openSec["tarefas"])}</span>
        </button>
        {openSec["tarefas"] && (
          <div style={{ borderTop: "1px solid var(--c-border-mild)" }}>
            {tarefas.map((t, i) => (
              <div key={i} className="flex items-start gap-3 px-4 py-3" style={i > 0 ? { borderTop: "1px solid var(--c-border-mild)" } : {}}>
                <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: t.status === "entregue" ? "color-mix(in srgb,var(--c-accent) 15%,transparent)" : "color-mix(in srgb,var(--c-amber) 18%,transparent)" }}>
                  {t.status === "entregue"
                    ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--c-accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    : <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="var(--c-amber)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium" style={{ ...T.text, textDecoration: t.status === "entregue" ? "line-through" : "none", opacity: t.status === "entregue" ? 0.5 : 1 }}>{t.titulo}</p>
                  <p className="text-xs mt-0.5" style={T.textFaint}>Prazo: {t.prazo}</p>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-lg flex-shrink-0"
                  style={{ backgroundColor: t.status === "entregue" ? "color-mix(in srgb,var(--c-accent) 15%,transparent)" : "color-mix(in srgb,var(--c-amber) 18%,transparent)", color: t.status === "entregue" ? "var(--c-accent)" : "var(--c-amber)" }}>
                  {t.status === "entregue" ? "Entregue" : "Pendente"}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Fóruns */}
      <Card className="overflow-hidden">
        <button onClick={() => toggleSec("foruns")} className="w-full flex items-center gap-3 px-4 py-4 hover:opacity-70 transition-opacity">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={T.chip}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--c-accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
          </div>
          <p className="flex-1 text-left text-sm font-semibold" style={T.text}>Fóruns</p>
          <span className="text-[10px] font-semibold rounded-lg px-2 py-0.5 mr-1" style={T.chip}>{foruns.length}</span>
          <span style={T.textFaint}>{Ico.chevDown(!!openSec["foruns"])}</span>
        </button>
        {openSec["foruns"] && (
          <div style={{ borderTop: "1px solid var(--c-border-mild)" }}>
            {foruns.map((f, i) => (
              <div key={i} className="flex items-start gap-3 px-4 py-3" style={i > 0 ? { borderTop: "1px solid var(--c-border-mild)" } : {}}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold" style={T.chip}>
                  {f.autor.split(" ").map(w => w[0]).join("").slice(0,2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-snug" style={T.text}>{f.titulo}</p>
                  <p className="text-xs mt-0.5" style={T.textFaint}>{f.autor} · {f.data}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={T.textFaint}>
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                  </svg>
                  <span className="text-xs font-semibold" style={T.textMuted}>{f.respostas}</span>
                </div>
              </div>
            ))}
            <div className="px-4 py-3" style={{ borderTop: "1px solid var(--c-border-mild)" }}>
              <button className="w-full py-2.5 rounded-xl text-sm font-semibold text-center" style={{ ...T.chip, ...T.accentText }}>
                + Nova discussão
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* Conteúdo Programático */}
      <Card className="overflow-hidden">
        <button onClick={() => toggleSec("conteudo")} className="w-full flex items-center gap-3 px-4 py-4 hover:opacity-70 transition-opacity">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={T.chip}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--c-accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 016.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
            </svg>
          </div>
          <p className="flex-1 text-left text-sm font-semibold" style={T.text}>Conteúdo Programático</p>
          <span style={T.textFaint}>{Ico.chevDown(!!openSec["conteudo"])}</span>
        </button>
        {openSec["conteudo"] && (
          <div style={{ borderTop: "1px solid var(--c-border-mild)" }}>
            {conteudo.map((u, i) => (
              <div key={i} className="px-4 py-3" style={i > 0 ? { borderTop: "1px solid var(--c-border-mild)" } : {}}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold flex-shrink-0" style={T.accent}>
                    <span style={{ color: "var(--c-accent-fg)" }}>{u.unidade}</span>
                  </div>
                  <p className="text-sm font-semibold" style={T.text}>{u.titulo}</p>
                </div>
                <ul className="space-y-1 pl-7">
                  {u.topicos.map((t, j) => (
                    <li key={j} className="flex items-start gap-1.5">
                      <span className="w-1 h-1 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: "var(--c-text-faint)" }} />
                      <p className="text-xs leading-snug" style={T.textMuted}>{t}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

/* ══════════════════════════════════════════
   SCREEN: ATIVIDADES HUB  (design image-6)
══════════════════════════════════════════ */
function AtividadesHub({ onRegistro, onConsulta, onAlteracao }: {
  onRegistro: () => void; onConsulta: () => void; onAlteracao: () => void;
}) {
  return (
    <div className="px-4 py-4 space-y-3">
      <p className="text-[10px] font-bold uppercase tracking-widest" style={T.textFaint}>O que deseja fazer?</p>

      {/* Registro de Horas — vermelho */}
      <button onClick={onRegistro} className="w-full rounded-2xl p-5 text-left flex items-center gap-4 hover:opacity-90 active:scale-[.98] transition-all shadow-sm"
        style={{ backgroundColor: "#c0392b" }}>
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </div>
        <div>
          <p className="text-white font-bold text-base">Registro de Horas</p>
          <p className="text-white/80 text-sm mt-0.5">Cadastrar nova atividade</p>
        </div>
      </button>

      {/* Consulta de Horas — verde escuro */}
      <button onClick={onConsulta} className="w-full rounded-2xl p-5 text-left flex items-center gap-4 hover:opacity-90 active:scale-[.98] transition-all shadow-sm"
        style={{ backgroundColor: "#1a6b48" }}>
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
          {Ico.search()}
        </div>
        <div>
          <p className="text-white font-bold text-base">Consulta de Horas</p>
          <p className="text-white/80 text-sm mt-0.5">Ver horas cadastradas</p>
        </div>
      </button>

      {/* Alteração de Registro — âmbar */}
      <button onClick={onAlteracao} className="w-full rounded-2xl p-5 text-left flex items-center gap-4 hover:opacity-90 active:scale-[.98] transition-all shadow-sm"
        style={{ backgroundColor: "#c8980a" }}>
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
          {Ico.edit()}
        </div>
        <div>
          <p className="text-white font-bold text-base">Alteração de Registro</p>
          <p className="text-white/80 text-sm mt-0.5">Editar atividade existente</p>
        </div>
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════
   SCREEN: CONSULTA DE HORAS  (design image-3)
══════════════════════════════════════════ */
function ConsultaScreen({ atividades }: { atividades: ExtAtividade[] }) {
  const [tipoFiltro, setTipoFiltro] = useState<TipoAtividade>("extensao");
  const filtradas = atividades.filter(a => a.tipo === tipoFiltro);

  return (
    <div className="px-4 py-4 space-y-4">
      {/* infográfico de horas faltantes — sempre mostra ambos */}
      <Card className="p-4">
        <SectionLabel>Horas que Faltam para a Meta</SectionLabel>
        <div className="mt-4">
          <HorasFaltamChart atividades={atividades} />
        </div>
      </Card>

      {/* seletor de tipo */}
      <div className="rounded-2xl p-1 flex gap-1" style={T.subdue}>
        {([["extensao","Extensão"],["complementares","Complementares"]] as [TipoAtividade,string][]).map(([id, label]) => (
          <button key={id} onClick={() => setTipoFiltro(id)}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={tipoFiltro === id ? { ...T.accent, boxShadow: "0 1px 4px rgba(0,0,0,.2)" } : T.textMuted}>
            <span style={tipoFiltro === id ? { color: "var(--c-accent-fg)" } : {}}>{label}</span>
          </button>
        ))}
      </div>

      {/* lista */}
      <Card className="overflow-hidden">
        <div className="px-4 pt-3.5 pb-2">
          <SectionLabel>Lista de Atividades ({filtradas.length})</SectionLabel>
        </div>
        {filtradas.length === 0 && <p className="px-4 pb-4 text-sm" style={T.textFaint}>Nenhuma atividade cadastrada neste tipo.</p>}
        {filtradas.map((a, i) => (
          <div key={a.id} className="flex items-start gap-3 px-4 py-3.5"
            style={{ borderTop: "1px solid var(--c-border-mild)" }}>
            <StatusDot status={a.status} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold leading-snug" style={T.text}>{a.titulo}</p>
              <p className="text-xs mt-0.5" style={T.textFaint}>{a.categoria}</p>
              <p className="text-xs mt-0.5" style={T.textFaint}>{a.dataInicio} → {a.dataFim}</p>
            </div>
            <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
              <span className="text-xs font-bold rounded-lg px-2 py-0.5" style={T.chip}>{a.horas}h</span>
              <StatusBadge status={a.status} />
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

/* ══════════════════════════════════════════
   SCREEN: ALTERAÇÃO DE REGISTRO
══════════════════════════════════════════ */
function AlteracaoScreen({ atividades, onEdit }: {
  atividades: ExtAtividade[]; onEdit: (a: ExtAtividade) => void;
}) {
  return (
    <div className="px-4 py-4 space-y-4">
      <div className="rounded-xl p-3 flex items-start gap-2" style={T.chip}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--c-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <p className="text-xs leading-snug" style={T.accentText}>Selecione uma atividade para editar. Apenas atividades <strong>pendentes ou reprovadas</strong> podem ser alteradas.</p>
      </div>
      <Card className="overflow-hidden">
        {atividades.map((a, i) => {
          const editavel = a.status !== "aprovado";
          return (
            <div key={a.id} className="flex items-start gap-3 px-4 py-3.5"
              style={i > 0 ? { borderTop: "1px solid var(--c-border-mild)" } : {}}>
              <StatusDot status={a.status} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold leading-snug" style={T.text}>{a.titulo}</p>
                <p className="text-xs mt-0.5" style={T.textFaint}>{a.tipo === "extensao" ? "Extensão" : "Complementar"} · {a.horas}h</p>
                <p className="text-xs" style={T.textFaint}>{a.dataInicio} → {a.dataFim}</p>
              </div>
              <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                <StatusBadge status={a.status} />
                {editavel && (
                  <button onClick={() => onEdit(a)}
                    className="w-8 h-8 rounded-xl flex items-center justify-center transition-all hover:opacity-80"
                    style={{ backgroundColor: "#c8980a", color: "white" }}>
                    {Ico.edit()}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </Card>
    </div>
  );
}

/* ══════════════════════════════════════════
   SCREEN: REGISTRO — PASSO 1/2  (design image-3)
══════════════════════════════════════════ */
function RegistroStep1({ form, setForm, onNext, onCancel }: {
  form: FormData; setForm: React.Dispatch<React.SetStateAction<FormData>>;
  onNext: () => void; onCancel: () => void;
}) {
  const [errors, setErrors] = useState<Partial<FormData>>({});

  function set(k: keyof FormData, v: string) {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: "" }));
  }

  function validate() {
    const e: Partial<FormData> = {};
    if (!form.titulo.trim())      e.titulo = "Obrigatório";
    if (!form.categoria)          e.categoria = "Obrigatório";
    if (!form.instituicao.trim()) e.instituicao = "Obrigatório";
    if (!form.data)               e.data = "Obrigatório";
    if (!form.horas || isNaN(Number(form.horas)) || Number(form.horas) <= 0) e.horas = "Obrigatório";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  const inp = (err?: string): React.CSSProperties => ({
    ...T.surface, ...T.text,
    border: `1.5px solid ${err ? "var(--c-red)" : "var(--c-border-mild)"}`,
    borderRadius: "0.75rem", padding: "0.625rem 0.875rem",
    width: "100%", fontSize: "0.875em", outline: "none", fontFamily: "inherit",
  });
  const lbl: React.CSSProperties = { ...T.textFaint, fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.06em", display: "block", marginBottom: "0.375rem" };

  return (
    <div className="px-4 py-4 space-y-4">
      {/* indicador passo */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold" style={T.accent}>
          <span style={{ color: "var(--c-accent-fg)" }}>1</span>
        </div>
        <div className="flex-1 h-px" style={{ backgroundColor: "var(--c-border-mild)" }} />
        <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold" style={T.subdue}>
          <span style={T.textFaint}>2</span>
        </div>
        <span className="text-xs ml-1" style={T.textFaint}>Passo 1/2</span>
      </div>

      <Card className="p-4 space-y-4">
        {/* tipo: Extensão / Complementares */}
        <div>
          <label style={lbl}>Tipo de Atividade *</label>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => set("tipo", "extensao")}
              className="py-3 rounded-xl font-semibold text-sm transition-all"
              style={form.tipo === "extensao" ? { backgroundColor: "#c0392b", color: "white" } : { ...T.subdue, ...T.textMuted, border: "1.5px solid var(--c-border-mild)" }}>
              Extensão
            </button>
            <button onClick={() => set("tipo", "complementares")}
              className="py-3 rounded-xl font-semibold text-sm transition-all"
              style={form.tipo === "complementares" ? { backgroundColor: "#1a6b48", color: "white" } : { ...T.subdue, ...T.textMuted, border: "1.5px solid var(--c-border-mild)" }}>
              Complementares
            </button>
          </div>
        </div>

        {/* título */}
        <div>
          <label style={lbl}>Título da Atividade *</label>
          <input value={form.titulo} onChange={e => set("titulo", e.target.value)}
            placeholder="Ex: Monitoria de Física Experimental" style={inp(errors.titulo)} />
          {errors.titulo && <p className="text-xs mt-1" style={{ color: "var(--c-red)" }}>{errors.titulo}</p>}
        </div>

        {/* categoria */}
        <div>
          <label style={lbl}>Categoria *</label>
          <select value={form.categoria} onChange={e => set("categoria", e.target.value)}
            style={{ ...inp(errors.categoria), appearance: "none" as const }}>
            <option value="">Selecione...</option>
            {categorias.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.categoria && <p className="text-xs mt-1" style={{ color: "var(--c-red)" }}>{errors.categoria}</p>}
        </div>

        {/* instituição */}
        <div>
          <label style={lbl}>Instituição *</label>
          <input value={form.instituicao} onChange={e => set("instituicao", e.target.value)}
            placeholder="Ex: UFABC, ONG, Empresa..." style={inp(errors.instituicao)} />
          {errors.instituicao && <p className="text-xs mt-1" style={{ color: "var(--c-red)" }}>{errors.instituicao}</p>}
        </div>

        {/* data + horas */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label style={lbl}>Data *</label>
            <input type="date" value={form.data} onChange={e => set("data", e.target.value)} style={inp(errors.data)} />
            {errors.data && <p className="text-xs mt-1" style={{ color: "var(--c-red)" }}>{errors.data}</p>}
          </div>
          <div>
            <label style={lbl}>Qtd. de Horas *</label>
            <input type="number" min="1" value={form.horas} onChange={e => set("horas", e.target.value)}
              placeholder="0" style={inp(errors.horas)} />
            {errors.horas && <p className="text-xs mt-1" style={{ color: "var(--c-red)" }}>{errors.horas}</p>}
          </div>
        </div>

        {/* ações */}
        <div className="flex gap-2 pt-1">
          <button onClick={onCancel} className="flex-1 py-3 rounded-2xl font-semibold text-sm"
            style={{ ...T.subdue, ...T.textMuted, border: "1px solid var(--c-border-mild)" }}>
            Cancelar
          </button>
          <button onClick={() => { if (validate()) onNext(); }}
            className="flex-[2] py-3 rounded-2xl font-semibold text-sm"
            style={T.accent}>
            <span style={{ color: "var(--c-accent-fg)" }}>Próximo passo →</span>
          </button>
        </div>
      </Card>
    </div>
  );
}

/* ══════════════════════════════════════════
   SCREEN: REGISTRO — PASSO 2/2
══════════════════════════════════════════ */
function RegistroStep2({ form, onSubmit, onBack }: {
  form: FormData; onSubmit: () => void; onBack: () => void;
}) {
  const [attached, setAttached] = useState(false);

  return (
    <div className="px-4 py-4 space-y-4">
      {/* indicador passo */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold" style={{ ...T.chip, border: "1.5px solid var(--c-accent)" }}>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--c-accent)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
        </div>
        <div className="flex-1 h-px" style={{ backgroundColor: "var(--c-accent)" }} />
        <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold" style={T.accent}>
          <span style={{ color: "var(--c-accent-fg)" }}>2</span>
        </div>
        <span className="text-xs ml-1" style={T.textFaint}>Passo 2/2</span>
      </div>

      <Card className="p-4 space-y-4">
        {/* anexar arquivo */}
        <div>
          <label className="text-[10px] font-semibold uppercase tracking-widest block mb-2" style={T.textFaint}>Anexar Arquivo *</label>
          {!attached ? (
            <button onClick={() => setAttached(true)}
              className="w-full flex flex-col items-center gap-2 py-8 rounded-2xl border-2 border-dashed hover:opacity-70 transition-opacity"
              style={{ borderColor: "var(--c-accent)", ...T.chip }}>
              {Ico.upload()}
              <span className="text-sm font-semibold" style={T.accentText}>Toque para anexar arquivo</span>
              <span className="text-xs" style={T.textFaint}>PDF, JPG ou PNG · máx. 10 MB</span>
            </button>
          ) : (
            <div className="flex items-center gap-3 px-4 py-3 rounded-2xl" style={{ ...T.chip, border: "1.5px solid var(--c-accent)" }}>
              {Ico.file()}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium" style={T.text}>comprovante_atividade.pdf</p>
                <p className="text-xs" style={T.textFaint}>245 KB · Pronto para envio</p>
              </div>
              <button onClick={() => setAttached(false)} className="w-6 h-6 rounded-full flex items-center justify-center" style={T.subdue}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={T.textFaint}>
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* lista de atividades — resumo */}
        <div className="rounded-xl p-3 space-y-1.5" style={T.subdue}>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={T.textFaint}>Resumo do Cadastro</p>
          {[
            ["Tipo",       form.tipo === "extensao" ? "Extensão" : "Complementares"],
            ["Atividade",  form.titulo],
            ["Categoria",  form.categoria],
            ["Instituição",form.instituicao],
            ["Data",       form.data],
            ["Horas",      `${form.horas}h`],
          ].map(([label, val]) => (
            <div key={label} className="flex justify-between gap-2">
              <span className="text-xs" style={T.textFaint}>{label}</span>
              <span className="text-xs font-medium text-right" style={T.text}>{val}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <button onClick={onBack} className="flex-1 py-3 rounded-2xl font-semibold text-sm"
            style={{ ...T.subdue, ...T.textMuted, border: "1px solid var(--c-border-mild)" }}>
            ← Voltar
          </button>
          <button onClick={() => { if (attached) onSubmit(); }}
            className="flex-[2] py-3 rounded-2xl font-semibold text-sm transition-opacity"
            style={attached ? T.accent : { ...T.subdue, ...T.textFaint, cursor: "not-allowed" as const }}>
            <span style={attached ? { color: "var(--c-accent-fg)" } : {}}>Concluir</span>
          </button>
        </div>
      </Card>
    </div>
  );
}

/* ══════════════════════════════════════════
   SCREEN: REGISTRO SUCESSO
══════════════════════════════════════════ */
function RegistroSucesso({ form, onVoltar }: { form: FormData; onVoltar: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 text-center gap-5">
      <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ ...T.chip, border: "3px solid var(--c-accent)" }}>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--c-accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <div>
        <p className="text-xl font-bold mb-2" style={T.text}>Cadastro enviado!</p>
        <p className="text-sm leading-relaxed" style={T.textMuted}>
          <strong style={T.text}>"{form.titulo}"</strong> ({form.horas}h) foi enviado para análise e aparecerá como <em>Pendente</em> até aprovação.
        </p>
      </div>
      <div className="w-full rounded-2xl p-4 space-y-2 text-left" style={{ ...T.chip, border: "1px solid var(--c-accent)33" }}>
        {["A coordenação analisará o comprovante em até 10 dias úteis.", "Você receberá uma notificação com o resultado.", "Em caso de reprovação, você poderá reenviar o comprovante."].map((t, i) => (
          <div key={i} className="flex items-start gap-2">
            <span className="text-[10px] font-bold mt-0.5" style={T.accentText}>{i+1}.</span>
            <p className="text-xs leading-snug" style={T.accentText}>{t}</p>
          </div>
        ))}
      </div>
      <button onClick={onVoltar} className="w-full py-3.5 rounded-2xl font-semibold text-sm" style={T.accent}>
        <span style={{ color: "var(--c-accent-fg)" }}>Ver minhas atividades</span>
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════
   SCREEN: PORTAL
══════════════════════════════════════════ */
function PortalScreen() {
  return (
    <div className="px-4 py-4 space-y-4">
      <div className="rounded-2xl p-4 header-bar" style={{ background: "var(--c-accent)" }}>
        <p className="text-[10px] font-semibold uppercase tracking-widest opacity-70 mb-1" style={{ color: "var(--c-accent-fg)" }}>Portal do Aluno</p>
        <p className="font-semibold text-base leading-snug" style={{ color: "var(--c-accent-fg)" }}>Bem-vindo, Aluno X</p>
        <p className="text-xs mt-0.5 opacity-70" style={{ color: "var(--c-accent-fg)" }}>RA 11202300000 · Ciência da Computação</p>
        <div className="mt-3 flex gap-2">
          {[["3,2","CR Geral"],["26","Créditos"],["4°","Quadrimestre"]].map(([val,lab]) => (
            <div key={lab} className="flex-1 rounded-xl px-3 py-2 text-center bg-white/10">
              <p className="text-lg font-bold" style={{ color: "var(--c-accent-fg)" }}>{val}</p>
              <p className="text-[10px] opacity-70" style={{ color: "var(--c-accent-fg)" }}>{lab}</p>
            </div>
          ))}
        </div>
      </div>
      <Card className="overflow-hidden">
        <div className="px-4 pt-3.5 pb-2 flex items-center justify-between">
          <SectionLabel>Avisos Recentes</SectionLabel>
          <span className="text-[10px] font-medium" style={T.accentText}>Ver todos</span>
        </div>
        {[
          { titulo: "Prazo de trancamento de disciplina", data: "28/08/2025", urgente: true },
          { titulo: "Resultado do auxílio moradia — 2º ciclo", data: "25/08/2025", urgente: false },
          { titulo: "Manutenção no sistema SIGAA — dom. 01/09", data: "22/08/2025", urgente: false },
        ].map((a, i) => (
          <div key={i} className="flex items-start gap-3 px-4 py-3" style={{ borderTop: "1px solid var(--c-border-mild)" }}>
            <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: a.urgente ? "var(--c-red)" : "var(--c-border-mild)" }} />
            <div className="flex-1">
              <p className="text-sm leading-snug" style={T.text}>{a.titulo}</p>
              <p className="text-xs mt-0.5" style={T.textFaint}>{a.data}</p>
            </div>
          </div>
        ))}
      </Card>
      <Card className="p-4">
        <SectionLabel>Acesso Rápido</SectionLabel>
        <div className="grid grid-cols-3 gap-3 mt-3">
          {[["📄","Atestado"],["📊","Histórico"],["📅","Calendário"],["📚","Biblioteca"],["💳","Bolsas"],["📣","Ouvidoria"]].map(([icon,label]) => (
            <button key={label} className="flex flex-col items-center gap-1.5 rounded-2xl py-3 px-2 hover:opacity-70 transition-opacity" style={T.subdue}>
              <span className="text-2xl">{icon}</span>
              <span className="text-[10px] font-medium text-center leading-tight" style={T.textMuted}>{label}</span>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}

/* ══════════════════════════════════════════
   SCREEN: ENSINO
══════════════════════════════════════════ */
function EnsinoScreen() {
  return (
    <div className="px-4 py-4 space-y-4">
      <div className="rounded-2xl p-4 header-bar" style={{ background: "var(--c-accent)" }}>
        <p className="text-[10px] font-semibold uppercase tracking-widest mb-1 opacity-70" style={{ color: "var(--c-accent-fg)" }}>Quadrimestre Atual</p>
        <p className="font-semibold text-base" style={{ color: "var(--c-accent-fg)" }}>2025.2 · Ago – Dez</p>
        <p className="text-xs mt-0.5 opacity-70" style={{ color: "var(--c-accent-fg)" }}>4 disciplinas · 26 créditos</p>
      </div>
      <Card className="overflow-hidden">
        <div className="px-4 pt-3.5 pb-2"><SectionLabel>Minhas Disciplinas</SectionLabel></div>
        {disciplines.map(d => (
          <div key={d.id} className="flex items-center gap-3 px-4 py-3" style={{ borderTop: "1px solid var(--c-border-mild)" }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={T.chip}>
              <span className="text-[11px] font-bold" style={T.accentText}>{d.code.slice(-3)}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium leading-snug truncate" style={T.text}>{d.name}</p>
              <p className="text-xs mt-0.5" style={T.textFaint}>{d.horario} · {d.sala}</p>
            </div>
            <span className="text-[10px] font-semibold rounded-lg px-2 py-0.5" style={T.chip}>{d.creditos}cr</span>
          </div>
        ))}
      </Card>
      <Card className="p-4">
        <SectionLabel>Grade da Semana</SectionLabel>
        <div className="mt-3 space-y-2">
          {[
            { dia: "Seg", itens: ["08h – Processamento da Informação","14h – Cálculo Diferencial I"] },
            { dia: "Ter", itens: ["10h – Bases Computacionais","16h – Funções de Uma Variável"] },
            { dia: "Qua", itens: ["08h – Processamento da Informação","14h – Cálculo Diferencial I"] },
            { dia: "Qui", itens: ["10h – Bases Computacionais","16h – Funções de Uma Variável"] },
            { dia: "Sex", itens: ["14h – Cálculo Diferencial I"] },
          ].map(({ dia, itens }) => (
            <div key={dia} className="flex gap-3">
              <span className="text-[11px] font-bold w-6 pt-1 flex-shrink-0" style={T.textFaint}>{dia}</span>
              <div className="flex-1 space-y-1">
                {itens.map(it => <div key={it} className="text-[11px] font-medium rounded-lg px-2.5 py-1.5" style={T.chip}>{it}</div>)}
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card className="p-4">
        <SectionLabel>Histórico de Quadrimestres</SectionLabel>
        {[["2025.1","26","3,1"],["2024.3","24","3,4"],["2024.2","22","2,9"]].map(([quad,creds,cr]) => (
          <div key={quad} className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid var(--c-border-mild)" }}>
            <div>
              <p className="text-sm font-medium" style={T.text}>{quad}</p>
              <p className="text-xs" style={T.textFaint}>{creds} créditos cursados</p>
            </div>
            <span className="font-bold text-sm" style={T.accentText}>CR {cr}<span className="text-xs font-normal opacity-60">/4,0</span></span>
          </div>
        ))}
      </Card>
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN APP
══════════════════════════════════════════ */
export default function App() {
  // theme state
  const [dark,      setDark]      = useState(false);
  const [fontSize,  setFontSize]  = useState<FontSize>("normal");
  const [colorMode, setColorMode] = useState<ColorMode>("normal");

  // nav state
  const [screen,    setScreen]    = useState<Screen>("home");
  const [navTab,    setNavTab]    = useState("inicio");
  const [prevScreen,setPrevScreen]= useState<Screen>("home");

  // ui state
  const [menuOpen,     setMenuOpen]      = useState(false);
  const [settingsOpen, setSettingsOpen]  = useState(false);
  const [toast,        setToast]         = useState<string | null>(null);
  const [downloadingId,setDownloadingId] = useState<number | null>(null);

  // data state
  const [selected,   setSelected]   = useState(disciplines[1]);
  const [atividades, setAtividades] = useState<ExtAtividade[]>(initialAtividades);
  const [form,       setForm]       = useState<FormData>({
    tipo: "extensao", titulo: "", categoria: "", instituicao: "", data: "", horas: "", comprovante: "",
  });
  const [editTarget, setEditTarget] = useState<ExtAtividade | null>(null);

  const themeCtx: ThemeCtx = { dark, setDark, fontSize, setFontSize, colorMode, setColorMode };

  function navigate(s: Screen) {
    setPrevScreen(screen);
    setScreen(s);
    const tabMap: Partial<Record<Screen, string>> = {
      home: "inicio", portal: "portal", ensino: "ensino",
      "atividades-hub": "atividades", consulta: "atividades",
      alteracao: "atividades", "alteracao-form": "atividades",
      "registro-1": "atividades", "registro-2": "atividades", "registro-sucesso": "atividades",
    };
    if (tabMap[s]) setNavTab(tabMap[s]!);
  }

  function handleNav(id: string) {
    setNavTab(id);
    const map: Record<string, Screen> = {
      inicio: "home", portal: "portal", ensino: "ensino", atividades: "atividades-hub",
    };
    setScreen(map[id] || "home");
  }

  function handleDownload(arq: typeof arquivos[0]) {
    setDownloadingId(arq.id);
    setToast(arq.name);
    if (arq.isPdf) {
      const a = document.createElement("a");
      a.href = ementaPdf; a.download = "ementa_disciplina.pdf";
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
    }
    setTimeout(() => setDownloadingId(null), 900);
    setTimeout(() => setToast(null), 3800);
  }

  function handleRegistroSubmit() {
    const nova: ExtAtividade = {
      id: Date.now(), tipo: form.tipo, titulo: form.titulo,
      categoria: form.categoria, instituicao: form.instituicao,
      dataInicio: form.data, dataFim: form.data,
      horas: Number(form.horas), status: "pendente",
      comprovante: "comprovante_atividade.pdf",
    };
    if (editTarget) {
      setAtividades(prev => prev.map(a => a.id === editTarget.id ? { ...nova, id: editTarget.id } : a));
      setEditTarget(null);
    } else {
      setAtividades(prev => [nova, ...prev]);
    }
    navigate("registro-sucesso");
  }

  function startEdit(a: ExtAtividade) {
    setEditTarget(a);
    setForm({ tipo: a.tipo, titulo: a.titulo, categoria: a.categoria, instituicao: a.instituicao, data: a.dataInicio, horas: String(a.horas), comprovante: "" });
    navigate("registro-1");
  }

  function resetForm() {
    setForm({ tipo: "extensao", titulo: "", categoria: "", instituicao: "", data: "", horas: "", comprovante: "" });
    setEditTarget(null);
  }

  // header back target
  const backTarget: Partial<Record<Screen, Screen>> = {
    disciplina: "home", consulta: "atividades-hub", alteracao: "atividades-hub",
    "alteracao-form": "alteracao", "registro-1": "atividades-hub",
    "registro-2": "registro-1", "registro-sucesso": "atividades-hub",
  };
  const headerTitle: Partial<Record<Screen, string>> = {
    home: "INÍCIO", portal: "PORTAL", ensino: "ENSINO",
    "atividades-hub": "ATIVIDADES",
    consulta: "CONSULTA DE HORAS", alteracao: "ALTERAÇÃO DE REGISTRO",
    "alteracao-form": "EDITAR ATIVIDADE",
    "registro-1": "REGISTRO DE HORAS", "registro-2": "REGISTRO DE HORAS",
    "registro-sucesso": "CADASTRO ENVIADO",
  };
  const isSecondary = screen !== "home" && screen !== "portal" && screen !== "ensino" && screen !== "atividades-hub";

  const NAV_TABS = [
    { id: "inicio",     label: "Início" },
    { id: "portal",     label: "Portal" },
    { id: "ensino",     label: "Ensino" },
    { id: "atividades", label: "Atividades" },
  ];

  return (
    <Theme.Provider value={themeCtx}>
      <div className="min-h-full flex items-center justify-center p-4" style={{ backgroundColor: dark ? "#0a0c11" : "#c8cdd4" }}>
        <div className="phone-root relative w-[390px] h-[844px] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border-4 border-gray-800"
          data-theme={dark ? "dark" : undefined}
          data-color={colorMode !== "normal" ? colorMode : undefined}
          data-fontsize={fontSize !== "normal" ? fontSize : undefined}
          style={T.bg}>

          {/* status bar */}
          <div className="header-bar flex items-center justify-between px-6 pt-3 pb-1 flex-shrink-0" style={{ background: "var(--c-accent)" }}>
            <span className="text-white text-[11px] font-semibold">9:41</span>
            <div className="flex items-center gap-1.5">
              <svg width="15" height="11" viewBox="0 0 15 11" fill="white">
                <rect x="0" y="4" width="3" height="7" rx="1" opacity=".4" /><rect x="4" y="2.5" width="3" height="8.5" rx="1" opacity=".6" />
                <rect x="8" y="1" width="3" height="10" rx="1" opacity=".8" /><rect x="12" y="0" width="3" height="11" rx="1" />
              </svg>
              <svg width="15" height="11" viewBox="0 0 15 11" fill="white">
                <path d="M7.5 2.5C9.8 2.5 11.8 3.5 13.2 5.1L14.5 3.7C12.7 1.7 10.2.5 7.5.5S2.3 1.7.5 3.7l1.3 1.4C3.2 3.5 5.2 2.5 7.5 2.5z" opacity=".6" />
                <path d="M7.5 5.5c1.4 0 2.7.6 3.6 1.5L12.4 5.6C11.1 4.3 9.4 3.5 7.5 3.5S3.9 4.3 2.6 5.6l1.3 1.4C4.8 6.1 6.1 5.5 7.5 5.5z" />
                <circle cx="7.5" cy="9.5" r="1.5" />
              </svg>
              <svg width="24" height="12" viewBox="0 0 24 12" fill="none">
                <rect x=".5" y=".5" width="20" height="11" rx="3.5" stroke="white" strokeOpacity=".35" />
                <rect x="1.5" y="1.5" width="17" height="9" rx="2.5" fill="white" />
                <path d="M22 4v4a2 2 0 000-4z" fill="white" fillOpacity=".4" />
              </svg>
            </div>
          </div>

          {/* header */}
          <header className="header-bar px-4 pb-3 flex items-center gap-3 flex-shrink-0" style={{ background: "var(--c-accent)" }}>
            {isSecondary ? (
              <>
                <button onClick={() => navigate(backTarget[screen] || "home")} className="flex items-center gap-1 mr-1">{Ico.chevLeft()}</button>
                <p className="flex-1 text-white font-bold text-sm tracking-wide truncate">{headerTitle[screen]}</p>
                <button onClick={() => setSettingsOpen(true)}>{Ico.settings()}</button>
              </>
            ) : screen === "disciplina" ? (
              <>
                <button onClick={() => navigate("home")} className="flex items-center gap-1 mr-1">{Ico.chevLeft()}</button>
                <div className="flex-1">
                  <p className="text-white font-semibold text-sm truncate">{selected.name}</p>
                  <p className="text-white/70 text-[11px]">{selected.code}</p>
                </div>
                <button onClick={() => setSettingsOpen(true)}>{Ico.settings()}</button>
              </>
            ) : (
              <>
                <button onClick={() => setMenuOpen(true)} className="w-8 h-8 flex flex-col justify-center gap-[5px] mr-1">
                  {[0,1,2].map(i => <span key={i} className="block h-[2px] w-5 bg-white rounded-full" />)}
                </button>
                <p className="flex-1 text-white font-bold text-sm tracking-wide">{headerTitle[screen]}</p>
                <div className="flex items-center gap-2.5">
                  <button className="relative">{Ico.bell()}
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full text-[8px] text-white flex items-center justify-center font-bold">2</span>
                  </button>
                  <button onClick={() => setSettingsOpen(true)}>{Ico.settings()}</button>
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">AX</span>
                  </div>
                </div>
              </>
            )}
          </header>

          {/* content */}
          <div className="flex-1 overflow-y-auto overscroll-contain flex flex-col" style={T.bg}>
            {screen === "home" && (
              <HomeScreen atividades={atividades}
                onSelectDiscipline={d => { setSelected(d); navigate("disciplina"); }}
                onGoAtividades={() => navigate("atividades-hub")} />
            )}
            {screen === "disciplina" && (
              <DisciplinaScreen disciplina={selected} downloadingId={downloadingId} onDownload={handleDownload} />
            )}
            {screen === "portal"        && <PortalScreen />}
            {screen === "ensino"        && <EnsinoScreen />}
            {screen === "atividades-hub" && (
              <AtividadesHub
                onRegistro={() => { resetForm(); navigate("registro-1"); }}
                onConsulta={() => navigate("consulta")}
                onAlteracao={() => navigate("alteracao")} />
            )}
            {screen === "consulta"  && <ConsultaScreen atividades={atividades} />}
            {screen === "alteracao" && <AlteracaoScreen atividades={atividades} onEdit={startEdit} />}
            {screen === "registro-1" && (
              <RegistroStep1 form={form} setForm={setForm}
                onNext={() => navigate("registro-2")}
                onCancel={() => navigate("atividades-hub")} />
            )}
            {screen === "registro-2" && (
              <RegistroStep2 form={form} onSubmit={handleRegistroSubmit} onBack={() => navigate("registro-1")} />
            )}
            {screen === "registro-sucesso" && (
              <RegistroSucesso form={form} onVoltar={() => navigate("atividades-hub")} />
            )}
          </div>

          {/* bottom nav */}
          <nav className="flex items-center justify-around pt-2 pb-5 flex-shrink-0"
            style={{ ...T.nav, borderTop: "1px solid var(--c-border-mild)" }}>
            {NAV_TABS.map(({ id, label }) => (
              <button key={id} onClick={() => handleNav(id)} className="flex flex-col items-center gap-1 px-4 py-1">
                <NavIcon id={id} active={navTab === id} />
                <span className="text-[10px] font-medium" style={navTab === id ? T.accentText : T.textFaint}>{label}</span>
              </button>
            ))}
          </nav>
          <div className="flex justify-center pb-2 flex-shrink-0" style={T.nav}>
            <div className="w-32 h-1 rounded-full opacity-20" style={T.text} />
          </div>

          {/* overlays */}
          <MenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)}
            onNavigate={s => { navigate(s); setMenuOpen(false); }} />
          <SettingsSheet open={settingsOpen} onClose={() => setSettingsOpen(false)} />
          {toast && <Toast name={toast} onClose={() => setToast(null)} />}
        </div>
      </div>
    </Theme.Provider>
  );
}
