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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.3048780487804878, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://member.daraz.com.bd/user/api/getUser"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-20"], "isController": false}, {"data": [1.0, 500, 1500, "https://helpcenter.daraz.com.bd/page/queryPlugin?pageId=1"], "isController": false}, {"data": [0.0, 500, 1500, "https://helpcenter.daraz.com.bd/headerFooter/queryICMSHeader?pageId=1&language=en"], "isController": false}, {"data": [1.0, 500, 1500, "https://helpcenter.daraz.com.bd/headerFooter/queryICMSFooter?pageId=1&language=en"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [1.0, 500, 1500, "https://helpcenter.daraz.com.bd/page/home/config/knowledge?pageId=1&ids=1000032753,1000074714,1000016609,1000036089,1000036086,1000015952,1000016611,1000005333,1000079379"], "isController": false}, {"data": [0.5, 500, 1500, "https://my.daraz.com.bd/api/recentOrders/"], "isController": false}, {"data": [0.5, 500, 1500, "https://member.daraz.com.bd/user/api/getContextInfo"], "isController": false}, {"data": [0.5, 500, 1500, "https://cart.daraz.com.bd/cart/api/count"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-0"], "isController": false}, {"data": [0.0, 500, 1500, "https://helpcenter.daraz.com.bd/"], "isController": false}, {"data": [0.25, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-2"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-11"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-1"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-10"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-4"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-13"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-12"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-6"], "isController": false}, {"data": [1.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-15"], "isController": false}, {"data": [1.0, 500, 1500, "https://helpcenter.daraz.com.bd/page/home/config/category?pageId=1&ids="], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-5"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-14"], "isController": false}, {"data": [0.5, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-8"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-17"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-7"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-16"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-19"], "isController": false}, {"data": [1.0, 500, 1500, "https://helpcenter.daraz.com.bd/navigation?language=en&pageId=1"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-9"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-18"], "isController": false}, {"data": [1.0, 500, 1500, "https://helpcenter.daraz.com.bd/announcement/page?language=en&pageId=1"], "isController": false}, {"data": [0.0, 500, 1500, "https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/"], "isController": false}, {"data": [1.0, 500, 1500, "https://helpcenter.daraz.com.bd/page/home/config/category?pageId=1&ids=1000001016,1000001019,1000001017,1000001020,1000001021,1000001022,1000001018,1000001023"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 40, 0, 0.0, 3602.0999999999995, 62, 23215, 1794.5, 8566.8, 17634.89999999999, 23215.0, 1.3357376611233553, 359.8143650758866, 1.5463707068556736], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://member.daraz.com.bd/user/api/getUser", 1, 0, 0.0, 62.0, 62, 62, 62.0, 62.0, 62.0, 62.0, 16.129032258064516, 13.18359375, 9.702620967741936], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-20", 1, 0, 0.0, 5289.0, 5289, 5289, 5289.0, 5289.0, 5289.0, 5289.0, 0.18907165815844204, 1.9047492437133675, 0.1165080237284931], "isController": false}, {"data": ["https://helpcenter.daraz.com.bd/page/queryPlugin?pageId=1", 1, 0, 0.0, 105.0, 105, 105, 105.0, 105.0, 105.0, 105.0, 9.523809523809526, 81.50111607142857, 4.231770833333334], "isController": false}, {"data": ["https://helpcenter.daraz.com.bd/headerFooter/queryICMSHeader?pageId=1&language=en", 1, 0, 0.0, 1583.0, 1583, 1583, 1583.0, 1583.0, 1583.0, 1583.0, 0.6317119393556537, 136.8939513581807, 0.42689908401768795], "isController": false}, {"data": ["https://helpcenter.daraz.com.bd/headerFooter/queryICMSFooter?pageId=1&language=en", 1, 0, 0.0, 117.0, 117, 117, 117.0, 117.0, 117.0, 117.0, 8.547008547008549, 239.55829326923075, 5.775908119658119], "isController": false}, {"data": ["Test", 1, 0, 0.0, 29909.0, 29909, 29909, 29909.0, 29909.0, 29909.0, 29909.0, 0.033434752081313315, 138.17665538592064, 0.8538922230766659], "isController": true}, {"data": ["https://helpcenter.daraz.com.bd/page/home/config/knowledge?pageId=1&ids=1000032753,1000074714,1000016609,1000036089,1000036086,1000015952,1000016611,1000005333,1000079379", 1, 0, 0.0, 77.0, 77, 77, 77.0, 77.0, 77.0, 77.0, 12.987012987012989, 18.199573863636363, 10.108056006493507], "isController": false}, {"data": ["https://my.daraz.com.bd/api/recentOrders/", 1, 0, 0.0, 872.0, 872, 872, 872.0, 872.0, 872.0, 872.0, 1.146788990825688, 1.3506128153669725, 0.6865055189220184], "isController": false}, {"data": ["https://member.daraz.com.bd/user/api/getContextInfo", 1, 0, 0.0, 679.0, 679, 679, 679.0, 679.0, 679.0, 679.0, 1.4727540500736376, 1.5763070692194403, 0.6241945876288659], "isController": false}, {"data": ["https://cart.daraz.com.bd/cart/api/count", 1, 0, 0.0, 1105.0, 1105, 1105, 1105.0, 1105.0, 1105.0, 1105.0, 0.9049773755656109, 0.8042279411764706, 0.5408653846153846], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-0", 2, 0, 0.0, 2103.0, 1890, 2316, 2103.0, 2316.0, 2316.0, 2316.0, 0.2711864406779661, 45.14115466101695, 0.18458686440677965], "isController": false}, {"data": ["https://helpcenter.daraz.com.bd/", 1, 0, 0.0, 1601.0, 1601, 1601, 1601.0, 1601.0, 1601.0, 1601.0, 0.6246096189881324, 0.1921406542785759, 0.36964202061211743], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-2", 2, 0, 0.0, 4327.0, 1262, 7392, 4327.0, 7392.0, 7392.0, 7392.0, 0.16329196603527107, 30.195698404841607, 0.12318656617406924], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-11", 1, 0, 0.0, 17730.0, 17730, 17730, 17730.0, 17730.0, 17730.0, 17730.0, 0.05640157924421884, 156.4255388994642, 0.19013501128031585], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-1", 2, 0, 0.0, 5241.5, 2053, 8430, 5241.5, 8430.0, 8430.0, 8430.0, 0.15050041387613816, 27.877409182406502, 0.09964773496877116], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-10", 1, 0, 0.0, 2120.0, 2120, 2120, 2120.0, 2120.0, 2120.0, 2120.0, 0.4716981132075472, 14.780181308962263, 0.3012603183962264], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-4", 2, 0, 0.0, 3179.5, 2907, 3452, 3179.5, 3452.0, 3452.0, 3452.0, 0.24073182474723157, 2.316103454501685, 0.1597434325349061], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-13", 1, 0, 0.0, 1732.0, 1732, 1732, 1732.0, 1732.0, 1732.0, 1732.0, 0.5773672055427251, 3.618694067551963, 0.37438654734411086], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-3", 2, 0, 0.0, 9620.0, 3412, 15828, 9620.0, 15828.0, 15828.0, 15828.0, 0.09669777111637576, 105.93831022155877, 0.06572426630566165], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-12", 1, 0, 0.0, 1053.0, 1053, 1053, 1053.0, 1053.0, 1053.0, 1053.0, 0.9496676163342831, 6.8674694325736, 0.6158000949667617], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-6", 1, 0, 0.0, 2956.0, 2956, 2956, 2956.0, 2956.0, 2956.0, 2956.0, 0.33829499323410017, 1.2847941686400541, 0.21705059624492556], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-15", 1, 0, 0.0, 123.0, 123, 123, 123.0, 123.0, 123.0, 123.0, 8.130081300813009, 22.64354674796748, 5.216272865853659], "isController": false}, {"data": ["https://helpcenter.daraz.com.bd/page/home/config/category?pageId=1&ids=", 1, 0, 0.0, 82.0, 82, 82, 82.0, 82.0, 82.0, 82.0, 12.195121951219512, 11.754477896341463, 8.122141768292682], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-5", 1, 0, 0.0, 1845.0, 1845, 1845, 1845.0, 1845.0, 1845.0, 1845.0, 0.5420054200542005, 40.703336720867206, 0.3429878048780488], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-14", 1, 0, 0.0, 1302.0, 1302, 1302, 1302.0, 1302.0, 1302.0, 1302.0, 0.7680491551459293, 2.4976598502304146, 0.4867811539938556], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-8", 1, 0, 0.0, 1157.0, 1157, 1157, 1157.0, 1157.0, 1157.0, 1157.0, 0.8643042350907519, 2.4148187662057046, 0.5216211106309421], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-17", 1, 0, 0.0, 2583.0, 2583, 2583, 2583.0, 2583.0, 2583.0, 2583.0, 0.38714672861014326, 6.843498959543166, 0.23629561072396438], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-7", 1, 0, 0.0, 1744.0, 1744, 1744, 1744.0, 1744.0, 1744.0, 1744.0, 0.573394495412844, 15.454213553612385, 0.3678908041857798], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-16", 1, 0, 0.0, 8022.0, 8022, 8022, 8022.0, 8022.0, 8022.0, 8022.0, 0.12465719272001995, 8.43128174862877, 0.08107586948391922], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-19", 1, 0, 0.0, 8582.0, 8582, 8582, 8582.0, 8582.0, 8582.0, 8582.0, 0.11652295502213937, 21.999055981997202, 0.18934980191097645], "isController": false}, {"data": ["https://helpcenter.daraz.com.bd/navigation?language=en&pageId=1", 1, 0, 0.0, 145.0, 145, 145, 145.0, 145.0, 145.0, 145.0, 6.896551724137931, 12.257543103448278, 4.539331896551724], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-9", 1, 0, 0.0, 2485.0, 2485, 2485, 2485.0, 2485.0, 2485.0, 2485.0, 0.40241448692152915, 48.00914864185111, 0.25190203722334004], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/-18", 1, 0, 0.0, 6510.0, 6510, 6510, 6510.0, 6510.0, 6510.0, 6510.0, 0.15360983102918588, 3.4214189708141323, 0.10110647081413211], "isController": false}, {"data": ["https://helpcenter.daraz.com.bd/announcement/page?language=en&pageId=1", 1, 0, 0.0, 168.0, 168, 168, 168.0, 168.0, 168.0, 168.0, 5.952380952380952, 6.004696800595238, 3.9585658482142856], "isController": false}, {"data": ["https://www.daraz.com.bd/wow/i/bd/help-pages/how-to-return/", 1, 0, 0.0, 23215.0, 23215, 23215, 23215.0, 23215.0, 23215.0, 23215.0, 0.04307559767391773, 166.6530513003446, 0.7494060278914495], "isController": false}, {"data": ["https://helpcenter.daraz.com.bd/page/home/config/category?pageId=1&ids=1000001016,1000001019,1000001017,1000001020,1000001021,1000001022,1000001018,1000001023", 1, 0, 0.0, 98.0, 98, 98, 98.0, 98.0, 98.0, 98.0, 10.204081632653061, 11.967873086734693, 7.802535076530612], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 40, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
