// IKT Data Loader - Parses CSV and maps to athlete data structure
import iktCsvData from './IKT_data.csv?raw';

export interface IKTRowData {
  athleteName: string;
  gender: string;
  group: string;
  // 2026 data
  peakTorqueL_Ext_26: number;
  peakTorqueR_Ext_26: number;
  peakTorqueL_Flex_26: number;
  peakTorqueR_Flex_26: number;
  extensor60Assy_26: number;
  flexor60Assy_26: number;
  hqL60_26: number;
  hqR60_26: number;
  // 2025 data
  peakTorqueL_Ext_25: number;
  peakTorqueR_Ext_25: number;
  peakTorqueL_Flex_25: number;
  peakTorqueR_Flex_25: number;
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
    // 2026 data:
    // 3: IKT_L extensors 60_26 (Peak Torque L Ext)
    // 4: IKT_R extensors 60_26 (Peak Torque R Ext)
    // 5: IKT_L flexors60_26 (Peak Torque L Flex)
    // 6: IKT_R flexors 60_26 (Peak Torque R Flex)
    // 9: Extensor 60_Assy(%)_26
    // 12: Flexor 60_Assy(%)_26
    // 21: 60_L H/Q ratio(%)_26
    // 22: 60_R H/Q ratio(%)_26
    // 2025 data:
    // 23: L extensors 60_25 (Peak Torque L Ext)
    // 24: R extensors 60_25 (Peak Torque R Ext)
    // 25: L flexors 60_25 (Peak Torque L Flex)
    // 26: R flexors 60_25 (Peak Torque R Flex)
    // 27: 60_L H/Q ratio(%)_25
    // 28: 60_R H/Q ratio(%)_25
    // 31: Extensor 60_Assy(%)_25
    // 34: Flexor 60_Assy(%)_25

    const row: IKTRowData = {
      athleteName,
      gender: values[1],
      group: values[2],
      // 2026 data - Peak Torque from IKT columns
      peakTorqueL_Ext_26: parseFloat(values[3]) || 0,
      peakTorqueR_Ext_26: parseFloat(values[4]) || 0,
      peakTorqueL_Flex_26: parseFloat(values[5]) || 0,
      peakTorqueR_Flex_26: parseFloat(values[6]) || 0,
      extensor60Assy_26: parseFloat(values[9]) || 0,
      flexor60Assy_26: parseFloat(values[12]) || 0,
      hqL60_26: parseFloat(values[21]) || 0,
      hqR60_26: parseFloat(values[22]) || 0,
      // 2025 data - Peak Torque from IKT columns
      peakTorqueL_Ext_25: parseFloat(values[23]) || 0,
      peakTorqueR_Ext_25: parseFloat(values[24]) || 0,
      peakTorqueL_Flex_25: parseFloat(values[25]) || 0,
      peakTorqueR_Flex_25: parseFloat(values[26]) || 0,
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
