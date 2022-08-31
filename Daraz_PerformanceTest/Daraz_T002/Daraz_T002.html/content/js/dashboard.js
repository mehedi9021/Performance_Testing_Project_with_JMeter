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

    var data = {"OkPercent": 92.43243243243244, "KoPercent": 7.5675675675675675};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.2657894736842105, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://member.daraz.com.bd/user/api/getUser"], "isController": false}, {"data": [0.2, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-20"], "isController": false}, {"data": [1.0, 500, 1500, "https://helpcenter.daraz.com.bd/page/queryPlugin?pageId=1"], "isController": false}, {"data": [0.0, 500, 1500, "https://helpcenter.daraz.com.bd/headerFooter/queryICMSHeader?pageId=1&language=en"], "isController": false}, {"data": [0.9, 500, 1500, "https://helpcenter.daraz.com.bd/headerFooter/queryICMSFooter?pageId=1&language=en"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [1.0, 500, 1500, "https://helpcenter.daraz.com.bd/page/home/config/knowledge?pageId=1&ids=1000032753,1000074714,1000016609,1000036089,1000036086,1000015952,1000016611,1000005333,1000079379"], "isController": false}, {"data": [0.3, 500, 1500, "https://my.daraz.com.bd/api/recentOrders/"], "isController": false}, {"data": [0.2, 500, 1500, "https://member.daraz.com.bd/user/api/getContextInfo"], "isController": false}, {"data": [0.4, 500, 1500, "https://cart.daraz.com.bd/cart/api/count"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-0"], "isController": false}, {"data": [0.3, 500, 1500, "https://helpcenter.daraz.com.bd/"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-2"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-11"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-1"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-10"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-4"], "isController": false}, {"data": [0.2, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-13"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-12"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-6"], "isController": false}, {"data": [0.6, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-15"], "isController": false}, {"data": [1.0, 500, 1500, "https://helpcenter.daraz.com.bd/page/home/config/category?pageId=1&ids="], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-5"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-14"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-8"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-17"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-7"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-16"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-19"], "isController": false}, {"data": [1.0, 500, 1500, "https://helpcenter.daraz.com.bd/navigation?language=en&pageId=1"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-9"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-18"], "isController": false}, {"data": [1.0, 500, 1500, "https://helpcenter.daraz.com.bd/announcement/page?language=en&pageId=1"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/"], "isController": false}, {"data": [1.0, 500, 1500, "https://helpcenter.daraz.com.bd/page/home/config/category?pageId=1&ids=1000001016,1000001019,1000001017,1000001020,1000001021,1000001022,1000001018,1000001023"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 185, 14, 7.5675675675675675, 7862.983783783784, 60, 49795, 6701.0, 14581.000000000002, 23382.79999999999, 47411.93999999996, 2.9803138189902376, 352.480286885411, 3.121400465573348], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://member.daraz.com.bd/user/api/getUser", 5, 0, 0.0, 64.4, 60, 67, 66.0, 67.0, 67.0, 67.0, 1.7094017094017093, 1.3918936965811968, 1.0279780982905984], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-20", 5, 0, 0.0, 4406.2, 120, 7475, 4707.0, 7475.0, 7475.0, 7475.0, 0.36595184073775894, 3.6866788955573444, 0.2255035268608651], "isController": false}, {"data": ["https://helpcenter.daraz.com.bd/page/queryPlugin?pageId=1", 5, 0, 0.0, 148.4, 98, 232, 103.0, 232.0, 232.0, 232.0, 1.8135654697134564, 15.519799034276387, 0.8058323132027566], "isController": false}, {"data": ["https://helpcenter.daraz.com.bd/headerFooter/queryICMSHeader?pageId=1&language=en", 5, 0, 0.0, 3470.6, 2332, 4256, 4052.0, 4256.0, 4256.0, 4256.0, 0.91324200913242, 197.90239726027397, 0.6171518264840183], "isController": false}, {"data": ["https://helpcenter.daraz.com.bd/headerFooter/queryICMSFooter?pageId=1&language=en", 5, 0, 0.0, 372.8, 111, 760, 408.0, 760.0, 760.0, 760.0, 2.0929259104227707, 58.661197807660116, 1.4143600879028884], "isController": false}, {"data": ["Test", 5, 5, 100.0, 55911.8, 51640, 58190, 56720.0, 58190.0, 58190.0, 58190.0, 0.0804039494419966, 160.81782374650243, 1.847657631942881], "isController": true}, {"data": ["https://helpcenter.daraz.com.bd/page/home/config/knowledge?pageId=1&ids=1000032753,1000074714,1000016609,1000036089,1000036086,1000015952,1000016611,1000005333,1000079379", 5, 0, 0.0, 133.0, 73, 263, 77.0, 263.0, 263.0, 263.0, 2.9342723004694835, 4.111992921068075, 2.2838037338615025], "isController": false}, {"data": ["https://my.daraz.com.bd/api/recentOrders/", 5, 0, 0.0, 1500.8, 788, 2244, 1386.0, 2244.0, 2244.0, 2244.0, 1.1215791834903543, 1.319169891206819, 0.671195042620009], "isController": false}, {"data": ["https://member.daraz.com.bd/user/api/getContextInfo", 5, 0, 0.0, 1771.6, 902, 2906, 1625.0, 2906.0, 2906.0, 2906.0, 1.2933264355923435, 1.3819900252198654, 0.5481481182100362], "isController": false}, {"data": ["https://cart.daraz.com.bd/cart/api/count", 5, 0, 0.0, 1234.2, 1012, 1648, 1095.0, 1648.0, 1648.0, 1648.0, 1.125112511251125, 1.015677739648965, 0.6722107757650765], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-0", 7, 0, 0.0, 6280.428571428571, 2910, 12072, 5058.0, 12072.0, 12072.0, 12072.0, 0.300648541854572, 63.06539374221535, 0.2116451649272001], "isController": false}, {"data": ["https://helpcenter.daraz.com.bd/", 5, 0, 0.0, 1433.0, 745, 2575, 1235.0, 2575.0, 2575.0, 2575.0, 0.9798157946306093, 0.3014081790123457, 0.5798519253380364], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-2", 7, 1, 14.285714285714286, 10552.142857142857, 3466, 19401, 11446.0, 19401.0, 19401.0, 19401.0, 0.18015235742227712, 15.857453844000926, 0.12237190684836319], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-11", 5, 5, 100.0, 22304.4, 12162, 41251, 13371.0, 41251.0, 41251.0, 41251.0, 0.12120918280768951, 77.68388853452038, 0.11311278817483213], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-1", 7, 0, 0.0, 12691.142857142857, 4354, 23738, 10203.0, 23738.0, 23738.0, 23738.0, 0.16206329729354294, 18.34869437756118, 0.10682883366517723], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-10", 5, 0, 0.0, 8271.4, 3841, 13500, 8916.0, 13500.0, 13500.0, 13500.0, 0.25889297364469527, 8.113817037099363, 0.16534766090198313], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-4", 7, 1, 14.285714285714286, 9079.285714285716, 4345, 12374, 10096.0, 12374.0, 12374.0, 12374.0, 0.25040243248077265, 2.0662043350921127, 0.1381614983902701], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-13", 5, 0, 0.0, 9266.2, 474, 12661, 10919.0, 12661.0, 12661.0, 12661.0, 0.27710042119264017, 1.7368567806473065, 0.17968230436710264], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-3", 7, 1, 14.285714285714286, 14929.571428571428, 7871, 29176, 13882.0, 29176.0, 29176.0, 29176.0, 0.14997964561952307, 60.294391129507424, 0.08687437062112999], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-12", 5, 0, 0.0, 10043.8, 6676, 13183, 10252.0, 13183.0, 13183.0, 13183.0, 0.21769418321142459, 1.5742010623476141, 0.14116107192615812], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-6", 5, 0, 0.0, 8213.8, 4197, 11238, 9195.0, 11238.0, 11238.0, 11238.0, 0.34211426616489904, 1.299299200307903, 0.21950104772494014], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-15", 5, 0, 0.0, 3564.6, 120, 11382, 251.0, 11382.0, 11382.0, 11382.0, 0.3246753246753247, 0.9042715097402597, 0.2083121956168831], "isController": false}, {"data": ["https://helpcenter.daraz.com.bd/page/home/config/category?pageId=1&ids=", 5, 0, 0.0, 164.8, 75, 268, 174.0, 268.0, 268.0, 268.0, 1.836884643644379, 1.7705128352314474, 1.2233938739897134], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-5", 5, 0, 0.0, 10247.6, 4932, 13488, 10474.0, 13488.0, 13488.0, 13488.0, 0.30175015087507545, 22.661023781683767, 0.19095126735063367], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-14", 5, 0, 0.0, 11213.4, 7412, 18348, 8380.0, 18348.0, 18348.0, 18348.0, 0.2725092653150207, 0.8861873569326357, 0.17271339178657075], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-8", 5, 1, 20.0, 7519.4, 4663, 10593, 8151.0, 10593.0, 10593.0, 10593.0, 0.33185106524191943, 0.8858219743479127, 0.1602218424371142], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-17", 5, 0, 0.0, 10837.0, 8229, 13923, 11324.0, 13923.0, 13923.0, 13923.0, 0.2802219357731323, 4.953634215798913, 0.17103389634590596], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-7", 5, 0, 0.0, 10562.0, 6701, 14803, 9914.0, 14803.0, 14803.0, 14803.0, 0.31236334103829577, 8.418863134097581, 0.2004128076778909], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-16", 5, 0, 0.0, 13650.0, 5746, 17019, 15187.0, 17019.0, 17019.0, 17019.0, 0.24059282071023, 16.272673993720527, 0.15647931503223944], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-19", 5, 0, 0.0, 11363.4, 8945, 14150, 10464.0, 14150.0, 14150.0, 14150.0, 0.22476961114857272, 42.43531727635423, 0.36525061811643067], "isController": false}, {"data": ["https://helpcenter.daraz.com.bd/navigation?language=en&pageId=1", 5, 0, 0.0, 167.4, 103, 216, 169.0, 216.0, 216.0, 216.0, 1.6420361247947455, 2.918462643678161, 1.0807933087027914], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-9", 5, 0, 0.0, 9703.0, 7099, 12724, 8674.0, 12724.0, 12724.0, 12724.0, 0.22716946842344388, 27.102648654020896, 0.1422027629486597], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-18", 5, 0, 0.0, 8906.8, 5687, 16131, 6833.0, 16131.0, 16131.0, 16131.0, 0.26890394750994945, 5.989415268366139, 0.1769934185758847], "isController": false}, {"data": ["https://helpcenter.daraz.com.bd/announcement/page?language=en&pageId=1", 5, 0, 0.0, 165.0, 85, 268, 187.0, 268.0, 268.0, 268.0, 1.7152658662092624, 1.7303414451114922, 1.1407188036020584], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/", 5, 5, 100.0, 45114.2, 40587, 49795, 45005.0, 49795.0, 49795.0, 49795.0, 0.09899813883498991, 171.88460978027362, 1.46900089840811], "isController": false}, {"data": ["https://helpcenter.daraz.com.bd/page/home/config/category?pageId=1&ids=1000001016,1000001019,1000001017,1000001020,1000001021,1000001022,1000001018,1000001023", 5, 0, 0.0, 171.6, 73, 275, 209.0, 275.0, 275.0, 275.0, 1.9817677368212443, 2.3243193866428853, 1.5153556034482758], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: fonts.googleapis.com:443 failed to respond", 1, 7.142857142857143, 0.5405405405405406], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.youtube.com:443 failed to respond", 6, 42.857142857142854, 3.2432432432432434], "isController": false}, {"data": ["Assertion failed", 7, 50.0, 3.7837837837837838], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 185, 14, "Assertion failed", 7, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.youtube.com:443 failed to respond", 6, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: fonts.googleapis.com:443 failed to respond", 1, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-2", 7, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.youtube.com:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-11", 5, 5, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.youtube.com:443 failed to respond", 3, "Assertion failed", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-4", 7, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.youtube.com:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-3", 7, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: www.youtube.com:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-8", 5, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: fonts.googleapis.com:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/", 5, 5, "Assertion failed", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
