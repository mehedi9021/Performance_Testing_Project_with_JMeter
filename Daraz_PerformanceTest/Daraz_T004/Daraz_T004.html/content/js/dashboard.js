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

    var data = {"OkPercent": 82.41965973534971, "KoPercent": 17.580340264650285};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.15808823529411764, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.8666666666666667, 500, 1500, "https://member.daraz.com.bd/user/api/getUser"], "isController": false}, {"data": [0.14285714285714285, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-20"], "isController": false}, {"data": [0.0, 500, 1500, "https://helpcenter.daraz.com.bd/page/queryPlugin?pageId=1"], "isController": false}, {"data": [0.0, 500, 1500, "https://helpcenter.daraz.com.bd/headerFooter/queryICMSHeader?pageId=1&language=en"], "isController": false}, {"data": [0.23333333333333334, 500, 1500, "https://helpcenter.daraz.com.bd/headerFooter/queryICMSFooter?pageId=1&language=en"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [0.8666666666666667, 500, 1500, "https://helpcenter.daraz.com.bd/page/home/config/knowledge?pageId=1&ids=1000032753,1000074714,1000016609,1000036089,1000036086,1000015952,1000016611,1000005333,1000079379"], "isController": false}, {"data": [0.0, 500, 1500, "https://my.daraz.com.bd/api/recentOrders/"], "isController": false}, {"data": [0.0, 500, 1500, "https://member.daraz.com.bd/user/api/getContextInfo"], "isController": false}, {"data": [0.0, 500, 1500, "https://cart.daraz.com.bd/cart/api/count"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-0"], "isController": false}, {"data": [0.0, 500, 1500, "https://helpcenter.daraz.com.bd/"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-2"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-11"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-1"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-10"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-4"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-13"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-12"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-6"], "isController": false}, {"data": [0.4642857142857143, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-15"], "isController": false}, {"data": [0.9, 500, 1500, "https://helpcenter.daraz.com.bd/page/home/config/category?pageId=1&ids="], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-5"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-14"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-8"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-17"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-7"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-16"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-19"], "isController": false}, {"data": [0.43333333333333335, 500, 1500, "https://helpcenter.daraz.com.bd/navigation?language=en&pageId=1"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-9"], "isController": false}, {"data": [0.25, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-18"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://helpcenter.daraz.com.bd/announcement/page?language=en&pageId=1"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://helpcenter.daraz.com.bd/page/home/config/category?pageId=1&ids=1000001016,1000001019,1000001017,1000001020,1000001021,1000001022,1000001018,1000001023"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 529, 93, 17.580340264650285, 15382.035916824187, 0, 116980, 11476.0, 32775.0, 48367.5, 97033.40000000004, 1.9408499381789766, 178.25183728940496, 1.7318227616937127], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://member.daraz.com.bd/user/api/getUser", 15, 0, 0.0, 792.1333333333334, 63, 6098, 251.0, 4204.4000000000015, 6098.0, 6098.0, 0.12662074554294975, 0.10125537874375337, 0.07615380516443815], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-20", 14, 2, 14.285714285714286, 9485.142857142857, 1, 26472, 6023.0, 25231.0, 26472.0, 26472.0, 0.08643362514971539, 0.7699562314013361, 0.04565258158716831], "isController": false}, {"data": ["https://helpcenter.daraz.com.bd/page/queryPlugin?pageId=1", 15, 0, 0.0, 7322.2, 2259, 50661, 4249.0, 24652.200000000015, 50661.0, 50661.0, 0.28687819151988064, 2.4549937424694477, 0.12747029017729072], "isController": false}, {"data": ["https://helpcenter.daraz.com.bd/headerFooter/queryICMSHeader?pageId=1&language=en", 15, 1, 6.666666666666667, 35576.40000000001, 1, 64680, 33650.0, 56769.00000000001, 64680.0, 64680.0, 0.22311468094600623, 45.156900751152754, 0.14072493678417372], "isController": false}, {"data": ["https://helpcenter.daraz.com.bd/headerFooter/queryICMSFooter?pageId=1&language=en", 15, 0, 0.0, 2978.5333333333333, 379, 12281, 2601.0, 8175.800000000003, 12281.0, 12281.0, 0.2546775781860165, 7.138184737809433, 0.17210633213351895], "isController": false}, {"data": ["Test", 15, 15, 100.0, 203264.53333333335, 117126, 272166, 179262.0, 271734.6, 272166.0, 272166.0, 0.05499319917436877, 84.78122860420844, 1.0672583152008535], "isController": true}, {"data": ["https://helpcenter.daraz.com.bd/page/home/config/knowledge?pageId=1&ids=1000032753,1000074714,1000016609,1000036089,1000036086,1000015952,1000016611,1000005333,1000079379", 15, 0, 0.0, 467.3999999999999, 190, 2623, 256.0, 1537.6000000000006, 2623.0, 2623.0, 0.2794076557697681, 0.39155272073204805, 0.2174686539536183], "isController": false}, {"data": ["https://my.daraz.com.bd/api/recentOrders/", 15, 0, 0.0, 18647.866666666665, 1513, 59755, 14026.0, 56150.8, 59755.0, 59755.0, 0.11205569915285891, 0.1320885734935979, 0.06706562775470261], "isController": false}, {"data": ["https://member.daraz.com.bd/user/api/getContextInfo", 15, 0, 0.0, 19748.533333333333, 1856, 66319, 12769.0, 63598.6, 66319.0, 66319.0, 0.12558606831882116, 0.13230688525619558, 0.05322690786168788], "isController": false}, {"data": ["https://cart.daraz.com.bd/cart/api/count", 15, 0, 0.0, 18321.13333333333, 1641, 64315, 8329.0, 62748.4, 64315.0, 64315.0, 0.12177795818956769, 0.10929888877613152, 0.07276550131926121], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-0", 19, 0, 0.0, 20114.789473684214, 4130, 62196, 12979.0, 40237.0, 62196.0, 62196.0, 0.1182239036288516, 25.357562897838992, 0.08352115313417792], "isController": false}, {"data": ["https://helpcenter.daraz.com.bd/", 15, 0, 0.0, 6154.000000000001, 3248, 8730, 6616.0, 8248.800000000001, 8730.0, 8730.0, 1.4847075126200138, 0.4567215492922894, 0.8786452662575472], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-2", 19, 5, 26.31578947368421, 18609.157894736843, 5037, 33488, 17183.0, 33335.0, 33488.0, 33488.0, 0.10904311794447984, 9.232223909281865, 0.06323671359825073], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-11", 14, 13, 92.85714285714286, 17337.071428571428, 1, 32775, 16238.0, 32642.0, 32775.0, 32775.0, 0.08157937673356176, 35.61468444259434, 0.050253032640491344], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-1", 19, 3, 15.789473684210526, 15867.526315789475, 2940, 27948, 15338.0, 25298.0, 27948.0, 27948.0, 0.11055445970871809, 5.5723118446738935, 0.06116407300085534], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-10", 14, 8, 57.142857142857146, 16627.5, 1, 29267, 18005.0, 28053.5, 29267.0, 29267.0, 0.08569557259945276, 1.2542242848245384, 0.023456293727696198], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-4", 19, 6, 31.57894736842105, 17635.315789473687, 6405, 33154, 16257.0, 31155.0, 33154.0, 33154.0, 0.11443508218245771, 0.8305071977408106, 0.04998300413170876], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-13", 14, 2, 14.285714285714286, 16327.000000000002, 401, 33745, 16026.5, 29179.5, 33745.0, 33745.0, 0.08266170696424881, 0.48104200801523334, 0.0459436719511115], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-3", 19, 5, 26.31578947368421, 21302.947368421057, 9170, 36364, 19339.0, 34324.0, 36364.0, 36364.0, 0.11452544273125098, 35.85810095154067, 0.05700372056997505], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-12", 14, 2, 14.285714285714286, 16335.071428571428, 2, 31313, 18588.5, 27837.5, 31313.0, 31313.0, 0.07890168849613381, 0.510653973474943, 0.0438538402578958], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-6", 14, 0, 0.0, 19013.42857142857, 4491, 28126, 19849.5, 27619.0, 28126.0, 28126.0, 0.08431855550268917, 0.320229357763631, 0.05409891695826834], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-15", 14, 1, 7.142857142857143, 7912.857142857144, 0, 25177, 702.0, 25000.5, 25177.0, 25177.0, 0.08379670918352078, 0.22667079976477067, 0.04992380671989753], "isController": false}, {"data": ["https://helpcenter.daraz.com.bd/page/home/config/category?pageId=1&ids=", 15, 0, 0.0, 354.13333333333327, 75, 1224, 263.0, 973.8000000000002, 1224.0, 1224.0, 0.25921957626239933, 0.2498532439169806, 0.17264428809663707], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-5", 14, 0, 0.0, 16407.85714285714, 5241, 30523, 16373.5, 29228.0, 30523.0, 30523.0, 0.08433379315330077, 6.33335256570506, 0.053367478479823136], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-14", 14, 2, 14.285714285714286, 16453.07142857143, 0, 34368, 13844.0, 33597.5, 34368.0, 34368.0, 0.08221414435629261, 0.26293501008591375, 0.04466265040784088], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-8", 14, 11, 78.57142857142857, 13156.857142857143, 3011, 24060, 12207.5, 22930.5, 24060.0, 24060.0, 0.07935473265957387, 0.22564841496006757, 0.010262533088089422], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-17", 14, 2, 14.285714285714286, 19014.357142857145, 3, 35417, 20160.0, 34665.0, 35417.0, 35417.0, 0.08340532006791576, 1.2929104547079324, 0.04363420064936999], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-7", 14, 0, 0.0, 15895.214285714286, 2955, 30747, 15614.5, 30394.0, 30747.0, 30747.0, 0.07662373912900701, 2.065174390841274, 0.04916191074976328], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-16", 14, 1, 7.142857142857143, 16742.285714285717, 3, 33957, 13486.0, 33804.5, 33957.0, 33957.0, 0.08255252404342263, 5.20045199349604, 0.04985628858593423], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-19", 14, 2, 14.285714285714286, 11208.285714285716, 0, 27638, 8155.0, 26891.5, 27638.0, 27638.0, 0.08619946556331351, 13.976675733003313, 0.12006354132032954], "isController": false}, {"data": ["https://helpcenter.daraz.com.bd/navigation?language=en&pageId=1", 15, 4, 26.666666666666668, 4991.066666666667, 0, 28495, 329.0, 26976.4, 28495.0, 28495.0, 0.25732519042064095, 0.47513019046352845, 0.12420631261579633], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-9", 14, 7, 50.0, 13787.92857142857, 5099, 25363, 13006.0, 23500.0, 25363.0, 25363.0, 0.08215866010962312, 5.005592015498645, 0.02571469781751388], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-18", 14, 1, 7.142857142857143, 10800.642857142857, 0, 28087, 4025.5, 27563.5, 28087.0, 28087.0, 0.08791374405797284, 1.828717485651221, 0.05373187956445019], "isController": false}, {"data": ["https://helpcenter.daraz.com.bd/announcement/page?language=en&pageId=1", 15, 0, 0.0, 3511.666666666667, 224, 15277, 281.0, 13916.800000000001, 15277.0, 15277.0, 0.2575726354832063, 0.2573210997063672, 0.17129586402740574], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/", 15, 15, 100.0, 84145.79999999999, 48701, 116980, 89932.0, 110624.2, 116980.0, 116980.0, 0.07087105248237673, 91.5701983680759, 0.8140573913783002], "isController": false}, {"data": ["https://helpcenter.daraz.com.bd/page/home/config/category?pageId=1&ids=1000001016,1000001019,1000001017,1000001020,1000001021,1000001022,1000001018,1000001023", 15, 0, 0.0, 253.66666666666663, 76, 570, 270.0, 398.4000000000001, 570.0, 570.0, 0.2596952908587258, 0.3045840276575485, 0.1985755983812327], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: maxcdn.bootstrapcdn.com:443 failed to respond", 6, 6.451612903225806, 1.1342155009451795], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: img.alicdn.com:443 failed to respond", 2, 2.150537634408602, 0.3780718336483932], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 12, 12.903225806451612, 2.268431001890359], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 1, 1.075268817204301, 0.1890359168241966], "isController": false}, {"data": ["Assertion failed", 18, 19.35483870967742, 3.402646502835539], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: fonts.googleapis.com:443 failed to respond", 7, 7.526881720430108, 1.3232514177693762], "isController": false}, {"data": ["Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 8, 8.602150537634408, 1.5122873345935728], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: cdnjs.cloudflare.com:443 failed to respond", 7, 7.526881720430108, 1.3232514177693762], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: helpcenter.daraz.com.bd:443 failed to respond", 5, 5.376344086021505, 0.945179584120983], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: laz-g-cdn.alicdn.com:443 failed to respond", 9, 9.67741935483871, 1.7013232514177694], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 8, 8.602150537634408, 1.5122873345935728], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 3, 3.225806451612903, 0.5671077504725898], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.youtube.com:443 failed to respond", 7, 7.526881720430108, 1.3232514177693762], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 529, 93, "Assertion failed", 18, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 12, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: laz-g-cdn.alicdn.com:443 failed to respond", 9, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 8, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 8], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-20", 14, 2, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: laz-g-cdn.alicdn.com:443 failed to respond", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://helpcenter.daraz.com.bd/headerFooter/queryICMSHeader?pageId=1&language=en", 15, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: helpcenter.daraz.com.bd:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-2", 19, 5, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: laz-g-cdn.alicdn.com:443 failed to respond", 3, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.youtube.com:443 failed to respond", 2, "", "", "", "", "", ""], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-11", 14, 13, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 4, "Assertion failed", 4, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.youtube.com:443 failed to respond", 2, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 1], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-1", 19, 3, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 1, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.youtube.com:443 failed to respond", 1, "", "", "", ""], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-10", 14, 8, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: cdnjs.cloudflare.com:443 failed to respond", 7, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-4", 19, 6, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: laz-g-cdn.alicdn.com:443 failed to respond", 2, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 2, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.youtube.com:443 failed to respond", 1, "", ""], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-13", 14, 2, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: img.alicdn.com:443 failed to respond", 1, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-3", 19, 5, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: laz-g-cdn.alicdn.com:443 failed to respond", 2, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 1, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.youtube.com:443 failed to respond", 1, "", ""], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-12", 14, 2, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: img.alicdn.com:443 failed to respond", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-15", 14, 1, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-14", 14, 2, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-8", 14, 11, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: fonts.googleapis.com:443 failed to respond", 7, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 3, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 1, "", "", "", ""], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-17", 14, 2, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: laz-g-cdn.alicdn.com:443 failed to respond", 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-16", 14, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-19", 14, 2, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["https://helpcenter.daraz.com.bd/navigation?language=en&pageId=1", 15, 4, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: helpcenter.daraz.com.bd:443 failed to respond", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-9", 14, 7, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: maxcdn.bootstrapcdn.com:443 failed to respond", 6, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", ""], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-18", 14, 1, "Non HTTP response code: java.lang.IllegalStateException/Non HTTP response message: Connection pool shut down", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/", 15, 15, "Assertion failed", 14, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
