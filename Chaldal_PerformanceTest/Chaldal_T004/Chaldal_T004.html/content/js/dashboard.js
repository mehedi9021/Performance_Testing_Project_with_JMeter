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

    var data = {"OkPercent": 33.57142857142857, "KoPercent": 66.42857142857143};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.047619047619047616, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "https://chaldal.com/yolk/api-v4/Recipe/GetAllRecipeSummaries?pageSize=100&pageNumber=1"], "isController": false}, {"data": [0.0, 500, 1500, "https://chaldal.com/yolk/api-v4/Recipe/GetAllRecipeCategories"], "isController": false}, {"data": [0.05714285714285714, 500, 1500, "https://chaldal.com/yolk/api-v4/DailyDeal/GetDailyDeals"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [0.07857142857142857, 500, 1500, "https://catalog.chaldal.com/searchOld"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 280, 186, 66.42857142857143, 16986.403571428564, 112, 34880, 18284.5, 25224.8, 27182.199999999993, 32257.459999999992, 1.8521090892253553, 64.27761647616401, 0.4946407693859597], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://chaldal.com/yolk/api-v4/Recipe/GetAllRecipeSummaries?pageSize=100&pageNumber=1", 35, 33, 94.28571428571429, 21791.34285714286, 9488, 31662, 21064.0, 28988.0, 29641.99999999999, 31662.0, 1.0502310508311827, 4.824176553216708, 0.04219678329232431], "isController": false}, {"data": ["https://chaldal.com/yolk/api-v4/Recipe/GetAllRecipeCategories", 35, 35, 100.0, 20957.885714285712, 15159, 28320, 21724.0, 24917.2, 26274.39999999999, 28320.0, 1.0626992561105206, 2.7637296948534993, 0.0], "isController": false}, {"data": ["https://chaldal.com/yolk/api-v4/DailyDeal/GetDailyDeals", 70, 58, 82.85714285714286, 18594.228571428575, 112, 28670, 18479.5, 25284.6, 26880.600000000002, 28670.0, 1.066845490291706, 2.604737198806657, 0.12305634087237478], "isController": false}, {"data": ["Test", 35, 35, 100.0, 135891.22857142854, 104018, 150268, 142442.0, 149152.4, 150226.4, 150268.0, 0.23114973880079517, 64.17658374720143, 0.49386328401038193], "isController": true}, {"data": ["https://catalog.chaldal.com/searchOld", 140, 60, 42.857142857142854, 13988.385714285714, 148, 34880, 16226.0, 23877.6, 25484.449999999997, 34845.56, 0.9260545446126777, 61.48158546739296, 0.43193054673598846], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: chaldal.com:443 failed to respond", 90, 48.38709677419355, 32.142857142857146], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 46, 24.731182795698924, 16.428571428571427], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: readHandshakeRecord", 2, 1.075268817204301, 0.7142857142857143], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: catalog.chaldal.com:443 failed to respond", 48, 25.806451612903224, 17.142857142857142], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 280, 186, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: chaldal.com:443 failed to respond", 90, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: catalog.chaldal.com:443 failed to respond", 48, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 46, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: readHandshakeRecord", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["https://chaldal.com/yolk/api-v4/Recipe/GetAllRecipeSummaries?pageSize=100&pageNumber=1", 35, 33, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: chaldal.com:443 failed to respond", 22, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 11, "", "", "", "", "", ""], "isController": false}, {"data": ["https://chaldal.com/yolk/api-v4/Recipe/GetAllRecipeCategories", 35, 35, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: chaldal.com:443 failed to respond", 25, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 9, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: readHandshakeRecord", 1, "", "", "", ""], "isController": false}, {"data": ["https://chaldal.com/yolk/api-v4/DailyDeal/GetDailyDeals", 70, 58, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: chaldal.com:443 failed to respond", 43, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 15, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://catalog.chaldal.com/searchOld", 140, 60, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: catalog.chaldal.com:443 failed to respond", 48, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: Connection reset", 11, "Non HTTP response code: javax.net.ssl.SSLException/Non HTTP response message: readHandshakeRecord", 1, "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
