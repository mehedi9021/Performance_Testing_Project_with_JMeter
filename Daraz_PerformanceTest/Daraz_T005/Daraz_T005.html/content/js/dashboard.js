/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 78.42003853564547, "KoPercent": 21.57996146435453};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.2144194756554307, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://member.daraz.com.bd/user/api/getUser"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-20"], "isController": false}, {"data": [0.5666666666666667, 500, 1500, "https://helpcenter.daraz.com.bd/page/queryPlugin?pageId=1"], "isController": false}, {"data": [0.0, 500, 1500, "https://helpcenter.daraz.com.bd/headerFooter/queryICMSHeader?pageId=1&language=en"], "isController": false}, {"data": [0.4, 500, 1500, "https://helpcenter.daraz.com.bd/headerFooter/queryICMSFooter?pageId=1&language=en"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [0.9333333333333333, 500, 1500, "https://helpcenter.daraz.com.bd/page/home/config/knowledge?pageId=1&ids=1000032753,1000074714,1000016609,1000036089,1000036086,1000015952,1000016611,1000005333,1000079379"], "isController": false}, {"data": [0.0, 500, 1500, "https://my.daraz.com.bd/api/recentOrders/"], "isController": false}, {"data": [0.0, 500, 1500, "https://member.daraz.com.bd/user/api/getContextInfo"], "isController": false}, {"data": [0.0, 500, 1500, "https://cart.daraz.com.bd/cart/api/count"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-0"], "isController": false}, {"data": [0.0, 500, 1500, "https://helpcenter.daraz.com.bd/"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-2"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-11"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-1"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-10"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-4"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-13"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-12"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-6"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-15"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://helpcenter.daraz.com.bd/page/home/config/category?pageId=1&ids="], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-5"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-14"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-8"], "isController": false}, {"data": [0.07142857142857142, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-17"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-7"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-16"], "isController": false}, {"data": [0.10714285714285714, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-19"], "isController": false}, {"data": [0.9, 500, 1500, "https://helpcenter.daraz.com.bd/navigation?language=en&pageId=1"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-9"], "isController": false}, {"data": [0.07142857142857142, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-18"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://helpcenter.daraz.com.bd/announcement/page?language=en&pageId=1"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "https://helpcenter.daraz.com.bd/page/home/config/category?pageId=1&ids=1000001016,1000001019,1000001017,1000001020,1000001021,1000001022,1000001018,1000001023"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 519, 112, 21.57996146435453, 17236.98073217727, 0, 141228, 12175.0, 38517.0, 51921.0, 124519.99999999975, 2.216755080597627, 192.13816925768603, 1.8366679426889794], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://member.daraz.com.bd/user/api/getUser", 15, 0, 0.0, 184.60000000000002, 65, 311, 243.0, 309.2, 311.0, 311.0, 0.49943397482852764, 0.4074483814177266, 0.3004407504827862], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-20", 14, 2, 14.285714285714286, 10445.785714285714, 128, 37989, 1193.0, 37192.0, 37989.0, 37989.0, 0.09934009792095366, 0.8885312078691548, 0.05246953274675371], "isController": false}, {"data": ["https://helpcenter.daraz.com.bd/page/queryPlugin?pageId=1", 15, 0, 0.0, 863.0, 91, 2329, 662.0, 2289.4, 2329.0, 2329.0, 1.739937362254959, 14.889717876406449, 0.7731166990488342], "isController": false}, {"data": ["https://helpcenter.daraz.com.bd/headerFooter/queryICMSHeader?pageId=1&language=en", 15, 0, 0.0, 13928.333333333332, 6851, 17862, 14306.0, 17188.2, 17862.0, 17862.0, 0.704390702042733, 152.64366635360412, 0.47601402911481566], "isController": false}, {"data": ["https://helpcenter.daraz.com.bd/headerFooter/queryICMSFooter?pageId=1&language=en", 15, 0, 0.0, 1536.6000000000001, 350, 3681, 1321.0, 3276.0, 3681.0, 3681.0, 1.0470473265391596, 29.346977850586345, 0.7075749511377915], "isController": false}, {"data": ["Test", 15, 15, 100.0, 183804.6666666667, 76654, 234111, 201395.0, 219180.0, 234111.0, 234111.0, 0.0640721708932942, 93.16431528473673, 1.1649705561678008], "isController": true}, {"data": ["https://helpcenter.daraz.com.bd/page/home/config/knowledge?pageId=1&ids=1000032753,1000074714,1000016609,1000036089,1000036086,1000015952,1000016611,1000005333,1000079379", 15, 0, 0.0, 295.8666666666667, 85, 1037, 246.0, 884.6000000000001, 1037.0, 1037.0, 1.3153279551034724, 1.8432574370834796, 1.0237464650561208], "isController": false}, {"data": ["https://my.daraz.com.bd/api/recentOrders/", 15, 0, 0.0, 20320.4, 2756, 57017, 18405.0, 42248.00000000001, 57017.0, 57017.0, 0.1283653105584747, 0.15311908984715972, 0.07684368688705565], "isController": false}, {"data": ["https://member.daraz.com.bd/user/api/getContextInfo", 15, 0, 0.0, 11798.133333333333, 2633, 24996, 10480.0, 24316.2, 24996.0, 24996.0, 0.4626488187033496, 0.49445592498920493, 0.1960835813645056], "isController": false}, {"data": ["https://cart.daraz.com.bd/cart/api/count", 15, 0, 0.0, 13623.533333333333, 2101, 32158, 13639.0, 23837.800000000003, 32158.0, 32158.0, 0.24217766153250025, 0.21887436831993282, 0.14473899302528334], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-0", 17, 0, 0.0, 31433.529411764706, 2971, 71262, 24349.0, 66516.4, 71262.0, 71262.0, 0.097850174115751, 22.693899383400005, 0.07006562616916567], "isController": false}, {"data": ["https://helpcenter.daraz.com.bd/", 15, 0, 0.0, 8022.799999999999, 4700, 14088, 7740.0, 13033.2, 14088.0, 14088.0, 0.9239866945915979, 0.28423418827768876, 0.546812438400887], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-2", 17, 3, 17.647058823529413, 20274.058823529413, 5195, 46649, 20236.0, 31424.999999999985, 46649.0, 46649.0, 0.09670244657189828, 6.3286162893138105, 0.06397760094028908], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-11", 14, 13, 92.85714285714286, 16931.0, 1, 32042, 14156.5, 32020.0, 32042.0, 32042.0, 0.07740194831761336, 29.623673627774032, 0.03688146686367306], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-1", 17, 6, 35.294117647058826, 24021.058823529416, 4444, 46904, 18388.0, 45898.4, 46904.0, 46904.0, 0.09711677435203117, 5.005843073574526, 0.04133376500311345], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-10", 14, 8, 57.142857142857146, 14028.428571428572, 1, 26070, 14088.0, 25522.5, 26070.0, 26070.0, 0.09037272293014188, 1.359095812838091, 0.024736507029706808], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-4", 17, 4, 23.529411764705884, 20784.235294117647, 4626, 60822, 16334.0, 50405.99999999999, 60822.0, 60822.0, 0.09701978062115488, 0.7466867031537135, 0.04770176369120316], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-13", 14, 5, 35.714285714285715, 20024.71428571429, 1, 54024, 17008.0, 46775.0, 54024.0, 54024.0, 0.09201869294019442, 0.43864853912109003, 0.03835823863076185], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-3", 17, 4, 23.529411764705884, 24469.176470588238, 7272, 51921, 21583.0, 47505.799999999996, 51921.0, 51921.0, 0.08837734005001117, 30.09822617418394, 0.04566094878273211], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-12", 14, 4, 28.571428571428573, 17269.428571428576, 544, 40930, 16725.5, 36533.0, 40930.0, 40930.0, 0.09237204821820917, 0.5596124971958485, 0.04278392858321072], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-6", 14, 2, 14.285714285714286, 23378.357142857145, 7527, 47584, 24204.5, 47245.5, 47584.0, 47584.0, 0.09374581491897682, 0.3342571899691978, 0.05155496685415829], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-15", 14, 3, 21.428571428571427, 10460.999999999998, 0, 39717, 3026.5, 32103.0, 39717.0, 39717.0, 0.09150506219076192, 0.23617956969744502, 0.04612912140434126], "isController": false}, {"data": ["https://helpcenter.daraz.com.bd/page/home/config/category?pageId=1&ids=", 15, 0, 0.0, 253.93333333333334, 147, 529, 246.0, 379.0000000000001, 529.0, 529.0, 1.0413051023950017, 1.0036798203748698, 0.6935254685872961], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-5", 14, 1, 7.142857142857143, 24182.71428571429, 7155, 39347, 23143.5, 38842.0, 39347.0, 39347.0, 0.09203926131918559, 6.4325787757463395, 0.054083338264008046], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-14", 14, 5, 35.714285714285715, 21926.5, 0, 50036, 22183.0, 46604.0, 50036.0, 50036.0, 0.09104565939818819, 0.2576726798802099, 0.03709526343086057], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-8", 14, 10, 71.42857142857143, 13498.571428571428, 2, 22932, 14298.0, 21890.0, 22932.0, 22932.0, 0.08955128410144882, 0.29114161895928614, 0.015441599769725268], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-17", 14, 3, 21.428571428571427, 20158.92857142857, 143, 50287, 14827.5, 48883.0, 50287.0, 50287.0, 0.09251366228548394, 1.3280189087187517, 0.04436603154385478], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-7", 14, 5, 35.714285714285715, 21523.214285714286, 827, 37894, 20525.5, 37441.5, 37894.0, 37894.0, 0.08673779165582444, 1.5938734755058672, 0.035775708849113415], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-16", 14, 7, 50.0, 26475.85714285714, 4, 55267, 23241.0, 54865.0, 55267.0, 55267.0, 0.08896797153024912, 3.1122778779550075, 0.02893196730427046], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-19", 14, 2, 14.285714285714286, 17612.357142857138, 862, 45017, 16159.0, 41712.5, 45017.0, 45017.0, 0.09466239333576751, 15.34824984448321, 0.13185119071767618], "isController": false}, {"data": ["https://helpcenter.daraz.com.bd/navigation?language=en&pageId=1", 15, 0, 0.0, 400.06666666666666, 196, 1506, 293.0, 1108.2000000000003, 1506.0, 1506.0, 1.0245901639344264, 1.8210489241803278, 0.6743884477459016], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-9", 14, 7, 50.0, 13908.428571428572, 5, 24149, 13805.0, 23824.0, 24149.0, 24149.0, 0.08970621215519174, 5.49291611267741, 0.028076993159901323], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-18", 14, 3, 21.428571428571427, 23333.85714285714, 176, 62244, 22437.0, 53447.0, 62244.0, 62244.0, 0.09626094968302645, 1.7294002104848802, 0.04978227406179953], "isController": false}, {"data": ["https://helpcenter.daraz.com.bd/announcement/page?language=en&pageId=1", 15, 0, 0.0, 290.6666666666667, 171, 512, 269.0, 503.0, 512.0, 512.0, 1.0341261633919339, 1.0432151628748707, 0.6877342942088934], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/", 15, 15, 100.0, 111868.40000000001, 38228, 141228, 117360.0, 140370.6, 141228.0, 141228.0, 0.07672830507174097, 91.31824223445612, 0.7703951427785877], "isController": false}, {"data": ["https://helpcenter.daraz.com.bd/page/home/config/category?pageId=1&ids=1000001016,1000001019,1000001017,1000001020,1000001021,1000001022,1000001018,1000001023", 15, 0, 0.0, 418.33333333333337, 151, 2288, 264.0, 1232.0000000000007, 2288.0, 2288.0, 1.0506408909434755, 1.2322458105694474, 0.8033709156335365], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: laz-img-cdn.alicdn.com:443 failed to respond", 9, 8.035714285714286, 1.7341040462427746], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: maxcdn.bootstrapcdn.com:443 failed to respond", 3, 2.6785714285714284, 0.5780346820809249], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: img.alicdn.com:443 failed to respond", 6, 5.357142857142857, 1.1560693641618498], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 23, 20.535714285714285, 4.431599229287091], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.daraz.com.bd:443 failed to respond", 1, 0.8928571428571429, 0.1926782273603083], "isController": false}, {"data": ["Assertion failed", 16, 14.285714285714286, 3.0828516377649327], "isController": false}, {"data": ["Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 7, 6.25, 1.348747591522158], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: fonts.googleapis.com:443 failed to respond", 2, 1.7857142857142858, 0.3853564547206166], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: cdnjs.cloudflare.com:443 failed to respond", 4, 3.5714285714285716, 0.7707129094412332], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 5, 4.464285714285714, 0.9633911368015414], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: laz-g-cdn.alicdn.com:443 failed to respond", 23, 20.535714285714285, 4.431599229287091], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 3, 2.6785714285714284, 0.5780346820809249], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: icms-image.slatic.net:443 failed to respond", 6, 5.357142857142857, 1.1560693641618498], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.youtube.com:443 failed to respond", 4, 3.5714285714285716, 0.7707129094412332], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 519, 112, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 23, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: laz-g-cdn.alicdn.com:443 failed to respond", 23, "Assertion failed", 16, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: laz-img-cdn.alicdn.com:443 failed to respond", 9, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 7], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-20", 14, 2, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: laz-g-cdn.alicdn.com:443 failed to respond", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-2", 17, 3, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 2, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: laz-g-cdn.alicdn.com:443 failed to respond", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-11", 14, 13, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 6, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.youtube.com:443 failed to respond", 4, "Assertion failed", 2, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, "", ""], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-1", 17, 6, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: laz-img-cdn.alicdn.com:443 failed to respond", 5, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-10", 14, 8, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: cdnjs.cloudflare.com:443 failed to respond", 4, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 3, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, "", "", "", ""], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-4", 17, 4, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: laz-g-cdn.alicdn.com:443 failed to respond", 3, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-13", 14, 5, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: img.alicdn.com:443 failed to respond", 4, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-3", 17, 4, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: laz-g-cdn.alicdn.com:443 failed to respond", 3, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-12", 14, 4, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: img.alicdn.com:443 failed to respond", 2, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-6", 14, 2, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: icms-image.slatic.net:443 failed to respond", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-15", 14, 3, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 2, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: icms-image.slatic.net:443 failed to respond", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-5", 14, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: laz-g-cdn.alicdn.com:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-14", 14, 5, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: laz-img-cdn.alicdn.com:443 failed to respond", 4, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-8", 14, 10, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 7, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: fonts.googleapis.com:443 failed to respond", 2, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, "", "", "", ""], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-17", 14, 3, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: laz-g-cdn.alicdn.com:443 failed to respond", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-7", 14, 5, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: icms-image.slatic.net:443 failed to respond", 3, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-16", 14, 7, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: laz-g-cdn.alicdn.com:443 failed to respond", 5, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-19", 14, 2, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: laz-g-cdn.alicdn.com:443 failed to respond", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-9", 14, 7, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: maxcdn.bootstrapcdn.com:443 failed to respond", 3, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 2, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 1, "", ""], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-18", 14, 3, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: laz-g-cdn.alicdn.com:443 failed to respond", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/", 15, 15, "Assertion failed", 14, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.daraz.com.bd:443 failed to respond", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
