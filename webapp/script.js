'use strict';

var caltrainServiceData = {

  northStops: ['Gilroy', 'San Martin', 'Morgan Hill', 'Blossom Hill', 'Capitol', 'Tamien', 'San Jose Diridon', 'College Park', 'Santa Clara', 'Lawrence', 'Sunnyvale', 'Mountain View', 'San Antonio', 'California Ave', 'Palo Alto', 'Menlo Park', 'Atherton', 'Redwood City', 'San Carlos', 'Belmont', 'Hillsdale', 'Hayward Park', 'San Mateo', 'Burlingame', 'Broadway', 'Millbrae', 'San Bruno', 'So San Francisco', 'Bayshore', '22nd Street', 'San Francisco'],

  northWeekday: {
    101: [,,,,,, 268,, 273, 279, 283, 288, 292, 297, 301, 304,, 310, 315, 318,, 325, 328, 332,, 336, 341, 345, 351, 357, 363],
    103: [,,,,, 295, 303,, 308, 313, 318, 323, 327, 331, 336, 339,, 344, 349, 352,, 359, 363, 366,, 371, 376, 380, 386, 392, 398],
    207: [,,,,, 351, 359,, 366, 372, 380, 385, 389, 394, 398, 401,, 407, 411, 415,, 421, 425, 428,, 433, 438, 442, 448, 454, 462],
    217: [366, 375, 381, 396, 402, 410, 419,, 426, 432, 440, 445, 449, 454, 458, 461,, 467, 471, 475,, 481, 485, 488,, 493, 498, 502, 508, 514, 522],
    221: [395, 404, 410, 425, 431, 439, 448,, 453, 459, 463, 468, 472, 476, 481, 484,, 490, 494, 498,, 504, 507, 510,, 515, 520, 524, 530, 536, 543],
    231: [,,,,,, 508,, 513, 519, 524, 529, 533, 537, 542, 545,, 552, 556, 560,, 566, 570, 573,, 578, 583, 587, 593, 599, 607],
    135: [,,,,,, 553,, 558, 564, 569, 574, 578, 582, 587, 590,, 597, 601, 605,, 611, 615, 618,, 623, 628, 632, 638, 644, 652],
    139: [,,,,,, 613,, 618, 624, 628, 633, 637, 642, 647, 650,, 655, 659, 663,, 669, 672, 675,, 680, 685, 689, 695, 701, 708],
    143: [,,,,,, 673,, 678, 684, 688, 693, 697, 701, 706, 709,, 715, 719, 723,, 729, 732, 735,, 740, 745, 749, 755, 761, 768],
    147: [,,,,,, 733,, 738, 744, 748, 753, 757, 761, 766, 769,, 775, 779, 783,, 789, 792, 795,, 800, 805, 809, 815, 821, 828],
    151: [,,,,,, 793,, 798, 804, 808, 813, 817, 821, 826, 829,, 835, 839, 843,, 849, 852, 855,, 860, 865, 869, 875, 881, 888],
    155: [,,,,,, 853,, 858, 864, 868, 873, 877, 881, 886, 889,, 895, 899, 903,, 909, 914, 917,, 922, 927, 931, 937, 943, 952],
    159: [,,,,,, 913, 916, 920, 925, 930, 935, 939, 943, 947, 951,, 958, 963, 966,, 973, 977, 980,, 985, 990, 994, 1000, 1006, 1013],
    261: [,,,,, 932, 940,, 945, 950, 957, 962, 966, 971, 975, 979,, 984, 989, 993,, 999, 1002, 1005,, 1010, 1015, 1019, 1025, 1031, 1038],
    269: [,,,,, 993, 1000,, 1006, 1014, 1020, 1025, 1029, 1034, 1040, 1043,, 1049, 1053, 1057,, 1063, 1066, 1069,, 1074, 1079, 1083, 1089, 1095, 1102],
    279: [,,,,, 1052, 1060,, 1066, 1074, 1080, 1085, 1089, 1094, 1100, 1103,, 1109, 1113, 1117,, 1123, 1126, 1129,, 1134, 1139, 1143, 1149, 1155, 1162],
    289: [,,,,, 1118, 1125,, 1130, 1135, 1140, 1145, 1148, 1153, 1157, 1160,, 1167, 1171, 1175,, 1181, 1184, 1188,, 1192, 1197, 1201, 1207, 1213, 1220],
    193: [,,,,,, 1185,, 1190, 1195, 1200, 1205, 1208, 1213, 1217, 1220,, 1227, 1231, 1235,, 1241, 1244, 1248,, 1252, 1257, 1261, 1267, 1273, 1280],
    195: [,,,,, 1237, 1245,, 1250, 1255, 1260, 1265, 1268, 1273, 1277, 1280,, 1287, 1291, 1295,, 1301, 1304, 1308,, 1312, 1317, 1321, 1327, 1333, 1340],
    197: [,,,,, 1297, 1305,, 1310, 1315, 1320, 1325, 1328, 1333, 1337, 1340,, 1347, 1351, 1355,, 1361, 1364, 1368,, 1372, 1377, 1381, 1387, 1393, 1400],
    199: [,,,,,, 1350,, 1355, 1360, 1365, 1370, 1374, 1379, 1384, 1387,, 1393, 1397, 1401,, 1407, 1410, 1414,, 1418, 1422, 1426, 1432, 1438, 1445] },

  northWeekend: {
    421: [,,,,,, 428,, 433, 439, 443, 449, 453, 457, 462, 465, 469, 473, 478, 482,, 489, 492, 496, 500, 503, 508, 513, 519, 525, 532],
    423: [,,,,,, 518,, 523, 529, 533, 539, 543, 547, 552, 555, 559, 563, 568, 572,, 579, 582, 586, 590, 593, 598, 603, 609, 615, 622],
    801: [,,,,,, 591,,,, 601, 606,,, 613,,, 620,, 626,,, 632,,, 640,,,,, 660],
    425: [,,,,,, 608,, 613, 619, 623, 629, 633, 637, 642, 645, 649, 653, 658, 662,, 669, 672, 676, 680, 683, 688, 693, 699, 705, 712],
    427: [,,,,,, 698,, 703, 709, 713, 719, 723, 727, 732, 735, 739, 743, 748, 752,, 759, 762, 766, 770, 773, 778, 783, 789, 795, 802],
    429: [,,,,,, 788,, 793, 799, 803, 809, 813, 817, 822, 825, 829, 833, 838, 842,, 849, 852, 856, 860, 863, 868, 873, 879, 885, 892],
    431: [,,,,,, 878,, 883, 889, 893, 899, 903, 907, 912, 915, 919, 923, 928, 932,, 939, 942, 946, 950, 953, 958, 963, 969, 975, 982],
    433: [,,,,,, 968,, 973, 979, 983, 989, 993, 997, 1002, 1005, 1009, 1013, 1018, 1022,, 1029, 1032, 1036, 1040, 1043, 1048, 1053, 1059, 1065, 1072],
    803: [,,,,,, 1041,,,, 1051, 1056,,, 1063,,, 1070,, 1076,,, 1082,,, 1090,,,,, 1110],
    435: [,,,,,, 1058,, 1063, 1069, 1073, 1079, 1083, 1087, 1092, 1095, 1099, 1103, 1108, 1112,, 1119, 1122, 1126, 1130, 1133, 1138, 1143, 1149, 1155, 1162],
    437: [,,,,,, 1148,, 1153, 1159, 1163, 1169, 1173, 1177, 1182, 1185, 1189, 1193, 1198, 1202,, 1209, 1212, 1216, 1220, 1223, 1228, 1233, 1239, 1245, 1252],
    439: [,,,,,, 1238,, 1243, 1249, 1253, 1259, 1263, 1267, 1272, 1275, 1279, 1283, 1288, 1292,, 1299, 1302, 1306, 1310, 1313, 1318, 1323, 1329, 1335, 1342],
    441: [,,,,,, 1328,, 1333, 1339, 1343, 1349, 1353, 1357, 1362, 1365, 1369, 1373, 1378, 1382,, 1389, 1392, 1396, 1400, 1403, 1408, 1413, 1419, 1425, 1432],
    443: [,,,,,, 1350,, 1355, 1360, 1364, 1369, 1373, 1377, 1381, 1384, 1388, 1392, 1397, 1401,, 1408, 1411, 1415, 1419, 1422, 1427, 1432, 1438, 1443, 1454] },

  southStops: ['San Francisco', '22nd Street', 'Bayshore', 'So San Francisco', 'San Bruno', 'Millbrae', 'Broadway', 'Burlingame', 'San Mateo', 'Hayward Park', 'Hillsdale', 'Belmont', 'San Carlos', 'Redwood City', 'Atherton', 'Menlo Park', 'Palo Alto', 'California Ave', 'San Antonio', 'Mountain View', 'Sunnyvale', 'Lawrence', 'Santa Clara', 'College Park', 'San Jose Diridon', 'Tamien', 'Capitol', 'Blossom Hill', 'Morgan Hill', 'San Martin', 'Gilroy'],

  southWeekday: {
    102: [295, 299, 304, 310, 314, 318,, 322, 325, 328,, 335, 338, 341,, 347, 351, 355, 359, 364, 370, 375, 382,, 391,,,,,,],
    104: [325, 329, 334, 340, 344, 348,, 353, 357, 360,, 367, 370, 375,, 380, 384, 388, 392, 397, 402, 406, 411,, 425, 430,,,,,],
    208: [375, 380, 385, 392, 396, 400,, 404, 407, 411,, 418, 421, 426,, 431, 435, 439, 443, 448, 453, 457, 462,, 470,,,,,,],
    218: [435, 440, 445, 452, 456, 460,, 464, 467, 471,, 478, 481, 486,, 491, 495, 499, 503, 508, 513, 517, 522,, 530,,,,,,],
    228: [495, 500, 505, 512, 516, 520,, 524, 527, 531,, 538, 541, 546,, 551, 555, 559, 563, 568, 573, 577, 582,, 590,,,,,,],
    134: [540, 545, 550, 557, 561, 565,, 569, 572, 576,, 583, 586, 591,, 596, 600, 604, 608, 613, 618, 622, 627,, 635,,,,,,],
    138: [600, 604, 609, 616, 620, 625,, 629, 632, 636,, 643, 646, 651,, 656, 660, 664, 668, 673, 678, 682, 688,, 695,,,,,,],
    142: [660, 664, 669, 676, 680, 685,, 689, 692, 696,, 703, 706, 711,, 716, 720, 724, 728, 733, 738, 742, 748,, 755,,,,,,],
    146: [720, 724, 729, 736, 740, 745,, 749, 752, 756,, 763, 766, 771,, 776, 780, 784, 788, 793, 798, 802, 808,, 815,,,,,,],
    150: [780, 784, 789, 796, 800, 805,, 809, 812, 816,, 823, 826, 831,, 836, 840, 844, 848, 853, 858, 862, 868,, 875,,,,,,],
    152: [840, 844, 849, 856, 860, 865,, 869, 872, 876,, 883, 886, 891,, 896, 900, 904, 908, 913, 918, 922, 928,, 935,,,,,,],
    156: [900, 904, 909, 916, 920, 927,, 932, 935, 939,, 946, 949, 954,, 959, 964, 968, 972, 977, 982, 987, 992, 995, 1004, 1010, 1017, 1023, 1036, 1042, 1057],
    258: [934, 939, 944, 951, 955, 959,, 963, 966, 970,, 977, 980, 985,, 990, 994, 998, 1002, 1007, 1012, 1016, 1021,, 1029, 1034,,,,,],
    264: [992, 997, 1002, 1009, 1013, 1017,, 1021, 1024, 1028,, 1035, 1038, 1043,, 1048, 1052, 1056, 1060, 1065, 1070, 1074, 1079,, 1087, 1093, 1100, 1106, 1119, 1125, 1141],
    274: [1052, 1057, 1062, 1069, 1073, 1077,, 1081, 1084, 1088,, 1095, 1098, 1103,, 1108, 1112, 1116, 1120, 1125, 1130, 1134, 1139,, 1147, 1152,,,,,],
    284: [1112, 1117, 1122, 1129, 1133, 1137,, 1141, 1144, 1148,, 1155, 1158, 1163,, 1168, 1172, 1176, 1180, 1185, 1190, 1194, 1199,, 1207,,,,,,],
    190: [1170, 1174, 1179, 1186, 1190, 1196,, 1201, 1204, 1208,, 1215, 1218, 1223,, 1228, 1232, 1235, 1239, 1244, 1249, 1253, 1258,, 1266,,,,,,],
    192: [1230, 1234, 1239, 1246, 1250, 1256,, 1261, 1264, 1268,, 1275, 1278, 1283,, 1288, 1292, 1295, 1299, 1304, 1309, 1313, 1318,, 1326, 1331,,,,,],
    194: [1290, 1294, 1299, 1306, 1310, 1316,, 1321, 1324, 1328,, 1335, 1338, 1343,, 1348, 1352, 1355, 1359, 1364, 1369, 1373, 1378,, 1386, 1391,,,,,],
    196: [1350, 1354, 1359, 1366, 1370, 1376,, 1381, 1384, 1388,, 1395, 1398, 1403,, 1408, 1412, 1415, 1419, 1424, 1429, 1433, 1438,, 1446,,,,,,],
    198: [1445, 1450, 1455, 1461, 1465, 1473,, 1477, 1480, 1484,, 1491, 1494, 1499,, 1504, 1508, 1511, 1515, 1520, 1525, 1529, 1534,, 1542,,,,,,] },

  southWeekend: {
    422: [487, 491, 498, 504, 510, 514, 518, 521, 525, 528,, 536, 539, 544, 549, 552, 556, 560, 564, 569, 574, 578, 584,, 592,,,,,,],
    424: [577, 581, 588, 594, 600, 604, 608, 611, 615, 618,, 626, 629, 634, 639, 642, 646, 650, 654, 659, 664, 668, 674,, 682,,,,,,],
    426: [667, 671, 678, 684, 690, 694, 698, 701, 705, 708,, 716, 719, 724, 729, 732, 736, 740, 744, 749, 754, 758, 764,, 772,,,,,,],
    802: [724,,,,, 739,,, 746,,, 752,, 758,,, 765,,, 774, 780,,,, 793,,,,,,],
    428: [757, 761, 768, 774, 780, 784, 788, 791, 795, 798,, 806, 809, 814, 819, 822, 826, 830, 834, 839, 844, 848, 854,, 862,,,,,,],
    430: [847, 851, 858, 864, 870, 874, 878, 881, 885, 888,, 896, 899, 904, 909, 912, 916, 920, 924, 929, 934, 938, 944,, 952,,,,,,],
    432: [937, 941, 948, 954, 960, 964, 968, 971, 975, 978,, 986, 989, 994, 999, 1002, 1006, 1010, 1014, 1019, 1024, 1028, 1034,, 1042,,,,,,],
    434: [1027, 1031, 1038, 1044, 1050, 1054, 1058, 1061, 1065, 1068,, 1076, 1079, 1084, 1089, 1092, 1096, 1100, 1104, 1109, 1114, 1118, 1124,, 1132,,,,,,],
    436: [1117, 1121, 1128, 1134, 1140, 1144, 1148, 1151, 1155, 1158,, 1166, 1169, 1174, 1179, 1182, 1186, 1190, 1194, 1199, 1204, 1208, 1214,, 1222,,,,,,],
    804: [1174,,,,, 1189,,, 1196,,, 1202,, 1208,,, 1215,,, 1224, 1230,,,, 1243,,,,,,],
    438: [1207, 1211, 1218, 1224, 1230, 1234, 1238, 1241, 1245, 1248,, 1256, 1259, 1264, 1269, 1272, 1276, 1280, 1284, 1289, 1294, 1298, 1304,, 1312,,,,,,],
    440: [1297, 1301, 1308, 1314, 1320, 1324, 1328, 1331, 1335, 1338,, 1346, 1349, 1354, 1359, 1362, 1366, 1370, 1374, 1379, 1384, 1388, 1394,, 1402,,,,,,],
    442: [1370, 1374, 1381, 1387, 1392, 1396, 1401, 1404, 1408, 1411,, 1419, 1422, 1427, 1432, 1435, 1439, 1443, 1447, 1452, 1457, 1461, 1467,, 1475,,,,,,],
    444: [1445, 1450, 1455, 1461, 1465, 1469, 1473, 1475, 1481, 1484,, 1492, 1495, 1501, 1505, 1508, 1511, 1515, 1519, 1523, 1528, 1532, 1537,, 1545,,,,,,] },

  scheduleDate: 1589406173000

};
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var special = {
  '2020-05-25': 2 };
var scheduleOptions = ['Weekday', 'Saturday', 'Sunday'];

var CaltrainSchedule = function () {
  function CaltrainSchedule(goodTime) {
    _classCallCheck(this, CaltrainSchedule);

    this.forToday = CaltrainSchedule.optionIndex(goodTime);
    this.selected = this.forToday;
  }

  _createClass(CaltrainSchedule, [{
    key: 'label',
    value: function label() {
      return scheduleOptions[this.selected];
    }
  }, {
    key: 'next',
    value: function next() {
      this.selected = this.selected >= scheduleOptions.length - 1 ? 0 : this.selected + 1;
    }
  }, {
    key: 'swapped',
    value: function swapped() {
      return this.forToday !== this.selected;
    }
  }], [{
    key: 'optionIndex',
    value: function optionIndex(goodTime) {
      if (goodTime.date in special) {
        return special[goodTime.date];
      } else if (goodTime.dotw === 0) {
        return 2;
      } else if (goodTime.dotw === 6) {
        return 1;
      } else {
        return 0;
      }
    }
  }]);

  return CaltrainSchedule;
}();
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var saturdayTripIds = [421, 443, 442, 444];
var CaltrainService = function () {
  function CaltrainService() {
    _classCallCheck(this, CaltrainService);

    this.northStops = CaltrainService.mapStops('North');
    this.southStops = CaltrainService.mapStops('South');
  }

  _createClass(CaltrainService, [{
    key: 'stopMap',
    value: function stopMap(direction) {
      return direction === 'North' ? this.northStops : this.southStops;
    }
  }, {
    key: 'routes',
    value: function routes(departStop, arriveStop, schedule) {
      var direction = CaltrainService.direction(departStop, arriveStop);
      var departTimes = this.times(departStop, direction, schedule);
      var arriveTimes = this.times(arriveStop, direction, schedule);
      var skip = schedule === 'Sunday' ? saturdayTripIds : [];
      return CaltrainService.merge(departTimes, arriveTimes, skip);
    }
  }, {
    key: 'times',
    value: function times(stop, direction, schedule) {
      var source = CaltrainService.select(direction, schedule);
      var index = this.stopMap(direction).get(stop);
      var times = new Map();
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = Object.keys(source).map(Number)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var train = _step.value;

          if (source[train][index]) times.set(train, source[train][index]);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return times;
    }
  }], [{
    key: 'mapStops',
    value: function mapStops(direction) {
      var out = new Map();
      var stops = direction === 'North' ? caltrainServiceData.northStops : caltrainServiceData.southStops;
      for (var i = 0; i < stops.length; i++) {
        out.set(stops[i], i);
      }
      return out;
    }
  }, {
    key: 'tripStops',
    value: function tripStops(train, direction, schedule) {
      var stops = direction === 'North' ? caltrainServiceData.northStops : caltrainServiceData.southStops;
      var times = CaltrainService.select(direction, schedule)[train];
      var out = [];
      for (var i = 0; i < times.length; i++) {
        if (times[i]) out.push([stops[i], times[i]]);
      }
      return out;
    }
  }, {
    key: 'direction',
    value: function direction(departStop, arriveStop) {
      var depart = caltrainServiceData.southStops.indexOf(departStop);
      var arrive = caltrainServiceData.southStops.indexOf(arriveStop);
      return depart < arrive ? 'South' : 'North';
    }
  }, {
    key: 'nextIndex',
    value: function nextIndex(routes, minutes) {
      var index = 0;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = routes[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var route = _step2.value;

          if (route[1] > minutes) {
            return index;
          }
          index++;
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return index;
    }
  }, {
    key: 'merge',
    value: function merge(departTimes, arriveTimes, skip) {
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = skip[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var x = _step3.value;

          departTimes.delete(x);
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      var arr = [];
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = departTimes.keys()[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var train = _step4.value;

          if (arriveTimes.has(train)) {
            arr.push([train, departTimes.get(train), arriveTimes.get(train)]);
          }
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      var sorted = arr.sort(function (a, b) {
        return a[1] - b[1];
      });
      return sorted;
    }
  }, {
    key: 'select',
    value: function select(direction, schedule) {
      if (schedule === 'Modified') {
        return direction === 'North' ? caltrainServiceData.northModified : caltrainServiceData.southModified;
      } else if (schedule === 'Weekday') {
        return direction === 'North' ? caltrainServiceData.northWeekday : caltrainServiceData.southWeekday;
      } else {
        return direction === 'North' ? caltrainServiceData.northWeekend : caltrainServiceData.southWeekend;
      }
    }
  }]);

  return CaltrainService;
}();
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var CaltrainTrip = function () {
  function CaltrainTrip(trip, schedule) {
    _classCallCheck(this, CaltrainTrip);

    this.trip = trip;
    this.schedule = schedule;
    this.stops = [];
    this.times = [];
    this.direction = trip % 2 === 0 ? 'South' : 'North';
    this.setService();
  }

  _createClass(CaltrainTrip, [{
    key: 'setService',
    value: function setService() {
      var mins = CaltrainService.tripStops(this.trip, this.direction, this.schedule);
      var strs = this.direction === 'North' ? caltrainServiceData.northStops : caltrainServiceData.southStops;
      this.times = [];
      this.stops = [];

      for (var i = 0; i < mins.length; i++) {
        if (mins[i] == undefined) continue;
        this.times.push(mins[i]);
        this.stops.push(strs[i]);
      }
    }
  }, {
    key: 'label',
    value: function label() {
      return `${this.directionString()} #${this.trip} ${CaltrainTrip.type(this.trip)}`;
    }
  }, {
    key: 'directionString',
    value: function directionString() {
      return this.direction[0] + 'B';
    }
  }], [{
    key: 'type',
    value: function type(trip) {
      if (trip > 900) {
        return 'Unknown';
      } else if (trip > 800) {
        return 'Baby Bullet';
      } else if (trip > 500) {
        return 'Limited';
      } else if (trip > 400) {
        return 'Local';
      } else if (trip > 300) {
        return 'Baby Bullet';
      } else if (trip > 200) {
        return 'Limited';
      } else if (trip > 100) {
        return 'Local';
      } else {
        return 'Unknown';
      }
    }
  }]);

  return CaltrainTrip;
}();
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GoodTimes = function () {
  function GoodTimes() {
    _classCallCheck(this, GoodTimes);

    var now = new Date();
    var run = new Date(now.getTime() - 2 * 60 * 60 * 1000);
    this.date = run.toJSON().slice(0, 10);
    this.minutes = (run.getHours() + 2) * 60 + run.getMinutes();
    this.seconds = run.getSeconds();
    this.dotw = run.getDay();
  }

  _createClass(GoodTimes, [{
    key: 'partTime',
    value: function partTime() {
      return GoodTimes.partTime(this.minutes);
    }
  }, {
    key: 'fullTime',
    value: function fullTime() {
      return GoodTimes.fullTime(this.minutes);
    }
  }, {
    key: 'inThePast',
    value: function inThePast(target) {
      return target - this.minutes < 0;
    }
  }, {
    key: 'departing',
    value: function departing(target) {
      return target === this.minutes;
    }
  }, {
    key: 'countdown',
    value: function countdown(target) {
      var minutes = target - this.minutes - 1;
      if (minutes < 0) {
        return '';
      } else if (minutes > 59) {
        return `in ${Math.floor(minutes / 60)} hr ${minutes % 60} min`;
      } else {
        return `in ${minutes} min ${60 - this.seconds} sec`;
      }
    }
  }], [{
    key: 'partTime',
    value: function partTime(minutes) {
      var hrs = Math.floor(minutes / 60);
      var min = minutes % 60;
      if (min < 10) {
        min = '0' + min;
      }
      var mer = hrs > 11 && hrs < 24 ? 'pm' : 'am';
      if (hrs > 12) {
        hrs -= 12;
        if (hrs > 12) {
          hrs -= 12;
        }
      }
      if (hrs < 1) {
        hrs = 12;
      }
      return [`${hrs}:${min}`, mer];
    }
  }, {
    key: 'fullTime',
    value: function fullTime(minutes) {
      return GoodTimes.partTime(minutes).join('');
    }
  }, {
    key: 'dateString',
    value: function dateString(miliseconds) {
      return new Date(miliseconds).toString().split(' ').slice(1, 4).join(' ');
    }
  }]);

  return GoodTimes;
}();
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LocalStorage = function () {
  function LocalStorage(stations) {
    _classCallCheck(this, LocalStorage);

    this.stations = stations;
    this.flipped = new Date().getHours() >= 12;
    var savedAM = parseInt(localStorage.getItem('stopAM'));
    var savedPM = parseInt(localStorage.getItem('stopPM'));
    if (Number.isNaN(savedAM) || savedAM < 0 || savedAM >= stations.length) {
      localStorage.setItem('stopAM', 16);
    }
    if (Number.isNaN(savedAM) || savedPM < 0 || savedPM >= stations.length) {
      localStorage.setItem('stopPM', 0);
    }
    this.stopAM = parseInt(localStorage.getItem('stopAM'));
    this.stopPM = parseInt(localStorage.getItem('stopPM'));
  }

  _createClass(LocalStorage, [{
    key: 'saveStops',
    value: function saveStops() {
      localStorage.setItem('stopAM', this.stopAM);
      localStorage.setItem('stopPM', this.stopPM);
    }
  }, {
    key: 'flipStations',
    value: function flipStations() {
      this.flipped = this.flipped ? false : true;
    }
  }, {
    key: 'tripLabels',
    value: function tripLabels() {
      this.origin = this.stations[this.flipped ? this.stopPM : this.stopAM];
      this.destin = this.stations[this.flipped ? this.stopAM : this.stopPM];
      if (this.origin.length + 3 >= this.destin.length) {
        return [this.origin, `to ${this.destin}`];
      } else {
        return [`${this.origin} to`, this.destin];
      }
    }
  }, {
    key: 'bumpStations',
    value: function bumpStations(origin, increment) {
      var max = this.stations.length - 1;
      if (this.flipped) origin = !origin;
      if (origin && !increment) {
        this.stopAM = this.stopAM === max ? 0 : ++this.stopAM;
      } else if (origin && increment) {
        this.stopAM = this.stopAM < 1 ? max : --this.stopAM;
      } else if (!origin && !increment) {
        this.stopPM = this.stopPM === max ? 0 : ++this.stopPM;
      } else if (!origin && increment) {
        this.stopPM = this.stopPM < 1 ? max : --this.stopPM;
      }
    }
  }]);

  return LocalStorage;
}();
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var prefs = new LocalStorage(caltrainServiceData.southStops);
var service = new CaltrainService();
var app = false;
var kaiWeb1 = false;
var kaiWeb2 = false;
var kaiWeb = false;
var schedule = null;
var countdown = null;
var trainId = null;
var offset = null;
var goodTime = null;
var skip = false;
var vh = 228;
var splash = false;
var hintIndex = -1;
var menuIndex = 0;
var listing = null;

var OK = 13;
var BACK = 95;
var HANGUP = 8;
var ESC = 27;
var UP = 38;
var DOWN = 40;


var screens = 'splash hero grid trip menu about commands'.split(' ');
var titles = { 'about': 'About Next Caltrain', 'commands': 'Keypad commands' };

var hints = [['Set your origin', [1, 3], 'Use [1] and [3] keys to<br/>set your origin station.'], ['Set destination', [4, 6], 'Use [4] and [6] keys to<br/>set destination station.'], ['Flip direction', ['c'], 'Press the [CALL] button to<br/>flip the selected stations'], ['Change schedule', ['l'], 'Press the [LEFT] softkey<br/>to cycle through schedules.'], ['Save stations', ['r'], 'Press the [RIGHT] softkey<br/>once to "Save Stations".'], ['Bookmark app', ['l'], 'Press the [RIGHT] softkey<br/>twice to "Pin to Apps Menu".']];

var NextCaltrain = function () {
  function NextCaltrain() {
    _classCallCheck(this, NextCaltrain);
  }

  _createClass(NextCaltrain, null, [{
    key: 'startApp',
    value: function startApp() {
      if (document.location.search === '?app') app = true;else if (document.location.search === '?kaiWeb1' || navigator.userAgent.toLowerCase().indexOf('kaios/1') > -1) kaiWeb1 = true;else if (document.location.search === '?kaiWeb2' || navigator.userAgent.toLowerCase().indexOf('kaios/2') > -1) kaiWeb2 = true;
      kaiWeb = kaiWeb1 || kaiWeb2;
      if (app || !kaiWeb) {
        if (!app) {
          document.getElementById('keypad').style['display'] = 'flex';
        }
        document.getElementById('softkey-menu').style['display'] = 'flex';
        document.getElementById('about-filler').style['display'] = 'flex';
        document.getElementById('commands-filler').style['display'] = 'flex';
        document.getElementById('content').className = 'full-screen';
      } else {
        document.getElementById('content').className = 'part-screen';
        document.getElementById('hero-screen').style['display'] = 'none';
        document.getElementById('splash-screen').style['display'] = 'flex';
        splash = true;
      }

      var dateString = GoodTimes.dateString(caltrainServiceData.scheduleDate);
      listing = document.getElementById('listing');
      document.getElementById('date-string').innerHTML = dateString;
      NextCaltrain.attachListeners();
      NextCaltrain.setTheTime();
      NextCaltrain.formatHints();
    }
  }, {
    key: 'formatHints',
    value: function formatHints() {
      if (!kaiWeb) hints = hints.slice(0, 5);
      for (var i = 0; i < hints.length; i++) {
        for (var n = 0; n < 2; n++) {
          hints[i][n * 2] = hints[i][n * 2].replace(/\[/g, '<span class=\'btn\'>').replace(/\]/g, '</span>');
          if (kaiWeb1) hints[i][n * 2] = hints[i][n * 2].replace(/Apps Menu/, 'Top Sites');
        }
      }
    }
  }, {
    key: 'bumpKeypadHint',
    value: function bumpKeypadHint() {
      hintIndex++;
      if (hintIndex >= hints.length) {
        hintIndex = -1;
        NextCaltrain.displayScreen('hero');
        return;
      } else if (hintIndex == hints.length - 1 && app) {
        NextCaltrain.populateSoftkeyMenu('', 'OK', '');
      }
      document.getElementById('hint-above').innerHTML = hints[hintIndex][0];
      document.getElementById('hint-below').innerHTML = hints[hintIndex][2];
      if (Array.isArray(hints[hintIndex][1])) {
        document.getElementById('mini-keypad').style['display'] = 'flex';
        document.getElementById('hint-center').style['display'] = 'none';
        for (var i = 1; i < 15; i++) {
          var key = i < 10 ? i : ['l', 'r', 'c', 'o', 'h'][i - 10];
          var cls = hints[hintIndex][1].indexOf(key) == -1 ? 'default' : 'selected';
          document.getElementById(`k${key}`).className = cls;
        }
      } else {
        document.getElementById('mini-keypad').style['display'] = 'none';
        document.getElementById('hint-center').style['display'] = 'block';
        document.getElementById('hint-center').innerHTML = hints[hintIndex][1];
      }
    }
  }, {
    key: 'moveMenuSelection',
    value: function moveMenuSelection() {
      var menuOptions = document.getElementById('menu-list').getElementsByTagName('li');
      if (menuIndex >= menuOptions.length) {
        menuIndex = 0;
      } else if (menuIndex < 0) {
        menuIndex = menuOptions.length - 1;
      }
      for (var i = 0; i < menuOptions.length; i++) {
        menuOptions[i].className = menuIndex === i ? 'selected' : '';
      }
    }
  }, {
    key: 'setTheTime',
    value: function setTheTime() {
      var ourTime = new GoodTimes();
      var partTime = ourTime.partTime();
      schedule = new CaltrainSchedule(ourTime);
      document.getElementById('time').innerHTML = partTime[0];
      document.getElementById('ampm').innerHTML = partTime[1].toUpperCase();
      setTimeout(function () {
        NextCaltrain.setTheTime();
      }, (60 - ourTime.seconds) * 1000);
      NextCaltrain.loadSchedule();
    }
  }, {
    key: 'setCountdown',
    value: function setCountdown(minutes) {
      var downTime = new GoodTimes();
      var blurb = downTime.countdown(minutes);
      document.getElementById('blurb-grid').innerHTML = blurb;
      document.getElementById('blurb-hero').innerHTML = blurb;
      if (blurb !== '') {
        var refresh = blurb.endsWith('sec') ? 1000 : (60 - downTime.seconds) * 1000;
        countdown = setTimeout(function () {
          NextCaltrain.setCountdown(minutes);
        }, refresh);
      }
    }
  }, {
    key: 'populateStops',
    value: function populateStops(labels) {
      document.getElementById('origin-grid').innerHTML = labels[0];
      document.getElementById('destin-grid').innerHTML = labels[1];
      document.getElementById('origin-hero').innerHTML = labels[0];
      document.getElementById('destin-hero').innerHTML = labels[1];
    }
  }, {
    key: 'populateBlurb',
    value: function populateBlurb(message, textClass) {
      document.getElementById('blurb-grid').innerHTML = message;
      document.getElementById('blurb-grid').className = textClass;
      document.getElementById('blurb-hero').innerHTML = message.replace(' Schedule', '');
      document.getElementById('blurb-hero').className = textClass;
    }
  }, {
    key: 'populateSoftkeyMenu',
    value: function populateSoftkeyMenu(left, center, right) {
      document.getElementById('softkey-left').innerHTML = left;
      document.getElementById('softkey-center').innerHTML = center;
      document.getElementById('softkey-right').innerHTML = right;
    }
  }, {
    key: 'loadTrip',
    value: function loadTrip(train) {
      goodTime = new GoodTimes();
      var trip = new CaltrainTrip(train, schedule.label());
      var lines = [];
      for (var i = 0; i < trip.times.length; i++) {
        var stop = trip.times[i];
        var spacer = i === 0 ? '' : '|';
        var fullTime = GoodTimes.fullTime(stop[1]);
        var filler = fullTime.length > 6 ? '' : '0';
        var style = goodTime.inThePast(stop[1]) ? 'message-departed' : 'message-arriving';
        var target = prefs.origin === stop[0] || prefs.destin === stop[0] ? 'target' : '';
        lines.push(`<div class="station-stop">
          <div class="station-time"><br/><span
               class="hour-filler">${filler}</span>${fullTime}</div>
          <div class="station-spacer ${style}">${spacer}<br/><span
               class="station-dot ${target}">&#9679;</span></div>
          <div class="station-name"><br/>${stop[0]}</div></div>`);
      }
      listing.innerHTML = lines.join('\n');
      document.getElementById('trip-filler').innerHTML = trip.label();
      document.title = trip.label();
    }
  }, {
    key: 'loadSchedule',
    value: function loadSchedule() {
      goodTime = new GoodTimes();
      clearTimeout(countdown);
      NextCaltrain.populateStops(prefs.tripLabels());

      var routes = service.routes(prefs.origin, prefs.destin, schedule.label());
      var minutes = 0;
      if (offset === null) {
        minutes = goodTime.minutes;
        offset = CaltrainService.nextIndex(routes, minutes);
      } else if (offset > routes.length - 1) {
        offset = 0;
      } else if (offset < 0) {
        offset = routes.length - 1;
      }

      for (var i = 0; i < 6; i++) {
        var tripCardElement = document.getElementById(`trip${i}`);
        var n = offset + i > routes.length - 1 ? offset + i - routes.length : offset + i;
        var route = routes[n];
        if (i > routes.length - 1) {
          if (i === 0) {
            trainId = null;
            NextCaltrain.populateBlurb('NO TRAINS', 'message-departed blink');
            document.getElementById('circle').className = 'selection-departed';
            document.getElementById('trip0').className = 'selection-none';
            document.getElementById('trip').innerHTML = '<span class="time-hero">&nbsp;</span>';
            document.getElementById('trip-type').innerHTML = '&nbsp;';
            document.getElementById('title').innerHTML = 'Next Caltrain';
            document.title = 'Next Caltrain';
          }
          tripCardElement.innerHTML = '<div class="train-time">&nbsp;</div>';
          continue;
        }
        minutes = route[1];
        var originTime = GoodTimes.partTime(minutes);
        var destinTime = GoodTimes.partTime(route[2]);
        var card = `<div class="train-number">#${route[0]}</div>
          <div class="train-time">${originTime[0]}<span class="meridiem">${originTime[1]}</span></div>
          <div class="train-time">${destinTime[0]}<span class="meridiem">${destinTime[1]}</span></div>`;
        tripCardElement.innerHTML = card;
        if (i === 0) {
          var tripTime = `<span class="train-hero">#${route[0]}</span>
            <span class="time-hero">${originTime[0]}</span>
            <span class="meridiem-hero">${originTime[1]}</span>`;
          document.getElementById('trip').innerHTML = tripTime;
          trainId = route[0];
          var message = void 0,
              textClass = void 0,
              tripClass = void 0,
              wrapClass = void 0;
          if (schedule.swapped()) {
            message = schedule.label() + ' Schedule';
            textClass = 'message-departed';
            tripClass = goodTime.inThePast(minutes) ? 'message-departed' : '';
            wrapClass = 'selection-departed';
          } else if (goodTime.inThePast(minutes)) {
            message = schedule.label() + ' Schedule';
            textClass = 'message-departed';
            tripClass = 'message-departed';
            wrapClass = 'selection-departed';
          } else if (goodTime.departing(minutes)) {
            message = 'DEPARTING';
            textClass = 'message-departing blink';
            wrapClass = 'selection-departing';
          } else {
            message = goodTime.countdown(minutes);
            textClass = 'message-arriving';
            wrapClass = 'selection-arriving';
            if (minutes > 0) {
              NextCaltrain.setCountdown(minutes);
            }
          }
          document.getElementById('circle').className = wrapClass;
          document.getElementById('trip').className = tripClass;
          document.getElementById('trip-type').innerHTML = CaltrainTrip.type(trainId);
          if (trainId && NextCaltrain.currentScreen() === 'grid') {
            document.getElementById('title').innerHTML = `${CaltrainTrip.type(trainId)} Service`;
            document.title = `${CaltrainTrip.type(trainId)} Service`;
          }
          tripCardElement.className = ['trip-card', 'selection', tripClass, wrapClass].join(' ');
          NextCaltrain.populateBlurb(message, textClass);
        } else {
          if (goodTime.inThePast(minutes)) {
            tripCardElement.className = 'trip-card message-departed';
          } else {
            tripCardElement.className = 'trip-card';
          }
        }
      }
    }
  }, {
    key: 'currentScreen',
    value: function currentScreen() {
      for (var i = 0; i < screens.length; i++) {
        if (document.getElementById(`${screens[i]}-screen`).style['display'] === 'flex') return screens[i];
      }
      return screens[0];
    }
  }, {
    key: 'displayScreen',
    value: function displayScreen(target) {
      for (var i = 0; i < screens.length; i++) {
        var display = target === screens[i] ? 'flex' : 'none';
        document.getElementById(`${screens[i]}-screen`).style['display'] = display;
      }

      if (!kaiWeb) {
        if (target === 'hero') {
          NextCaltrain.populateSoftkeyMenu('', 'SELECT', 'Options');
        } else if (target === 'grid') {
          NextCaltrain.populateSoftkeyMenu('', 'SELECT', 'Options');
        } else if (target === 'trip') {
          NextCaltrain.populateSoftkeyMenu('', 'BACK', 'Options');
        } else if (target === 'menu') {
          NextCaltrain.populateSoftkeyMenu('', 'SELECT', '');
        } else if (target === 'about') {
          NextCaltrain.populateSoftkeyMenu('', 'OK', '');
        } else if (target === 'commands') {
          NextCaltrain.populateSoftkeyMenu('', 'NEXT', '');
        }
      }

      document.getElementById('title').innerHTML = 'Next Caltrain';
      document.title = target in titles ? titles[target] : 'Next Caltrain';

      if (target === 'grid' || target === 'hero') {
        NextCaltrain.loadSchedule();
      }
    }
  }, {
    key: 'attachListeners',
    value: function attachListeners() {
      document.addEventListener('DOMContentLoaded', function () {
        if (app && navigator.userAgent.toLowerCase().indexOf('kaios/2') > -1) {
          getKaiAd({
            publisher: '8400043d-1768-4179-8a02-6bc7f7e62a25',
            app: 'NextCaltrain',
            slot: 'mainAdUnit',
            test: 0,
            onerror: function onerror(err) {
              return console.error('Custom catch:', err);
            },
            onready: function onready(ad) {
              ad.call('display');
            }
          });
        }
      });
      document.addEventListener('mousemove', function (e) {
        if (!kaiWeb) return;
        skip = skip ? false : true;

        if (kaiWeb && splash && e.clientX >= 239) {
          splash = false;
          NextCaltrain.displayScreen('hero');
        } else if (kaiWeb && !splash && e.clientX < 239) {
          splash = true;
          NextCaltrain.displayScreen('splash');
        } else if (e.mozMovementY > 0) {
          NextCaltrain.press(DOWN);
          if (skip) {
            NextCaltrain.press(DOWN);
            skip = false;
          }
        } else if (e.mozMovementY < 0) {
          NextCaltrain.press(UP);
          if (skip) {
            NextCaltrain.press(UP);
            skip = false;
          }
        } else if (e.mozMovementX === 0 && !skip) {
          if (e.clientY === 0) {
            NextCaltrain.press(UP);
          } else if (e.clientY >= vh - 1) {
            NextCaltrain.press(DOWN);
          }
        }
      });

      document.addEventListener('click', function () {
        if (kaiWeb) {
          NextCaltrain.press(OK);
        }
      });

      document.addEventListener('keydown', function (e) {
        var code = e.keyCode ? e.keyCode : e.which;
        if (code === HANGUP) {
          code = BACK;
          if (NextCaltrain.currentScreen() !== 'hero') {
            e.preventDefault();
          } else {
            return;
          }
        } else if (e.key === 'Call' || code === 220) {
          code = 'flip';
        } else if (e.key === 'SoftLeft' || e.key === '[') {
          code = 'cycle';

          e.preventDefault();
        } else if (e.key === 'SoftRight' || e.key === ']') {
          if (NextCaltrain.currentScreen() !== 'menu') {
            e.preventDefault();
            code = 'menu';
          } else {
            code = BACK;
          }
        } else if (e.key === '1' || e.key === '3') {
          e.preventDefault();
        } else if (e.key === '2') {
          e.preventDefault();
        } else if (code === OK) {
          e.preventDefault();
        }
        NextCaltrain.press(code);
      });
    }
  }, {
    key: 'press',
    value: function press(code) {
      if (splash) return;
      if (code === ESC) {
        NextCaltrain.displayScreen('hero');
      } else if (code === 'prefs') {
        var confirmation = ['Save', prefs.flipped ? prefs.destin : prefs.origin, 'as morning and', prefs.flipped ? prefs.origin : prefs.destin, 'as evening default stations?'].join(' ');
        if (confirm(confirmation)) prefs.saveStops();
      } else if (code === 'about') {
        NextCaltrain.displayScreen('about');
      } else if (code === 'commands') {
        NextCaltrain.bumpKeypadHint();
        NextCaltrain.displayScreen('commands');
      } else if (NextCaltrain.currentScreen() === 'about') {
        if (code == OK || code == BACK) {
          NextCaltrain.displayScreen('hero');
        }
      } else if (NextCaltrain.currentScreen() === 'commands') {
        if (code == OK) {
          NextCaltrain.bumpKeypadHint();
        } else if (code == BACK) {
          hintIndex = -1;

          NextCaltrain.displayScreen('hero');
        }
      } else if (NextCaltrain.currentScreen() === 'menu') {
        if (code === OK) {
          var menuOptions = document.getElementById('menu-list').getElementsByTagName('li');
          var action = menuOptions[menuIndex].getAttribute('value');
          menuIndex = 0;
          if (action === 'prefs') NextCaltrain.displayScreen('hero');
          NextCaltrain.press(action);
        } else if (code == UP) {
          menuIndex--;
        } else if (code == DOWN) {
          menuIndex++;
        } else if (code === BACK) {
          menuIndex = 0;
          NextCaltrain.displayScreen('hero');
        }
        NextCaltrain.moveMenuSelection();
      } else if (code === 'menu') {
        menuIndex = 0;
        NextCaltrain.displayScreen('menu');
      } else if (NextCaltrain.currentScreen() === 'trip') {
        if (code === OK || code === BACK) {
          NextCaltrain.displayScreen('grid');
        } else if (code === UP) {
          if (listing.scrollTop > 0) listing.scrollTo(0, listing.scrollTop - 72);
        } else if (code === DOWN) {
          if (listing.scrollTop < listing.scrollHeight - 228) listing.scrollTo(0, listing.scrollTop + 72);
        }
      } else if (code === OK && NextCaltrain.currentScreen() === 'grid' && trainId !== null) {
        NextCaltrain.displayScreen('trip');
        NextCaltrain.loadTrip(trainId);
      } else {
        if (code === BACK) {
          NextCaltrain.displayScreen('hero');
        } else if (code === OK) {
          NextCaltrain.displayScreen('grid');
        } else if (code === UP) {
          offset--;
        } else if (code === DOWN) {
          offset++;
        } else if (code === 49) {
          offset = null;
          prefs.bumpStations(true, false);
        } else if (code === 51) {
          offset = null;
          prefs.bumpStations(true, true);
        } else if (code === 52) {
          offset = null;
          prefs.bumpStations(false, false);
        } else if (code === 54) {
          offset = null;
          prefs.bumpStations(false, true);
        } else if (code === 'flip') {
          offset = null;
          prefs.flipStations();
        } else if (code === 'cycle') {
          schedule.next();
          offset = null;
        } else {
          return;
        }
        NextCaltrain.loadSchedule();
      }
    }
  }]);

  return NextCaltrain;
}();
