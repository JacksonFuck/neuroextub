import { PatientData, CalculationResult, NeurologicalData, RespiratoryData, HemodynamicData, AirwayData, CuffLeakData } from './scoring';
import { RECOMMENDATION_DETAILS, RISK_LEVEL_COLORS, RISK_LEVEL_LABELS, DISCLAIMER, DIAGNOSES } from '../constants/medical';

export const buildReportHTML = (
    pat: PatientData,
    sc: CalculationResult,
    neu: NeurologicalData,
    res: RespiratoryData,
    hm: HemodynamicData,
    aw: AirwayData,
    cu: CuffLeakData
): string => {
    const r = RECOMMENDATION_DETAILS[sc.rec as keyof typeof RECOMMENDATION_DETAILS] || RECOMMENDATION_DETAILS["?"];
    const dxLabel = DIAGNOSES.find(d => d.value === pat.dx)?.label || pat.dx || "—";

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
<div><b>Paciente:</b> ${pat.name || "—"}</div><div><b>Leito:</b> ${pat.bed || "—"}</div><div><b>Data:</b> ${pat.date || "—"}</div>
<div><b>Idade:</b> ${pat.age || "—"} anos</div><div><b>Peso:</b> ${pat.weight || "—"} kg</div><div><b>Dx:</b> ${dxLabel}</div>
<div><b>VM:</b> ${pat.mvD || "—"} dias</div><div><b>TOT:</b> ${pat.ett || "—"} mm</div><div><b>Avaliador:</b> ${pat.eval || "—"}</div>
</div>
<div class="ct bx" style="border:3px solid ${r[2]};background:#f8fafc;padding:16px">
<div style="font-size:28px">${r[0]}</div>
<div style="font-size:18px;font-weight:800;color:${r[2]}">${r[1]}</div>
<div style="margin-top:6px">Risco: <b style="color:${RISK_LEVEL_COLORS[sc.rl]}">${RISK_LEVEL_LABELS[sc.rl]}</b> (${sc.rf} fator${sc.rf !== 1 ? "es" : ""})</div>
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
<div class="bx" style="border:2px solid ${RISK_LEVEL_COLORS[sc.rl]};font-size:11px">
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
