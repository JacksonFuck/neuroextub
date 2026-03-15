import { useMemo } from 'react';
import { calculateScores, PatientData, NeurologicalData, RespiratoryData, AirwayData, HemodynamicData, CuffLeakData, PrerequisitesData } from '../utils/scoring';

export const useScoresCalculations = (
    pat: PatientData,
    neu: NeurologicalData,
    res: RespiratoryData,
    aw: AirwayData,
    hm: HemodynamicData,
    cu: CuffLeakData,
    pre: PrerequisitesData
) => {
    return useMemo(() => {
        return calculateScores(pat, neu, res, aw, hm, cu, pre);
    }, [pat, neu, res, aw, hm, cu, pre]);
};
