import { ProductSalesRecord, MonthlyVolumeSummary, BrandType, BottleSize } from '../types';

export const RAW_PODA_CSV = `,60 ML Bequ,12.987,35.115,32.278,36.747,22.871,21.592,25.687,187.277,60 ML,30ML,15ML
,60 ML Orama,11.360,41.157,32.364,56.380,21.725,16.090,20.460,199.536,,,
,30ML Bequ,9.721,55.271,48.946,56.194,34.045,34.465,56.014,294.656,60 ML,30ML,15ML
,30ML Orama,4.257,29.112,24.093,48.170,23.019,23.969,24.789,177.409,,,
Volume Sales,,38.355,160.655,137.694,197.491,101.660,97.621,127.424,860.900,386.813,474.057,30
No,PRODUCTS,JAN,FEB,MAR,APR,MEI,JUNI,JULI,JUMLAH,,,
1,BEQU BEVERAGE COLA FB,20,,,,,,,20,20,,
2,BEQU BEVERAGE COLA SALTNIC 30ML,20,,,,,,,20,,20,
3,BEQU BEVERAGE LEMONADE FB,,,,,,,,0,-,,
4,BEQU BEVERAGE LEMONADE SALTNIC 30ML,10,,1,,,,,11,,11,
5,BEQU BEVERAGE TEA FB,,,,,,,,0,-,,
6,BEQU BEVERAGE TEA SALTNIC 30ML,,,,,,,,0,,-,
7,Bequ Honeydew,905,3.565,2.520,3.185,1.730,2.250,2.523,16.678,16.678,,
8,Salt Bequ Honeydew 30Ml,824,4.346,3.833,4.059,2.690,3.225,3.456,22.433,,22.433,
9,Bequ Pomegrenate,70,,,,,,,70,70,,
10,Salt Bequ Pomegrenate 30Ml,125,,,,,,30,155,,155,
11,Bequ Mango,1.781,4.275,3.980,4.660,3.110,3.120,3.191,24.117,24.117,,
12,Salt Bequ Manggo 30Ml,1.067,5.580,6.235,5.820,3.625,4.855,5.051,32.233,,32.233,
13,Salt Bequ Manggo 15Ml,,,,,,,,0,,,-
14,Bequ Watermelon,335,1.970,1.920,1.415,1.240,955,1.101,8.936,8.936,,
15,Salt Bequ Watermelon 30Ml,265,2.415,2.314,1.995,935,1.028,2.301,11.253,,11.253,
16,Bequ Blackcurrant,1.105,3.625,2.585,3.945,1.800,2.495,2.583,18.138,18.138,,
17,Salt Bequ Blackcurrant 30Ml,670,4.616,4.055,4.313,2.630,4.120,3.802,24.206,,24.206,
18,Bequ strawberry,905,3.825,3.220,3.690,2.590,2.250,2.801,19.281,19.281,,
19,Salt Bequ strawberry 30Ml,805,5.050,4.896,4.206,3.305,4.243,4.050,26.555,,26.555,
20,Salt Bequ strawberry 15Ml,,,,,,,,0,,,-
21,Bequ Lights V1 60ml,2.036,3.825,4.450,5.311,3.100,2.075,4.242,25.039,25.039,,
22,Salt Bequ Light V1 30Ml,1.385,5.400,4.340,6.265,4.445,3.880,4.995,30.710,,30.710,
23,Bequ Lights V2 60ml,1.345,3.106,2.478,3.973,2.425,2.820,1.936,18.083,18.083,,
24,Salt Bequ Light V2 30Ml,810,4.137,2.856,5.129,3.050,3.086,3.322,22.390,,22.390,
25,Bequ Lights V3 60ml,2.235,3.790,4.550,4.959,3.510,3.058,3.232,25.334,25.334,,
26,Salt Bequ Light V3 30Ml,1.435,5.518,2.904,7.424,5.255,2.690,6.195,31.421,,31.421,
27,Salt Bequ Light V3 15Ml,,,,,,,,0,,,-
28,Bequ Light Mix V4 60Ml,450,1.560,1.385,1.390,395,140,338,5.658,5.658,,
29,Salt Bequ Light Mix V4 30ML,315,1.860,1.570,1.145,150,215,435,5.690,,5.690,
30,Salt Bequ Light Mix V4 15ML,,,,,,,,0,-,,
31,Bequ Light Mix V5 60Ml,645,1.813,1.535,1.305,1.010,859,1.247,8.414,8.414,,
32,Salt Bequ Light Mix V5 30ML,450,2.326,1.530,1.883,1.200,1.076,1.143,9.608,,9.608,
33,Salt Bequ Light Mix V5 15ML,,,,,,,,0,,-,
34,Bequ Lights V6 60ml,490,1.821,1.515,1.860,785,710,835,8.016,8.016,,
35,Salt Bequ Light V6 30Ml,280,2.185,2.015,2.020,760,710,1.058,9.028,,9.028,
36,Bequ Lights V7 60ml,665,1.940,2.140,1.054,1.176,860,1.658,9.493,9.493,,
37,Salt Bequ Light V7 30Ml,340,2.385,1.172,1.520,870,578,1.205,8.070,,8.070,
38,Bequ Lights V8 60ml,,,,,,,,0,-,,
39,Salt Bequ Light V8 30Ml,,,,,,,4.221,4.221,,4.221,
40,Bequ Lights V9 60ml,,,,,,,,0,-,,
41,Salt Bequ Light V9 30Ml,,,,,,,4.204,4.204,,4.204,
42,Bequ Lights V10 60ml,,,,,,,,0,-,,
43,Salt Bequ Light V10 30Ml,,,,,,,4.154,4.154,,4.154,
44,SALT BEQU APPLE 30ML,85,1.284,1.470,1.385,480,575,747,6.026,,6.026,
45,SALT BEQU GUAVA 30ML,180,613,1.595,1.590,565,700,891,6.134,,6.134,
46,SALT BEQU LYCHEE 30ML,205,1.651,1.915,1.540,1.545,1.110,1.526,9.492,,9.492,
47,SALT BEQU KIWI 30ML,130,1.060,1.420,1.130,340,755,543,5.378,,5.378,
48,SALT BEQU BANANA 30ML,100,1.485,1.270,1.335,620,355,600,5.765,,5.765,
49,SALT BEQU BANANA 15ML,,,,,,,,0,,,-
50,SALT BEQU PEACH 30ML,125,1.370,1.815,1.445,850,549,1.064,7.218,,7.218,
51,SALT BEQU PEACH 15ML,,,,,,,,0,,,-
52,SALT BEQU PINEAPLE 30ML,95,1.670,1.450,1.560,680,655,889,6.999,,6.999,
53,SALT BEQU TOBBACCO APPLE 30ML,,170,130,235,25,30,56,646,,646,
54,SALT BEQU TOBBACCO STRAWBERRY 30ML,,150,160,195,25,30,76,636,,636,
55,BEQU X SENI KANJI V1,,,,,,1.505,474,1.979,,1.979,
56,BEQU MILKY MELON SALT 30ML,,,,,,,,0,,,
57,BEQU MILKY PINEAPPLE SALT 30ML,,,,,,,,0,,,
58,BEQU MILKY STRAWBERRY SALT 30ML,,,,,,,,0,,,
59,ORAMA V1 60ML 1MG,,,,,,,,0,-,,
60,ORAMA V1 60ML 3MG,3.560,7.747,7.505,7.180,3.730,2.910,4.625,37.257,37.257,,
61,ORAMA V1 60ML 6MG,4.170,6.329,5.708,8.799,6.350,4.900,6.943,43.199,43.199,,
62,ORAMA V1 9MG 30ML,70,1.710,1.650,1.190,935,560,804,6.919,,6.919,
63,O RAMA V2 60ML 1MG,,,,,,,,0,0,,
64,O RAMA V2 60ML 3MG,335,1.515,1.295,1.380,465,545,316,5.851,5.851,,
65,O RAMA V2 60ML 6MG,475,2.025,1.365,1.582,820,955,697,7.919,7.919,,
66,ORAMA V3 60ML 1MG,,,,,,,,0,0,,
67,ORAMA V3 60ML 3MG,125,1.645,1.056,970,485,270,226,4.777,4.777,,
68,ORAMA V3 60ML 6MG,445,1.825,1.030,1.242,825,510,883,6.760,6.760,,
69,ORAMA V4 60ML 1MG,,,,,,,,0,,,
70,ORAMA V4 60ML 3MG,,4.867,2.925,,,,,7.792,7.792,,
71,ORAMA V4 60ML 6MG,,4.899,2.980,,,,,7.879,7.879,,
72,ORAMA CREME BRULEE 3MG 60ML,,,,11.658,1.765,705,602,14.730,14.730,,
73,ORAMA CREME BRULEE 6MG 60ML,,,,11.272,1.890,1.075,876,15.113,15.113,,
74,ORAMA G2 V1 3MG 60ML,185,1.210,495,800,225,150,149,3.214,3.214,,
75,ORAMA G2 V1 6MG 60ML,260,1.185,550,680,310,450,274,3.709,3.709,,
76,ORAMA G2 V1 9MG 30ML,,350,274,80,,10,81,795,,795,
77,ORAMA G2 V2 3MG,715,2.635,2.740,2.302,760,550,343,10.045,10.045,,
78,ORAMA G2 V2 6MG,890,2.900,2.775,2.555,1.420,950,978,12.468,12.468,,
79,ORAMA G2 V2 9MG,50,915,630,100,305,90,514,2.604,2.604,,
80,O RAMA V1 PODS FRIENDLY 30ml,2.397,10.325,4.929,14.666,7.580,9.165,10.123,59.185,,59.185,
81,O RAMA V2 PODS FRIENDLY 30ml,360,3.306,3.475,3.365,2.650,2.890,2.639,18.685,,18.685,
82,O RAMA V3 PODS FRIENDLY 30ml,170,2.572,3.048,3.354,1.740,2.275,2.006,15.165,,15.165,
83,O RAMA V4 PODS FRIENDLY 30ml,,4.515,2.299,4.331,2.465,3.120,2.657,19.387,,19.387,
84,O RAMA CRÈME BRULEE PODS FRIENDLY 30ml,,,,13.186,2.314,1.529,1.616,18.645,,18.645,
85,ORAMA G2 V1 PODS FRIENDLY 30ml,170,2.090,2.332,1.818,980,1.215,1.101,9.706,,9.706,
86,ORAMA G2 V2 PODS FRIENDLY 30ml,1.015,2.804,4.581,4.605,3.450,2.120,2.904,21.479,,21.479,
87,SALT O RAMA V1 15ML,30,,,,,,,30,,,30
88,O RAMA BACCO STRAWBERRY 3MG 60ML,40,535,360,436,75,200,280,1.926,1.926,,
89,O RAMA BACCO STRAWBERRY 6MG 60ML,110,525,530,554,135,100,361,2.315,2.315,,
90,O RAMA BACCO STRAWBERRY 9MG 30ML,10,50,150,70,75,110,39,504,,504,
91,O RAMA BACCO STRAWBERRY PODS FRIENDLY 15MG 30ML,55,725,860,960,660,730,541,4.531,,4.531,
92,O RAMA BACCO TEA 3MG 60ML,,220,205,110,75,,3,613,613,,
93,O RAMA BACCO TEA 6MG 60ML,,180,215,130,75,20,101,721,721,,
94,O RAMA BACCO TEA 9MG 30ML,,50,150,45,5,70,100,420,,420,
95,O RAMA BACCO TEA PODS FRIENDLY 15MG 30ML,10,615,345,500,165,175,178,1.988,,1.988,
96,O RAMA BANANA BUTTER TOAST 3MG 60ML,,,,2.065,615,665,854,4.199,4.199,,
97,O RAMA BANANA BUTTER TOAST 6MG 60ML,,,,2.565,1.400,1.045,1.435,6.445,6.445,,
98,BITES V1 PODS FRIENDLY 30ML,,,13,,,,,13,,13,
99,BITES V2 3MG 60ML,,,,,,,,0,-,,
100,BITES V2 6MG 60ML,,,,,,,,0,-,,
101,BITES V2 PODS FRIENDLY 30ML,,,,,,,,0,,-,
102,BITES V2 PODS FRIENDLY 15ML,,,,,,,,0,,,-
103,Tester Bequ Beverage Cola,1,9,,,,,,10,860.900,,
104,Tester Bequ Beverage Lemonade,1,9,,,,,,10,,,
105,Tester Bequ Beverage Tea,1,9,,,,,,10,,,
106,Tester Bequ Blackcurrant,1,9,,,,,,10,,,
107,Tester Bequ Honeydew,1,9,,,,,,10,,,
108,Tester Bequ Light V1,1,9,,,,,,10,,,
109,Tester Bequ Light V2,1,9,,,,,,10,,,
110,Tester Bequ Light V3,1,9,,,,,,10,,,
111,Tester Bequ Light V4,1,9,,,,,,10,,,
112,Tester Bequ Light V5,1,9,,,,,,10,,,
113,Tester Bequ Light V6,,8,,,,,,8,,,
114,Tester Bequ Light V7,,8,,,,,,8,,,
115,Tester Bequ Manggo,1,9,,,,,,10,,,
116,Tester Bequ Pome,1,9,,,,,,10,,,
117,Tester Bequ Strawbery,1,9,,,,,,10,,,
118,Tester Bequ Watermelon,1,9,,,,,,10,,,
119,Tester Creamy Bites,1,9,,,,,,10,,,
120,Tester Bites V2,1,9,,,,,,10,,,
121,Tester Orama G2 V1 3MG,1,9,,,,,,10,,,
122,Tester Orama G2 V2 3MG,1,9,,,,,,10,,,
123,Tester Orama V1 3Mg,1,9,,,,,,10,,,
124,Tester Orama V2 3Mg,1,9,,,,,,10,,,
125,Tester Orama V3 3Mg,1,9,,,,,,10,,,
126,Tester Orama V4 3Mg,,8,,,,,,8,,,
127,Tester Orama Bacco Tea 3MG,1,9,,,,,,10,,,
128,Tester Orama Bacco Strawbery 3MG,1,9,,,,,,10,,,
,,23,231,-,-,-,,,254,"0,00%",,`;

export function cleanNumber(val: string | undefined): number {
  if (!val) return 0;
  const trimmed = val.trim().replace(/^["']|["']$/g, '');
  if (trimmed === '-' || trimmed === '' || trimmed === '0,00%') return 0;
  // If dot is used as thousand separator (e.g. 12.987, 860.900)
  // Check if it matches pattern like 1.234 or 12.345 or 860.900
  const normalized = trimmed.replace(/\./g, '').replace(/,/g, '.');
  const num = parseFloat(normalized);
  return isNaN(num) ? 0 : Math.round(num);
}

export function detectBrand(name: string): BrandType {
  const upper = name.toUpperCase();
  if (upper.includes('TESTER')) return 'Tester';
  if (upper.includes('BEQU')) return 'Bequ';
  if (upper.includes('ORAMA') || upper.includes('O RAMA')) return 'Orama';
  if (upper.includes('BITES')) return 'Bites';
  return 'Other';
}

export function detectSize(name: string): BottleSize {
  const upper = name.toUpperCase();
  if (upper.includes('TESTER')) return 'Tester';
  if (upper.includes('15ML') || upper.includes('15 ML')) return '15ML';
  if (upper.includes('60ML') || upper.includes('60 ML') || upper.includes('FB') || upper.includes('3MG') || upper.includes('6MG')) {
    if (!upper.includes('30ML') && !upper.includes('30 ML') && !upper.includes('PODS') && !upper.includes('SALT')) {
      return '60 ML';
    }
  }
  if (upper.includes('30ML') || upper.includes('30 ML') || upper.includes('SALT') || upper.includes('PODS FRIENDLY') || upper.includes('9MG') || upper.includes('15MG')) {
    return '30ML';
  }
  return '60 ML';
}

export function parsePodaCsv(csvContent: string): {
  products: ProductSalesRecord[];
  monthlyVolumeSummary: MonthlyVolumeSummary[];
} {
  const lines = csvContent.split(/\r?\n/).filter(line => line.trim().length > 0);
  const products: ProductSalesRecord[] = [];
  const summaries: MonthlyVolumeSummary[] = [];

  let headerFound = false;

  for (const line of lines) {
    // Split by comma taking care of potential quotes
    const parts = line.split(',').map(s => s.trim());

    // Check top category summary lines before "No,PRODUCTS..."
    if (!headerFound) {
      if (parts[1] && (parts[1].includes('60 ML Bequ') || parts[1].includes('60 ML Orama') || parts[1].includes('30ML Bequ') || parts[1].includes('30ML Orama'))) {
        summaries.push({
          category: parts[1],
          jan: cleanNumber(parts[2]),
          feb: cleanNumber(parts[3]),
          mar: cleanNumber(parts[4]),
          apr: cleanNumber(parts[5]),
          mei: cleanNumber(parts[6]),
          juni: cleanNumber(parts[7]),
          juli: cleanNumber(parts[8]),
          total: cleanNumber(parts[9]),
        });
        continue;
      }
      if (parts[0] === 'Volume Sales') {
        summaries.push({
          category: 'Total Volume Sales',
          jan: cleanNumber(parts[2]),
          feb: cleanNumber(parts[3]),
          mar: cleanNumber(parts[4]),
          apr: cleanNumber(parts[5]),
          mei: cleanNumber(parts[6]),
          juni: cleanNumber(parts[7]),
          juli: cleanNumber(parts[8]),
          total: cleanNumber(parts[9]),
        });
        continue;
      }
      if (parts[0] === 'No' && parts[1] === 'PRODUCTS') {
        headerFound = true;
        continue;
      }
    } else {
      // Process product line
      const no = parseInt(parts[0], 10);
      const name = parts[1];
      if (!name || isNaN(no)) continue;

      const jan = cleanNumber(parts[2]);
      const feb = cleanNumber(parts[3]);
      const mar = cleanNumber(parts[4]);
      const apr = cleanNumber(parts[5]);
      const mei = cleanNumber(parts[6]);
      const juni = cleanNumber(parts[7]);
      const juli = cleanNumber(parts[8]);
      const totalVolume = cleanNumber(parts[9]) || (jan + feb + mar + apr + mei + juni + juli);

      const brand = detectBrand(name);
      const size = detectSize(name);
      const isTester = brand === 'Tester' || name.toLowerCase().includes('tester');

      // Wholesale price calculation (IDR)
      let estUnitPrice = 0;
      let estHppUnit = 0;

      if (isTester) {
        estUnitPrice = 0; // Tester is distributed free as sample
        estHppUnit = 18000; // Cost of manufacturing sample
      } else if (size === '60 ML') {
        estUnitPrice = 65000;
        estHppUnit = 36500;
      } else if (size === '30ML') {
        estUnitPrice = 55000;
        estHppUnit = 26800;
      } else if (size === '15ML') {
        estUnitPrice = 35000;
        estHppUnit = 16500;
      } else {
        estUnitPrice = 55000;
        estHppUnit = 26800;
      }

      const estRevenue = totalVolume * estUnitPrice;
      const estTotalHpp = totalVolume * estHppUnit;

      products.push({
        no,
        name,
        brand,
        size,
        isTester,
        jan,
        feb,
        mar,
        apr,
        mei,
        juni,
        juli,
        totalVolume,
        estUnitPrice,
        estRevenue,
        estHppUnit,
        estTotalHpp,
      });
    }
  }

  return { products, monthlyVolumeSummary: summaries };
}
