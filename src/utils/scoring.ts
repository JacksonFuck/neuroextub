export interface PatientData {
    age?: string;
    mvD?: string;
    [key: string]: any;
}

export interface NeurologicalData {
    fE: string;
    fM: string;
    fB: string;
    fR: string;
    gE: string;
    gV: string;
    gM: string;
    vp: string;
    sw: string;
    icp: boolean;
    icpV: string;
    ppcV: string;
    rass: string;
    pup: string;
}

export interface RespiratoryData {
    pf: string;
    fio2: string;
    peep: string;
    pim: string;
    vc: string;
    sbt: string;
    sbtD: string;
    sec: string;
    rsbi: string;
    rr: string;
    vt: string;
}

export interface AirwayData {
    sw: string;
    tong: string;
    cS: string;
    cA: string;
    gag: string;
    sal: string;
    pef: string;
}

export interface HemodynamicData {
    stable: boolean;
    sbp: string;
    dbp: string;
    hr: string;
    vaso: string;
    arr: boolean;
    temp: string;
    crp: string;
    k: string;
    hb: string;
    ph: string;
    co2: string;
}

export interface CuffLeakData {
    done: boolean;
    leak: string;
    pct: string;
}

export interface PrerequisitesData {
    [key: string]: boolean;
}

export interface CalculationResult {
    four: number;
    gcs: number;
    vis: number;
    stg: number;
    bip: number;
    rf: number;
    pm: number;
    sbt: boolean;
    rec: string;
    rl: 'low' | 'medium' | 'high';
    vV: number;
    vS: number;
    vA: number;
    vM: number;
}

export const calculateScores = (
    pat: PatientData,
    neu: NeurologicalData,
    res: RespiratoryData,
    aw: AirwayData,
    hm: HemodynamicData,
    cu: CuffLeakData,
    pre: PrerequisitesData
): CalculationResult => {
    // FOUR Score
    const four = +neu.fE + +neu.fM + +neu.fB + +neu.fR;

    // GCS
    const gcs = +neu.gE + +neu.gV + +neu.gM;

    // VISAGE Score components
    const vV = neu.vp === "yes" ? 2 : 0;
    const vS = neu.sw === "yes" ? 2 : 0;
    const vA = pat.age && +pat.age < 60 ? 2 : 0;
    const vM = +neu.gM === 6 ? 2 : 0;
    const vis = vV + vS + vA + vM;

    // STAGE Score
    const stg =
        (aw.sw === "present" ? 2 : 0) +
        (aw.tong === "yes" ? 2 : 0) +
        (aw.cS === "vigorous" ? 2 : 0) +
        (aw.cA === "vigorous" ? 2 : 0) +
        (+neu.gM >= 5 ? 2 : 0);

    // BIPER Score
    let bip = 0;
    if (neu.icp && neu.icpV && +neu.icpV < 20) bip += 2; else if (!neu.icp) bip += 1;
    if (neu.icp && neu.ppcV && +neu.ppcV > 60) bip += 2; else if (!neu.icp) bip += 1;
    if (res.sbt === "success") bip += 3; else if (res.sbt === "partial") bip += 1;
    if (+res.sec <= 2) bip += 1;
    if (hm.stable) bip += 2;
    if (four >= 12) bip += 2; else if (four >= 8) bip += 1;

    // Risk Factors (rf)
    let rf = 0;
    if (pat.age && +pat.age >= 65) rf++;
    if (pat.mvD && +pat.mvD > 7) rf++;
    if (gcs < 10) rf++;
    if (aw.cS !== "vigorous") rf++;
    if (aw.sw !== "present") rf++;
    if (res.pf && +res.pf < 200) rf++;
    if (hm.vaso !== "none") rf++;
    if (cu.done && cu.leak && +cu.leak < 110) rf++;
    if (res.rsbi && +res.rsbi > 105) rf++;

    // Meta data
    const pm = Object.values(pre).filter(Boolean).length;
    const sbt = res.sbt === "success";

    // Recommendation Algorithm
    let rec = "?";
    let rl: 'low' | 'medium' | 'high' = "medium";

    if (pm < 8) {
        rec = "not_ready";
    } else if (!sbt && res.sbt !== "not_done") {
        rec = "sbt_fail";
    } else if (vis >= 6 && four >= 12 && stg >= 6 && sbt) {
        rec = "go";
        rl = rf <= 2 ? "low" : rf <= 4 ? "medium" : "high";
    } else if (vis >= 4 && four >= 10 && sbt) {
        rec = "cond";
        rl = "medium";
    } else if (vis < 4 || four < 10) {
        rec = "defer";
        rl = "high";
    } else {
        rec = "cond";
        rl = rf <= 3 ? "medium" : "high";
    }

    return { four, gcs, vis, stg, bip, rf, pm, sbt, rec, rl, vV, vS, vA, vM };
};
