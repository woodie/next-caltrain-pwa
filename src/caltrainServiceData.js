var caltrainServiceData = {

  northStops: [
    'Gilroy','San Martin','Morgan Hill','Blossom Hill','Capitol','Tamien','San Jose Diridon','College Park','Santa Clara','Lawrence','Sunnyvale','Mountain View','San Antonio','California Ave','Palo Alto','Menlo Park','Atherton','Redwood City','San Carlos','Belmont','Hillsdale','Hayward Park','San Mateo','Burlingame','Broadway','Millbrae','San Bruno','So San Francisco','Bayshore','22nd Street','San Francisco'],

  northWeekday: {
    101: [,,,,,,268,,273,279,283,288,292,297,301,304,,310,315,318,322,325,328,332,,336,341,345,351,357,363],
    103: [,,,,,295,303,,308,313,318,323,327,331,336,339,,344,349,352,356,359,363,366,,371,376,380,386,392,398],
    207: [,,,,,351,359,,366,372,380,385,389,394,398,401,,407,411,415,418,421,425,428,,433,438,442,448,454,462],
    217: [366,375,381,396,402,410,419,,426,432,440,445,449,454,458,461,,467,471,475,478,481,485,488,,493,498,502,508,514,522],
    221: [395,404,410,425,431,439,448,,453,459,463,468,472,476,481,484,,490,494,498,501,504,507,510,,515,520,524,530,536,543],
    231: [,,,,,,508,,513,519,524,529,533,537,542,545,,552,556,560,563,566,570,573,,578,583,587,593,599,607],
    135: [,,,,,,553,,558,564,569,574,578,582,587,590,,597,601,605,608,611,615,618,,623,628,632,638,644,652],
    139: [,,,,,,613,,618,624,628,633,637,642,647,650,,655,659,663,666,669,672,675,,680,685,689,695,701,708],
    143: [,,,,,,673,,678,684,688,693,697,701,706,709,,715,719,723,726,729,732,735,,740,745,749,755,761,768],
    147: [,,,,,,733,,738,744,748,753,757,761,766,769,,775,779,783,786,789,792,795,,800,805,809,815,821,828],
    151: [,,,,,,793,,798,804,808,813,817,821,826,829,,835,839,843,846,849,852,855,,860,865,869,875,881,888],
    155: [,,,,,,853,,858,864,868,873,877,881,886,889,,895,899,903,906,909,914,917,,922,927,931,937,943,952],
    159: [,,,,,,913,916,920,925,930,935,939,943,947,951,,958,963,966,970,973,977,980,,985,990,994,1000,1006,1013],
    261: [,,,,,932,940,,945,950,957,962,966,971,975,979,,984,989,993,996,999,1002,1005,,1010,1015,1019,1025,1031,1038],
    269: [,,,,,993,1000,,1006,1014,1020,1025,1029,1034,1040,1043,,1049,1053,1057,1060,1063,1066,1069,,1074,1079,1083,1089,1095,1102],
    279: [,,,,,1052,1060,,1066,1074,1080,1085,1089,1094,1100,1103,,1109,1113,1117,1120,1123,1126,1129,,1134,1139,1143,1149,1155,1162],
    289: [,,,,,1118,1125,,1130,1135,1140,1145,1148,1153,1157,1160,,1167,1171,1175,1178,1181,1184,1188,,1192,1197,1201,1207,1213,1220],
    193: [,,,,,,1185,,1190,1195,1200,1205,1208,1213,1217,1220,,1227,1231,1235,1238,1241,1244,1248,,1252,1257,1261,1267,1273,1280],
    195: [,,,,,1237,1245,,1250,1255,1260,1265,1268,1273,1277,1280,,1287,1291,1295,1298,1301,1304,1308,,1312,1317,1321,1327,1333,1340],
    197: [,,,,,1297,1305,,1310,1315,1320,1325,1328,1333,1337,1340,,1347,1351,1355,1358,1361,1364,1368,,1372,1377,1381,1387,1393,1400],
    199: [,,,,,,1350,,1355,1360,1365,1370,1374,1379,1384,1387,,1393,1397,1401,1404,1407,1410,1414,,1418,1422,1426,1432,1438,1445]},

  northWeekend: {},

  northClosure: {
    421: [,,,,,,428,,433,439,443,449,453,457,462,465,469,473,478,482,485,489,492,496,500,503,508,513,524,536,551],
    423: [,,,,,,518,,523,529,533,539,543,547,552,555,559,563,568,572,575,579,582,586,590,593,598,603,614,626,641],
    801: [,,,,,,591,,,,601,606,,,613,,,620,,,627,,632,,,640,,,661,673,688],
    425: [,,,,,,608,,613,619,623,629,633,637,642,645,649,653,658,662,665,669,672,676,680,683,688,693,704,716,731],
    427: [,,,,,,698,,703,709,713,719,723,727,732,735,739,743,748,752,755,759,762,766,770,773,778,783,794,806,821],
    429: [,,,,,,788,,793,799,803,809,813,817,822,825,829,833,838,842,845,849,852,856,860,863,868,873,884,896,911],
    431: [,,,,,,878,,883,889,893,899,903,907,912,915,919,923,928,932,935,939,942,946,950,953,958,963,974,986,1001],
    433: [,,,,,,968,,973,979,983,989,993,997,1002,1005,1009,1013,1018,1022,1025,1029,1032,1036,1040,1043,1048,1053,1064,1076,1091],
    803: [,,,,,,1041,,,,1051,1056,,,1063,,,1070,,,1077,,1082,,,1090,,,1111,1123,1138],
    435: [,,,,,,1058,,1063,1069,1073,1079,1083,1087,1092,1095,1099,1103,1108,1112,1115,1119,1122,1126,1130,1133,1138,1143,1154,1166,1181],
    437: [,,,,,,1148,,1153,1159,1163,1169,1173,1177,1182,1185,1189,1193,1198,1202,1205,1209,1212,1216,1220,1223,1228,1233,1244,1256,1271],
    439: [,,,,,,1238,,1243,1249,1253,1259,1263,1267,1272,1275,1279,1283,1288,1292,1295,1299,1302,1306,1310,1313,1318,1323,1334,1346,1361],
    441: [,,,,,,1328,,1333,1339,1343,1349,1353,1357,1362,1365,1369,1373,1378,1382,1385,1389,1392,1396,1400,1403,1408,1413,1424,1436,1451],
    443: [,,,,,,1350,,1355,1360,1364,1369,1373,1377,1381,1384,1388,1392,1397,1401,1404,1408,1411,1415,1419,1422,1427,1432,1443,1455,1470]},

  southStops: [
    'San Francisco','22nd Street','Bayshore','So San Francisco','San Bruno','Millbrae','Broadway','Burlingame','San Mateo','Hayward Park','Hillsdale','Belmont','San Carlos','Redwood City','Atherton','Menlo Park','Palo Alto','California Ave','San Antonio','Mountain View','Sunnyvale','Lawrence','Santa Clara','College Park','San Jose Diridon','Tamien','Capitol','Blossom Hill','Morgan Hill','San Martin','Gilroy'],

  southWeekday: {
    102: [295,299,304,310,314,318,,322,325,328,332,335,338,341,,347,351,355,359,364,370,375,382,,391,,,,,,],
    104: [325,329,334,340,344,348,,353,357,360,363,367,370,375,,380,384,388,392,397,402,406,411,,425,430,,,,,],
    208: [375,380,385,392,396,400,,404,407,411,414,418,421,426,,431,435,439,443,448,453,457,462,,470,,,,,,],
    218: [435,440,445,452,456,460,,464,467,471,474,478,481,486,,491,495,499,503,508,513,517,522,,530,,,,,,],
    228: [495,500,505,512,516,520,,524,527,531,534,538,541,546,,551,555,559,563,568,573,577,582,,590,,,,,,],
    134: [540,545,550,557,561,565,,569,572,576,579,583,586,591,,596,600,604,608,613,618,622,627,,635,,,,,,],
    138: [600,604,609,616,620,625,,629,632,636,639,643,646,651,,656,660,664,668,673,678,682,688,,695,,,,,,],
    142: [660,664,669,676,680,685,,689,692,696,699,703,706,711,,716,720,724,728,733,738,742,748,,755,,,,,,],
    146: [720,724,729,736,740,745,,749,752,756,759,763,766,771,,776,780,784,788,793,798,802,808,,815,,,,,,],
    150: [780,784,789,796,800,805,,809,812,816,819,823,826,831,,836,840,844,848,853,858,862,868,,875,,,,,,],
    152: [840,844,849,856,860,865,,869,872,876,879,883,886,891,,896,900,904,908,913,918,922,928,,935,,,,,,],
    156: [900,904,909,916,920,927,,932,935,939,942,946,949,954,,959,964,968,972,977,982,987,992,995,1004,1010,1017,1023,1036,1042,1057],
    258: [934,939,944,951,955,959,,963,966,970,973,977,980,985,,990,994,998,1002,1007,1012,1016,1021,,1029,1034,,,,,],
    264: [992,997,1002,1009,1013,1017,,1021,1024,1028,1031,1035,1038,1043,,1048,1052,1056,1060,1065,1070,1074,1079,,1087,1093,1100,1106,1119,1125,1141],
    274: [1052,1057,1062,1069,1073,1077,,1081,1084,1088,1091,1095,1098,1103,,1108,1112,1116,1120,1125,1130,1134,1139,,1147,1152,,,,,],
    284: [1112,1117,1122,1129,1133,1137,,1141,1144,1148,1151,1155,1158,1163,,1168,1172,1176,1180,1185,1190,1194,1199,,1207,,,,,,],
    190: [1170,1174,1179,1186,1190,1196,,1201,1204,1208,1211,1215,1218,1223,,1228,1232,1235,1239,1244,1249,1253,1258,,1266,,,,,,],
    192: [1230,1234,1239,1246,1250,1256,,1261,1264,1268,1271,1275,1278,1283,,1288,1292,1295,1299,1304,1309,1313,1318,,1326,1331,,,,,],
    194: [1290,1294,1299,1306,1310,1316,,1321,1324,1328,1331,1335,1338,1343,,1348,1352,1355,1359,1364,1369,1373,1378,,1386,1391,,,,,],
    196: [1350,1354,1359,1366,1370,1376,,1381,1384,1388,1391,1395,1398,1403,,1408,1412,1415,1419,1424,1429,1433,1438,,1446,,,,,,],
    198: [1445,1450,1455,1461,1465,1473,,1477,1480,1484,1487,1491,1494,1499,,1504,1508,1511,1515,1520,1525,1529,1534,,1542,,,,,,]},

  southWeekend: {},

  southClosure: {
    422: [463,471,498,504,510,514,518,521,525,528,532,536,539,544,549,552,556,560,564,569,574,578,584,,592,,,,,,],
    424: [553,561,588,594,600,604,608,611,615,618,622,626,629,634,639,642,646,650,654,659,664,668,674,,682,,,,,,],
    426: [643,651,678,684,690,694,698,701,705,708,712,716,719,724,729,732,736,740,744,749,754,758,764,,772,,,,,,],
    802: [695,703,730,,,739,,,746,,750,,,758,,,765,,,774,780,,,,793,,,,,,],
    428: [733,741,768,774,780,784,788,791,795,798,802,806,809,814,819,822,826,830,834,839,844,848,854,,862,,,,,,],
    430: [823,831,858,864,870,874,878,881,885,888,892,896,899,904,909,912,916,920,924,929,934,938,944,,952,,,,,,],
    432: [913,921,948,954,960,964,968,971,975,978,982,986,989,994,999,1002,1006,1010,1014,1019,1024,1028,1034,,1042,,,,,,],
    434: [1003,1011,1038,1044,1050,1054,1058,1061,1065,1068,1072,1076,1079,1084,1089,1092,1096,1100,1104,1109,1114,1118,1124,,1132,,,,,,],
    436: [1093,1101,1128,1134,1140,1144,1148,1151,1155,1158,1162,1166,1169,1174,1179,1182,1186,1190,1194,1199,1204,1208,1214,,1222,,,,,,],
    804: [1145,1153,1180,,,1189,,,1196,,1200,,,1208,,,1215,,,1224,1230,,,,1243,,,,,,],
    438: [1183,1191,1218,1224,1230,1234,1238,1241,1245,1248,1252,1256,1259,1264,1269,1272,1276,1280,1284,1289,1294,1298,1304,,1312,,,,,,],
    440: [1273,1281,1308,1314,1320,1324,1328,1331,1335,1338,1342,1346,1349,1354,1359,1362,1366,1370,1374,1379,1384,1388,1394,,1402,,,,,,],
    442: [1346,1354,1381,1387,1392,1396,1401,1404,1408,1411,1415,1419,1422,1427,1432,1435,1439,1443,1447,1452,1457,1461,1467,,1475,,,,,,],
    444: [1420,1428,1455,1461,1465,1469,1473,1475,1481,1484,1488,1492,1495,1501,1505,1508,1511,1515,1519,1523,1528,1532,1537,,1545,,,,,,]},

  scheduleDate: 1578689615000

};
