var caltrainServiceData = {

  saturdayTripIds: [421,480,481,484],

  northStops: [
    'Gilroy','San Martin','Morgan Hill','Blossom Hill','Capitol','Tamien','San Jose Diridon','College Park','Santa Clara','Lawrence','Sunnyvale','Mountain View','San Antonio','California Ave','Palo Alto','Menlo Park','Redwood City','San Carlos','Belmont','Hillsdale','Hayward Park','San Mateo','Burlingame','Broadway','Millbrae','San Bruno','So San Francisco','Bayshore','22nd Street','San Francisco'],

  northWeekday: {
    101: [,,,,,262,268,,274,280,284,289,293,297,301,304,310,315,318,322,325,328,332,,337,341,345,352,357,363],
    501: [,,,,,302,309,,315,,323,327,,,335,339,344,,,352,,357,,,363,,,,376,382],
    103: [,,,,,,315,,321,327,331,336,340,344,348,352,357,362,366,370,373,376,380,,385,390,394,400,406,412],
    401: [,,,,,338,344,,350,,358,363,,,370,,377,382,,,,390,393,,398,403,,,414,420],
    105: [,,,,,,354,,360,369,374,379,382,387,391,394,400,404,408,412,415,418,422,,426,431,435,441,446,453],
    701: [,,,,,,359,,,,,373,,,381,,388,,,396,,,,,406,,,,,425],
    301: [,,,,,376,383,,,393,397,402,406,410,414,418,423,,429,433,,,,,441,,448,,,461],
    403: [354,363,369,384,390,397,404,,410,,418,423,,,431,,437,442,,,,450,453,,458,463,,,474,480],
    107: [,,,,,408,414,,420,429,434,439,442,447,451,454,460,464,468,472,475,478,482,,486,491,495,501,506,513],
    703: [,,,,,,419,,,,,433,,,441,,448,,,456,,,,,466,,,,,485],
    303: [391,400,406,421,427,434,443,,,453,457,462,466,470,474,478,483,,489,493,,,,,501,,508,,,521],
    405: [412,421,427,442,448,455,462,466,470,,478,483,,,491,,497,502,,,,510,513,,518,523,,,534,540],
    109: [,,,,,468,474,,480,489,494,499,502,507,511,514,520,524,528,532,535,538,542,,546,551,555,561,566,573],
    705: [,,,,,,479,,,,,493,,,501,,508,,,516,,,,,526,,,,,545],
    305: [,,,,,497,503,,,513,517,522,526,530,534,538,543,,549,553,,,,,561,,568,,,581],
    407: [,,,,,,524,,530,,538,543,,,551,,557,562,,,,570,573,,579,584,,,595,601],
    111: [,,,,,530,536,,542,548,552,557,561,565,569,573,578,583,586,590,593,597,601,,606,610,615,621,627,633],
    503: [,,,,,,583,,589,,596,601,,,609,612,618,,,625,,631,,,638,,,,651,657],
    113: [,,,,,588,594,,600,606,610,615,619,624,628,632,637,642,645,649,652,656,660,,665,670,675,681,687,693],
    505: [,,,,,,643,,649,,656,661,,,669,672,678,,,685,,691,,,698,,,,711,717],
    115: [,,,,,648,654,,660,666,670,675,679,684,688,692,697,702,705,709,712,716,720,,725,730,735,741,747,753],
    507: [,,,,,,703,,709,,716,721,,,729,732,738,,,745,,751,,,758,,,,771,777],
    117: [,,,,,708,714,,720,726,730,735,739,744,748,752,757,762,765,769,772,776,780,,785,790,795,801,807,813],
    509: [,,,,,,763,,769,,776,781,,,789,792,798,,,805,,811,,,818,,,,831,837],
    119: [,,,,,768,774,,780,786,790,795,799,804,808,812,817,822,825,829,832,836,840,,845,850,855,861,867,873],
    511: [,,,,,,823,,829,,836,841,,,849,852,858,,,865,,871,,,878,,,,891,897],
    121: [,,,,,828,834,,840,846,850,855,859,864,868,872,877,882,885,889,892,896,900,,905,910,915,921,927,933],
    513: [,,,,,,883,,889,,896,901,,,909,912,918,,,925,,931,,,938,,,,951,957],
    123: [,,,,,888,894,,900,906,910,915,919,924,928,932,937,942,945,949,952,956,960,,965,970,975,981,987,993],
    307: [,,,,,,922,926,,933,938,943,946,951,955,958,964,,970,974,,,,,982,,989,,998,1003],
    409: [,,,,,,944,,950,,958,963,,,971,,977,982,,,,990,993,,998,1003,,,1014,1020],
    125: [,,,,,948,954,,960,969,974,979,982,987,991,994,1000,1004,1008,1012,1015,1018,1022,,1026,1031,1035,1041,1046,1053],
    707: [,,,,,,959,,,,,973,,,981,,988,,,996,,,,,1006,,,,1020,1025],
    309: [,,,,,,983,,,993,997,1002,1006,1010,1014,1018,1023,,1029,1033,,,,,1041,,1048,,1057,1063],
    411: [,,,,,,1004,,1010,,1018,1023,,,1031,,1037,1042,,,,1050,1053,,1058,1063,,,1074,1080],
    127: [,,,,,1008,1014,,1020,1029,1034,1039,1042,1047,1051,1054,1060,1064,1068,1072,1075,1078,1082,,1086,1091,1095,1101,1106,1113],
    709: [,,,,,,1019,,,,,1033,,,1041,,1048,,,1056,,,,,1066,,,,1080,1085],
    311: [,,,,,,1043,,,1053,1057,1062,1066,1070,1074,1078,1083,,1089,1093,,,,,1101,,1108,,1117,1123],
    413: [,,,,,,1064,,1070,,1078,1083,,,1091,,1097,1102,,,,1110,1113,,1118,1123,,,1134,1140],
    129: [,,,,,1065,1074,,1080,1089,1094,1099,1102,1107,1111,1114,1120,1124,1128,1132,1135,1138,1142,,1146,1151,1155,1161,1167,1174],
    711: [,,,,,,1079,,,,,1093,,,1101,,1108,,,1116,,,,,1126,,,,1140,1145],
    313: [,,,,,1096,1103,,,1113,1117,1122,1126,1130,1134,1138,1143,,1149,1153,,,,,1161,,1168,,1177,1183],
    415: [,,,,,,1124,,1130,,1138,1143,,,1151,,1157,1162,,,,1170,1173,,1178,1183,,,1194,1200],
    131: [,,,,,1130,1136,,1142,1148,1152,1157,1161,1165,1169,1172,1178,1183,1186,1191,1194,1198,1202,,1208,1212,1216,1223,1229,1235],
    515: [,,,,,,1183,,1189,,1196,1201,,,1209,1212,1218,,,1226,,1231,,,1237,,,,1252,1261],
    133: [,,,,,1188,1194,,1200,1206,1210,1215,1219,1223,1227,1230,1237,1241,1245,1250,1254,1259,1262,,1268,1273,1277,1284,1290,1297],
    135: [,,,,,,1214,,1220,1226,1230,1235,1239,1244,1248,1252,1258,1263,1266,1273,1278,1285,1290,,1297,1302,1307,1314,1321,1328],
    137: [,,,,,1238,1244,,1250,1256,1260,1265,1269,1274,1278,1282,1288,1294,1298,1305,1310,1315,1320,,1327,1332,1337,1345,1352,1359],
    139: [,,,,,,1274,,1280,1286,1290,1295,1299,1304,1308,1312,1318,1324,1328,1335,1340,1345,1350,,1357,1362,1367,1374,1381,1388],
    141: [,,,,,1298,1304,,1310,1316,1320,1325,1329,1334,1338,1342,1348,1354,1358,1365,1370,1375,1380,,1387,1392,1397,1405,1412,1419],
    143: [,,,,,,1334,,1340,1346,1350,1355,1359,1364,1368,1372,1378,1384,1388,1395,1400,1405,1410,,1417,1422,1427,1434,1441,1448],
    145: [,,,,,1385,1392,,1398,1404,1408,1413,1417,1421,1426,1430,1436,1441,1445,1449,1452,1456,1459,,1466,1470,1474,1480,1486,1492]},

  northWeekend: {
    221: [,,,,,432,439,,445,451,455,460,463,468,472,475,481,485,489,492,495,499,502,505,509,514,518,524,530,536],
    225: [,,,,,545,552,,558,564,568,574,577,582,586,590,596,601,604,608,611,615,619,622,626,630,634,641,646,652],
    229: [,,,,,605,612,,618,624,628,634,637,642,646,650,656,661,664,668,671,675,679,682,686,690,694,701,706,713],
    233: [,,,,,665,672,,678,684,688,694,697,702,706,710,716,721,724,728,731,735,739,742,746,750,754,761,766,773],
    237: [,,,,,,732,,738,744,748,754,757,762,766,770,776,781,784,788,791,795,799,802,806,810,814,821,826,832],
    241: [,,,,,785,792,,798,804,808,814,817,822,826,830,836,841,844,848,851,855,859,862,866,870,874,881,886,892],
    245: [,,,,,,852,,858,864,868,874,877,882,886,890,896,901,904,908,911,915,919,922,926,930,934,941,946,952],
    249: [,,,,,905,912,,918,924,928,934,937,942,946,950,956,961,964,968,971,975,979,982,986,990,994,1001,1006,1012],
    253: [,,,,,,972,,978,984,988,994,997,1002,1006,1010,1016,1021,1024,1028,1031,1035,1039,1042,1046,1050,1054,1061,1066,1072],
    257: [,,,,,1025,1032,,1038,1044,1048,1054,1057,1062,1066,1070,1076,1081,1084,1088,1091,1095,1099,1102,1106,1110,1114,1121,1126,1132],
    261: [,,,,,,1092,,1098,1104,1108,1114,1117,1122,1126,1130,1136,1141,1144,1148,1151,1155,1159,1162,1166,1170,1174,1181,1186,1192],
    265: [,,,,,1145,1152,,1158,1164,1168,1174,1177,1182,1186,1190,1196,1201,1204,1208,1211,1215,1219,1222,1226,1230,1234,1241,1246,1252],
    269: [,,,,,,1212,,1218,1224,1228,1234,1237,1242,1246,1250,1256,1261,1264,1268,1271,1275,1279,1282,1286,1290,1294,1301,1306,1312],
    273: [,,,,,1265,1272,,1278,1284,1288,1294,1297,1302,1306,1310,1316,1321,1324,1328,1331,1335,1339,1342,1346,1350,1354,1361,1366,1372],
    277: [,,,,,,1339,,1345,1351,1355,1360,1364,1368,1373,1376,1382,1387,1390,1394,1397,1401,1405,1408,1412,1417,1421,1427,1433,1439],
    281: [,,,,,1385,1392,,1398,1404,1408,1414,1417,1422,1426,1430,1436,1441,1444,1448,1451,1455,1459,1462,1466,1470,1474,1481,1486,1492]},

  northModified: {
    601: [,,,,,270,276,,282,288,292,297,301,305,309,312,318,323,326,330,333,336,340,343,346,351,355,361,367,372],
    603: [,,,,,,312,,318,324,328,334,337,342,346,350,356,361,364,368,371,375,379,382,386,390,394,401,406,412],
    605: [,,,,,365,372,,378,384,388,394,397,402,406,410,416,421,424,428,431,435,439,442,446,450,454,461,466,472],
    607: [382,391,397,412,418,425,432,,438,444,448,454,457,462,466,470,476,481,484,488,491,495,499,502,506,510,514,521,526,532],
    609: [,,,,,485,492,,498,504,508,514,517,522,526,530,536,541,544,548,551,555,559,562,566,570,574,581,586,592],
    225: [,,,,,545,552,,558,564,568,574,577,582,586,590,596,601,604,608,611,615,619,622,626,630,634,641,646,652],
    629: [,,,,,,612,,618,624,628,634,637,642,646,650,656,661,664,668,671,675,679,682,686,690,694,701,706,713],
    233: [,,,,,665,672,,678,684,688,694,697,702,706,710,716,721,724,728,731,735,739,742,746,750,754,761,766,773],
    237: [,,,,,,732,,738,744,748,754,757,762,766,770,776,781,784,788,791,795,799,802,806,810,814,821,826,832],
    241: [,,,,,785,792,,798,804,808,814,817,822,826,830,836,841,844,848,851,855,859,862,866,870,874,881,886,892],
    245: [,,,,,,852,,858,864,868,874,877,882,886,890,896,901,904,908,911,915,919,922,926,930,934,941,946,952],
    249: [,,,,,905,912,,918,924,928,934,937,942,946,950,956,961,964,968,971,975,979,982,986,990,994,1001,1006,1012],
    253: [,,,,,,972,,978,984,988,994,997,1002,1006,1010,1016,1021,1024,1028,1031,1035,1039,1042,1046,1050,1054,1061,1066,1072],
    257: [,,,,,1025,1032,,1038,1044,1048,1054,1057,1062,1066,1070,1076,1081,1084,1088,1091,1095,1099,1102,1106,1110,1114,1121,1126,1132],
    261: [,,,,,,1092,,1098,1104,1108,1114,1117,1122,1126,1130,1136,1141,1144,1148,1151,1155,1159,1162,1166,1170,1174,1181,1186,1192],
    265: [,,,,,1145,1152,,1158,1164,1168,1174,1177,1182,1186,1190,1196,1201,1204,1208,1211,1215,1219,1222,1226,1230,1234,1241,1246,1252],
    269: [,,,,,,1212,,1218,1224,1228,1234,1237,1242,1246,1250,1256,1261,1264,1268,1271,1275,1279,1282,1286,1290,1294,1301,1306,1312],
    273: [,,,,,1265,1272,,1278,1284,1288,1294,1297,1302,1306,1310,1316,1321,1324,1328,1331,1335,1339,1342,1346,1350,1354,1361,1366,1372],
    277: [,,,,,,1339,,1345,1351,1355,1360,1364,1368,1373,1376,1382,1387,1390,1394,1397,1401,1405,1408,1412,1417,1421,1427,1433,1439],
    281: [,,,,,1385,1392,,1398,1404,1408,1414,1417,1422,1426,1430,1436,1441,1444,1448,1451,1455,1459,1462,1466,1470,1474,1481,1486,1492]},

  southStops: [
    'San Francisco','22nd Street','Bayshore','So San Francisco','San Bruno','Millbrae','Broadway','Burlingame','San Mateo','Hayward Park','Hillsdale','Belmont','San Carlos','Redwood City','Menlo Park','Palo Alto','California Ave','San Antonio','Mountain View','Sunnyvale','Lawrence','Santa Clara','College Park','San Jose Diridon','Tamien','Capitol','Blossom Hill','Morgan Hill','San Martin','Gilroy'],

  southWeekday: {
    102: [291,296,301,308,312,316,,321,325,328,332,335,339,343,349,353,356,361,365,370,374,380,,387,,,,,,],
    502: [330,335,,,,348,,,355,,360,,,367,373,377,,,384,390,,397,,403,,,,,,],
    104: [339,344,349,356,360,364,,369,373,376,379,383,386,390,396,400,403,408,412,417,425,431,,440,444,,,,,],
    702: [366,371,,,,385,,,,,394,,,401,,409,,,417,,,,,432,,,,,,],
    402: [372,377,,,388,393,,398,402,,,,410,414,,421,,,429,434,,442,,449,,,,,,],
    302: [387,392,,402,,408,,,,,417,421,,427,432,436,440,444,449,454,458,,,468,,,,,,],
    106: [399,404,409,416,420,424,,429,433,436,439,443,446,450,456,460,463,468,472,477,485,491,494,503,508,,,,,],
    704: [426,431,,,,445,,,,,454,,,461,,469,,,477,,,,,492,,,,,,],
    404: [432,437,,,448,453,,458,462,,,,470,474,,481,,,489,494,,502,,509,,,,,,],
    304: [447,452,,462,,468,,,,,477,481,,487,492,496,500,504,509,514,518,,,528,,,,,,],
    108: [459,464,469,476,480,484,,489,493,496,499,503,506,510,516,520,523,528,532,537,545,551,,559,564,,,,,],
    706: [486,491,,,,505,,,,,514,,,521,,529,,,537,,,,,551,,,,,,],
    406: [492,497,,,508,513,,518,522,,,,530,534,,541,,,549,554,,562,,569,,,,,,],
    306: [507,512,,522,,528,,,,,537,541,,547,552,556,560,564,569,574,578,,,588,,,,,,],
    110: [519,524,529,536,540,544,,549,553,556,559,563,567,572,578,581,585,590,594,599,604,610,,618,623,,,,,],
    504: [554,559,,,,574,,,580,,584,,,591,597,600,,,608,613,,620,,628,,,,,,],
    112: [578,583,588,595,599,604,,609,612,616,619,623,627,632,638,641,645,650,654,659,664,670,,678,683,,,,,],
    506: [614,619,,,,634,,,640,,644,,,651,657,660,,,668,673,,680,,688,,,,,,],
    114: [638,643,648,655,659,664,,669,672,676,679,683,687,692,698,701,705,710,714,719,724,730,,738,743,,,,,],
    508: [674,679,,,,694,,,700,,704,,,711,717,720,,,728,733,,740,,748,,,,,,],
    116: [698,703,708,715,719,724,,729,732,736,739,743,747,752,758,761,765,770,774,779,784,790,,798,803,,,,,],
    510: [734,739,,,,754,,,760,,764,,,771,777,780,,,788,793,,800,,808,,,,,,],
    118: [758,763,768,775,779,784,,789,792,796,799,803,807,812,818,821,825,830,834,839,844,850,,858,863,,,,,],
    512: [794,799,,,,814,,,820,,824,,,831,837,840,,,848,853,,860,,868,,,,,,],
    120: [818,823,828,835,839,844,,849,852,856,859,863,867,872,878,881,885,890,894,899,904,910,,918,923,,,,,],
    514: [854,859,,,,874,,,880,,884,,,891,897,900,,,908,913,,920,,928,,,,,,],
    122: [878,883,888,895,899,904,,909,912,916,919,923,927,932,938,941,945,950,954,959,964,970,,979,984,,,,,],
    408: [911,916,,,927,932,,937,941,,,,949,953,,960,,,968,973,,981,984,990,996,1003,1009,1022,1028,1041],
    308: [930,,,943,,949,,,,,958,962,,968,973,977,981,985,990,995,999,,,1009,,,,,,],
    124: [939,944,949,956,960,964,,969,973,976,979,983,986,990,996,1000,1003,1008,1012,1017,1025,1031,,1038,1043,,,,,],
    708: [966,,,,,984,,,,,993,,,1001,,1009,,,1017,,,,,1031,,,,,,],
    410: [972,977,,,988,993,,998,1002,,,,1010,1014,,1021,,,1029,1034,,1042,,1048,,,,,,],
    310: [989,,,1002,,1008,,,,,1017,1021,,1027,1032,1036,1040,1044,1049,1054,1058,,,1071,1077,1084,1090,1103,1109,1122],
    126: [999,1004,1009,1016,1020,1024,,1029,1033,1036,1039,1043,1046,1050,1056,1060,1063,1068,1072,1077,1085,1091,,1101,1106,,,,,],
    710: [1026,,,,,1044,,,,,1053,,,1061,,1069,,,1077,,,,,1091,,,,,,],
    412: [1032,1037,,,1048,1053,,1058,1062,,,,1070,1074,,1081,,,1089,1094,,1102,,1109,1115,1122,1128,1140,1146,1159],
    312: [1049,,,1062,,1068,,,,,1077,1081,,1087,1092,1096,1100,1104,1109,1114,1118,,,1132,1139,,,,,],
    128: [1059,1064,1069,1076,1080,1084,,1089,1093,1096,1099,1103,1106,1110,1116,1120,1123,1128,1132,1137,1145,1151,,1159,1164,,,,,],
    712: [1086,,,,,1104,,,,,1113,,,1121,,1129,,,1137,,,,,1151,,,,,,],
    414: [1092,1097,,,1108,1113,,1118,1122,,,,1130,1134,,1141,,,1149,1154,,1162,,1168,,,,,,],
    314: [1109,,,1122,,1128,,,,,1137,1141,,1147,1152,1156,1160,1164,1169,1174,1178,,,1188,,,,,,],
    130: [1123,1128,1133,1140,1144,1148,,1153,1157,1160,1163,1167,1170,1175,1180,1184,1188,1192,1196,1202,1206,1212,,1219,1224,,,,,],
    516: [1154,1159,,,,1174,,,1180,,1184,,,1191,1197,1200,,,1208,1213,,1220,,1228,,,,,,],
    132: [1178,1183,1188,1195,1199,1203,,1209,1212,1216,1219,1223,1227,1231,1238,1242,1246,1251,1257,1263,1268,1274,,1282,1287,,,,,],
    518: [1213,1218,,,,1233,,,1239,,1243,,,1252,1259,1264,,,1273,1279,,1287,,1295,,,,,,],
    134: [1223,1228,1233,1240,1244,1248,,1254,1257,1261,1265,1269,1274,1282,1289,1294,1298,1302,1307,1313,1318,1324,,1332,1337,,,,,],
    136: [1246,1251,1257,1263,1267,1274,,1279,1284,1289,1295,1301,1306,1313,1319,1324,1328,1333,1338,1344,1348,1354,,1362,,,,,,],
    138: [1276,1281,1287,1293,1297,1304,,1309,1314,1319,1325,1331,1336,1343,1349,1354,1358,1363,1368,1374,1378,1384,,1394,1399,,,,,],
    140: [1306,1311,1317,1323,1327,1334,,1339,1344,1349,1355,1361,1366,1373,1379,1384,1388,1393,1398,1404,1408,1414,,1422,,,,,,],
    142: [1336,1341,1347,1353,1357,1364,,1369,1374,1379,1385,1391,1394,1400,1406,1411,1415,1419,1424,1430,1435,1441,,1450,1456,,,,,],
    144: [1366,1371,1377,1383,1387,1394,,1399,1404,1409,1415,1421,1424,1430,1436,1441,1445,1450,1455,1460,1464,1470,,1478,,,,,,],
    146: [1445,1450,1455,1462,1466,1470,,1475,1478,1482,1485,1489,1492,1496,1502,1506,1509,1514,1518,1523,1527,1533,,1540,1545,,,,,]},

  southWeekend: {
    224: [508,513,518,525,529,533,537,540,544,547,550,554,557,561,568,572,576,581,585,591,595,601,,610,615,,,,,],
    228: [598,603,608,615,619,624,627,631,634,637,641,644,648,652,658,662,666,671,676,681,686,692,,700,705,,,,,],
    232: [658,663,668,675,679,684,687,691,694,697,701,704,708,712,718,722,726,731,736,741,746,752,,760,765,,,,,],
    236: [718,723,728,735,739,744,747,751,754,757,761,764,768,772,778,782,786,791,796,801,806,812,,818,,,,,,],
    240: [778,783,788,795,799,804,807,811,814,817,821,824,828,832,838,842,846,851,856,861,866,872,,880,885,,,,,],
    244: [838,843,848,855,859,864,867,871,874,877,881,884,888,892,898,902,906,911,916,921,926,932,,938,,,,,,],
    248: [898,903,908,915,919,924,927,931,934,937,941,944,948,952,958,962,966,971,976,981,986,992,,1000,1005,,,,,],
    252: [958,963,968,975,979,984,987,991,994,997,1001,1004,1008,1012,1018,1022,1026,1031,1036,1041,1046,1052,,1058,,,,,,],
    256: [1018,1023,1028,1035,1039,1044,1047,1051,1054,1057,1061,1064,1068,1072,1078,1082,1086,1091,1096,1101,1106,1112,,1120,1125,,,,,],
    260: [1078,1083,1088,1095,1099,1104,1107,1111,1114,1117,1121,1124,1128,1132,1138,1142,1146,1151,1156,1161,1166,1172,,1178,,,,,,],
    264: [1138,1143,1148,1155,1159,1164,1167,1171,1174,1177,1181,1184,1188,1192,1198,1202,1206,1211,1216,1221,1226,1232,,1240,1245,,,,,],
    268: [1198,1203,1208,1215,1219,1224,1227,1231,1234,1237,1241,1244,1248,1252,1258,1262,1266,1271,1276,1281,1286,1292,,1298,,,,,,],
    272: [1258,1263,1268,1275,1279,1284,1287,1291,1294,1297,1301,1304,1308,1312,1318,1322,1326,1331,1336,1341,1346,1352,,1360,1365,,,,,],
    276: [1318,1323,1328,1335,1339,1344,1347,1351,1354,1357,1361,1364,1368,1372,1378,1382,1386,1391,1396,1401,1406,1412,,1418,,,,,,],
    280: [1378,1383,1388,1395,1399,1404,1407,1411,1414,1417,1421,1424,1428,1432,1438,1442,1446,1450,1455,1460,1465,1471,,1479,1484,,,,,],
    284: [1445,1450,1455,1462,1466,1471,1475,1478,1481,1485,1488,1492,1495,1499,1505,1509,1512,1517,1521,1526,1531,1537,,1544,1549,,,,,]},

  southModified: {
    602: [298,303,308,315,319,324,327,331,334,337,341,344,348,352,358,362,366,371,376,381,386,392,,398,,,,,,],
    604: [358,363,368,375,379,384,387,391,394,397,401,404,408,412,418,422,426,431,436,441,446,452,,460,465,,,,,],
    606: [418,423,428,435,439,444,447,451,454,457,461,464,468,472,478,482,486,491,496,501,506,512,,518,,,,,,],
    608: [478,483,488,495,499,504,507,511,514,517,521,524,528,532,538,542,546,551,556,561,566,572,,580,585,,,,,],
    610: [538,543,548,555,559,563,567,570,574,577,581,584,588,592,598,602,606,611,616,621,626,632,,638,,,,,,],
    228: [598,603,608,615,619,624,627,631,634,637,641,644,648,652,658,662,666,671,676,681,686,692,,700,705,,,,,],
    632: [658,663,668,675,679,684,687,691,694,697,701,704,708,712,718,722,726,731,736,741,746,752,,758,,,,,,],
    636: [718,723,728,735,739,744,747,751,754,757,761,764,768,772,778,782,786,791,796,801,806,812,,820,825,,,,,],
    640: [778,783,788,795,799,804,807,811,814,817,821,824,828,832,838,842,846,851,856,861,866,872,,878,,,,,,],
    644: [838,843,848,855,859,864,867,871,874,877,881,884,888,892,898,902,906,911,916,921,926,932,,940,945,,,,,],
    248: [898,903,908,915,919,924,927,931,934,937,941,944,948,952,958,962,966,971,976,981,986,992,,1000,1005,,,,,],
    652: [958,963,968,975,979,984,987,991,994,997,1001,1004,1008,1012,1018,1022,1026,1031,1036,1041,1046,1052,,1060,1065,,,,,],
    656: [1018,1023,1028,1035,1039,1044,1047,1051,1054,1057,1061,1064,1068,1072,1078,1082,1086,1091,1096,1101,1106,1112,,1120,1125,1133,1139,1152,1158,1171],
    260: [1078,1083,1088,1095,1099,1104,1107,1111,1114,1117,1121,1124,1128,1132,1138,1142,1146,1151,1156,1161,1166,1172,,1178,,,,,,],
    264: [1138,1143,1148,1155,1159,1164,1167,1171,1174,1177,1181,1184,1188,1192,1198,1202,1206,1211,1216,1221,1226,1232,,1240,1245,,,,,],
    268: [1198,1203,1208,1215,1219,1224,1227,1231,1234,1237,1241,1244,1248,1252,1258,1262,1266,1271,1276,1281,1286,1292,,1298,,,,,,],
    272: [1258,1263,1268,1275,1279,1284,1287,1291,1294,1297,1301,1304,1308,1312,1318,1322,1326,1331,1336,1341,1346,1352,,1360,1365,,,,,],
    276: [1318,1323,1328,1335,1339,1344,1347,1351,1354,1357,1361,1364,1368,1372,1378,1382,1386,1391,1396,1401,1406,1412,,1418,,,,,,],
    280: [1378,1383,1388,1395,1399,1404,1407,1411,1414,1417,1421,1424,1428,1432,1438,1442,1446,1450,1455,1460,1465,1471,,1479,1484,,,,,],
    284: [1445,1450,1455,1462,1466,1471,1475,1478,1481,1485,1488,1492,1495,1499,1505,1509,1512,1517,1521,1526,1531,1537,,1544,1549,,,,,]},

  scheduleDate: 1675377149000

};
export { caltrainServiceData };
