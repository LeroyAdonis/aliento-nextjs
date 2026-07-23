/**
 * Aliento Health — Medical Script PDF Generator
 *
 * Generates professional prescription HTML that can be:
 *   - Rendered directly in the browser (print-to-PDF via Cmd+P)
 *   - Converted to a PDF buffer via Puppeteer/Playwright on the server
 *   - Saved as HTML for archival
 */

export interface MedicationItem {
  name: string
  dosage?: string | null
  quantity?: number | null
  refills?: number | null
}

// Backward-compat alias used by existing route files
export type Medication = MedicationItem

export interface ScriptData {
  id: string
  patientName: string
  patientEmail?: string | null
  patientIdNumber?: string | null
  patientCell?: string | null
  patientAddress?: string | null
  medications: MedicationItem[]
  type?: string | null
  specialInstructions?: string | null
  createdAt?: Date | string | null
  completedAt?: Date | string | null
}

// ─── Doctor credentials ────────────────────────────────────────────────────

const DOCTOR = {
  name: 'Dr Leegale Adonis',
  qualifications: 'MBBCH, MBA, MMed Comm Health, FCPHM, PhD',
  practiceNo: '1181300',
  mpNo: 'MP0531502',
  address: '112A, 9th Road, Hyde Park, Johannesburg, 2196',
  practiceName: 'Aliento Health',
}

const SIGNATURE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1240 319"><path fill="#1a1a1a" stroke="#1a1a1a" stroke-width="1" opacity="1" d="M 999.5 11 L 1003 12 Q 1003.9 19.6 1001 24.5 Q 996.9 31.9 990.5 37 L 983.5 38 L 978.5 42 L 976.5 42 L 977 40.5 L 988 20.5 L 995.5 13 L 999.5 11 Z " /><path fill="#1a1a1a" stroke="#1a1a1a" stroke-width="1" opacity="1" d="M 171.5 12 Q 175.3 11.3 176 13.5 L 177 15.5 Q 174.5 30 164.5 37 Q 162.7 38.7 158.5 38 L 151.5 43 L 150 43 Q 154.2 31.4 161 21.5 L 169.5 13 L 171.5 12 Z " /><path fill="#1a1a1a" stroke="#1a1a1a" stroke-width="1" opacity="1" d="M 584.5 12 Q 589 11 590 13.5 Q 588.3 29.8 577.5 37 Q 568.1 37.6 563.5 43 L 563 41.5 L 575 20.5 L 582.5 13 L 584.5 12 Z " /><path fill="#1a1a1a" stroke="#1a1a1a" stroke-width="1" opacity="1" d="M 192.5 22 L 196 23 Q 195.3 25.6 197 26.5 L 197 40.5 L 198 41.5 L 198 51 L 195.5 51 L 189.5 54 L 178.5 42 L 171 38.5 Q 179.4 27.9 192.5 22 Z " /><path fill="#1a1a1a" stroke="#1a1a1a" stroke-width="1" opacity="1" d="M 605.5 22 Q 608.5 21.5 609 23.5 L 611 29.5 L 611 49.5 L 602.5 54 Q 599.1 46.4 592.5 42 Q 589.9 38.4 585 39 L 585 37.5 L 591.5 31 L 602.5 23 L 605.5 22 Z " /><path fill="#1a1a1a" stroke="#1a1a1a" stroke-width="1" opacity="1" d="M 1017.5 22 Q 1022 21 1023 23.5 Q 1022.2 26.8 1024 27.5 L 1024 49.5 Q 1020.8 53 1015 53 L 1015 51.5 L 1007.5 43 L 998 37.5 Q 1006.1 28.1 1017.5 22 Z " /><path fill="#1a1a1a" stroke="#1a1a1a" stroke-width="1" opacity="1" d="M 624.5 37 L 625 38.5 L 624 39.5 L 623 46 L 620 45.5 L 624.5 37 Z " /><path fill="#1a1a1a" stroke="#1a1a1a" stroke-width="1" opacity="1" d="M 935.5 38 Q 944.1 37.9 949.5 41 L 959 50.5 L 963 56.5 L 963 58.5 L 950.5 72 Q 944.8 77.3 936.5 80 Q 933.6 81.6 928.5 81 L 927.5 82 L 923.5 82 Q 915.7 80.8 912 75.5 Q 907.4 69.7 909 57.5 Q 910.8 48.3 917.5 44 L 922.5 41 L 928.5 39 L 934.5 39 L 935.5 38 Z " /><path fill="#1a1a1a" stroke="#1a1a1a" stroke-width="1" opacity="1" d="M 1037.5 38 L 1038 39.5 L 1034.5 46 L 1034 43.5 L 1037.5 38 Z " /><path fill="#1a1a1a" stroke="#1a1a1a" stroke-width="1" opacity="1" d="M 1106.5 38 Q 1112.6 39.4 1115 44.5 Q 1119.4 51.6 1121 61.5 L 1120 64 Q 1116.1 66.4 1106.5 65 Q 1097.9 63.1 1093 57.5 L 1097 54.5 Q 1099.6 45.6 1104.5 39 L 1106.5 38 Z " /><path fill="#1a1a1a" stroke="#1a1a1a" stroke-width="1" opacity="1" d="M 105.5 39 Q 124.8 37.8 131 49.5 L 137 58.5 L 123.5 73 Q 115.9 78.9 105.5 82 L 93.5 82 Q 88 80 85 75.5 L 82 67.5 L 82 59.5 Q 83.8 49.8 90.5 45 L 97.5 41 L 104.5 40 L 105.5 39 Z " /><path fill="#1a1a1a" stroke="#1a1a1a" stroke-width="1" opacity="1" d="M 210.5 39 L 211 41.5 L 208.5 46 L 207 45.5 L 210.5 39 Z " /><path fill="#1a1a1a" stroke="#1a1a1a" stroke-width="1" opacity="1" d="M 278.5 39 L 282.5 39 L 287 43.5 L 293 55.5 L 294 62.5 Q 291.3 67.8 281.5 66 Q 272.1 64.5 267 58.5 L 270 55.5 L 278.5 39 Z " /><path fill="#1a1a1a" stroke="#1a1a1a" stroke-width="1" opacity="1" d="M 517.5 39 L 530.5 39 Q 538.5 41.5 543 47.5 Q 548.1 51.4 550 58.5 L 537.5 72 L 524.5 80 L 518.5 81 L 517.5 82 L 508.5 82 L 500 78 L 496 69.5 L 496 56.5 Q 498.2 48.1 504.5 44 L 517.5 39 Z " /><path fill="#1a1a1a" stroke="#1a1a1a" stroke-width="1" opacity="1" d="M 577.5 39 L 580 39.5 L 566.5 55 L 563 52.5 Q 563.3 46.8 566.5 44 Q 573.9 43.4 577.5 39 Z " /><path fill="#1a1a1a" stroke="#1a1a1a" stroke-width="1" opacity="1" d="M 691.5 39 Q 698.4 38.1 700 42.5 Q 704.7 48.8 707 57.5 L 707 64 L 704.5 65 L 691.5 65 L 680 59 Q 678.9 56.3 681.5 57 L 685 52.5 Q 687 44.5 691.5 39 Z " /><path fill="#1a1a1a" stroke="#1a1a1a" stroke-width="1" opacity="1" d="M 990.5 39 L 993 39.5 L 979.5 55 L 977 54 Q 975.9 47.2 979.5 44 Q 986.7 43.2 990.5 39 Z " /><path fill="#1a1a1a" stroke="#1a1a1a" stroke-width="1" opacity="1" d="M 163.5 40 L 166 40.5 L 153.5 55 Q 150.5 55.5 150 53.5 Q 149.4 47.3 152 45 Q 158.7 44.2 163.5 40 Z " /><path fill="#1a1a1a" stroke="#1a1a1a" stroke-width="1" opacity="1" d="M 169.5 40 Q 180.7 43.4 186 52.5 L 187 54.5 Q 178.8 60.3 165.5 61 L 155 56.5 L 169.5 40 Z " /><path fill="#1a1a1a" stroke="#1a1a1a" stroke-width="1" opacity="1" d="M 582.5 40 Q 592.8 42.8 598 50.5 L 600 54.5 Q 592.2 60.2 578.5 60 Q 577.5 58 573.5 59 L 569 57 L 571 52.5 L 582.5 40 Z " /><path fill="#1a1a1a" stroke="#1a1a1a" stroke-width="1" opacity="1" d="M 995.5 40 Q 1000.5 39.5 1002.5 42 L 1010 48.5 L 1014 54.5 L 1001.5 59 L 991.5 60 Q 985.6 58.9 982 55.5 L 995.5 40 Z " /><path fill="#1a1a1a" stroke="#1a1a1a" stroke-width="1" opacity="1" d="M 141.5 45 L 145 46.5 L 143.5 48 Q 139.5 46.5 141.5 45 Z " /><path fill="#1a1a1a" stroke="#1a1a1a" stroke-width="1" opacity="1" d="M 148.5 45 L 150 45.5 L 147.5 52 Q 145.5 51.5 146 48.5 L 148.5 45 Z " /><path fill="#1a1a1a" stroke="#1a1a1a" stroke-width="1" opacity="1" d="M 555 45 Q 558.7 43.5 558 46.5 Q 556.5 49.5 555 46.5 L 555 45 Z " /><path fill="#1a1a1a" stroke="#1a1a1a" stroke-width="1" opacity="1" d="M 561.5 45 L 563 45.5 Q 561.3 46.3 562 49.5 L 560.5 51 L 559 48.5 L 561.5 45 Z " /><path fill="#1a1a1a" stroke="#1a1a1a" stroke-width="1" opacity="1" d="M 968.5 45 L 972 45.5 L 969.5 47 Q 967 46 968.5 45 Z " /><path fill="#1a1a1a" stroke="#1a1a1a" stroke-width="1" opacity="1" d="M 974 45 Q 976.7 43.9 976 46.5 Q 974 47.6 975 51 L 972 49.5 L 974 45 Z " /><path fill="#1a1a1a" stroke="#1a1a1a" stroke-width="1" opacity="1" d="M 215.5 47 Q 226.8 46.7 232 52.5 L 233 54.5 Q 231 55.6 232 59 L 219.5 62 L 218.5 61 L 212.5 60 L 209 56.5 Q 211 55.5 210 51.5 L 212.5 48 L 215.5 47 Z " /><path fill="#1a1a1a" stroke="#1a1a1a" stroke-width="1" opacity="1" d="M 243.5 47 Q 245.8 46.3 245 48.5 L 240.5 54 L 235.5 58 L 235 54.5 L 239.5 49 L 243.5 47 Z " /><path fill="#1a1a1a" stroke="#1a1a1a" stroke-width="1" opacity="1" d="M 627.5 47 Q 641.5 45.5 646 53.5 Q 647 58 644.5 59 L 638.5 60 L 637.5 61 L 629.5 61 L 623 58 L 624 48 Q 626.6 48.8 627.5 47 Z " /><path fill="#1a1a1a" stroke="#1a1a1a" stroke-width="1" opacity="1" d="M 656.5 47 Q 658.8 46.3 658 48.5 L 653.5 54 L 649.5 57 L 648 57 Q 648.1 51.4 652.5 49 L 656.5 47 Z " /><path fill="#1a1a1a" stroke="#1a1a1a" stroke-width="1" opacity="1" d="M 1039.5 47 Q 1054.2 44.8 1059 52.5 Q 1060.3 58.6 1057.5 58 L 1049.5 61 L 1044.5 61 L 1038.5 59 L 1036 56.5 L 1037 49.5 L 1039.5 47 Z " /><path fill="#1a1a1a" stroke="#1a1a1a" stroke-width="1" opacity="1" d="M 1068.5 47 L 1072 47.5 L 1066.5 54 L 1062.5 57 L 1062 52.5 L 1068.5 47 Z " /><path fill="#1a1a1a" stroke="#1a1a1a" stroke-width="1" opacity="1" d="M 1033.5 48 L 1034 49.5 L 1030.5 54 L 1031 52.5 Q 1030.5 48.5 1033.5 48 Z " /><path fill="#1a1a1a" stroke="#1a1a1a" stroke-width="1" opacity="1" d="M 206.5 49 L 208 49.5 L 203.5 55 L 204 53.5 L 206.5 49 Z " /><path fill="#1a1a1a" stroke="#1a1a1a" stroke-width="1" opacity="1" d="M 619.5 49 L 621 49.5 L 617.5 54 L 617 52.5 L 619.5 49 Z " /><path fill="#1a1a1a" stroke="#1a1a1a" stroke-width="1" opacity="1" d="M 1028.5 50 L 1029 51.5 L 1026.5 55 L 1026 51 L 1028.5 50 Z " /><path fill="#1a1a1a" stroke="#1a1a1a" stroke-width="1" opacity="1" d="M 201.5 51 L 202 52.5 L 200.5 55 L 200 52.5 L 201.5 51 Z " /><path fill="#1a1a1a" stroke="#1a1a1a" stroke-width="1" opacity="1" d="M 614.5 51 L 615 53.5 Q 614 56 613 54.5 Q 612.5 51.5 614.5 51 Z " /><path fill="#1a1a1a" stroke="#1a1a1a" stroke-width="1" opacity="1" d="M 144.5 52 Q 149.3 54.2 150 60.5 L 145.5 64 L 143.5 64 L 140 59.5 L 140 57.5 L 144.5 52 Z " /><path fill="#1a1a1a" stroke="#1a1a1a" stroke-width="1" opacity="1" d="M 557.5 52 L 562 55.5 L 564 58.5 L 561.5 62 L 557.5 64 L 553 58.5 L 557.5 52 Z " /><path fill="#1a1a1a" stroke="#1a1a1a" stroke-width="1" opacity="1" d="M 970.5 52 L 975 54.5 Q 977.4 55.6 977 59.5 L 971.5 64 L 970 64 Q 970.5 60.8 967 59.5 L 967 56.5 L 970.5 52 Z " /><path fill="#1a1a1a" stroke="#1a1a1a" stroke-width="1" opacity="1" d="M 196.5 53 L 197 60.5 Q 195 65 193 61.5 L 191 56.5 L 196.5 53 Z " /><path fill="#1a1a1a" stroke="#1a1a1a" stroke-width="1" opacity="1" d="M 609.5 53 Q 612.3 52.4 611 58.5 L 607.5 63 L 604 55 Q 607.7 55.6 609.5 53 Z " /><path fill="#1a1a1a" stroke="#1a1a1a" stroke-width="1" opacity="1" d="M 1021.5 53 L 1024 53 L 1024 59.5 L 1021.5 63 L 1017 55.5 L 1021.5 53 Z " /><path fill="#1a1a1a" stroke="#1a1a1a" stroke-width="1" opacity="1" d="M 187.5 57 Q 189.8 56.3 189 58.5 L 193 65.5 L 187.5 72 Q 182.2 76.7 174.5 79 L 163.5 79 Q 152.6 76.4 147 68.5 L 150.5 63 Q 153.4 61.4 158.5 62 L 159.5 63 L 169.5 63 L 170.5 62 L 174.5 62 Q 176.5 59.5 181.5 60 L 187.5 57 Z " /><path fill="#1a1a1a" stroke="#1a1a1a" stroke-width="1" opacity="1" d="M 600.5 57 L 603 58.5 L 606 65.5 L 601.5 71 Q 594.3 79.3 578.5 79 Q 565.9 76.6 560 67.5 L 563.5 63 L 568.5 61 L 569.5 62 L 578.5 63 L 579.5 62 L 590.5 61 L 600.5 57 Z " /><path fill="#1a1a1a" stroke="#1a1a1a" stroke-width="1" opacity="1" d="M 1012.5 57 Q 1016.9 55.5 1016 58.5 Q 1019.4 60.1 1019 65.5 L 1014.5 71 L 1007.5 76 Q 1003.6 75.6 1002.5 78 Q 997 76.5 995.5 79 L 994.5 78 Q 988.8 78.8 985.5 77 L 975 69.5 L 974 66.5 Q 976.5 65.5 976 63 L 980.5 61 L 983.5 61 L 984.5 62 L 997.5 62 L 1012.5 57 Z " /><path fill="#1a1a1a" stroke="#1a1a1a" stroke-width="1" opacity="1" d="M 209.5 60 Q 210.6 62.4 214 62.5 L 209 63 L 209.5 60 Z " /><path fill="#1a1a1a" stroke="#1a1a1a" stroke-width="1" opacity="1" d="M 622 60 L 628 62.5 L 623.5 63 L 622 60 Z " /><path fill="#1a1a1a" stroke="#1a1a1a" stroke-width="1" opacity="1" d="M 1036.5 60 L 1039 61 Q 1040.1 63.7 1037.5 63 Q 1035.1 62.1 1036.5 60 Z " /><path fill="#1a1a1a" stroke="#1a1a1a" stroke-width="1" opacity="1" d="M 1023.5 64 L 1024 67.5 L 1023 67.5 L 1022 65.5 L 1023.5 64 Z " /><path fill="#1a1a1a" stroke="#1a1a1a" stroke-width="1" opacity="1" d="M 196.5 65 L 197 68.5 L 196 68.5 L 196.5 65 Z " /><path fill="#1a1a1a" stroke="#1a1a1a" stroke-width="1" opacity="1" d="M 143.5 68 L 143 69.5 Q 137.4 80.4 128.5 88 L 128 86.5 Q 133.8 75.3 143.5 68 Z " /><path fill="#1a1a1a" stroke="#1a1a1a" stroke-width="1" opacity="1" d="M 556.5 68 L 556 69.5 Q 550.6 80.6 541.5 88 L 542 86.5 Q 546.9 74.9 556.5 68 Z " /><path fill="#1a1a1a" stroke="#1a1a1a" stroke-width="1" opacity="1" d="M 969.5 68 L 969 69.5 Q 964 80 955.5 87 L 955 85.5 Q 960.4 74.9 969.5 68 Z " /><path fill="rgb(231,245,230)" stroke="rgb(231,245,230)" stroke-width="1" opacity="1" d="M 998.5 9 Q 1003.6 8.4 1005 11.5 Q 1006 18.5 1004 22.5 Q 1000.7 31.2 994 36.5 L 995.5 37 Q 1003.6 27.6 1014.5 21 Q 1017 19 1022.5 20 L 1025 22.5 Q 1024.3 25.8 1026 26.5 L 1026.5 49 L 1031 46.5 L 1042 24 Q 1045.8 22.5 1045 25.5 L 1038 44.5 L 1043.5 45 Q 1044.5 43 1045.5 45 Q 1056.7 44.3 1060.5 51 Q 1063.7 45.3 1071.5 44 L 1074 45 Q 1074.9 50.4 1071 52.5 Q 1072.2 54.2 1073.5 51 L 1075.5 50 Q 1076.6 52.8 1080 52 L 1080 56 L 1088 56 Q 1084.8 50.5 1083 42.5 L 1083 30.5 Q 1084.8 29.7 1084 26.5 L 1083.5 26 L 1078 31.5 L 1074 38.5 L 1077 40 Q 1078.3 43 1074.5 42 Q 1071.5 41.5 1072 37.5 Q 1076.3 27.8 1084.5 22 Q 1088.3 20.8 1087 24.5 L 1086 25.5 Q 1087.3 30.2 1085 31.5 L 1085 41.5 Q 1087 42.5 1086 46.5 L 1090 55 Q 1093.8 56 1095 53.5 L 1100 41.5 L 1103.5 37 L 1108.5 36 L 1116 42.5 Q 1121.9 50.1 1123 62.5 L 1122 65 Q 1117.1 68.7 1105.5 67 Q 1095.7 64.8 1090.5 58 L 1081.5 58 Q 1079.7 60.8 1078 56.5 L 1077.5 54 L 1073.5 60 Q 1069.8 61.3 1071 57.5 L 1069.5 58 L 1065.5 60 L 1061.5 60 L 1053.5 63 L 1047.5 63 L 1046.5 64 L 1036.5 65 L 1034 64 L 1034 56.5 L 1032.5 55 L 1028.5 60 L 1026.5 59 L 1026 77.5 L 1024.5 80 L 1020.5 68 Q 1014.8 75.3 1005.5 79 L 998.5 80 L 997.5 81 L 992.5 81 L 991.5 80 Q 985.4 80.6 982.5 78 L 972.5 70 L 971 70 Q 966 81.3 956.5 89 L 953 90 L 952 87.5 Q 957.6 73.6 969 65.5 L 966 61.5 L 966 60 Q 963.3 58.9 964 61.5 Q 956.5 71.5 945.5 78 Q 937.4 84.4 922.5 84 Q 914 82.5 910 76.5 Q 905 69.9 907 56.5 Q 909.1 46.6 916.5 42 Q 925.5 35.5 941.5 36 Q 951.2 38.3 957 44.5 L 964.5 55 L 967 53.5 L 969 49.5 L 963.5 44 L 956.5 42 L 948 36.5 Q 947.3 34.3 949.5 35 L 960.5 41 L 960 39.5 L 955 32.5 L 954 28 Q 956.7 26.9 956 29.5 Q 959.5 37 965.5 42 Q 967.7 43.8 972.5 43 L 986 19.5 L 994.5 11 L 998.5 9 Z M 1000 11 L 996 13 L 988 21 L 977 41 L 977 42 L 979 42 L 984 38 L 991 37 Q 997 32 1001 25 Q 1004 20 1003 12 L 1000 11 Z M 1018 22 Q 1006 28 998 38 L 1008 43 L 1015 52 L 1015 53 Q 1021 53 1024 50 L 1024 28 Q 1022 27 1023 24 Q 1022 21 1018 22 Z M 936 38 L 935 39 L 929 39 L 923 41 L 918 44 Q 911 48 909 58 Q 907 70 912 76 Q 916 81 924 82 L 928 82 L 929 81 Q 934 82 937 80 Q 945 77 951 72 L 963 59 L 963 57 L 959 51 L 950 41 Q 944 38 936 38 Z M 1107 38 L 1105 39 Q 1100 46 1097 55 L 1093 58 Q 1098 63 1107 65 Q 1116 66 1120 64 L 1121 62 Q 1119 52 1115 45 Q 1113 39 1107 38 Z M 991 39 Q 987 43 980 44 Q 976 47 977 54 L 980 55 L 993 40 L 991 39 Z M 996 40 L 982 56 Q 986 59 992 60 L 1002 59 L 1014 55 L 1010 49 L 1003 42 Q 1000 39 996 40 Z M 1037 40 L 1034 44 L 1035 46 L 1037 43 L 1037 40 Z M 969 45 Q 967 46 970 47 L 972 46 L 969 45 Z M 974 45 L 972 50 L 975 51 Q 974 48 976 47 Q 977 44 974 45 Z M 1040 47 L 1037 50 L 1036 57 L 1039 59 L 1045 61 L 1050 61 L 1058 58 Q 1060 59 1059 53 Q 1054 45 1040 47 Z M 1069 47 L 1062 53 L 1063 57 L 1067 54 L 1072 48 L 1069 47 Z M 1034 48 L 1031 51 L 1032 53 L 1034 50 L 1034 48 Z M 1029 50 L 1026 51 L 1027 55 L 1029 52 L 1029 50 Z M 971 52 L 967 57 L 967 60 Q 971 61 970 64 L 972 64 L 977 60 Q 977 56 975 55 L 971 52 Z M 1022 53 L 1017 56 L 1022 63 L 1024 60 L 1024 53 L 1022 53 Z M 1013 57 L 998 62 L 985 62 L 984 61 L 981 61 L 976 63 Q 976 65 974 67 L 975 70 L 986 77 Q 989 79 995 78 L 996 79 Q 997 77 1003 78 Q 1004 76 1008 76 L 1015 71 L 1019 66 Q 1019 60 1016 59 Q 1017 55 1013 57 Z M 1037 60 Q 1035 62 1038 63 Q 1040 64 1039 61 L 1037 60 Z M 1024 64 L 1022 66 L 1023 68 L 1024 68 L 1024 64 Z M 969 69 Q 960 76 955 86 L 956 87 Q 964 80 969 71 L 969 69 Z " /><path fill="rgb(231,245,230)" stroke="rgb(231,245,230)" stroke-width="1" opacity="1" d="M 170.5 10 Q 176.8 8.8 178 12.5 L 179 16.5 Q 176.6 30.6 167 37.5 L 168.5 38 L 182.5 25 L 191.5 20 L 194.5 20 L 198 22.5 Q 199.9 26.1 199 32.5 L 200 33.5 L 200 49 L 204 48 Q 209 34.9 216 24 Q 219 22.8 218 26.5 L 212 42.5 L 212 46 Q 214.7 44.1 221.5 45 Q 229.7 46.3 234.5 51 Q 237.3 46.8 242.5 45 L 247 45 Q 248.1 51.2 244 53.5 Q 245.2 55.2 246.5 52 L 249.5 51 L 254 54.5 Q 252.7 58.7 257.5 57 Q 258.4 55.3 261 56 L 257 46.5 L 256 34.5 Q 258.5 33 257 27.5 L 256.5 27 L 251 32.5 Q 247.6 34.1 248 39.5 Q 251.7 41.3 248.5 43 L 246 42 Q 245 37.1 247 34.5 L 257.5 23 Q 261.7 21.7 260 26.5 L 259 27.5 L 259 45.5 L 264.5 56 Q 267.5 56.5 268 54.5 L 276.5 38 Q 278.3 36.3 282.5 37 L 289 42.5 L 295 54.5 L 296 63.5 L 295 66 Q 290.4 69.1 280.5 68 L 279.5 67 L 273.5 66 Q 267.4 63.1 263.5 58 L 260.5 58 L 259.5 59 L 252 59 Q 253.7 53.8 250 55 L 250 56.5 L 246.5 61 Q 242.8 62.3 244 58.5 L 242.5 59 L 238.5 61 L 233.5 61 L 225.5 64 L 208.5 65 L 207 63.5 L 207 56 Q 204.3 54.9 205 57.5 L 201.5 61 Q 200.3 58.7 199 61.5 L 199 79.5 L 197 80 Q 196.8 73 193.5 68 L 188.5 74 Q 183.2 78.7 175.5 81 L 162.5 81 Q 151.2 78.3 145.5 70 Q 139.2 81.7 129.5 90 Q 124.3 91.8 126 86.5 L 131 77.5 L 142 65.5 L 138.5 61 Q 136.3 60.3 137 62.5 Q 127.4 74.9 112.5 82 Q 105.3 85.8 92.5 84 Q 86.3 81.7 83 76.5 L 80 68.5 L 80 58.5 Q 82.1 48.1 89.5 43 Q 95.5 38.5 104.5 37 L 116.5 37 Q 127.4 40.1 133 48.5 L 138.5 56 L 142 51.5 L 142 49.5 L 137.5 45 L 130.5 43 L 121 36.5 L 123.5 36 L 134.5 42 L 135 41.5 L 132 38.5 Q 128 34.5 127 29 L 130 30.5 L 138.5 43 L 146.5 43 L 148 41.5 Q 152.7 29.2 160 19.5 L 168.5 11 L 170.5 10 Z M 172 12 L 170 13 L 161 22 Q 154 31 150 43 L 152 43 L 159 38 Q 163 39 165 37 Q 175 30 177 16 L 176 14 Q 175 11 172 12 Z M 193 22 Q 179 28 171 39 L 179 42 L 190 54 L 196 51 L 198 51 L 198 42 L 197 41 L 197 27 Q 195 26 196 23 L 193 22 Z M 106 39 L 105 40 L 98 41 L 91 45 Q 84 50 82 60 L 82 68 L 85 76 Q 88 80 94 82 L 106 82 Q 116 79 124 73 L 137 59 L 131 50 Q 125 38 106 39 Z M 211 39 L 207 46 L 209 46 L 211 42 L 211 39 Z M 279 39 L 270 56 L 267 59 Q 272 64 282 66 Q 291 68 294 63 L 293 56 L 287 44 L 283 39 L 279 39 Z M 164 40 Q 159 44 152 45 Q 149 47 150 54 Q 151 55 154 55 L 166 41 L 164 40 Z M 170 40 L 155 57 L 166 61 Q 179 60 187 55 L 186 53 Q 181 43 170 40 Z M 149 45 L 146 49 Q 146 52 148 52 L 150 46 L 149 45 Z M 143 46 Q 143 50 145 47 L 143 46 Z M 216 47 L 213 48 L 210 52 Q 211 55 209 57 L 213 60 L 219 61 L 220 62 L 232 59 Q 231 56 233 55 L 232 53 Q 227 47 216 47 Z M 244 47 L 240 49 L 235 55 L 236 58 L 241 54 L 245 49 Q 246 46 244 47 Z M 207 49 L 204 53 L 205 54 L 208 50 L 207 49 Z M 202 51 L 200 53 L 201 55 L 202 53 L 202 51 Z M 145 52 L 140 58 L 140 60 L 144 64 L 146 64 L 150 61 Q 149 54 145 52 Z M 197 53 L 191 57 L 193 62 Q 195 65 197 61 L 197 53 Z M 188 57 L 182 60 Q 177 59 175 62 L 171 62 L 170 63 L 160 63 L 159 62 Q 153 61 151 63 L 147 69 Q 153 76 164 79 L 175 79 Q 182 77 188 72 L 193 66 L 189 59 Q 190 56 188 57 Z M 210 60 L 209 63 L 214 63 Q 211 62 210 60 Z M 197 65 L 196 69 L 197 69 L 197 65 Z M 143 69 Q 133 76 128 87 L 129 88 Q 137 81 143 71 L 143 69 Z " /><path fill="rgb(231,245,230)" stroke="rgb(231,245,230)" stroke-width="1" opacity="1" d="M 583.5 10 Q 590.5 8.5 592 12.5 L 592 18.5 Q 590.3 19.2 591 22.5 Q 587.7 31.2 581 36.5 L 582.5 37 Q 589.4 28.9 598.5 23 L 604.5 20 L 608.5 20 L 611 22.5 L 613 28.5 L 613 49 L 617 48 L 629 24 Q 632.3 22.7 631 27.5 L 625 45.5 L 626.5 45 Q 641.7 43.3 647.5 51 Q 650.8 45.3 659.5 45 L 661 47.5 L 658 52.5 L 659.5 52 L 663.5 51 L 667 53.5 L 667.5 57 L 668.5 56 L 675 55.5 Q 671.2 51.3 670 44.5 L 669.5 27 Q 661.9 31.1 661 40 Q 664 39 663 42 Q 660 42.8 659 40.5 Q 661.9 27.9 671.5 22 Q 674.5 21.5 673 28.5 L 672 29.5 L 672 43.5 Q 673.2 51.8 678.5 56 L 682 53.5 L 688 39.5 L 690.5 37 L 694.5 36 Q 699.3 37.7 702 41.5 L 709 56.5 L 709 64.5 L 705.5 67 L 696.5 68 L 695.5 67 Q 690.4 67.6 687.5 66 Q 680.8 63.2 676.5 58 L 669.5 58 L 666.5 59 Q 664.2 57.8 664.5 54 L 659.5 61 L 657 59.5 Q 657.8 57.3 655.5 58 L 653.5 60 Q 650.6 61.6 645.5 61 L 641.5 63 L 630.5 64 L 629.5 65 L 621 65 Q 619.1 61.9 619.5 55 L 615.5 60 L 613 60 L 613 66.5 L 612 67.5 L 611.5 80 L 610 78.5 L 610 75.5 L 609 74.5 L 608 68 Q 605.3 66.9 606 69.5 Q 601 75.5 593.5 79 L 587.5 80 L 586.5 81 L 576.5 81 L 568.5 78 L 559.5 70 L 558 70 Q 552.6 81.9 542.5 90 Q 539.5 90.5 539 88.5 L 539 86.5 L 542 80.5 L 556 65.5 L 551.5 60 L 538.5 74 Q 531.9 79.9 522.5 83 Q 516.6 85.1 507.5 84 Q 501.6 82.4 498 78.5 Q 492.7 72.3 493 60.5 L 497 48.5 L 503.5 42 L 516.5 37 L 531.5 37 Q 540.2 39.8 545 46.5 L 551.5 56 L 556 50.5 L 551.5 45 Q 541.1 42.9 535 36.5 L 535.5 35 L 543.5 40 L 547 41 L 547 39.5 L 541 31.5 L 541 29 Q 543.7 27.9 543 30.5 L 552.5 43 Q 559.2 44.8 561 41.5 Q 565.7 29.2 573 19.5 L 581.5 11 L 583.5 10 Z M 585 12 L 583 13 L 575 21 L 563 42 L 564 43 Q 568 38 578 37 Q 588 30 590 14 Q 589 11 585 12 Z M 606 22 L 603 23 L 592 31 L 585 38 L 585 39 Q 590 38 593 42 Q 599 46 603 54 L 611 50 L 611 30 L 609 24 Q 609 22 606 22 Z M 518 39 L 505 44 Q 498 48 496 57 L 496 70 L 500 78 L 509 82 L 518 82 L 519 81 L 525 80 L 538 72 L 550 59 Q 548 51 543 48 Q 539 42 531 39 L 518 39 Z M 578 39 Q 574 43 567 44 Q 563 47 563 53 L 567 55 L 580 40 L 578 39 Z M 624 39 L 620 46 L 623 46 Q 622 43 624 43 L 624 39 Z M 692 39 Q 687 45 685 53 L 682 57 Q 679 56 680 59 L 692 65 L 705 65 L 707 64 L 707 58 Q 705 49 700 43 Q 698 38 692 39 Z M 583 40 L 571 53 L 569 57 L 574 59 Q 577 58 579 60 Q 592 60 600 55 L 598 51 Q 593 43 583 40 Z M 555 45 L 555 47 Q 557 50 558 47 Q 559 44 555 45 Z M 562 45 L 559 49 L 561 51 L 562 50 Q 561 46 563 46 L 562 45 Z M 628 47 Q 627 49 624 48 L 623 58 L 630 61 L 638 61 L 639 60 L 645 59 Q 647 58 646 54 Q 642 45 628 47 Z M 657 47 L 653 49 Q 648 51 648 57 L 650 57 L 654 54 L 658 49 Q 659 46 657 47 Z M 620 49 L 617 53 L 618 54 L 621 50 L 620 49 Z M 615 51 Q 613 52 613 55 Q 614 56 615 54 L 615 51 Z M 558 52 L 553 59 L 558 64 L 562 62 L 564 59 L 562 56 L 558 52 Z M 610 53 Q 608 56 604 55 L 608 63 L 611 59 Q 612 52 610 53 Z M 601 57 L 591 61 L 580 62 L 579 63 L 570 62 L 569 61 L 564 63 L 560 68 Q 566 77 579 79 Q 594 79 602 71 L 606 66 L 603 59 L 601 57 Z M 622 60 L 624 63 L 628 63 L 622 60 Z M 556 69 Q 547 76 542 86 L 543 87 Q 551 80 556 71 L 556 69 Z " /><path fill="#1a1a1a" stroke="#1a1a1a" stroke-width="1" opacity="1" d="M 196.5 65 L 197 68.5 L 196 68.5 L 196.5 65 Z " /></svg>`

// ─── HTML generator ────────────────────────────────────────────────────────

/**
 * Generate a fully-styled prescription HTML document.
 * Call this, then pass the result to `generateScriptPdfBuffer` or render it
 * in the browser for print-to-PDF.
 */
export function generateScriptHtml(script: ScriptData): string {
  const medications = Array.isArray(script.medications)
    ? script.medications.filter(
        (m: MedicationItem) => m && m.name && m.name.trim() !== '',
      )
    : []

  const itemCount = medications.length
  const today = new Date().toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  // Build medication table rows
  const tableRows =
    itemCount > 0
      ? medications
          .map(
            (m, i) => `
          <tr>
            <td style="padding: 8px 12px; border: 1px solid #ccc; font-size: 13px;">${i + 1}.</td>
            <td style="padding: 8px 12px; border: 1px solid #ccc; font-size: 13px; font-weight: 600;">${escHtml(m.name)}</td>
            <td style="padding: 8px 12px; border: 1px solid #ccc; font-size: 13px;">${escHtml(m.dosage ?? '—')}</td>
            <td style="padding: 8px 12px; border: 1px solid #ccc; font-size: 13px; text-align: center;">${m.quantity ?? '—'}</td>
            <td style="padding: 8px 12px; border: 1px solid #ccc; font-size: 13px; text-align: center;">${m.refills ?? 0}</td>
          </tr>`,
          )
          .join('')
      : ''

  const hasMedications = itemCount > 0

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Prescription — ${escHtml(script.patientName)}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&display=swap');
    @page { margin: 20mm 15mm; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif;
      color: #1a1a1a;
      background: #fff;
      line-height: 1.5;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .page {
      max-width: 210mm;
      margin: 0 auto;
      padding: 40px 40px 30px;
      background: #fff;
      position: relative;
    }
    /* Decorative top border */
    .top-border {
      height: 6px;
      background: linear-gradient(90deg, #0d6b4f 0%, #1a9e7a 50%, #0d6b4f 100%);
      border-radius: 3px;
      margin-bottom: 28px;
    }
    /* Header */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 24px;
      padding-bottom: 20px;
      border-bottom: 2px solid #e8e8e8;
    }
    .header-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .practice-info h1 {
      font-size: 20px;
      font-weight: 700;
      color: #0d6b4f;
      letter-spacing: -0.3px;
    }
    .practice-info .doctor-name {
      font-size: 14px;
      font-weight: 600;
      color: #333;
      margin-top: 2px;
    }
    .practice-info .quals {
      font-size: 11px;
      color: #666;
    }
    .header-right {
      text-align: right;
      font-size: 11px;
      color: #555;
      line-height: 1.6;
    }
    .header-right strong {
      color: #333;
    }
    /* Title */
    .rx-title {
      text-align: center;
      margin-bottom: 24px;
    }
    .rx-title h2 {
      font-size: 22px;
      font-weight: 700;
      color: #0d6b4f;
      letter-spacing: 1px;
      text-transform: uppercase;
    }
    .rx-title p {
      font-size: 11px;
      color: #888;
      margin-top: 2px;
    }
    /* Patient info section */
    .patient-section {
      background: #f7fbf9;
      border: 1px solid #d4e8df;
      border-radius: 8px;
      padding: 16px 20px;
      margin-bottom: 20px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px 24px;
      font-size: 13px;
    }
    .patient-section .label {
      color: #666;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 600;
    }
    .patient-section .value {
      color: #1a1a1a;
      font-weight: 500;
    }
    .patient-section .full-width {
      grid-column: 1 / -1;
    }
    /* Medication table */
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 16px;
    }
    thead th {
      background: #0d6b4f;
      color: #fff;
      padding: 10px 12px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      text-align: left;
    }
    thead th:first-child { border-radius: 6px 0 0 0; }
    thead th:last-child { border-radius: 0 6px 0 0; }
    tbody tr:nth-child(even) { background: #f9fdfb; }
    tbody tr:hover { background: #edf7f2; }
    /* Checkboxes */
    .checkbox-row {
      display: flex;
      gap: 24px;
      margin: 16px 0 12px;
      font-size: 13px;
    }
    .checkbox-row label {
      display: flex;
      align-items: center;
      gap: 6px;
      cursor: default;
    }
    .checkbox-row input[type="checkbox"] {
      width: 16px;
      height: 16px;
      accent-color: #0d6b4f;
    }
    /* Special instructions */
    .instructions-box {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 12px 16px;
      margin: 12px 0 16px;
      min-height: 50px;
      font-size: 13px;
    }
    .instructions-box .label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #666;
      font-weight: 600;
      margin-bottom: 4px;
    }
    /* Signature & stamp */
    .signature-area {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-top: 20px;
      padding-top: 16px;
      border-top: 1px solid #e8e8e8;
    }
    .signature-line {
      flex: 1;
    }
    .signature-line .sig-label {
      font-size: 11px;
      color: #888;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .signature-line .sig-space {
      margin-top: 4px;
      width: 240px;
      border-bottom: 1px solid #333;
      padding-bottom: 2px;
    }
    .stamp-area {
      text-align: center;
    }

    .stamp-label {
      font-size: 9px;
      color: #888;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
    /* Footer / tamper-proof */
    .footer {
      margin-top: 24px;
      padding: 12px 16px;
      background: #fafafa;
      border-radius: 6px;
      border: 1px solid #eee;
    }
    .footer p {
      font-size: 11px;
      color: #666;
      text-align: center;
      font-style: italic;
    }
    .footer .tamper-note {
      color: #c0392b;
      font-weight: 600;
      font-style: normal;
    }
    .item-count-badge {
      display: inline-block;
      background: #0d6b4f;
      color: #fff;
      font-size: 12px;
      font-weight: 600;
      padding: 2px 12px;
      border-radius: 12px;
      margin: 4px 0 8px;
    }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .page { padding: 0; }
    }
  </style>
</head>
<body>
  <div class="page">
    <!-- Decorative top border -->
    <div class="top-border"></div>

    <!-- Header -->
    <div class="header">
      <div class="header-left">
        <img src="https://alientomd.com/logo-icon.svg" alt="Aliento" style="width:56px;height:56px;border-radius:12px;" />
        <div class="practice-info">
          <h1>${escHtml(DOCTOR.practiceName)}</h1>
          <div class="doctor-name">${escHtml(DOCTOR.name)}</div>
          <div class="quals">${escHtml(DOCTOR.qualifications)}</div>
        </div>
      </div>
      <div class="header-right">
        <strong>Practice No:</strong> ${escHtml(DOCTOR.practiceNo)}<br />
        <strong>MP No:</strong> ${escHtml(DOCTOR.mpNo)}<br />
        <span>${escHtml(DOCTOR.address)}</span>
      </div>
    </div>

    <!-- Prescription title -->
    <div class="rx-title">
      <h2>Medical Prescription</h2>
      <p>${today}</p>
    </div>

    <!-- Patient details -->
    <div class="patient-section">
      <div>
        <div class="label">Patient Name</div>
        <div class="value">${escHtml(script.patientName)}</div>
      </div>
      <div>
        <div class="label">ID Number</div>
        <div class="value">${escHtml(script.patientIdNumber ?? '—')}</div>
      </div>
      <div>
        <div class="label">Cell</div>
        <div class="value">${escHtml(script.patientCell ?? '—')}</div>
      </div>
      <div>
        <div class="label">Email</div>
        <div class="value">${escHtml(script.patientEmail ?? '—')}</div>
      </div>
      ${
        script.patientAddress
          ? `<div class="full-width">
              <div class="label">Address</div>
              <div class="value">${escHtml(script.patientAddress)}</div>
            </div>`
          : ''
      }
    </div>

    <!-- Medication table (only if there are items) -->
    ${
      hasMedications
        ? `
    <table>
      <thead>
        <tr>
          <th style="width: 36px;">#</th>
          <th>Medication / Item</th>
          <th style="width: 30%;">Dosage</th>
          <th style="width: 10%; text-align: center;">Qty</th>
          <th style="width: 10%; text-align: center;">Refills</th>
        </tr>
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
    </table>
    <div class="item-count-badge">Total items: ${itemCount}</div>`
        : '<p style="color: #999; font-style: italic; text-align: center; padding: 20px 0;">No medications listed on this prescription.</p>'
    }

    <!-- Dispense checkboxes -->
    <div class="checkbox-row">
      <label>
        <input type="checkbox" checked disabled /> Dispense As Written (DAW)
      </label>
      <label>
        <input type="checkbox" disabled /> May Substitute
      </label>
    </div>

    <!-- Special instructions -->
    <div class="instructions-box">
      <div class="label">Special Instructions</div>
      <div>${escHtml(script.specialInstructions ?? 'None')}</div>
    </div>

    <!-- Signature & stamp -->
    <div class="signature-area">
      <div class="signature-line">
        <div class="sig-label">Prescriber Signature</div>
        <div class="sig-space"></div>
        <div style="margin-top: -4px;">
          ${SIGNATURE_SVG}
        </div>
      </div>
      <div class="stamp-area">
        <svg width="120" height="120" viewBox="0 0 120 120" style="display:block;margin:0 auto 4px;">
          <defs>
            <path id="arc-top" d="M 18,60 A 42,42 0 1,1 102,60" />
            <path id="arc-bot" d="M 18,60 A 42,42 0 0,0 102,60" />
          </defs>
          <circle cx="60" cy="60" r="56" fill="none" stroke="#0d6b4f" stroke-width="2" />
          <circle cx="60" cy="60" r="49" fill="none" stroke="#0d6b4f" stroke-width="0.6" opacity="0.4" />
          <text font-family="'Inter',sans-serif" font-size="6" fill="#0d6b4f" font-weight="700" letter-spacing="2">
            <textPath href="#arc-top" startOffset="50%" text-anchor="middle">ALIENTO HEALTH</textPath>
          </text>
          <text font-family="'Inter',sans-serif" font-size="5" fill="#0d6b4f" font-weight="600" letter-spacing="1.5">
            <textPath href="#arc-bot" startOffset="50%" text-anchor="middle">MEDICAL PRACTITIONER</textPath>
          </text>
          <path d="M 60,37 Q 68,47 60,57 Q 52,47 60,37" fill="#0d6b4f" opacity="0.85" />
          <text x="60" y="70" text-anchor="middle" font-family="'Inter',sans-serif" font-size="6" fill="#0d6b4f" font-weight="700">Dr L Adonis</text>
          <text x="60" y="78" text-anchor="middle" font-family="'Inter',sans-serif" font-size="4.5" fill="#0d6b4f">MBBCH · MBA · PhD</text>
          <text x="60" y="85" text-anchor="middle" font-family="'Inter',sans-serif" font-size="3.5" fill="#0d6b4f" opacity="0.7">MP0531502</text>
        </svg>
        <div class="stamp-label">Rx #${escHtml(script.id.slice(0, 8).toUpperCase())}</div>
      </div>
    </div>

    <!-- Footer / tamper-proof note -->
    <div class="footer">
      <p>
        <span class="tamper-note">⚠ Tamper-Proof:</span>
        This prescription contains <strong>${itemCount} medication(s)</strong>.
        No further items have been prescribed.
      </p>
      ${
        script.type
          ? `<p style="margin-top: 4px; font-size: 10px; color: #999;">Type: ${escHtml(script.type)}</p>`
          : ''
      }
    </div>
  </div>
</body>
</html>`
}

// ─── PDF buffer conversion (pdfkit) ─────────────────────────────────────────

const PDFDocument = require('pdfkit')

/**
 * Generate a real A4 PDF buffer for a prescription using pdfkit.
 */
export function generateScriptPdfBuffer(script: ScriptData): Promise<Buffer> {
  const doc = new PDFDocument({ size: 'A4', margin: 50 })
  const buffers: Buffer[] = []

  doc.on('data', (chunk: Buffer) => buffers.push(chunk))

  return new Promise<Buffer>((resolve, reject) => {
    doc.on('end', () => resolve(Buffer.concat(buffers)))
    doc.on('error', reject)

    const pageWidth = doc.page.width
    const leftMargin = doc.page.margins.left
    const rightMargin = doc.page.margins.right
    const contentWidth = pageWidth - leftMargin - rightMargin
    const brandColor = '#0d6b4f'
    const lightBg = '#f7fbf9'
    const borderColor = '#d4e8df'

    // ── Helper functions ──────────────────────────────────────────────
    function brandRect(y: number, h: number) {
      doc.rect(leftMargin, y, contentWidth, h).fill(brandColor)
    }

    function sectionLabel(text: string, x: number, y: number) {
      doc.fontSize(9).fillColor('#666').font('Helvetica-Bold')
      doc.text(text.toUpperCase(), x, y, { continued: false })
    }

    function sectionValue(text: string, x: number, y: number) {
      doc.fontSize(11).fillColor('#1a1a1a').font('Helvetica')
      doc.text(text || '—', x, y, { continued: false })
    }

    // ── Top decorative line ──────────────────────────────────────────
    doc.rect(leftMargin, 30, contentWidth, 4).fill(brandColor)

    // ── Header ────────────────────────────────────────────────────────
    // Logo circle
    doc.circle(leftMargin + 28, 70, 24).fill(brandColor)
    doc.fontSize(14).fillColor('#fff').font('Helvetica-Bold')
    doc.text('AH', leftMargin + 18, 60, { width: 20, align: 'center' })

    // Practice name & doctor
    doc.fontSize(16).fillColor(brandColor).font('Helvetica-Bold')
    doc.text(DOCTOR.practiceName, leftMargin + 60, 50)
    doc.fontSize(11).fillColor('#333').font('Helvetica-Bold')
    doc.text(DOCTOR.name, leftMargin + 60, 70)
    doc.fontSize(9).fillColor('#666').font('Helvetica')
    doc.text(DOCTOR.qualifications, leftMargin + 60, 85)

    // Right-aligned practice info
    const rightX = leftMargin + contentWidth
    doc.fontSize(9).fillColor('#555').font('Helvetica')
    doc.text(`Practice No: ${DOCTOR.practiceNo}`, rightX - 150, 50, { width: 150, align: 'right' })
    doc.text(`MP No: ${DOCTOR.mpNo}`, rightX - 150, 63, { width: 150, align: 'right' })
    doc.text(DOCTOR.address, rightX - 150, 76, { width: 150, align: 'right' })

    // ── Separator line ───────────────────────────────────────────────
    const headerBottom = 110
    doc.moveTo(leftMargin, headerBottom).lineTo(rightX, headerBottom).strokeColor('#e8e8e8').lineWidth(1).stroke()

    // ── Title ─────────────────────────────────────────────────────────
    const titleY = headerBottom + 20
    doc.fontSize(18).fillColor(brandColor).font('Helvetica-Bold')
    doc.text('MEDICAL PRESCRIPTION', leftMargin, titleY, { width: contentWidth, align: 'center' })
    const today = new Date().toLocaleDateString('en-ZA', {
      year: 'numeric', month: 'long', day: 'numeric',
    })
    doc.fontSize(10).fillColor('#888').font('Helvetica')
    doc.text(today, leftMargin, titleY + 20, { width: contentWidth, align: 'center' })

    // ── Patient section ───────────────────────────────────────────────
    const patientY = titleY + 50
    doc.roundedRect(leftMargin, patientY, contentWidth, 80, 6).fill(lightBg)
    doc.roundedRect(leftMargin, patientY, contentWidth, 80, 6).stroke(borderColor)

    const pCol1 = leftMargin + 16
    const pCol2 = leftMargin + contentWidth / 2 + 8
    const pRow1 = patientY + 12
    const pRow2 = patientY + 40

    sectionLabel('Patient Name', pCol1, pRow1)
    sectionValue(script.patientName, pCol1, pRow1 + 12)
    sectionLabel('ID Number', pCol2, pRow1)
    sectionValue(script.patientIdNumber ?? '—', pCol2, pRow1 + 12)
    sectionLabel('Cell', pCol1, pRow2)
    sectionValue(script.patientCell ?? '—', pCol1, pRow2 + 12)
    sectionLabel('Email', pCol2, pRow2)
    sectionValue(script.patientEmail ?? '—', pCol2, pRow2 + 12)

    // ── Medication table ─────────────────────────────────────────────
    const meds = Array.isArray(script.medications)
      ? script.medications.filter((m) => m && m.name && m.name.trim() !== '')
      : []

    const tableY = patientY + 100
    const colWidths = [30, contentWidth * 0.35, contentWidth * 0.25, 60, 60]
    const colStarts = [leftMargin]
    for (let i = 1; i < colWidths.length; i++) {
      colStarts.push(colStarts[i - 1] + colWidths[i - 1])
    }

    // Table header
    const headerH = 24
    brandRect(tableY, headerH)
    doc.fontSize(9).fillColor('#fff').font('Helvetica-Bold')
    const headers = ['#', 'Medication / Item', 'Dosage', 'Qty', 'Refills']
    headers.forEach((h, i) => {
      doc.text(h, colStarts[i] + 6, tableY + 7, {
        width: colWidths[i] - 12,
        align: i >= 3 ? 'center' : 'left',
      })
    })

    // Table rows
    let rowY = tableY + headerH
    const rowH = 22
    meds.forEach((m, i) => {
      const bg = i % 2 === 0 ? '#f9fdfb' : '#ffffff'
      doc.rect(leftMargin, rowY, contentWidth, rowH).fill(bg)
      doc.rect(leftMargin, rowY, contentWidth, rowH).stroke('#ccc')

      doc.fontSize(10).fillColor('#1a1a1a').font('Helvetica')
      doc.text(String(i + 1), colStarts[0] + 6, rowY + 6, { width: colWidths[0] - 12, align: 'center' })
      doc.font('Helvetica-Bold')
      doc.text(m.name, colStarts[1] + 6, rowY + 6, { width: colWidths[1] - 12 })
      doc.font('Helvetica')
      doc.text(m.dosage ?? '—', colStarts[2] + 6, rowY + 6, { width: colWidths[2] - 12 })
      doc.text(String(m.quantity ?? '—'), colStarts[3] + 6, rowY + 6, { width: colWidths[3] - 12, align: 'center' })
      doc.text(String(m.refills ?? 0), colStarts[4] + 6, rowY + 6, { width: colWidths[4] - 12, align: 'center' })
      rowY += rowH
    })

    // ── Special instructions ──────────────────────────────────────────
    const instrY = rowY + 16
    doc.roundedRect(leftMargin, instrY, contentWidth, 50, 6).stroke('#ddd')
    sectionLabel('Special Instructions', leftMargin + 12, instrY + 8)
    doc.fontSize(10).fillColor('#1a1a1a').font('Helvetica')
    doc.text(script.specialInstructions || 'None', leftMargin + 12, instrY + 22, {
      width: contentWidth - 24,
    })

    // ── Signature & stamp ─────────────────────────────────────────────
    const sigY = instrY + 70
    doc.moveTo(leftMargin, sigY).lineTo(rightX, sigY).strokeColor('#e8e8e8').lineWidth(1).stroke()

    doc.fontSize(9).fillColor('#888').font('Helvetica-Bold')
    doc.text('PRESCRIBER SIGNATURE', leftMargin, sigY + 8)

    // Render signature SVG inline
    try {
      const SVGtoPDF = require('svg-to-pdfkit')
      SVGtoPDF(doc, SIGNATURE_SVG, leftMargin, sigY + 12, { preserveAspectRatio: 'xMinYMin meet', width: 200 })
    } catch {
      doc.fontSize(10).fillColor('#666').font('Helvetica')
      doc.text(DOCTOR.name, leftMargin, sigY + 20)
    }

    // Stamp area
    const stampX = rightX - 100
    doc.fontSize(7).fillColor(brandColor).font('Helvetica-Bold')
    doc.text('ALIENTO HEALTH', stampX, sigY + 4, { width: 80, align: 'center' })
    doc.fontSize(6).fillColor('#666').font('Helvetica')
    doc.text(`MP ${DOCTOR.mpNo}`, stampX, sigY + 14, { width: 80, align: 'center' })
    doc.roundedRect(stampX, sigY + 22, 80, 30, 4).stroke(brandColor)
    doc.fontSize(8).fillColor(brandColor).font('Helvetica-Bold')
    doc.text('Dr L Adonis', stampX + 4, sigY + 28, { width: 72, align: 'center' })
    doc.fontSize(6).fillColor('#666').font('Helvetica')
    doc.text(DOCTOR.qualifications.slice(0, 30), stampX + 4, sigY + 40, { width: 72, align: 'center' })
    doc.fontSize(6).fillColor('#888').font('Helvetica')
    doc.text(`Rx #${script.id.slice(0, 8).toUpperCase()}`, stampX + 4, sigY + 48, { width: 72, align: 'center' })

    // ── Footer ────────────────────────────────────────────────────────
    const footerY = Math.max(sigY + 80, doc.y + 20)
    doc.roundedRect(leftMargin, footerY, contentWidth, 40, 6).fill('#fafafa')
    doc.roundedRect(leftMargin, footerY, contentWidth, 40, 6).stroke('#eee')
    doc.fontSize(9).fillColor('#666').font('Helvetica-Oblique')
    doc.text(
      `Tamper-Proof: This prescription contains ${meds.length} medication(s). No further items have been prescribed.`,
      leftMargin + 12,
      footerY + 8,
      { width: contentWidth - 24, align: 'center' },
    )
    if (script.type) {
      doc.fontSize(8).fillColor('#999').font('Helvetica')
      doc.text(`Type: ${script.type}`, leftMargin + 12, footerY + 26, { width: contentWidth - 24, align: 'center' })
    }

    doc.end()
  })
}

// ─── Email wrapper ─────────────────────────────────────────────────────────

const EMAIL_BRAND_COLOR = '#0d6b4f'

/**
 * Wraps the prescription HTML inside a minimal email template suitable for
 * sending via Resend or any transactional email provider.
 *
 * Used by `src/app/api/scripts/generate/route.ts`.
 */
export function generateScriptEmailHtml(
  script: ScriptData,
  scriptHtml: string,
): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Prescription — Aliento Health</title>
</head>
<body style="margin:0;padding:0;background:#f4f7f6;font-family:'Inter','Segoe UI',sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7f6;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <!-- Card -->
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.06);">
          <!-- Header -->
          <tr>
            <td style="background:${EMAIL_BRAND_COLOR};padding:24px 32px;text-align:center;">
              <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;letter-spacing:-0.3px;">Aliento Health</h1>
              <p style="margin:4px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">Your prescription is ready</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 16px;font-size:15px;color:#333;">
                Dear <strong>${escHtml(script.patientName)}</strong>,
              </p>
              <p style="margin:0 0 20px;font-size:14px;color:#555;line-height:1.6;">
                Please find your prescription from Dr Leegale Adonis attached below.
                You may print this prescription or present it electronically at your pharmacy.
              </p>

              <!-- Embedded prescription -->
              <div style="border:1px solid #e0e0e0;border-radius:8px;overflow:hidden;">
                ${scriptHtml}
              </div>

              <hr style="border:none;border-top:1px solid #e8e8e8;margin:24px 0;" />

              <p style="margin:0 0 4px;font-size:12px;color:#999;text-align:center;">
                Aliento Health &middot; ${escHtml(DOCTOR.address)}
              </p>
              <p style="margin:0;font-size:11px;color:#bbb;text-align:center;">
                This is an automated message. Do not reply directly.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function escHtml(s: unknown): string {
  if (s == null) return ''
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
}
