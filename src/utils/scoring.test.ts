import { describe, it, expect } from 'vitest';
import { calculateScores, PatientData, NeurologicalData, RespiratoryData, AirwayData, HemodynamicData, CuffLeakData, PrerequisitesData } from './scoring';

const defaultNeu: NeurologicalData = { fE: '4', fM: '4', fB: '4', fR: '4', gE: '4', gV: '5', gM: '6', vp: 'yes', sw: 'yes', icp: false, icpV: '', ppcV: '' };
const defaultPat: PatientData = { age: '50', mvD: '2' };
const defaultRes: RespiratoryData = { pf: '300', sbt: 'success', sec: '0', rsbi: '50', rr: '18', vt: '450' };
const defaultAw: AirwayData = { sw: 'present', tong: 'yes', cS: 'vigorous', cA: 'vigorous' };
const defaultHm: HemodynamicData = { stable: true, vaso: 'none' };
const defaultCu: CuffLeakData = { done: false, leak: '' };
const allPre: PrerequisitesData = { a: true, b: true, c: true, d: true, e: true, f: true, g: true, h: true };

describe('NEUROEXTUB Scoring Logic', () => {
    describe('FOUR Score', () => {
        it('should sum E, M, B, R correctly', () => {
            const neu = { ...defaultNeu, fE: '2', fM: '3', fB: '4', fR: '1' };
            const res = calculateScores(defaultPat, neu, defaultRes, defaultAw, defaultHm, defaultCu, allPre);
            expect(res.four).toBe(10);
        });
    });

    describe('VISAGE Score', () => {
        it('should calculate VISAGE correctly (Max 8)', () => {
            const pat = { age: '50' }; // Age < 60 = 2
            const neu = { ...defaultNeu, vp: 'yes', sw: 'yes', gM: '6' }; // vp=2, sw=2, gM=6=2
            const res = calculateScores(pat, neu, defaultRes, defaultAw, defaultHm, defaultCu, allPre);
            expect(res.vis).toBe(8);
            expect(res.vA).toBe(2);
            expect(res.vV).toBe(2);
            expect(res.vS).toBe(2);
            expect(res.vM).toBe(2);
        });

        it('should decrease VISAGE points for older age and lack of visual pursuit', () => {
            const pat = { age: '70' }; // Age >= 60 = 0
            const neu = { ...defaultNeu, vp: 'no', sw: 'yes', gM: '6' }; // vp=0, sw=2, gM=6=2
            const res = calculateScores(pat, neu, defaultRes, defaultAw, defaultHm, defaultCu, allPre);
            expect(res.vis).toBe(4);
        });
    });

    describe('STAGE Score', () => {
        it('should calculate STAGE correctly (Max 10)', () => {
            const aw = { sw: 'present', tong: 'yes', cS: 'vigorous', cA: 'vigorous' }; // 2+2+2+2=8
            const neu = { ...defaultNeu, gM: '6' }; // M6 >= 5 = 2
            const res = calculateScores(defaultPat, neu, defaultRes, aw, defaultHm, defaultCu, allPre);
            expect(res.stg).toBe(10);
        });
    });

    describe('BIPER Score', () => {
        it('should calculate BIPER correctly (Max 12)', () => {
            const neu = { ...defaultNeu, icp: false }; // no ICP = 1 (PIC) + 1 (PPC) = 2
            const resData = { ...defaultRes, sbt: 'success', sec: '1' }; // Success=3, Sec<=2=1 -> total 4
            // Hemodynamic stable = 2
            // FOUR 16 >= 12 = 2
            // Total: 2 + 4 + 2 + 2 = 10
            const res = calculateScores(defaultPat, neu, resData, defaultAw, defaultHm, defaultCu, allPre);
            expect(res.bip).toBe(10);
        });
    });

    describe('Risk Factors', () => {
        it('should count multiple risk factors', () => {
            const pat = { age: '70', mvD: '10' }; // Age>=65 (+1), VM>7 (+1)
            const resData = { ...defaultRes, pf: '150', rsbi: '120' }; // PF<200 (+1), RSBI>105 (+1)
            const neu = { ...defaultNeu, gE: '1', gV: '1', gM: '4' }; // GCS 6 < 10 (+1)
            const aw = { ...defaultAw, cS: 'weak' }; // Cough not vigorous (+1)
            const hm = { ...defaultHm, vaso: 'low' }; // Vaso use (+1)
            const cu = { done: true, leak: '80' }; // Leak < 110 (+1)
            // Total so far: 1+1+1+1+0(swallow)+1+1+1+1 = 8
            // Swallow in defaultAw is 'present', so if we make it weak:
            const awWeak = { ...aw, sw: 'weak' }; // (+1)

            const res = calculateScores(pat, neu, resData, awWeak, hm, cu, allPre);
            expect(res.rf).toBe(9);
        });
    });

    describe('Recommendation Algorithm', () => {
        it('should return not_ready if prerequisites are not met', () => {
            const incompletePre = { ...allPre, a: false };
            const res = calculateScores(defaultPat, defaultNeu, defaultRes, defaultAw, defaultHm, defaultCu, incompletePre);
            expect(res.rec).toBe('not_ready');
        });

        it('should return sbt_fail if SBT fails', () => {
            const failRes = { ...defaultRes, sbt: 'failed' };
            const res = calculateScores(defaultPat, defaultNeu, failRes, defaultAw, defaultHm, defaultCu, allPre);
            expect(res.rec).toBe('sbt_fail');
        });

        it('should return go (EXTUBAÇÃO RECOMENDADA) for favorable scores', () => {
            const res = calculateScores(defaultPat, defaultNeu, defaultRes, defaultAw, defaultHm, defaultCu, allPre);
            expect(res.rec).toBe('go');
        });

        it('should return cond (EXTUBAÇÃO CONDICIONAL) for intermediate VISAGE/FOUR', () => {
            const intermediateNeu = { ...defaultNeu, fE: '2', fM: '2', fB: '3', fR: '3' }; // FOUR 10
            const res = calculateScores(defaultPat, intermediateNeu, defaultRes, defaultAw, defaultHm, defaultCu, allPre);
            expect(res.rec).toBe('cond');
        });

        it('should return defer (ADIAR EXTUBAÇÃO) for poor VISAGE/FOUR', () => {
            const poorNeu = { ...defaultNeu, fE: '1', fM: '1', fB: '1', fR: '1', vp: 'no', sw: 'no', gM: '3' }; // FOUR 4, VISAGE 0
            const res = calculateScores(defaultPat, poorNeu, defaultRes, defaultAw, defaultHm, defaultCu, allPre);
            expect(res.rec).toBe('defer');
        });
    });
});
