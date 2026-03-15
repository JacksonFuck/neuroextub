import { useState, useCallback, useRef } from "react";
import { PHASES, DISCLAIMER } from "./constants/medical";
import { useScoresCalculations } from "./hooks/useScoresCalculations";
import { buildReportHTML } from "./utils/reportGenerator";
import { PhaseNavigation } from "./components/PhaseNavigation";
import { IdentificationPanel } from "./components/Panels/IdentificationPanel";
import { PrerequisitesPanel } from "./components/Panels/PrerequisitesPanel";
import { NeurologicalPanel } from "./components/Panels/NeurologicalPanel";
import { RespiratoryPanel } from "./components/Panels/RespiratoryPanel";
import { AirwayPanel } from "./components/Panels/AirwayPanel";
import { HemodynamicPanel } from "./components/Panels/HemodynamicPanel";
import { CuffLeakPanel } from "./components/Panels/CuffLeakPanel";
import { ResultPanel } from "./components/Panels/ResultPanel";
import { PostExtubationPanel } from "./components/Panels/PostExtubationPanel";
import { EvidencePanel } from "./components/Panels/EvidencePanel";

import "./index.css";

export default function App() {
    const [ph, setPh] = useState(0);
    const [pat, setPat] = useState({ name: "", age: "", weight: "", dx: "avci", mvD: "", ett: "", bed: "", date: new Date().toISOString().split("T")[0], eval: "" });
    const [pre, setPre] = useState({ a: false, b: false, c: false, d: false, e: false, f: false, g: false, h: false });
    const [neu, setNeu] = useState({ fE: "4", fM: "4", fB: "4", fR: "4", gE: "4", gV: "5", gM: "6", vp: "yes", sw: "yes", rass: "0", pup: "bilateral", icp: false, icpV: "", ppcV: "" });
    const [res, setRes] = useState({ pf: "", fio2: "", peep: "", rsbi: "", pim: "", vc: "", rr: "", vt: "", sbt: "not_done", sbtD: "30", sec: "0" });
    const [aw, setAw] = useState({ sw: "present", tong: "yes", cS: "vigorous", cA: "vigorous", gag: "present", sal: "no", pef: "" });
    const [hm, setHm] = useState({ stable: true, sbp: "", dbp: "", hr: "", vaso: "none", arr: false, temp: "", crp: "", k: "", hb: "", ph: "", co2: "" });
    const [cu, setCu] = useState({ done: false, leak: "", pct: "" });
    const [modal, setModal] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const sc = useScoresCalculations(pat, neu, res, aw, hm, cu, pre);

    const update = useCallback((setter: any) => (k: string, v: any) => setter((p: any) => ({ ...p, [k]: v })), []);
    const togglePre = useCallback((k: string) => setPre((p: any) => ({ ...p, [k]: !p[k] })), []);

    const go = (d: number) => {
        setPh((p) => Math.max(0, Math.min(p + d, PHASES.length - 1)));
        if (scrollRef.current) scrollRef.current.scrollTop = 0;
    };

    const printReport = () => {
        const html = buildReportHTML(pat, sc, neu, res, hm, aw, cu);
        const blob = new Blob([html], { type: "text/html;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");

        // Sanitize filename to avoid issues with special characters
        const safeName = (pat.name || "relatorio").replace(/[^a-z0-9]/gi, '_').toLowerCase();
        const safeDate = (pat.date || new Date().toISOString().split('T')[0]).replace(/-/g, '');

        a.href = url;
        a.download = `NEUROEXTUB_${safeName}_${safeDate}.html`;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();

        // Cleanup
        setTimeout(() => {
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }, 100);
    };

    const panels = [
        () => <IdentificationPanel data={pat} onUpdate={update(setPat)} />,
        () => <PrerequisitesPanel data={pre} onToggle={togglePre} count={sc.pm} />,
        () => <NeurologicalPanel neu={neu} pat={pat} onUpdate={update(setNeu)} four={sc.four} gcs={sc.gcs} vis={sc.vis} />,
        () => <RespiratoryPanel data={res} onUpdate={update(setRes)} />,
        () => <AirwayPanel data={aw} onUpdate={update(setAw)} stg={sc.stg} />,
        () => <HemodynamicPanel data={hm} onUpdate={update(setHm)} />,
        () => <CuffLeakPanel data={cu} onUpdate={update(setCu)} />,
        () => <ResultPanel sc={sc} neu={neu} onPrint={printReport} onShowDisclaimer={() => setModal("disc")} />,
        () => <PostExtubationPanel sc={sc} cu={cu} onPrint={printReport} />,
        () => <EvidencePanel onPrint={printReport} />
    ];

    return (
        <div style={{ minHeight: "100vh", position: "relative" }}>
            {/* Modal */}
            {modal === "disc" && (
                <div
                    style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,.7)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
                    onClick={() => setModal(null)}
                >
                    <div
                        style={{ maxWidth: 640, maxHeight: "80vh", overflow: "auto", background: "#1e293b", borderRadius: 16, padding: 32, border: "1px solid rgba(245,158,11,0.3)" }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 700, color: "#fcd34d" }}>⚖️ Termo de Responsabilidade</h3>
                        <div style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.8, whiteSpace: "pre-line" }}>{DISCLAIMER}</div>
                        <button
                            onClick={() => setModal(null)}
                            style={{ marginTop: 20, width: "100%", padding: 12, borderRadius: 8, border: "none", background: "#3b82f6", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
                        >
                            Entendi
                        </button>
                    </div>
                </div>
            )}

            <PhaseNavigation
                phases={PHASES}
                currentPhase={ph}
                onPhaseChange={(i) => { setPh(i); if (scrollRef.current) scrollRef.current.scrollTop = 0; }}
                scoresSummary={{ four: sc.four, vis: sc.vis, stg: sc.stg }}
            />

            {/* Content */}
            <div ref={scrollRef} style={{ maxWidth: 900, margin: "0 auto", padding: "24px 20px 100px" }}>
                {panels[ph]()}
            </div>

            {/* Footer Nav */}
            <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(15,23,42,.95)", borderTop: "1px solid rgba(100,116,139,0.15)", padding: "12px 20px", backdropFilter: "blur(12px)" }}>
                <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <button
                        onClick={() => go(-1)}
                        disabled={ph === 0}
                        style={{ padding: "10px 24px", borderRadius: 8, border: "1px solid rgba(100,116,139,.25)", background: "transparent", color: ph === 0 ? "#475569" : "#94a3b8", fontSize: 14, fontWeight: 600, cursor: ph === 0 ? "not-allowed" : "pointer" }}
                    >
                        ← Anterior
                    </button>
                    <span style={{ fontSize: 12, color: "#475569" }}>{PHASES[ph]}</span>
                    <button
                        onClick={() => go(1)}
                        disabled={ph === PHASES.length - 1}
                        style={{ padding: "10px 24px", borderRadius: 8, border: "none", background: ph === PHASES.length - 1 ? "#334155" : ph === 6 ? "#10b981" : "#3b82f6", color: "#fff", fontSize: 14, fontWeight: 600, cursor: ph === PHASES.length - 1 ? "not-allowed" : "pointer" }}
                    >
                        {ph === 6 ? "Resultado →" : ph >= PHASES.length - 1 ? "Fim" : "Próximo →"}
                    </button>
                </div>
            </div>
        </div>
    );
}
