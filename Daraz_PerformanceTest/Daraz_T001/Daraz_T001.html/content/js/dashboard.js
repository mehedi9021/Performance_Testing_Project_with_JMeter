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

    var data = {"OkPercent": 89.72972972972973, "KoPercent": 10.27027027027027};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.20394736842105263, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://member.daraz.com.bd/user/api/getUser"], "isController": false}, {"data": [0.05, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-20"], "isController": false}, {"data": [0.45, 500, 1500, "https://helpcenter.daraz.com.bd/page/queryPlugin?pageId=1"], "isController": false}, {"data": [0.0, 500, 1500, "https://helpcenter.daraz.com.bd/headerFooter/queryICMSHeader?pageId=1&language=en"], "isController": false}, {"data": [0.5, 500, 1500, "https://helpcenter.daraz.com.bd/headerFooter/queryICMSFooter?pageId=1&language=en"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [1.0, 500, 1500, "https://helpcenter.daraz.com.bd/page/home/config/knowledge?pageId=1&ids=1000032753,1000074714,1000016609,1000036089,1000036086,1000015952,1000016611,1000005333,1000079379"], "isController": false}, {"data": [0.1, 500, 1500, "https://my.daraz.com.bd/api/recentOrders/"], "isController": false}, {"data": [0.05, 500, 1500, "https://member.daraz.com.bd/user/api/getContextInfo"], "isController": false}, {"data": [0.05, 500, 1500, "https://cart.daraz.com.bd/cart/api/count"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-0"], "isController": false}, {"data": [0.0, 500, 1500, "https://helpcenter.daraz.com.bd/"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-2"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-11"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-1"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-10"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-4"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-13"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-12"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-6"], "isController": false}, {"data": [0.75, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-15"], "isController": false}, {"data": [1.0, 500, 1500, "https://helpcenter.daraz.com.bd/page/home/config/category?pageId=1&ids="], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-5"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-14"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-8"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-17"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-7"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-16"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-19"], "isController": false}, {"data": [0.95, 500, 1500, "https://helpcenter.daraz.com.bd/navigation?language=en&pageId=1"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-9"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-18"], "isController": false}, {"data": [0.9, 500, 1500, "https://helpcenter.daraz.com.bd/announcement/page?language=en&pageId=1"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/"], "isController": false}, {"data": [0.95, 500, 1500, "https://helpcenter.daraz.com.bd/page/home/config/category?pageId=1&ids=1000001016,1000001019,1000001017,1000001020,1000001021,1000001022,1000001018,1000001023"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 370, 38, 10.27027027027027, 12762.313513513514, 9, 118642, 10038.5, 24744.70000000002, 38427.049999999996, 88644.14, 2.506859988481995, 273.2081720671432, 2.517724283512314], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://member.daraz.com.bd/user/api/getUser", 10, 0, 0.0, 144.5, 62, 269, 130.0, 265.3, 269.0, 269.0, 1.0912265386294195, 0.8723418403535574, 0.6563343995525971], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-20", 10, 1, 10.0, 14603.6, 9, 40737, 15411.5, 38763.40000000001, 40737.0, 40737.0, 0.176034643617864, 1.6438266300807998, 0.09762702549861813], "isController": false}, {"data": ["https://helpcenter.daraz.com.bd/page/queryPlugin?pageId=1", 10, 0, 0.0, 1207.3, 222, 2909, 704.5, 2873.8, 2909.0, 2909.0, 2.585983966899405, 22.12986084173778, 1.1490456102922162], "isController": false}, {"data": ["https://helpcenter.daraz.com.bd/headerFooter/queryICMSHeader?pageId=1&language=en", 10, 0, 0.0, 10440.9, 8420, 12991, 10248.0, 12863.300000000001, 12991.0, 12991.0, 0.6653359946773121, 144.18038922155688, 0.4496215901530273], "isController": false}, {"data": ["https://helpcenter.daraz.com.bd/headerFooter/queryICMSFooter?pageId=1&language=en", 10, 0, 0.0, 1031.5, 342, 2295, 893.5, 2263.2000000000003, 2295.0, 2295.0, 1.8005041411595246, 50.46510679240187, 1.21674693914296], "isController": false}, {"data": ["Test", 10, 10, 100.0, 114498.0, 90248, 145737, 112459.0, 145274.7, 145737.0, 145737.0, 0.06769289089259846, 127.31607524234055, 1.5085069867525012], "isController": true}, {"data": ["https://helpcenter.daraz.com.bd/page/home/config/knowledge?pageId=1&ids=1000032753,1000074714,1000016609,1000036089,1000036086,1000015952,1000016611,1000005333,1000079379", 10, 0, 0.0, 216.4, 90, 378, 237.5, 366.80000000000007, 378.0, 378.0, 2.0721094073767095, 2.903786132407791, 1.6127648414836304], "isController": false}, {"data": ["https://my.daraz.com.bd/api/recentOrders/", 10, 0, 0.0, 3233.7, 1368, 5600, 3533.0, 5532.8, 5600.0, 5600.0, 0.9131586156515387, 1.0868727741758744, 0.5465575347000273], "isController": false}, {"data": ["https://member.daraz.com.bd/user/api/getContextInfo", 10, 0, 0.0, 2926.6, 1314, 6655, 2521.5, 6394.6, 6655.0, 6655.0, 0.8882572392965004, 0.9346652102949015, 0.37646840024871203], "isController": false}, {"data": ["https://cart.daraz.com.bd/cart/api/count", 10, 0, 0.0, 2662.3, 1027, 3919, 2703.5, 3880.6000000000004, 3919.0, 3919.0, 0.8911861687906604, 0.7905796052045272, 0.5325359537919971], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-0", 14, 0, 0.0, 19390.857142857145, 6338, 55727, 17757.0, 42278.5, 55727.0, 55727.0, 0.15756006977660234, 33.05421446809409, 0.11092730079905463], "isController": false}, {"data": ["https://helpcenter.daraz.com.bd/", 10, 0, 0.0, 4137.400000000001, 2060, 6444, 4409.0, 6341.3, 6444.0, 6444.0, 1.4427932477276006, 0.4438280010099553, 0.8538405352762949], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-2", 14, 2, 14.285714285714286, 16118.000000000004, 8604, 26200, 14987.0, 25058.5, 26200.0, 26200.0, 0.16676593210244192, 14.679008152173912, 0.11327892346634902], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-11", 10, 9, 90.0, 25887.6, 10407, 73731, 16252.0, 70519.20000000001, 73731.0, 73731.0, 0.10251153254741159, 54.96511204190159, 0.07509169976934905], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-1", 14, 3, 21.428571428571427, 12489.357142857143, 5789, 19124, 12353.5, 18033.5, 19124.0, 19124.0, 0.1606130830828534, 6.122455107209233, 0.08284973140329946], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-10", 10, 0, 0.0, 11809.6, 8067, 16535, 11542.0, 16509.9, 16535.0, 16535.0, 0.152895847348786, 4.792164971752492, 0.09765027750596295], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-4", 14, 2, 14.285714285714286, 11109.0, 5015, 18426, 9906.5, 18054.5, 18426.0, 18426.0, 0.16763857124040568, 1.4057504520254331, 0.09249589135823165], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-13", 10, 0, 0.0, 10931.4, 3672, 17384, 9939.5, 17267.1, 17384.0, 17384.0, 0.1679571373385512, 1.0528156964342699, 0.1089097062429668], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-3", 14, 2, 14.285714285714286, 27076.0, 8912, 55805, 27499.5, 48861.5, 55805.0, 55805.0, 0.1287226119656862, 51.748034394222195, 0.07456142367208834], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-12", 10, 0, 0.0, 11400.2, 1921, 20901, 12880.5, 20447.100000000002, 20901.0, 20901.0, 0.17319616197305066, 1.2525093147060862, 0.11230688627940005], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-6", 10, 0, 0.0, 12222.9, 7193, 18565, 11969.0, 18371.8, 18565.0, 18565.0, 0.1552288849909191, 0.5895362634078949, 0.09959509515530648], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-15", 10, 0, 0.0, 2437.0, 146, 14151, 332.0, 13436.400000000001, 14151.0, 14151.0, 0.16464970774676874, 0.4585751625915864, 0.10563950975549519], "isController": false}, {"data": ["https://helpcenter.daraz.com.bd/page/home/config/category?pageId=1&ids=", 10, 0, 0.0, 233.20000000000002, 80, 279, 253.0, 278.7, 279.0, 279.0, 1.7583963425356075, 1.6948605371900827, 1.1711194390715667], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-5", 10, 0, 0.0, 14578.1, 5835, 25032, 14142.5, 24942.1, 25032.0, 25032.0, 0.15321913400545462, 11.506397856464314, 0.09695898323782673], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-14", 10, 1, 10.0, 13798.499999999998, 7573, 20084, 15962.5, 19805.5, 20084.0, 20084.0, 0.16199841241555832, 0.5342625376646309, 0.09240553973821057], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-8", 10, 6, 60.0, 10392.1, 3393, 16601, 11122.0, 16306.2, 16601.0, 16601.0, 0.16311085013375087, 0.3947473718764272, 0.0393759786651008], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-17", 10, 0, 0.0, 15519.7, 8261, 19217, 17409.5, 19166.6, 19217.0, 19217.0, 0.16745930738830464, 2.9603011546319244, 0.10220904991961953], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-7", 10, 0, 0.0, 15450.800000000001, 5423, 20485, 17671.0, 20399.4, 20485.0, 20485.0, 0.16115775732864904, 4.343547797376352, 0.10339906891105703], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-16", 10, 0, 0.0, 21645.4, 4154, 41887, 22934.5, 40179.90000000001, 41887.0, 41887.0, 0.17168855695767876, 11.612081777405786, 0.1116646278650528], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-19", 10, 0, 0.0, 23854.399999999998, 6557, 38498, 25533.0, 38101.5, 38498.0, 38498.0, 0.1891610706516599, 35.71290817412277, 0.3073867398089473], "isController": false}, {"data": ["https://helpcenter.daraz.com.bd/navigation?language=en&pageId=1", 10, 0, 0.0, 361.5, 274, 991, 286.0, 924.8000000000002, 991.0, 991.0, 1.5895724050230489, 2.8252165792401844, 1.0462615243999362], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-9", 10, 1, 10.0, 19141.6, 9507, 26150, 20476.0, 25760.800000000003, 26150.0, 26150.0, 0.1498464074323818, 16.135780161272198, 0.08442030512474713], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-18", 10, 1, 10.0, 13378.3, 7359, 20756, 12662.0, 20392.9, 20756.0, 20756.0, 0.18348960531385897, 3.7179222898585293, 0.10869608846033872], "isController": false}, {"data": ["https://helpcenter.daraz.com.bd/announcement/page?language=en&pageId=1", 10, 0, 0.0, 289.8, 115, 518, 258.5, 517.1, 518.0, 518.0, 1.6350555918901242, 1.6494261976782212, 1.0873758379659908], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/", 10, 10, 100.0, 87379.00000000001, 60126, 118642, 86676.0, 118005.1, 118642.0, 118642.0, 0.08178420419880104, 132.24011439821138, 1.156695404443336], "isController": false}, {"data": ["https://helpcenter.daraz.com.bd/page/home/config/category?pageId=1&ids=1000001016,1000001019,1000001017,1000001020,1000001021,1000001022,1000001018,1000001023", 10, 0, 0.0, 233.8, 80, 552, 225.0, 524.3000000000001, 552.0, 552.0, 1.822489520685256, 2.137509681975579, 1.393563764352105], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: fonts.googleapis.com:443 failed to respond", 6, 15.789473684210526, 1.6216216216216217], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: maxcdn.bootstrapcdn.com:443 failed to respond", 1, 2.6315789473684212, 0.2702702702702703], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: laz-g-cdn.alicdn.com:443 failed to respond", 1, 2.6315789473684212, 0.2702702702702703], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 1, 2.6315789473684212, 0.2702702702702703], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 3, 7.894736842105263, 0.8108108108108109], "isController": false}, {"data": ["Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 1, 2.6315789473684212, 0.2702702702702703], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.youtube.com:443 failed to respond", 12, 31.57894736842105, 3.2432432432432434], "isController": false}, {"data": ["Assertion failed", 13, 34.21052631578947, 3.5135135135135136], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 370, 38, "Assertion failed", 13, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.youtube.com:443 failed to respond", 12, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: fonts.googleapis.com:443 failed to respond", 6, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 3, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: maxcdn.bootstrapcdn.com:443 failed to respond", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-20", 10, 1, "Non HTTP response code: java.net.SocketException/Non HTTP response message: Socket operation on nonsocket: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-2", 14, 2, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.youtube.com:443 failed to respond", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-11", 10, 9, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.youtube.com:443 failed to respond", 5, "Assertion failed", 3, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 1, "", "", "", ""], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-1", 14, 3, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.youtube.com:443 failed to respond", 2, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-4", 14, 2, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.youtube.com:443 failed to respond", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-3", 14, 2, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.youtube.com:443 failed to respond", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-14", 10, 1, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Socket closed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-8", 10, 6, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: fonts.googleapis.com:443 failed to respond", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-9", 10, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: maxcdn.bootstrapcdn.com:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-18", 10, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: laz-g-cdn.alicdn.com:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/", 10, 10, "Assertion failed", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
