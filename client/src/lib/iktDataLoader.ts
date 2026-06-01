// IKT Data Loader - Parses CSV and maps to athlete data structure
import iktCsvData from './IKT_data.csv?raw';

export interface IKTRowData {
  athleteName: string;
  gender: string;
  group: string;
  // 2026 data - Normalized values (divided by body weight)
  nvL_Extensors_26: number;
  nvR_Extensors_26: number;
  nvL_Flexor_26: number;
  nvR_Flexor_26: number;
  extensor60Assy_26: number;
  flexor60Assy_26: number;
  hqL60_26: number;
  hqR60_26: number;
  // 2025 data - Normalized values (divided by body weight)
  nvL_Extensors_25: number;
  nvR_Extensors_25: number;
  nvL_Flexor_25: number;
  nvR_Flexor_25: number;
  extensor60Assy_25: number;
  flexor60Assy_25: number;
  hqL60_25: number;
  hqR60_25: number;
}

export function parseIKTData(): Map<string, IKTRowData> {
  const lines = iktCsvData.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  const dataMap = new Map<string, IKTRowData>();

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    
    const athleteName = values[0]; // Athlete Name is first column
    
    // Column indices (0-based):
    // 2026 data - Normalized values:
    // 7: NV_L extensors_26 (col 8 in 1-based)
    // 8: NV_R extensors 60_26 (col 9 in 1-based)
    // 10: NV_L Flexor 60_26 (col 11 in 1-based)
    // 11: NV_R Flexor 60_26 (col 12 in 1-based)
    // 9: Extensor 60_Assy(%)_26 (col 10 in 1-based)
    // 12: Flexor 60_Assy(%)_26 (col 13 in 1-based)
    // 21: 60_L H/Q ratio(%)_26 (col 22 in 1-based)
    // 22: 60_R H/Q ratio(%)_26 (col 23 in 1-based)
    // 2025 data - Normalized values:
    // 29: NV_L extensors 60_25 (col 30 in 1-based)
    // 30: NV_R extensors 60_25 (col 31 in 1-based)
    // 32: NV_L Flexor 60_25 (col 33 in 1-based)
    // 33: NV_R Flexor 60_25 (col 34 in 1-based)
    // 31: Extensor 60_Assy(%)_25 (col 32 in 1-based)
    // 34: Flexor 60_Assy(%)_25 (col 35 in 1-based)
    // 27: 60_L H/Q ratio(%)_25 (col 28 in 1-based)
    // 28: 60_R H/Q ratio(%)_25 (col 29 in 1-based)

    const row: IKTRowData = {
      athleteName,
      gender: values[1],
      group: values[2],
      // 2026 data - Normalized values (divided by body weight)
      nvL_Extensors_26: parseFloat(values[7]) || 0,
      nvR_Extensors_26: parseFloat(values[8]) || 0,
      nvL_Flexor_26: parseFloat(values[10]) || 0,
      nvR_Flexor_26: parseFloat(values[11]) || 0,
      extensor60Assy_26: parseFloat(values[9]) || 0,
      flexor60Assy_26: parseFloat(values[12]) || 0,
      hqL60_26: parseFloat(values[21]) || 0,
      hqR60_26: parseFloat(values[22]) || 0,
      // 2025 data - Normalized values (divided by body weight)
      nvL_Extensors_25: parseFloat(values[29]) || 0,
      nvR_Extensors_25: parseFloat(values[30]) || 0,
      nvL_Flexor_25: parseFloat(values[32]) || 0,
      nvR_Flexor_25: parseFloat(values[33]) || 0,
      extensor60Assy_25: parseFloat(values[31]) || 0,
      flexor60Assy_25: parseFloat(values[34]) || 0,
      hqL60_25: parseFloat(values[27]) || 0,
      hqR60_25: parseFloat(values[28]) || 0,
    };

    dataMap.set(athleteName, row);
  }

  return dataMap;
}

export const iktDataMap = parseIKTData();
