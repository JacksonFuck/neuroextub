export const PHASES = [
    "Identificação",
    "Pré-Requisitos",
    "Neurológica",
    "Respiratória",
    "Via Aérea",
    "Hemodinâmica",
    "Cuff Leak",
    "Resultado",
    "Pós-Extubação",
    "Evidências"
];

export const DISCLAIMER = `Este aplicativo é uma ferramenta de apoio à decisão clínica desenvolvida com base nas melhores evidências científicas disponíveis até 2026. O NEUROEXTUB não substitui, em nenhuma hipótese, o julgamento clínico do médico intensivista, do fisioterapeuta respiratório ou do enfermeiro responsável pelo cuidado direto ao paciente.

A decisão de extubar um paciente neurocrítico é um ato médico complexo que envolve avaliação multidimensional, experiência profissional e conhecimento individualizado do caso clínico. Os scores e recomendações gerados são auxiliares e devem ser interpretados dentro do contexto clínico global de cada paciente.

A responsabilidade pela decisão de extubação, bem como por todas as suas consequências, é exclusivamente da equipe assistencial — médico(a), fisioterapeuta e enfermeiro(a) — que acompanha o paciente à beira do leito. Nenhum algoritmo, por mais robusto que seja, substitui a capacidade humana de integrar informações clínicas, avaliar nuances individuais e exercer julgamento profissional.

Ao utilizar esta ferramenta, o profissional reconhece que:
• A ferramenta é um instrumento de suporte, não de decisão autônoma
• Os dados inseridos devem ser verificados quanto à sua acurácia
• A evidência científica é dinâmica e sujeita a atualizações
• A aplicação deve considerar o contexto local e particularidades do paciente
• A responsabilidade técnica e ética permanece com a equipe assistencial humana`;

export const EVIDENCE = [
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

export const DIAGNOSES = [
    { value: "avci", label: "AVCi" },
    { value: "avch", label: "AVCh" },
    { value: "hsa", label: "HSA" },
    { value: "tce", label: "TCE" },
    { value: "postop", label: "Pós-op Neuro" },
    { value: "se", label: "Status Epilepticus" },
    { value: "other", label: "Outro" }
];

export const RECOMMENDATION_DETAILS = {
    go: ["✅", "EXTUBAÇÃO RECOMENDADA", "#10b981"],
    cond: ["⚠️", "EXTUBAÇÃO CONDICIONAL", "#f59e0b"],
    defer: ["🔴", "ADIAR EXTUBAÇÃO", "#ef4444"],
    not_ready: ["⏸️", "PRÉ-REQUISITOS PENDENTES", "#94a3b8"],
    sbt_fail: ["❌", "FALHA NO TRE", "#ef4444"],
    "?": ["❓", "DADOS INSUFICIENTES", "#94a3b8"]
} as const;

export const RISK_LEVEL_COLORS = {
    low: "#10b981",
    medium: "#f59e0b",
    high: "#ef4444"
} as const;

export const RISK_LEVEL_LABELS = {
    low: "BAIXO",
    medium: "MÉDIO",
    high: "ALTO"
} as const;
