import Papa from 'papaparse';
import ybtCsvData from './Cycling_YBTD(2026+2025).csv?raw';

export interface YBTData {
  athleteName: string;
  // 2026 Data
  ybtLA_26: number;
  ybtLM_26: number;
  ybtLL_26: number;
  ybtRA_26: number;
  ybtRM_26: number;
  ybtRL_26: number;
  leftComposite_26: number;
  rightComposite_26: number;
  anteriorDisbalance_26: number;
  postMedialDisbalance_26: number;
  postLateralDisbalance_26: number;
  compositeDisbalance_26: number;
  // 2025 Data
  ybtLA_25: number;
  ybtLM_25: number;
  ybtLL_25: number;
  ybtRA_25: number;
  ybtRM_25: number;
  ybtRL_25: number;
  leftComposite_25: number;
  rightComposite_25: number;
  anteriorDisbalance_25: number;
  postMedialDisbalance_25: number;
  postLateralDisbalance_25: number;
  compositeDisbalance_25: number;
}

export const ybtDataMap = new Map<string, YBTData>();

// Parse CSV data
const parseYBTData = () => {
  Papa.parse(ybtCsvData, {
    header: true,
    skipEmptyLines: true,
    complete: (results: any) => {
      results.data.forEach((row: any) => {
        if (row['Athlete Name']) {
          const data: YBTData = {
            athleteName: row['Athlete Name'],
            // 2026 Data
            ybtLA_26: parseFloat(row['YBT LA Relative (normalized) (%)_26']) || 0,
            ybtLM_26: parseFloat(row['YBT LM Relative (normalized) (%)_26']) || 0,
            ybtLL_26: parseFloat(row['YBT LL Relative (normalized) (%)_26']) || 0,
            ybtRA_26: parseFloat(row['YBT RA Relative (normalized) (%)_26']) || 0,
            ybtRM_26: parseFloat(row['YBT RM Relative (normalized) (%)_26']) || 0,
            ybtRL_26: parseFloat(row['YBT RL Relative (normalized) (%)_26']) || 0,
            leftComposite_26: parseFloat(row['Left composite score(%)_26']) || 0,
            rightComposite_26: parseFloat(row['Right composite score(%)_26']) || 0,
            anteriorDisbalance_26: parseFloat(row['Anterior disbalance (%)_26']) || 0,
            postMedialDisbalance_26: parseFloat(row['Post_Medial disbalance (%)_26']) || 0,
            postLateralDisbalance_26: parseFloat(row['Post_Lateral disbalance (%)_26']) || 0,
            compositeDisbalance_26: parseFloat(row['Composite Disbalance (%)_26']) || 0,
            // 2025 Data
            ybtLA_25: parseFloat(row['YBT LA Relative (normalized) (%)_25']) || 0,
            ybtLM_25: parseFloat(row['YBT LM Relative (normalized) (%)_25']) || 0,
            ybtLL_25: parseFloat(row['YBT LL Relative (normalized) (%)_25']) || 0,
            ybtRA_25: parseFloat(row['YBT RA Relative (normalized) (%)_25']) || 0,
            ybtRM_25: parseFloat(row['YBT RM Relative (normalized) (%)_25']) || 0,
            ybtRL_25: parseFloat(row['YBT RL Relative (normalized) (%)_25']) || 0,
            leftComposite_25: parseFloat(row['Left composite score(%)_25']) || 0,
            rightComposite_25: parseFloat(row['Right composite score(%)_25']) || 0,
            anteriorDisbalance_25: parseFloat(row['Anterior disbalance (%)_25']) || 0,
            postMedialDisbalance_25: parseFloat(row['Post_Medial disbalance (%)_25']) || 0,
            postLateralDisbalance_25: parseFloat(row['Post_Lateral disbalance (%)_25']) || 0,
            compositeDisbalance_25: parseFloat(row['Composite Disbalance (%)_25']) || 0,
          };
          ybtDataMap.set(row['Athlete Name'], data);
        }
      });
    },
  });
};

parseYBTData();
