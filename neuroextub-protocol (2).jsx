import { useState, useCallback, useMemo, useRef } from "react";

const PHASES = ["Identificação","Pré-Requisitos","Neurológica","Respiratória","Via Aérea","Hemodinâmica","Cuff Leak","Resultado","Pós-Extubação","Evidências"];

const DISCLAIMER = `Este aplicativo é uma ferramenta de apoio à decisão clínica desenvolvida com base nas melhores evidências científicas disponíveis até 2026. O NEUROEXTUB não substitui, em nenhuma hipótese, o julgamento clínico do médico intensivista, do fisioterapeuta respiratório ou do enfermeiro responsável pelo cuidado direto ao paciente.

A decisão de extubar um paciente neurocrítico é um ato médico complexo que envolve avaliação multidimensional, experiência profissional e conhecimento individualizado do caso clínico. Os scores e recomendações gerados são auxiliares e devem ser interpretados dentro do contexto clínico global de cada paciente.

A responsabilidade pela decisão de extubação, bem como por todas as suas consequências, é exclusivamente da equipe assistencial — médico(a), fisioterapeuta e enfermeiro(a) — que acompanha o paciente à beira do leito. Nenhum algoritmo, por mais robusto que seja, substitui a capacidade humana de integrar informações clínicas, avaliar nuances individuais e exercer julgamento profissional.

Ao utilizar esta ferramenta, o profissional reconhece que:
• A ferramenta é um instrumento de suporte, não de decisão autônoma
• Os dados inseridos devem ser verificados quanto à sua acurácia
• A evidência científica é dinâmica e sujeita a atualizações
• A aplicação deve considerar o contexto local e particularidades do paciente
• A responsabilidade técnica e ética permanece com a equipe assistencial humana`;

const EVIDENCE = [
  { tag: "ESICM", title: "Mechanical ventilation in patients with acute brain injury: ESICM consensus", ref: "Robba C et al. Intensive Care Med. 2020;46(12):2397-2410", use: "Base para critérios de prontidão e manejo de PIC durante TRE." },
  { tag: "VISAGE", title: "Extubation success prediction in severe brain injury", ref: "Asehnoune K et al. Crit Care Med. 2017;45(2):e150-e157", use: "Score VISAGE: AUC 0,75. Ponto de corte ≥3 prediz 90% sucesso." },
  { tag: "ENIO", title: "Extubation strategies in Neuro-ICU patients and Outcomes", ref: "Cinotti R et al. Lancet Neurol. 2023;22(1):45-57", use: "1.512 pacientes, 73 UTIs, 18 países. Falha 19,4%. ENIO Score AUC 0,79." },
  { tag: "Toronto", title: "Airway management strategies for brain-injured patients", ref: "McCredie VA et al. Ann Am Thorac Soc. 2017;14(1):85-93", use: "GCS NÃO associado a sucesso na multivariada. Tosse = melhor preditor (OR 3,60)." },
  { tag: "SETPOINT2", title: "Stroke-related Early Tracheostomy vs Prolonged Intubation", ref: "Bösel J et al. JAMA. 2022;327(19):1924-1932", use: "TQT precoce NÃO melhorou mRS em 6m. Janela ideal: 7-14 dias." },
  { tag: "Namen", title: "Predictors of successful extubation in neurosurgical patients", ref: "Namen AM et al. Am J Respir Crit Care Med. 2001;163(3):658-664", use: "80% com GCS <8 podem ter sucesso. Questiona dogma GCS ≥8." },
  { tag: "Coplin", title: "Implications of extubation delay in brain-injured patients", ref: "Coplin WM et al. Am J Respir Crit Care Med. 2000;161(5):1530-1536", use: "Atraso aumentou pneumonia e tempo de UTI." },
  { tag: "Toronto 2024", title: "Timing of extubation in acute brain injury", ref: "Taran S et al. Am J Respir Crit Care Med. 2024;210(12):1510-1519", use: "GCS-EM NÃO associado a falha (OR 1,07). Extubação precoce reduz mortalidade." },
  { tag: "FOUR Score", title: "Validation of a new coma scale: the FOUR Score", ref: "Wijdicks EFM et al. Ann Neurol. 2005;58(4):585-593", use: "Superior ao GCS em intubados. Corte ≥12: Sens 92,3%, Esp 85%." },
  { tag: "Corticoide", title: "Methylprednisolone for prevention of postextubation laryngeal oedema", ref: "Francois B et al. Lancet. 2007;369(9567):1083-1089", use: "40mg 4/4h: estridor 38%→12%. NNT=25." },
  { tag: "Protocolo", title: "Protocol-directed vs conventional weaning in neurocritical patients", ref: "Belenguer-Muncharaz A et al. Crit Care Sci. 2023;35(4):389-397", use: "100% vs 79% extubados (p=0,01). VM 5 vs 9 dias." },
  { tag: "VENTILA", title: "Ventilatory settings and ARDS in MV patients", ref: "Tejerina E et al. Intensive Care Med. 2022;48:174-183", use: "Lesão cerebral: OR 1,41 para reintubação. Justifica protocolos específicos." },
  { tag: "AMIB 2013", title: "Recomendações Brasileiras de Ventilação Mecânica", ref: "Barbas CSV et al. Rev Bras Ter Intensiva. 2014;26(3):215-239", use: "VNI preventiva em DPOC hipercápnicos. Base para contexto SUS." },
  { tag: "AMIB 2024", title: "Orientações Práticas de Ventilação Mecânica", ref: "AMIB/SBPT. 2024. 75 especialistas, 38 temas.", use: "Protocolo dirigido preferido. Wake-up test em neurocríticos." },
  { tag: "Drive Resp", title: "Respiratory drive in critically ill patients", ref: "Vaporidi K et al. Am J Respir Crit Care Med. 2020;201(1):20-32", use: "PEF <60 L/min prediz falha com Sens 88%." },
];

function F({ label, children, hint }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#94a3b8", marginBottom: 4 }}>{label}</label>
      {children}
      {hint && <div style={{ fontSize: 11, color: "#64748b", marginTop: 3 }}>{hint}</div>}
    </div>
  );
}

function Chk({ checked, onChange, label, detail }) {
  return (
    <label style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 12px", borderRadius: 8, background: checked ? "rgba(16,185,129,.08)" : "rgba(100,116,139,.06)", border: "1px solid " + (checked ? "rgba(16,185,129,.3)" : "rgba(100,116,139,.12)"), cursor: "pointer", marginBottom: 8 }}>
      <input type="checkbox" checked={checked} onChange={onChange} style={{ marginTop: 2, accentColor: "#10b981" }} />
      <div>
        <div style={{ fontSize: 14, fontWeight: 500, color: "#e2e8f0" }}>{label}</div>
        {detail && <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>{detail}</div>}
      </div>
    </label>
  );
}

function Sel({ value, onChange, options }) {
  return (
    <select value={value} onChange={onChange} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(100,116,139,.25)", background: "#0f172a", color: "#e2e8f0", fontSize: 14 }}>
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}

function Inp({ type, value, onChange, placeholder, ...r }) {
  return <input type={type || "text"} value={value} onChange={onChange} placeholder={placeholder} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid rgba(100,116,139,.25)", background: "#0f172a", color: "#e2e8f0", fontSize: 14, boxSizing: "border-box" }} {...r} />;
}

function RG({ value, onChange, name, options }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {options.map((o) => (
        <label key={o.value} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, background: value === o.value ? "rgba(59,130,246,.15)" : "rgba(100,116,139,.06)", border: "1px solid " + (value === o.value ? "rgba(59,130,246,.4)" : "rgba(100,116,139,.12)"), cursor: "pointer", fontSize: 13, color: value === o.value ? "#93c5fd" : "#94a3b8" }}>
          <input type="radio" name={name} value={o.value} checked={value === o.value} onChange={() => onChange(o.value)} style={{ accentColor: "#3b82f6" }} />
          {o.label}
        </label>
      ))}
    </div>
  );
}

function SB({ label, value, max, color }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
        <span>{label}</span><span style={{ color }}>{value}/{max}</span>
      </div>
      <div style={{ height: 8, borderRadius: 4, background: "#1e293b" }}>
        <div style={{ height: "100%", borderRadius: 4, width: (max > 0 ? (value / max) * 100 : 0) + "%", background: color, transition: "width .4s" }} />
      </div>
    </div>
  );
}

const Box = ({ bg, border, children, style }) => (
  <div style={{ padding: 16, borderRadius: 10, background: bg, border: "1px solid " + border, marginBottom: 16, ...style }}>{children}</div>
);

export default function App() {
  const [ph, setPh] = useState(0);
  const [pat, setPat] = useState({ name: "", age: "", weight: "", dx: "avci", mvD: "", ett: "", bed: "", date: new Date().toISOString().split("T")[0], eval: "" });
  const [pre, setPre] = useState({ a: false, b: false, c: false, d: false, e: false, f: false, g: false, h: false });
  const [neu, setNeu] = useState({ fE: "4", fM: "4", fB: "4", fR: "4", gE: "4", gV: "5", gM: "6", vp: "yes", sw: "yes", rass: "0", pup: "bilateral", icp: false, icpV: "", ppcV: "" });
  const [res, setRes] = useState({ pf: "", fio2: "", peep: "", rsbi: "", pim: "", vc: "", rr: "", vt: "", sbt: "not_done", sbtD: "30", sec: "0" });
  const [aw, setAw] = useState({ sw: "present", tong: "yes", cS: "vigorous", cA: "vigorous", gag: "present", sal: "no", pef: "" });
  const [hm, setHm] = useState({ stable: true, sbp: "", dbp: "", hr: "", vaso: "none", arr: false, temp: "", crp: "", k: "", hb: "", ph: "", co2: "" });
  const [cu, setCu] = useState({ done: false, leak: "", pct: "" });
  const [modal, setModal] = useState(null);
  const ref = useRef(null);

  const u = useCallback((fn) => (k, v) => fn((p) => ({ ...p, [k]: v })), []);
  const uP = u(setPat), uN = u(setNeu), uR = u(setRes), uA = u(setAw), uH = u(setHm), uC = u(setCu);
  const tPre = useCallback((k) => setPre((p) => ({ ...p, [k]: !p[k] })), []);

  const sc = useMemo(() => {
    const four = +neu.fE + +neu.fM + +neu.fB + +neu.fR;
    const gcs = +neu.gE + +neu.gV + +neu.gM;
    const vV = neu.vp === "yes" ? 2 : 0;
    const vS = neu.sw === "yes" ? 2 : 0;
    const vA = pat.age && +pat.age < 60 ? 2 : 0;
    const vM = +neu.gM === 6 ? 2 : 0;
    const vis = vV + vS + vA + vM;
    const stg = (aw.sw === "present" ? 2 : 0) + (aw.tong === "yes" ? 2 : 0) + (aw.cS === "vigorous" ? 2 : 0) + (aw.cA === "vigorous" ? 2 : 0) + (+neu.gM >= 5 ? 2 : 0);
    let bip = 0;
    if (neu.icp && neu.icpV && +neu.icpV < 20) bip += 2; else if (!neu.icp) bip += 1;
    if (neu.icp && neu.ppcV && +neu.ppcV > 60) bip += 2; else if (!neu.icp) bip += 1;
    if (res.sbt === "success") bip += 3; else if (res.sbt === "partial") bip += 1;
    if (+res.sec <= 2) bip += 1;
    if (hm.stable) bip += 2;
    if (four >= 12) bip += 2; else if (four >= 8) bip += 1;
    let rf = 0;
    if (+pat.age >= 65) rf++; if (+pat.mvD > 7) rf++; if (gcs < 10) rf++;
    if (aw.cS !== "vigorous") rf++; if (aw.sw !== "present") rf++;
    if (+res.pf && +res.pf < 200) rf++; if (hm.vaso !== "none") rf++;
    if (cu.done && +cu.leak < 110) rf++; if (+res.rsbi > 105) rf++;
    const pm = Object.values(pre).filter(Boolean).length;
    const sbt = res.sbt === "success";
    let rec = "?", rl = "medium";
    if (pm < 8) rec = "not_ready";
    else if (!sbt && res.sbt !== "not_done") rec = "sbt_fail";
    else if (vis >= 6 && four >= 12 && stg >= 6 && sbt) { rec = "go"; rl = rf <= 2 ? "low" : rf <= 4 ? "medium" : "high"; }
    else if (vis >= 4 && four >= 10 && sbt) { rec = "cond"; rl = "medium"; }
    else if (vis < 4 || four < 10) { rec = "defer"; rl = "high"; }
    else { rec = "cond"; rl = rf <= 3 ? "medium" : "high"; }
    return { four, gcs, vis, stg, bip, rf, pm, sbt, rec, rl, vV, vS, vA, vM };
  }, [pat, neu, res, aw, hm, cu, pre]);

  const go = (d) => { setPh((p) => Math.max(0, Math.min(p + d, PHASES.length - 1))); ref.current && (ref.current.scrollTop = 0); };
  const dxL = { avci: "AVCi", avch: "AVCh", hsa: "HSA", tce: "TCE", postop: "Pós-op", se: "SE", other: "Outro" };
  const recD = { go: ["✅", "EXTUBAÇÃO RECOMENDADA", "#10b981"], cond: ["⚠️", "EXTUBAÇÃO CONDICIONAL", "#f59e0b"], defer: ["🔴", "ADIAR EXTUBAÇÃO", "#ef4444"], not_ready: ["⏸️", "PRÉ-REQUISITOS PENDENTES", "#94a3b8"], sbt_fail: ["❌", "FALHA NO TRE", "#ef4444"], "?": ["❓", "DADOS INSUFICIENTES", "#94a3b8"] };
  const rlC = { low: "#10b981", medium: "#f59e0b", high: "#ef4444" };
  const rlL = { low: "BAIXO", medium: "MÉDIO", high: "ALTO" };

  const buildHTML = () => {
    const r = recD[sc.rec];
    return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>NEUROEXTUB - ${pat.name || "Relatório"}</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Georgia,serif;font-size:12px;color:#1e293b;padding:30px 40px;line-height:1.6}
h1{font-size:22px;color:#1e40af;margin-bottom:2px}h2{font-size:14px;color:#1e40af;border-bottom:1px solid #cbd5e1;padding-bottom:3px;margin:16px 0 8px}
table{width:100%;border-collapse:collapse;margin-bottom:12px}th{padding:5px 8px;text-align:left;border-bottom:2px solid #94a3b8;font-size:11px;background:#f1f5f9}
td{padding:5px 8px;border-bottom:1px solid #e2e8f0;font-size:11px}.g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px;font-size:11px;margin-bottom:12px}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:4px;font-size:11px}.bx{padding:12px;border-radius:6px;margin-bottom:12px}
.ct{text-align:center}.sg{text-align:center;border-top:1px solid #94a3b8;padding-top:6px;margin-top:30px}
@media print{@page{margin:20mm 15mm}body{padding:0}}
.btn{display:inline-block;padding:12px 32px;background:#1e40af;color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:700;cursor:pointer;margin:20px 8px 20px 0}
.btn:hover{background:#1d4ed8}.btn2{background:#059669}.btn2:hover{background:#047857}
@media print{.no-print{display:none!important}}</style></head><body>
<div class="no-print" style="background:#f1f5f9;padding:16px 40px;margin:-30px -40px 20px;border-bottom:2px solid #1e40af">
<button class="btn" onclick="window.print()">🖨️ Imprimir / Salvar PDF</button>
<button class="btn btn2" onclick="window.close()">✓ Fechar</button>
<span style="font-size:12px;color:#64748b;margin-left:8px">Abra o diálogo de impressão e escolha "Salvar como PDF" para gerar o arquivo.</span>
</div>
<h1>NEUROEXTUB <span style="font-size:12px;color:#64748b;font-weight:400">v2.0</span></h1>
<div style="color:#475569;font-size:12px">Protocolo de Extubação em Pacientes Neurocríticos</div>
<div style="color:#94a3b8;font-size:10px;margin-bottom:12px">SAMUTI · UNIPAR · ${new Date().toLocaleString("pt-BR")}</div>
<div class="g3" style="padding:8px;border:1px solid #cbd5e1;border-radius:4px;margin-bottom:12px">
<div><b>Paciente:</b> ${pat.name || "—"}</div><div><b>Leito:</b> ${pat.bed || "—"}</div><div><b>Data:</b> ${pat.date}</div>
<div><b>Idade:</b> ${pat.age || "—"} anos</div><div><b>Peso:</b> ${pat.weight || "—"} kg</div><div><b>Dx:</b> ${dxL[pat.dx]}</div>
<div><b>VM:</b> ${pat.mvD || "—"} dias</div><div><b>TOT:</b> ${pat.ett || "—"} mm</div><div><b>Avaliador:</b> ${pat.eval || "—"}</div>
</div>
<div class="ct bx" style="border:3px solid ${r[2]};background:#f8fafc;padding:16px">
<div style="font-size:28px">${r[0]}</div>
<div style="font-size:18px;font-weight:800;color:${r[2]}">${r[1]}</div>
<div style="margin-top:6px">Risco: <b style="color:${rlC[sc.rl]}">${rlL[sc.rl]}</b> (${sc.rf} fator${sc.rf !== 1 ? "es" : ""})</div>
</div>
<h2>SCORES CALCULADOS</h2>
<table><thead><tr><th>Score</th><th>Valor</th><th>Corte</th><th>Resultado</th><th>Evidência</th></tr></thead><tbody>
<tr><td><b>FOUR</b></td><td>${sc.four}/16</td><td>≥12</td><td>${sc.four >= 12 ? "Favorável" : sc.four >= 10 ? "Limítrofe" : "Desfavorável"}</td><td>S92,3% E85%</td></tr>
<tr><td><b>VISAGE</b></td><td>${sc.vis}/8</td><td>≥6</td><td>${sc.vis >= 6 ? "Favorável" : sc.vis >= 4 ? "Limítrofe" : "Desfavorável"}</td><td>AUC 0,75</td></tr>
<tr><td><b>STAGE</b></td><td>${sc.stg}/10</td><td>≥6</td><td>${sc.stg >= 9 ? "Imediata" : sc.stg >= 6 ? "Condicional" : "CI"}</td><td>Esp100%(≥9)</td></tr>
<tr><td><b>BIPER</b></td><td>${sc.bip}/12</td><td>&gt;9</td><td>${sc.bip > 9 ? "Extubar" : sc.bip >= 6 ? "Reavaliar" : "Inapto"}</td><td>S92% E87%</td></tr>
<tr><td><b>GCS</b></td><td>${sc.gcs}/15</td><td>—</td><td>E${neu.gE}V${neu.gV}M${neu.gM}</td><td>${sc.gcs < 8 ? "Não é CI absoluta" : ""}</td></tr>
</tbody></table>
<h2>DECOMPOSIÇÃO VISAGE</h2>
<div class="g2"><div>${sc.vV ? "✓" : "✗"} Perseguição visual (${sc.vV})</div><div>${sc.vS ? "✓" : "✗"} Deglutição (${sc.vS})</div>
<div>${sc.vA ? "✓" : "✗"} Idade &lt;60 (${sc.vA})</div><div>${sc.vM ? "✓" : "✗"} Motor M6 (${sc.vM})</div></div>
<h2>PARÂMETROS COLETADOS</h2>
<div class="g3"><div>PaO₂/FiO₂: ${res.pf || "—"}</div><div>FiO₂: ${res.fio2 || "—"}%</div><div>PEEP: ${res.peep || "—"}</div>
<div>RSBI: ${res.rsbi || (res.rr && res.vt ? (+res.rr / (+res.vt / 1000)).toFixed(1) : "—")}</div><div>PImax: ${res.pim || "—"}</div>
<div>TRE: ${res.sbt === "success" ? "Sucesso" : res.sbt === "failed" ? "Falha" : "—"}</div>
<div>RASS: ${neu.rass}</div><div>PA: ${hm.sbp || "—"}/${hm.dbp || "—"}</div><div>FC: ${hm.hr || "—"}</div>
<div>Vaso: ${hm.vaso === "none" ? "Não" : hm.vaso === "low" ? "Baixa" : "Alta"}</div>
<div>Cuff: ${cu.done ? (cu.leak || "—") + " mL" : "N/R"}</div><div>PEF: ${aw.pef || "—"} L/min</div></div>
<div class="bx" style="border:2px solid ${rlC[sc.rl]};font-size:11px">
<b>Conduta pós-extubação:</b> ${sc.rl === "low" ? "Baixo risco — Monitoramento padrão 1/1h" : sc.rl === "medium" ? "Médio risco — VNI preventiva 24-48h, monitor 30/30min nas 6h iniciais" : "Alto risco — VNI imediata pós-extubação, considerar TQT eletiva se falha em 3 TREs"}
</div>
<div style="page-break-before:always"></div>
<h2>⚖️ TERMO DE RESPONSABILIDADE E ISENÇÃO</h2>
<div style="font-size:10px;color:#475569;white-space:pre-line;margin-bottom:20px;padding:12px;border:1px solid #e2e8f0;border-radius:4px;background:#f8fafc">${DISCLAIMER}</div>
<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:30px;margin-top:40px">
<div class="sg"><div style="font-weight:600;font-size:11px">Médico(a) Responsável</div><div style="font-size:9px;color:#94a3b8">Carimbo e assinatura</div></div>
<div class="sg"><div style="font-weight:600;font-size:11px">Fisioterapeuta</div><div style="font-size:9px;color:#94a3b8">Carimbo e assinatura</div></div>
<div class="sg"><div style="font-weight:600;font-size:11px">Enfermeiro(a)</div><div style="font-size:9px;color:#94a3b8">Carimbo e assinatura</div></div>
</div>
<div style="border-top:2px solid #1e40af;padding-top:8px;margin-top:24px;font-size:9px;color:#64748b">
<b style="color:#1e293b">NEUROEXTUB v2.0</b> — Protocolo de Extubação em Pacientes Neurocríticos<br/>
Desenvolvido por <b>Dr. Jackson Erasmo Fuck</b> — CRM/PR 21.528 — SAMUTI<br/>
Baseado em evidências 2000-2026 | ESICM · ENIO · VISAGE · SETPOINT2 · AMIB/SBPT
</div></body></html>`;
  };

  const printReport = () => {
    const html = buildHTML();
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `NEUROEXTUB_${pat.name || "relatorio"}_${pat.date}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const numOpts = (arr) => arr.map((v) => ({ value: String(v), label: String(v) }));

  /* ═══ PHASES ═══ */
  const panels = [
    // 0 - Identificação
    () => (
      <div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", marginBottom: 16 }}>🏥 Identificação do Paciente</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <F label="Paciente (iniciais)"><Inp value={pat.name} onChange={(e) => uP("name", e.target.value)} placeholder="J.E.F." /></F>
          <F label="Leito"><Inp value={pat.bed} onChange={(e) => uP("bed", e.target.value)} placeholder="UTI-01" /></F>
          <F label="Idade"><Inp type="number" value={pat.age} onChange={(e) => uP("age", e.target.value)} placeholder="anos" /></F>
          <F label="Peso (kg)"><Inp type="number" value={pat.weight} onChange={(e) => uP("weight", e.target.value)} placeholder="70" /></F>
          <F label="Diagnóstico"><Sel value={pat.dx} onChange={(e) => uP("dx", e.target.value)} options={[{ value: "avci", label: "AVCi" }, { value: "avch", label: "AVCh" }, { value: "hsa", label: "HSA" }, { value: "tce", label: "TCE" }, { value: "postop", label: "Pós-op Neuro" }, { value: "se", label: "Status Epilepticus" }, { value: "other", label: "Outro" }]} /></F>
          <F label="Dias VM"><Inp type="number" value={pat.mvD} onChange={(e) => uP("mvD", e.target.value)} placeholder="0" /></F>
          <F label="TOT (mm)"><Inp value={pat.ett} onChange={(e) => uP("ett", e.target.value)} placeholder="7.5" /></F>
          <F label="Data"><Inp type="date" value={pat.date} onChange={(e) => uP("date", e.target.value)} /></F>
        </div>
        <F label="Avaliador"><Inp value={pat.eval} onChange={(e) => uP("eval", e.target.value)} placeholder="Nome" /></F>
      </div>
    ),
    // 1 - Pré-Requisitos
    () => (
      <div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", marginBottom: 16 }}>✅ Pré-Requisitos para Desmame</h3>
        <Chk checked={pre.a} onChange={() => tPre("a")} label="Controle da lesão primária" detail="Sem agravamento 48h" />
        <Chk checked={pre.b} onChange={() => tPre("b")} label="PIC ≤20 mmHg 24h" detail="Se monitorizada" />
        <Chk checked={pre.c} onChange={() => tPre("c")} label="Sedação mínima (RASS ≥ −2)" />
        <Chk checked={pre.d} onChange={() => tPre("d")} label="Hemodinâmica estável" detail="Sem aminas ou NE ≤0,1" />
        <Chk checked={pre.e} onChange={() => tPre("e")} label="Afebril (T <38,5°C)" />
        <Chk checked={pre.f} onChange={() => tPre("f")} label="Hb ≥7 g/dL" />
        <Chk checked={pre.g} onChange={() => tPre("g")} label="Sem status epilepticus" />
        <Chk checked={pre.h} onChange={() => tPre("h")} label="Albumina ≥2,5 g/dL" />
        <div style={{ marginTop: 16, padding: 12, borderRadius: 8, background: sc.pm === 8 ? "rgba(16,185,129,.1)" : "rgba(245,158,11,.1)", border: "1px solid " + (sc.pm === 8 ? "rgba(16,185,129,.3)" : "rgba(245,158,11,.3)"), fontSize: 14, fontWeight: 600, color: sc.pm === 8 ? "#10b981" : "#f59e0b" }}>
          {sc.pm}/8 atendidos{sc.pm < 8 && " — Otimizar"}
        </div>
      </div>
    ),
    // 2 - Neurológica
    () => (
      <div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", marginBottom: 16 }}>🧠 Avaliação Neurológica</h3>
        <Box bg="rgba(59,130,246,.06)" border="rgba(59,130,246,.15)">
          <div style={{ fontSize: 14, fontWeight: 700, color: "#93c5fd", marginBottom: 12 }}>FOUR Score</div>
          <F label="Ocular (E)" hint="4=segue · 3=aberta · 2=som · 1=dor · 0=fechada"><Sel value={neu.fE} onChange={(e) => uN("fE", e.target.value)} options={[4, 3, 2, 1, 0].map((v) => ({ value: String(v), label: "E" + v }))} /></F>
          <F label="Motor (M)" hint="4=comandos · 3=localiza · 2=flexão · 1=extensão · 0=nada"><Sel value={neu.fM} onChange={(e) => uN("fM", e.target.value)} options={[4, 3, 2, 1, 0].map((v) => ({ value: String(v), label: "M" + v }))} /></F>
          <F label="Tronco (B)" hint="4=pupilar+corneano · 0=tudo ausente"><Sel value={neu.fB} onChange={(e) => uN("fB", e.target.value)} options={[4, 3, 2, 1, 0].map((v) => ({ value: String(v), label: "B" + v }))} /></F>
          <F label="Respiração (R)" hint="4=regular · 1=acima vent · 0=apneia"><Sel value={neu.fR} onChange={(e) => uN("fR", e.target.value)} options={[4, 3, 2, 1, 0].map((v) => ({ value: String(v), label: "R" + v }))} /></F>
          <div style={{ fontSize: 15, fontWeight: 700, color: sc.four >= 12 ? "#10b981" : sc.four >= 10 ? "#f59e0b" : "#ef4444" }}>FOUR: {sc.four}/16 {sc.four >= 12 ? "✅" : sc.four >= 10 ? "⚠️" : "🔴"}</div>
        </Box>
        <Box bg="rgba(139,92,246,.06)" border="rgba(139,92,246,.15)">
          <div style={{ fontSize: 14, fontWeight: 700, color: "#c4b5fd", marginBottom: 12 }}>GCS</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <F label="E"><Sel value={neu.gE} onChange={(e) => uN("gE", e.target.value)} options={[4, 3, 2, 1].map((v) => ({ value: String(v), label: "E" + v }))} /></F>
            <F label="V"><Sel value={neu.gV} onChange={(e) => uN("gV", e.target.value)} options={[5, 4, 3, 2, 1].map((v) => ({ value: String(v), label: "V" + v }))} /></F>
            <F label="M"><Sel value={neu.gM} onChange={(e) => uN("gM", e.target.value)} options={[6, 5, 4, 3, 2, 1].map((v) => ({ value: String(v), label: "M" + v }))} /></F>
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#c4b5fd" }}>GCS: {sc.gcs}/15</div>
        </Box>
        <Box bg="rgba(16,185,129,.06)" border="rgba(16,185,129,.15)">
          <div style={{ fontSize: 14, fontWeight: 700, color: "#6ee7b7", marginBottom: 12 }}>VISAGE Score</div>
          <F label="Perseguição visual"><RG value={neu.vp} onChange={(v) => uN("vp", v)} name="vp" options={[{ value: "yes", label: "Sim (2)" }, { value: "no", label: "Não (0)" }]} /></F>
          <F label="Deglutição espontânea"><RG value={neu.sw} onChange={(v) => uN("sw", v)} name="nsw" options={[{ value: "yes", label: "Sim (2)" }, { value: "no", label: "Não (0)" }]} /></F>
          <div style={{ fontSize: 13, color: "#94a3b8", margin: "8px 0" }}>Idade: {pat.age ? (+pat.age < 60 ? pat.age + "a→2" : pat.age + "a→0") : "?"} · Motor: {neu.gM === "6" ? "M6→2" : "M" + neu.gM + "→0"}</div>
          <div style={{ fontSize: 15, fontWeight: 700, color: sc.vis >= 6 ? "#10b981" : sc.vis >= 4 ? "#f59e0b" : "#ef4444" }}>VISAGE: {sc.vis}/8 {sc.vis >= 8 ? "🟢" : sc.vis >= 6 ? "🟡" : sc.vis >= 4 ? "🟠" : "🔴"}</div>
        </Box>
        <F label="RASS"><Sel value={neu.rass} onChange={(e) => uN("rass", e.target.value)} options={[{ value: "4", label: "+4" }, { value: "3", label: "+3" }, { value: "2", label: "+2" }, { value: "1", label: "+1" }, { value: "0", label: "0 Alerta" }, { value: "-1", label: "-1" }, { value: "-2", label: "-2" }, { value: "-3", label: "-3" }, { value: "-4", label: "-4" }, { value: "-5", label: "-5" }]} /></F>
        <F label="Pupilas"><RG value={neu.pup} onChange={(v) => uN("pup", v)} name="pu" options={[{ value: "bilateral", label: "Bilateral" }, { value: "unilateral", label: "Unilateral" }, { value: "absent", label: "Ausente" }]} /></F>
        <Chk checked={neu.icp} onChange={() => uN("icp", !neu.icp)} label="PIC monitorizada" />
        {neu.icp && <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginLeft: 24 }}>
          <F label="PIC (mmHg)"><Inp type="number" value={neu.icpV} onChange={(e) => uN("icpV", e.target.value)} placeholder="15" /></F>
          <F label="PPC (mmHg)"><Inp type="number" value={neu.ppcV} onChange={(e) => uN("ppcV", e.target.value)} placeholder="70" /></F>
        </div>}
      </div>
    ),
    // 3 - Respiratória
    () => (
      <div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", marginBottom: 16 }}>🫁 Avaliação Respiratória & TRE</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <F label="PaO₂/FiO₂" hint="≥200"><Inp type="number" value={res.pf} onChange={(e) => uR("pf", e.target.value)} placeholder="300" /></F>
          <F label="FiO₂ %" hint="≤40"><Inp type="number" value={res.fio2} onChange={(e) => uR("fio2", e.target.value)} placeholder="40" /></F>
          <F label="PEEP" hint="≤5-8"><Inp type="number" value={res.peep} onChange={(e) => uR("peep", e.target.value)} placeholder="5" /></F>
          <F label="FR (rpm)"><Inp type="number" value={res.rr} onChange={(e) => uR("rr", e.target.value)} placeholder="18" /></F>
          <F label="VC (mL)"><Inp type="number" value={res.vt} onChange={(e) => uR("vt", e.target.value)} placeholder="450" /></F>
          <F label="RSBI" hint="<105"><Inp type="number" value={res.rsbi || (res.rr && res.vt ? Math.round(+res.rr / (+res.vt / 1000) * 10) / 10 : "")} onChange={(e) => uR("rsbi", e.target.value)} placeholder="Auto" /></F>
          <F label="PImax" hint="< −25"><Inp type="number" value={res.pim} onChange={(e) => uR("pim", e.target.value)} placeholder="-30" /></F>
          <F label="CV (mL/kg)" hint=">10"><Inp type="number" value={res.vc} onChange={(e) => uR("vc", e.target.value)} placeholder="12" /></F>
        </div>
        <F label="Aspirações/8h"><Sel value={res.sec} onChange={(e) => uR("sec", e.target.value)} options={[{ value: "0", label: "0-1" }, { value: "2", label: "2-3" }, { value: "4", label: "4+" }]} /></F>
        <Box bg="rgba(245,158,11,.06)" border="rgba(245,158,11,.15)">
          <div style={{ fontSize: 14, fontWeight: 700, color: "#fcd34d", marginBottom: 12 }}>⏱️ TRE</div>
          <F label="Resultado"><RG value={res.sbt} onChange={(v) => uR("sbt", v)} name="sbt" options={[{ value: "not_done", label: "N/R" }, { value: "success", label: "✅ Sucesso" }, { value: "partial", label: "⚠️ Parcial" }, { value: "failed", label: "❌ Falha" }]} /></F>
          <F label="Duração"><Sel value={res.sbtD} onChange={(e) => uR("sbtD", e.target.value)} options={[{ value: "30", label: "30min" }, { value: "60", label: "60min" }, { value: "120", label: "120min" }]} /></F>
        </Box>
      </div>
    ),
    // 4 - Via Aérea
    () => (
      <div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", marginBottom: 16 }}>🛡️ Proteção de Via Aérea (STAGE)</h3>
        <F label="Deglutição"><RG value={aw.sw} onChange={(v) => uA("sw", v)} name="asw" options={[{ value: "present", label: "Presente (2)" }, { value: "weak", label: "Fraca (1)" }, { value: "absent", label: "Ausente (0)" }]} /></F>
        <F label="Protrusão lingual"><RG value={aw.tong} onChange={(v) => uA("tong", v)} name="to" options={[{ value: "yes", label: "Sim (2)" }, { value: "no", label: "Não (0)" }]} /></F>
        <F label="Tosse espontânea"><RG value={aw.cS} onChange={(v) => uA("cS", v)} name="cs" options={[{ value: "vigorous", label: "Vigorosa (2)" }, { value: "weak", label: "Fraca (1)" }, { value: "absent", label: "Ausente (0)" }]} /></F>
        <F label="Tosse c/ aspiração"><RG value={aw.cA} onChange={(v) => uA("cA", v)} name="ca" options={[{ value: "vigorous", label: "Vigorosa (2)" }, { value: "weak", label: "Fraca (1)" }, { value: "absent", label: "Ausente (0)" }]} /></F>
        <F label="Reflexo de gag"><RG value={aw.gag} onChange={(v) => uA("gag", v)} name="ga" options={[{ value: "present", label: "Presente" }, { value: "weak", label: "Fraco" }, { value: "absent", label: "Ausente" }]} /></F>
        <F label="Acúmulo salivar"><RG value={aw.sal} onChange={(v) => uA("sal", v)} name="sa" options={[{ value: "no", label: "Não" }, { value: "yes", label: "Sim" }]} /></F>
        <F label="PEF (L/min)" hint="≥60"><Inp type="number" value={aw.pef} onChange={(e) => uA("pef", e.target.value)} placeholder="80" /></F>
        <div style={{ marginTop: 12, padding: 12, borderRadius: 8, background: sc.stg >= 8 ? "rgba(16,185,129,.1)" : sc.stg >= 6 ? "rgba(245,158,11,.1)" : "rgba(239,68,68,.1)", border: "1px solid " + (sc.stg >= 8 ? "rgba(16,185,129,.3)" : sc.stg >= 6 ? "rgba(245,158,11,.3)" : "rgba(239,68,68,.3)") }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: sc.stg >= 8 ? "#10b981" : sc.stg >= 6 ? "#f59e0b" : "#ef4444" }}>STAGE: {sc.stg}/10 {sc.stg >= 9 ? "— Imediata" : sc.stg >= 6 ? "— Condicional" : "— CI"}</div>
        </div>
      </div>
    ),
    // 5 - Hemodinâmica
    () => (
      <div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", marginBottom: 16 }}>💊 Hemodinâmica & Metabólica</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <F label="PAS"><Inp type="number" value={hm.sbp} onChange={(e) => uH("sbp", e.target.value)} placeholder="120" /></F>
          <F label="PAD"><Inp type="number" value={hm.dbp} onChange={(e) => uH("dbp", e.target.value)} placeholder="80" /></F>
          <F label="FC"><Inp type="number" value={hm.hr} onChange={(e) => uH("hr", e.target.value)} placeholder="80" /></F>
          <F label="T° (°C)"><Inp type="number" value={hm.temp} onChange={(e) => uH("temp", e.target.value)} placeholder="36.8" step="0.1" /></F>
          <F label="PCR" hint="<100"><Inp type="number" value={hm.crp} onChange={(e) => uH("crp", e.target.value)} placeholder="25" /></F>
          <F label="K⁺" hint="3,5-5,0"><Inp type="number" value={hm.k} onChange={(e) => uH("k", e.target.value)} placeholder="4.0" step="0.1" /></F>
          <F label="Hb" hint="≥7"><Inp type="number" value={hm.hb} onChange={(e) => uH("hb", e.target.value)} placeholder="10" step="0.1" /></F>
          <F label="pH"><Inp type="number" value={hm.ph} onChange={(e) => uH("ph", e.target.value)} placeholder="7.40" step="0.01" /></F>
          <F label="PaCO₂"><Inp type="number" value={hm.co2} onChange={(e) => uH("co2", e.target.value)} placeholder="40" /></F>
        </div>
        <F label="Vasopressores"><RG value={hm.vaso} onChange={(v) => uH("vaso", v)} name="va" options={[{ value: "none", label: "Não" }, { value: "low", label: "Baixa" }, { value: "high", label: "Alta" }]} /></F>
        <Chk checked={hm.stable} onChange={() => uH("stable", !hm.stable)} label="PA estável (90-180)" />
        <Chk checked={hm.arr} onChange={() => uH("arr", !hm.arr)} label="Arritmias presentes" />
      </div>
    ),
    // 6 - Cuff Leak
    () => (
      <div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", marginBottom: 16 }}>🎈 Cuff Leak Test</h3>
        <Chk checked={cu.done} onChange={() => uC("done", !cu.done)} label="Cuff Leak Test realizado" />
        {cu.done && <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
          <F label="Volume (mL)" hint="≥110"><Inp type="number" value={cu.leak} onChange={(e) => uC("leak", e.target.value)} placeholder="150" /></F>
          <F label="% do VC" hint="≥15%"><Inp type="number" value={cu.pct} onChange={(e) => uC("pct", e.target.value)} placeholder="20" /></F>
        </div>}
        {cu.done && +cu.leak > 0 && +cu.leak < 110 && <div style={{ marginTop: 12, padding: 12, borderRadius: 8, background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.3)", fontSize: 13, color: "#fca5a5" }}>⚠️ Leak {"<"}110mL — Metilprednisolona 40mg IV 4/4h × 3-4 doses (Francois 2007)</div>}
      </div>
    ),
    // 7 - Resultado
    () => {
      const r = recD[sc.rec];
      return (
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", marginBottom: 16 }}>📊 Resultado</h3>
          <div style={{ padding: 20, borderRadius: 12, background: "rgba(100,116,139,.06)", border: "2px solid " + r[2], textAlign: "center", marginBottom: 24 }}>
            <div style={{ fontSize: 32 }}>{r[0]}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: r[2], marginTop: 8 }}>{r[1]}</div>
            <div style={{ fontSize: 14, color: "#cbd5e1", marginTop: 8 }}>Risco: <span style={{ fontWeight: 700, color: rlC[sc.rl] }}>{rlL[sc.rl]}</span> ({sc.rf} fator{sc.rf !== 1 ? "es" : ""})</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
            <Box bg="rgba(59,130,246,.06)" border="rgba(59,130,246,.15)" style={{ marginBottom: 0 }}><SB label="FOUR" value={sc.four} max={16} color={sc.four >= 12 ? "#10b981" : sc.four >= 10 ? "#f59e0b" : "#ef4444"} /><div style={{ fontSize: 11, color: "#64748b" }}>≥12 · S92% E85%</div></Box>
            <Box bg="rgba(16,185,129,.06)" border="rgba(16,185,129,.15)" style={{ marginBottom: 0 }}><SB label="VISAGE" value={sc.vis} max={8} color={sc.vis >= 6 ? "#10b981" : sc.vis >= 4 ? "#f59e0b" : "#ef4444"} /><div style={{ fontSize: 11, color: "#64748b" }}>≥6 · AUC 0,75</div></Box>
            <Box bg="rgba(245,158,11,.06)" border="rgba(245,158,11,.15)" style={{ marginBottom: 0 }}><SB label="STAGE" value={sc.stg} max={10} color={sc.stg >= 8 ? "#10b981" : sc.stg >= 6 ? "#f59e0b" : "#ef4444"} /><div style={{ fontSize: 11, color: "#64748b" }}>≥9 imediata</div></Box>
            <Box bg="rgba(139,92,246,.06)" border="rgba(139,92,246,.15)" style={{ marginBottom: 0 }}><SB label="BIPER" value={sc.bip} max={12} color={sc.bip > 9 ? "#10b981" : sc.bip >= 6 ? "#f59e0b" : "#ef4444"} /><div style={{ fontSize: 11, color: "#64748b" }}>{">"}9 · S92% E87%</div></Box>
          </div>
          <Box bg="rgba(139,92,246,.06)" border="rgba(139,92,246,.15)">
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 600, flexWrap: "wrap" }}>
              <span style={{ color: "#c4b5fd" }}>GCS: {sc.gcs} (E{neu.gE}V{neu.gV}M{neu.gM})</span>
              <span style={{ color: sc.gcs >= 10 ? "#10b981" : "#f59e0b" }}>{sc.gcs < 8 ? "Não é CI absoluta" : ""}</span>
            </div>
          </Box>
          <Box bg="rgba(16,185,129,.04)" border="rgba(16,185,129,.12)">
            <div style={{ fontWeight: 600, color: "#6ee7b7", marginBottom: 6, fontSize: 13 }}>VISAGE Detalhado</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 4, fontSize: 13 }}>
              <span style={{ color: sc.vV ? "#10b981" : "#ef4444" }}>{sc.vV ? "✅" : "❌"} Perseguição ({sc.vV})</span>
              <span style={{ color: sc.vS ? "#10b981" : "#ef4444" }}>{sc.vS ? "✅" : "❌"} Deglutição ({sc.vS})</span>
              <span style={{ color: sc.vA ? "#10b981" : "#ef4444" }}>{sc.vA ? "✅" : "❌"} Idade {"<"}60 ({sc.vA})</span>
              <span style={{ color: sc.vM ? "#10b981" : "#ef4444" }}>{sc.vM ? "✅" : "❌"} Motor M6 ({sc.vM})</span>
            </div>
          </Box>
          <div style={{ display: "flex", gap: 12, marginTop: 20, flexWrap: "wrap" }}>
            <button onClick={printReport} style={{ flex: 1, padding: "12px 20px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#1e40af,#3b82f6)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", minWidth: 180 }}>📥 Baixar Relatório (HTML/PDF)</button>
            <button onClick={() => setModal("disc")} style={{ padding: "12px 20px", borderRadius: 10, border: "1px solid rgba(100,116,139,.3)", background: "transparent", color: "#94a3b8", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>⚖️ Disclaimer</button>
          </div>
        </div>
      );
    },
    // 8 - Pós-Extubação
    () => (
      <div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", marginBottom: 16 }}>📋 Protocolo Pós-Extubação</h3>
        <Box bg="rgba(59,130,246,.06)" border="rgba(59,130,246,.15)">
          <div style={{ fontWeight: 700, color: "#93c5fd", marginBottom: 8 }}>🔧 Pré-Extubação</div>
          <div style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.8 }}>☐ Cabeceira 30-45° · ☐ Aspirar NF+TOT · ☐ Desinflar cuff · ☐ Material de reintubação · ☐ VNI disponível{cu.done && +cu.leak < 110 ? " · ☐ Metilprednisolona 40mg" : ""}</div>
        </Box>
        <Box bg="rgba(16,185,129,.06)" border="rgba(16,185,129,.15)">
          <div style={{ fontWeight: 700, color: "#6ee7b7", marginBottom: 8 }}>📊 Monitor 6h</div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse", color: "#cbd5e1" }}>
              <thead><tr style={{ borderBottom: "1px solid rgba(100,116,139,.2)" }}>{["Período", "Parâmetros", "Alertas"].map((h) => <th key={h} style={{ padding: "6px 8px", textAlign: "left", color: "#94a3b8" }}>{h}</th>)}</tr></thead>
              <tbody>{[["0-30min", "FR,SpO₂,RASS,voz", "FR>30→VNI"], ["30-60min", "Saliva,PA", "Acúmulo→aspirar"], ["1-2h", "PA,FC,FOUR", "FC>120→HIC?"], ["2-3h", "PImax,VC", "PImax<-15→VNI"], ["3-6h", "Gaso arterial", "PaCO₂>48→↑IPAP"]].map(([t, p, a], i) => <tr key={i} style={{ borderBottom: "1px solid rgba(100,116,139,.1)" }}><td style={{ padding: "6px 8px", fontWeight: 600 }}>{t}</td><td style={{ padding: "6px 8px" }}>{p}</td><td style={{ padding: "6px 8px", color: "#fcd34d" }}>{a}</td></tr>)}</tbody>
            </table>
          </div>
        </Box>
        <Box bg="rgba(239,68,68,.06)" border="rgba(239,68,68,.15)">
          <div style={{ fontWeight: 700, color: "#fca5a5", marginBottom: 8 }}>❌ Reintubação Imediata</div>
          <div style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.8 }}>Queda GCS ≥2 · SpO₂ {"<"}88% · FR {">"}35 sustentada · Fadiga resp · Aspiração maciça · Instab. hemodinâmica · Estridor refratário</div>
        </Box>
        <div style={{ padding: 12, borderRadius: 8, background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.2)", fontSize: 13, color: "#fca5a5", marginBottom: 16 }}>🚨 HIC rebote (12-23% em 6h): PaCO₂ 35-38. Lidocaína 2% se PIC {">"}20.</div>
        <div style={{ padding: 12, borderRadius: 8, background: "rgba(139,92,246,.08)", border: "1px solid rgba(139,92,246,.2)", fontSize: 13, color: "#c4b5fd" }}>🍽️ Disfagia obrigatória: GUSS-ICU 24h. FEES se detectada. 80% têm disfagia.</div>
        <button onClick={printReport} style={{ marginTop: 16, width: "100%", padding: "12px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#1e40af,#3b82f6)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>📥 Baixar Relatório (HTML/PDF)</button>
      </div>
    ),
    // 9 - Evidências
    () => (
      <div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", marginBottom: 16 }}>📚 Evidências Científicas</h3>
        {EVIDENCE.map((e, i) => (
          <Box key={i} bg="rgba(100,116,139,.04)" border="rgba(100,116,139,.1)">
            <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 4, background: "rgba(59,130,246,.15)", color: "#93c5fd", fontWeight: 600 }}>{e.tag}</span>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0", marginTop: 8 }}>{e.title}</div>
            <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>{e.ref}</div>
            <div style={{ fontSize: 12, color: "#cbd5e1", marginTop: 8, padding: "8px 10px", background: "rgba(59,130,246,.05)", borderRadius: 6, borderLeft: "3px solid rgba(59,130,246,.3)" }}><strong>Uso:</strong> {e.use}</div>
          </Box>
        ))}
        <div style={{ marginTop: 32, padding: 24, borderRadius: 12, background: "linear-gradient(135deg,rgba(30,64,175,.15),rgba(16,185,129,.1))", border: "1px solid rgba(59,130,246,.2)", textAlign: "center" }}>
          <div style={{ fontSize: 22, fontWeight: 800 }}><span style={{ color: "#3b82f6" }}>NEURO</span><span style={{ color: "#10b981" }}>EXTUB</span></div>
          <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 8 }}>Protocolo de Extubação em Neurocríticos · v2.0</div>
          <div style={{ width: 60, height: 2, background: "linear-gradient(90deg,#3b82f6,#10b981)", margin: "16px auto", borderRadius: 1 }} />
          <div style={{ fontSize: 16, fontWeight: 700, color: "#e2e8f0", marginTop: 12 }}>Dr. Jackson Erasmo Fuck</div>
          <div style={{ fontSize: 13, color: "#94a3b8" }}>CRM/PR 21.528</div>
          <div style={{ fontSize: 12, color: "#64748b", marginTop: 8, lineHeight: 1.6 }}>Médico Intensivista · Coordenador de UTI<br />SAMUTI — Serviços de Atendimento de Urgência e Medicina Intensiva<br />Professor Coordenador — Emergências e Terapia Intensiva — UNIPAR<br />Umuarama, Paraná, Brasil</div>
        </div>
        <Box bg="rgba(245,158,11,.06)" border="rgba(245,158,11,.2)" style={{ marginTop: 24 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#fcd34d", marginBottom: 12 }}>⚖️ Termo de Responsabilidade</div>
          <div style={{ fontSize: 12, color: "#cbd5e1", lineHeight: 1.8, whiteSpace: "pre-line" }}>{DISCLAIMER}</div>
        </Box>
        <button onClick={printReport} style={{ marginTop: 16, width: "100%", padding: "12px", borderRadius: 10, border: "none", background: "linear-gradient(135deg,#1e40af,#3b82f6)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>📥 Baixar Relatório Completo</button>
      </div>
    ),
  ];

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg,#0f172a 0%,#1e293b 50%,#0f172a 100%)", color: "#e2e8f0", fontFamily: "'Segoe UI',system-ui,sans-serif" }}>
      {/* Modal */}
      {modal === "disc" && <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,.7)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }} onClick={() => setModal(null)}>
        <div style={{ maxWidth: 640, maxHeight: "80vh", overflow: "auto", background: "#1e293b", borderRadius: 16, padding: 32, border: "1px solid rgba(245,158,11,.3)" }} onClick={(e) => e.stopPropagation()}>
          <h3 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 700, color: "#fcd34d" }}>⚖️ Termo de Responsabilidade</h3>
          <div style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.8, whiteSpace: "pre-line" }}>{DISCLAIMER}</div>
          <button onClick={() => setModal(null)} style={{ marginTop: 20, width: "100%", padding: 12, borderRadius: 8, border: "none", background: "#3b82f6", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Entendi</button>
        </div>
      </div>}
      {/* Header */}
      <div style={{ background: "rgba(15,23,42,.9)", borderBottom: "1px solid rgba(59,130,246,.2)", padding: "12px 20px", position: "sticky", top: 0, zIndex: 100, backdropFilter: "blur(12px)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
            <div>
              <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}><span style={{ color: "#3b82f6" }}>NEURO</span><span style={{ color: "#10b981" }}>EXTUB</span><span style={{ color: "#64748b", fontWeight: 400, fontSize: 12, marginLeft: 8 }}>Neurocríticos</span></h1>
              <div style={{ fontSize: 10, color: "#475569" }}>Dr. Jackson E. Fuck · CRM/PR 21.528 · SAMUTI</div>
            </div>
            <div style={{ fontSize: 11, color: "#64748b" }}>v2.0</div>
          </div>
          <div style={{ display: "flex", gap: 2, marginTop: 10 }}>
            {PHASES.map((p, i) => <button key={i} onClick={() => { setPh(i); ref.current && (ref.current.scrollTop = 0); }} style={{ flex: 1, height: 4, borderRadius: 2, border: "none", cursor: "pointer", background: i < ph ? "#10b981" : i === ph ? "#3b82f6" : "rgba(100,116,139,.2)", transition: "all .3s" }} title={p} />)}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
            <span style={{ fontSize: 11, color: "#3b82f6", fontWeight: 600 }}>{ph + 1}/{PHASES.length} · {PHASES[ph]}</span>
            {ph >= 1 && ph <= 6 && <span style={{ fontSize: 11, color: "#64748b" }}>F:{sc.four} V:{sc.vis} S:{sc.stg}</span>}
          </div>
        </div>
      </div>
      {/* Content */}
      <div ref={ref} style={{ maxWidth: 900, margin: "0 auto", padding: "24px 20px 100px" }}>{panels[ph]()}</div>
      {/* Nav */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(15,23,42,.95)", borderTop: "1px solid rgba(100,116,139,.15)", padding: "12px 20px", backdropFilter: "blur(12px)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button onClick={() => go(-1)} disabled={ph === 0} style={{ padding: "10px 24px", borderRadius: 8, border: "1px solid rgba(100,116,139,.25)", background: "transparent", color: ph === 0 ? "#475569" : "#94a3b8", fontSize: 14, fontWeight: 600, cursor: ph === 0 ? "not-allowed" : "pointer" }}>← Anterior</button>
          <span style={{ fontSize: 12, color: "#475569" }}>{PHASES[ph]}</span>
          <button onClick={() => go(1)} disabled={ph === PHASES.length - 1} style={{ padding: "10px 24px", borderRadius: 8, border: "none", background: ph === PHASES.length - 1 ? "#334155" : ph === 6 ? "#10b981" : "#3b82f6", color: "#fff", fontSize: 14, fontWeight: 600, cursor: ph === PHASES.length - 1 ? "not-allowed" : "pointer" }}>{ph === 6 ? "Resultado →" : ph >= PHASES.length - 1 ? "Fim" : "Próximo →"}</button>
        </div>
      </div>
    </div>
  );
}
