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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.608545918367347, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.325, 500, 1500, "https://en.wikipedia.org/wiki/Wikipedia:About"], "isController": false}, {"data": [0.5, 500, 1500, "https://en.wikipedia.org/w/api.php?action=visualeditor&format=json&formatversion=2&uselang=en&paction=metadata&page=Wikipedia%3AContents"], "isController": false}, {"data": [0.5, 500, 1500, "https://en.wikipedia.org/w/api.php?action=visualeditor&format=json&formatversion=2&uselang=en&paction=metadata&page=Wikipedia%3AContact_us"], "isController": false}, {"data": [0.6, 500, 1500, "https://en.wikipedia.org/wiki/Portal:Current_events-23"], "isController": false}, {"data": [0.6375, 500, 1500, "https://en.wikipedia.org/wiki/Portal:Current_events-22"], "isController": false}, {"data": [0.5625, 500, 1500, "https://en.wikipedia.org/wiki/Portal:Current_events-21"], "isController": false}, {"data": [0.6, 500, 1500, "https://en.wikipedia.org/wiki/Portal:Current_events-20"], "isController": false}, {"data": [0.0, 500, 1500, "https://en.wikipedia.org/w/api.php?action=discussiontoolspageinfo&format=json&formatversion=2&uselang=en&page=Wikipedia%3AAbout&oldid=1107089714"], "isController": false}, {"data": [0.95, 500, 1500, "https://en.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&uselang=en&list=linterrors&lntcategories=fostered&lntlimit=1&lnttitle=Wikipedia%3AAbout"], "isController": false}, {"data": [0.9875, 500, 1500, "https://en.wikipedia.org/wiki/Portal:Current_events-6"], "isController": false}, {"data": [0.975, 500, 1500, "https://en.wikipedia.org/wiki/Portal:Current_events-5"], "isController": false}, {"data": [0.85, 500, 1500, "https://en.wikipedia.org/wiki/Portal:Current_events-4"], "isController": false}, {"data": [0.9, 500, 1500, "https://en.wikipedia.org/wiki/Portal:Current_events-3"], "isController": false}, {"data": [0.9125, 500, 1500, "https://en.wikipedia.org/wiki/Portal:Current_events-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://en.wikipedia.org/wiki/Portal:Current_events-1"], "isController": false}, {"data": [0.45, 500, 1500, "https://en.wikipedia.org/wiki/Portal:Current_events-0"], "isController": false}, {"data": [0.4375, 500, 1500, "https://en.wikipedia.org/wiki/Portal:Current_events-9"], "isController": false}, {"data": [0.475, 500, 1500, "https://en.wikipedia.org/wiki/Portal:Current_events-8"], "isController": false}, {"data": [0.4875, 500, 1500, "https://en.wikipedia.org/wiki/Portal:Current_events-7"], "isController": false}, {"data": [0.85, 500, 1500, "https://en.wikipedia.org/w/api.php?action=discussiontoolspageinfo&format=json&formatversion=2&uselang=en&page=Wikipedia%3AContact_us&oldid=967537943"], "isController": false}, {"data": [0.525, 500, 1500, "https://en.wikipedia.org/wiki/Main_Page-10"], "isController": false}, {"data": [0.4625, 500, 1500, "https://en.wikipedia.org/wiki/Main_Page-11"], "isController": false}, {"data": [0.575, 500, 1500, "https://en.wikipedia.org/w/api.php?action=discussiontoolspageinfo&format=json&formatversion=2&uselang=en&page=Wikipedia%3AContents&oldid=1106439112"], "isController": false}, {"data": [0.8875, 500, 1500, "https://en.wikipedia.org/wiki/Special:Random"], "isController": false}, {"data": [0.45, 500, 1500, "https://en.wikipedia.org/wiki/Main_Page-18"], "isController": false}, {"data": [0.575, 500, 1500, "https://en.wikipedia.org/wiki/Wikipedia:Contents-11"], "isController": false}, {"data": [0.5875, 500, 1500, "https://en.wikipedia.org/wiki/Main_Page-19"], "isController": false}, {"data": [0.55, 500, 1500, "https://en.wikipedia.org/wiki/Wikipedia:Contents-10"], "isController": false}, {"data": [0.5125, 500, 1500, "https://en.wikipedia.org/wiki/Main_Page-16"], "isController": false}, {"data": [0.675, 500, 1500, "https://en.wikipedia.org/wiki/Wikipedia:Contents-13"], "isController": false}, {"data": [0.4875, 500, 1500, "https://en.wikipedia.org/wiki/Main_Page-17"], "isController": false}, {"data": [0.75, 500, 1500, "https://en.wikipedia.org/wiki/Wikipedia:Contents-12"], "isController": false}, {"data": [0.525, 500, 1500, "https://en.wikipedia.org/wiki/Main_Page-14"], "isController": false}, {"data": [0.6125, 500, 1500, "https://en.wikipedia.org/wiki/Main_Page-15"], "isController": false}, {"data": [0.3625, 500, 1500, "https://en.wikipedia.org/wiki/Main_Page-12"], "isController": false}, {"data": [0.4875, 500, 1500, "https://en.wikipedia.org/wiki/Main_Page-13"], "isController": false}, {"data": [0.475, 500, 1500, "https://en.wikipedia.org/wiki/Main_Page-21"], "isController": false}, {"data": [0.525, 500, 1500, "https://en.wikipedia.org/wiki/Main_Page-22"], "isController": false}, {"data": [0.6, 500, 1500, "https://en.wikipedia.org/wiki/Main_Page-20"], "isController": false}, {"data": [0.0, 500, 1500, "Test"], "isController": true}, {"data": [0.0, 500, 1500, "https://en.wikipedia.org/wiki/Main_Page"], "isController": false}, {"data": [0.025, 500, 1500, "https://en.wikipedia.org/wiki/Wikipedia:Contents"], "isController": false}, {"data": [0.225, 500, 1500, "https://en.wikipedia.org/wiki/Main_Page-2"], "isController": false}, {"data": [0.5625, 500, 1500, "https://en.wikipedia.org/wiki/Main_Page-1"], "isController": false}, {"data": [0.225, 500, 1500, "https://en.wikipedia.org/wiki/Main_Page-0"], "isController": false}, {"data": [0.3875, 500, 1500, "https://en.wikipedia.org/wiki/Main_Page-6"], "isController": false}, {"data": [0.65, 500, 1500, "https://en.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&uselang=en&list=linterrors&lntcategories=fostered&lntlimit=1&lnttitle=Wikipedia%3AContents"], "isController": false}, {"data": [0.375, 500, 1500, "https://en.wikipedia.org/wiki/Main_Page-5"], "isController": false}, {"data": [0.525, 500, 1500, "https://en.wikipedia.org/wiki/Main_Page-4"], "isController": false}, {"data": [0.4, 500, 1500, "https://en.wikipedia.org/wiki/Main_Page-3"], "isController": false}, {"data": [0.225, 500, 1500, "https://en.wikipedia.org/wiki/Main_Page-9"], "isController": false}, {"data": [0.5, 500, 1500, "https://en.wikipedia.org/wiki/Main_Page-8"], "isController": false}, {"data": [0.5, 500, 1500, "https://en.wikipedia.org/wiki/Main_Page-7"], "isController": false}, {"data": [0.6625, 500, 1500, "https://en.wikipedia.org/wiki/Main_Page-23"], "isController": false}, {"data": [0.0, 500, 1500, "https://en.wikipedia.org/wiki/Portal:Current_events"], "isController": false}, {"data": [0.05, 500, 1500, "https://en.wikipedia.org/wiki/Wikipedia:Contact_us"], "isController": false}, {"data": [0.5, 500, 1500, "https://en.wikipedia.org/wiki/Portal:Current_events-19"], "isController": false}, {"data": [0.6, 500, 1500, "https://en.wikipedia.org/wiki/Portal:Current_events-18"], "isController": false}, {"data": [0.525, 500, 1500, "https://en.wikipedia.org/wiki/Portal:Current_events-17"], "isController": false}, {"data": [0.5375, 500, 1500, "https://en.wikipedia.org/wiki/Portal:Current_events-16"], "isController": false}, {"data": [0.575, 500, 1500, "https://en.wikipedia.org/wiki/Wikipedia:Contents-0"], "isController": false}, {"data": [0.525, 500, 1500, "https://en.wikipedia.org/wiki/Portal:Current_events-15"], "isController": false}, {"data": [0.55, 500, 1500, "https://en.wikipedia.org/wiki/Portal:Current_events-14"], "isController": false}, {"data": [0.5375, 500, 1500, "https://en.wikipedia.org/wiki/Portal:Current_events-13"], "isController": false}, {"data": [0.4625, 500, 1500, "https://en.wikipedia.org/wiki/Portal:Current_events-12"], "isController": false}, {"data": [0.8125, 500, 1500, "https://en.wikipedia.org/wiki/Wikipedia:Contents-4"], "isController": false}, {"data": [0.45, 500, 1500, "https://en.wikipedia.org/wiki/Portal:Current_events-11"], "isController": false}, {"data": [0.8375, 500, 1500, "https://en.wikipedia.org/wiki/Wikipedia:Contents-3"], "isController": false}, {"data": [0.425, 500, 1500, "https://en.wikipedia.org/wiki/Portal:Current_events-10"], "isController": false}, {"data": [0.8625, 500, 1500, "https://en.wikipedia.org/wiki/Wikipedia:Contents-2"], "isController": false}, {"data": [0.7125, 500, 1500, "https://en.wikipedia.org/wiki/Wikipedia:Contents-1"], "isController": false}, {"data": [0.55, 500, 1500, "https://en.wikipedia.org/wiki/Wikipedia:Contents-8"], "isController": false}, {"data": [0.6125, 500, 1500, "https://en.wikipedia.org/wiki/Wikipedia:Contents-7"], "isController": false}, {"data": [0.8625, 500, 1500, "https://en.wikipedia.org/wiki/Wikipedia:Contents-6"], "isController": false}, {"data": [0.9125, 500, 1500, "https://en.wikipedia.org/wiki/Wikipedia:Contents-5"], "isController": false}, {"data": [0.6, 500, 1500, "https://en.wikipedia.org/wiki/Wikipedia:Contents-9"], "isController": false}, {"data": [0.8, 500, 1500, "https://en.wikipedia.org/wiki/Wikipedia:About-8"], "isController": false}, {"data": [0.8375, 500, 1500, "https://en.wikipedia.org/wiki/Wikipedia:About-9"], "isController": false}, {"data": [1.0, 500, 1500, "https://en.wikipedia.org/wiki/Wikipedia:About-6"], "isController": false}, {"data": [0.7875, 500, 1500, "https://en.wikipedia.org/wiki/Wikipedia:About-7"], "isController": false}, {"data": [0.9875, 500, 1500, "https://en.wikipedia.org/wiki/Wikipedia:About-4"], "isController": false}, {"data": [0.85, 500, 1500, "https://en.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&uselang=en&list=linterrors&lntcategories=fostered&lntlimit=1&lnttitle=Wikipedia%3AContact_us"], "isController": false}, {"data": [0.9875, 500, 1500, "https://en.wikipedia.org/wiki/Wikipedia:About-5"], "isController": false}, {"data": [0.9875, 500, 1500, "https://en.wikipedia.org/wiki/Wikipedia:About-2"], "isController": false}, {"data": [0.9625, 500, 1500, "https://en.wikipedia.org/wiki/Wikipedia:About-3"], "isController": false}, {"data": [0.8625, 500, 1500, "https://en.wikipedia.org/wiki/Wikipedia:About-10"], "isController": false}, {"data": [0.725, 500, 1500, "https://en.wikipedia.org/wiki/Wikipedia:About-0"], "isController": false}, {"data": [0.875, 500, 1500, "https://en.wikipedia.org/wiki/Wikipedia:Contact_us-5"], "isController": false}, {"data": [1.0, 500, 1500, "https://en.wikipedia.org/wiki/Wikipedia:About-1"], "isController": false}, {"data": [0.875, 500, 1500, "https://en.wikipedia.org/wiki/Wikipedia:Contact_us-4"], "isController": false}, {"data": [0.5, 500, 1500, "https://en.wikipedia.org/w/api.php?action=visualeditor&format=json&formatversion=2&uselang=en&paction=metadata&page=Wikipedia%3AAbout"], "isController": false}, {"data": [0.9, 500, 1500, "https://en.wikipedia.org/wiki/Wikipedia:Contact_us-3"], "isController": false}, {"data": [0.8875, 500, 1500, "https://en.wikipedia.org/wiki/Wikipedia:Contact_us-2"], "isController": false}, {"data": [0.55, 500, 1500, "https://en.wikipedia.org/wiki/Wikipedia:Contact_us-1"], "isController": false}, {"data": [0.7625, 500, 1500, "https://en.wikipedia.org/wiki/Wikipedia:Contact_us-0"], "isController": false}, {"data": [0.6125, 500, 1500, "https://en.wikipedia.org/wiki/Wikipedia:Contact_us-8"], "isController": false}, {"data": [0.6375, 500, 1500, "https://en.wikipedia.org/wiki/Wikipedia:Contact_us-7"], "isController": false}, {"data": [0.9125, 500, 1500, "https://en.wikipedia.org/wiki/Wikipedia:Contact_us-6"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 3880, 0, 0.0, 943.2061855670114, 96, 13093, 612.0, 1969.9, 2656.95, 5996.0, 114.57256754761553, 3184.7242728480733, 196.73589066883213], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://en.wikipedia.org/wiki/Wikipedia:About", 40, 0, 0.0, 1289.55, 766, 1933, 1256.5, 1801.3, 1911.8, 1933.0, 8.403361344537815, 1533.178505777311, 93.3889180672269], "isController": false}, {"data": ["https://en.wikipedia.org/w/api.php?action=visualeditor&format=json&formatversion=2&uselang=en&paction=metadata&page=Wikipedia%3AContents", 40, 0, 0.0, 715.0499999999997, 567, 915, 691.0, 865.7, 911.4999999999999, 915.0, 11.699327288680902, 115.48515647850249, 10.67106610119918], "isController": false}, {"data": ["https://en.wikipedia.org/w/api.php?action=visualeditor&format=json&formatversion=2&uselang=en&paction=metadata&page=Wikipedia%3AContact_us", 40, 0, 0.0, 734.7749999999999, 629, 979, 732.0, 809.9, 853.5999999999999, 979.0, 6.962576153176675, 98.22399912967798, 6.364229765013055], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Portal:Current_events-23", 40, 0, 0.0, 692.375, 198, 1382, 623.0, 1227.6, 1371.85, 1382.0, 8.373456144023445, 10.49135178982625, 8.774139104040191], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Portal:Current_events-22", 40, 0, 0.0, 651.1500000000001, 159, 1321, 615.5, 972.0999999999999, 1207.549999999999, 1321.0, 8.25082508250825, 10.337703692244224, 8.57312293729373], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Portal:Current_events-21", 40, 0, 0.0, 761.775, 137, 2058, 699.0, 1233.4, 1936.549999999997, 2058.0, 8.095527221210281, 24.903233151183972, 7.06777474195507], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Portal:Current_events-20", 40, 0, 0.0, 789.1250000000001, 140, 1988, 711.5, 1498.9999999999998, 1724.7499999999993, 1988.0, 8.237232289950576, 17.785664641680395, 7.4006383855024716], "isController": false}, {"data": ["https://en.wikipedia.org/w/api.php?action=discussiontoolspageinfo&format=json&formatversion=2&uselang=en&page=Wikipedia%3AAbout&oldid=1107089714", 40, 0, 0.0, 2810.2250000000004, 1855, 4506, 2579.5, 3867.5, 4251.449999999999, 4506.0, 7.630675314765357, 10.372949256009157, 7.019625143075162], "isController": false}, {"data": ["https://en.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&uselang=en&list=linterrors&lntcategories=fostered&lntlimit=1&lnttitle=Wikipedia%3AAbout", 40, 0, 0.0, 449.67499999999995, 384, 557, 447.0, 508.29999999999995, 553.7999999999998, 557.0, 12.303906490310673, 16.38918794217164, 11.5469278683482], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Portal:Current_events-6", 40, 0, 0.0, 285.87499999999994, 151, 1012, 264.5, 346.59999999999997, 371.8499999999999, 1012.0, 9.165902841429881, 23.693500802016498, 8.270795142071494], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Portal:Current_events-5", 40, 0, 0.0, 302.7250000000001, 130, 1305, 269.5, 362.29999999999995, 603.1999999999991, 1305.0, 9.291521486643438, 15.361861207897794, 8.375072590011614], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Portal:Current_events-4", 40, 0, 0.0, 407.80000000000007, 129, 929, 278.5, 800.1, 830.95, 929.0, 9.358914365933552, 12.100783809078147, 9.62396174543753], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Portal:Current_events-3", 40, 0, 0.0, 375.8500000000001, 133, 1308, 267.0, 790.4999999999999, 977.5499999999993, 1308.0, 9.140767824497258, 11.943698583180986, 9.149694355575868], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Portal:Current_events-2", 40, 0, 0.0, 361.12499999999994, 130, 1310, 270.5, 742.6999999999999, 877.1999999999999, 1310.0, 9.383063570255688, 11.756318906873094, 9.419716162327], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Portal:Current_events-1", 40, 0, 0.0, 342.175, 192, 1002, 295.0, 512.5999999999999, 860.7499999999986, 1002.0, 9.387467730579676, 354.82519508331376, 10.670910584369866], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Portal:Current_events-0", 40, 0, 0.0, 942.3, 503, 1908, 824.5, 1502.1, 1793.5499999999993, 1908.0, 8.748906386701663, 2123.745762248469, 8.227731299212598], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Portal:Current_events-9", 40, 0, 0.0, 1046.5249999999996, 453, 2217, 939.5, 1655.8, 2095.8499999999985, 2217.0, 7.82625709254549, 17.677863920954803, 6.886189101936999], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Portal:Current_events-8", 40, 0, 0.0, 942.85, 257, 1987, 854.0, 1450.8999999999999, 1527.95, 1987.0, 7.567158531971245, 10.951688422247447, 8.350477676882331], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Portal:Current_events-7", 40, 0, 0.0, 959.3999999999999, 455, 2773, 800.0, 1433.7999999999997, 2262.9499999999994, 2773.0, 6.600660066006601, 21.714656817244226, 5.943172442244225], "isController": false}, {"data": ["https://en.wikipedia.org/w/api.php?action=discussiontoolspageinfo&format=json&formatversion=2&uselang=en&page=Wikipedia%3AContact_us&oldid=967537943", 40, 0, 0.0, 468.2750000000001, 409, 558, 460.0, 528.1, 534.75, 558.0, 7.44186046511628, 10.116279069767442, 6.875], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Main_Page-10", 40, 0, 0.0, 1085.6750000000002, 136, 3581, 998.5, 1859.3999999999999, 2836.4999999999973, 3581.0, 3.518029903254178, 8.004892260334213, 3.095454045734389], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Main_Page-11", 40, 0, 0.0, 1489.275, 388, 6131, 1065.5, 3062.399999999999, 5499.449999999995, 6131.0, 3.5470426531879045, 11.588766820741332, 3.1867961337235085], "isController": false}, {"data": ["https://en.wikipedia.org/w/api.php?action=discussiontoolspageinfo&format=json&formatversion=2&uselang=en&page=Wikipedia%3AContents&oldid=1106439112", 40, 0, 0.0, 591.525, 471, 838, 582.5, 735.3, 808.1499999999997, 838.0, 12.376237623762377, 22.323155167079207, 11.421430228960395], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Special:Random", 40, 0, 0.0, 483.15, 363, 934, 464.5, 570.6, 838.8499999999991, 934.0, 8.863283846665189, 11.958941530024374, 8.274706403722579], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Main_Page-18", 40, 0, 0.0, 1241.8750000000005, 165, 3525, 934.0, 2670.2, 3070.4499999999994, 3525.0, 3.60555255092843, 13.151112087614928, 3.218237335496665], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Wikipedia:Contents-11", 40, 0, 0.0, 887.9000000000003, 190, 3464, 568.5, 2059.399999999999, 3172.199999999996, 3464.0, 5.5286800276434, 13.319583621285418, 4.837595024187975], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Main_Page-19", 40, 0, 0.0, 837.2750000000001, 126, 2696, 650.0, 2212.2999999999993, 2435.6999999999994, 2696.0, 3.7091988130563798, 7.023570799332344, 3.3469723664688424], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Wikipedia:Contents-10", 40, 0, 0.0, 856.9, 96, 3427, 568.0, 2337.7, 2882.2499999999995, 3427.0, 5.530973451327434, 15.939358061393804, 4.872009817477876], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Main_Page-16", 40, 0, 0.0, 1149.25, 115, 3069, 891.5, 2658.5999999999995, 2758.5499999999997, 3069.0, 3.6003600360036003, 9.500168766876689, 3.1995387038703873], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Wikipedia:Contents-13", 40, 0, 0.0, 578.7750000000001, 132, 1591, 547.0, 794.5999999999999, 1463.3999999999974, 1591.0, 6.920415224913495, 8.670793685121106, 7.251567906574394], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Main_Page-17", 40, 0, 0.0, 1268.15, 116, 4332, 932.0, 3395.8999999999983, 3832.149999999999, 4332.0, 3.6248300860897147, 10.545282057091073, 3.2283642954236518], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Wikipedia:Contents-12", 40, 0, 0.0, 582.625, 132, 2213, 493.0, 906.9999999999999, 1216.4999999999993, 2213.0, 6.942034015966678, 8.6978805102395, 7.213207219715377], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Main_Page-14", 40, 0, 0.0, 1101.0, 147, 4760, 806.5, 2464.0999999999995, 2553.7, 4760.0, 3.604902667627974, 5.762915690338861, 3.1965347873107426], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Main_Page-15", 40, 0, 0.0, 1041.5, 136, 4932, 785.0, 2240.0, 2845.299999999999, 4932.0, 3.7686074995289243, 14.146999246278499, 3.341694931222913], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Main_Page-12", 40, 0, 0.0, 1343.6, 164, 3114, 1343.5, 2365.5, 3050.8999999999987, 3114.0, 3.6010082823190492, 10.27905000900252, 3.2704469751530425], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Main_Page-13", 40, 0, 0.0, 1225.4499999999998, 231, 4951, 685.5, 2376.4, 3701.849999999995, 4951.0, 3.6406662419222715, 10.431362064257758, 3.235357695458269], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Main_Page-21", 40, 0, 0.0, 1272.45, 101, 3506, 1030.0, 2828.9999999999995, 3191.3999999999996, 3506.0, 3.9600039600039603, 9.377939065439065, 3.530745718245718], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Main_Page-22", 40, 0, 0.0, 1065.1750000000002, 118, 3036, 778.0, 2340.4, 2433.7999999999997, 3036.0, 3.857280617164899, 13.850801591128256, 3.6840043394406945], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Main_Page-20", 40, 0, 0.0, 943.3750000000001, 109, 2395, 488.5, 2213.4999999999995, 2342.4999999999995, 2395.0, 3.698224852071006, 7.208649223372781, 3.351516272189349], "isController": false}, {"data": ["Test", 40, 0, 0.0, 26978.0, 21077, 32409, 27313.0, 31079.7, 31479.0, 32409.0, 1.1783767859773162, 1617.114570674989, 103.59128737663868], "isController": true}, {"data": ["https://en.wikipedia.org/wiki/Main_Page", 40, 0, 0.0, 8239.700000000003, 4011, 13093, 8406.0, 10283.6, 10964.849999999999, 13093.0, 2.398656752218758, 756.1517112916767, 53.5059741544735], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Wikipedia:Contents", 40, 0, 0.0, 2885.1499999999996, 1243, 5997, 2136.5, 5733.0, 5847.25, 5997.0, 4.634457189201715, 1263.4967251042754, 62.85935146564709], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Main_Page-2", 40, 0, 0.0, 1658.2250000000001, 286, 3053, 1724.5, 2654.9, 2818.8499999999995, 3053.0, 3.3918426185025012, 205.77230997731706, 3.318970999745612], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Main_Page-1", 40, 0, 0.0, 1020.325, 127, 2743, 608.0, 2476.8, 2652.749999999999, 2743.0, 3.185474237477105, 108.23768615115075, 3.4498934857051844], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Main_Page-0", 40, 0, 0.0, 1751.4500000000003, 644, 3791, 1770.5, 2804.7999999999997, 3084.55, 3791.0, 3.078580774263065, 258.9856076348803, 2.5404304240745015], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Main_Page-6", 40, 0, 0.0, 1295.425, 181, 2739, 1144.5, 2363.4, 2695.2, 2739.0, 3.038820937476259, 26.337437324318163, 2.7034822988680394], "isController": false}, {"data": ["https://en.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&uselang=en&list=linterrors&lntcategories=fostered&lntlimit=1&lnttitle=Wikipedia%3AContents", 40, 0, 0.0, 560.9, 387, 946, 544.0, 685.9, 932.149999999999, 946.0, 12.547051442910917, 16.71306461731493, 11.811872647427855], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Main_Page-5", 40, 0, 0.0, 1341.525, 378, 3576, 1067.5, 2820.5, 3490.7999999999975, 3576.0, 3.0351316488352684, 21.207389597086273, 3.0143836785795584], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Main_Page-4", 40, 0, 0.0, 1084.5500000000002, 195, 3446, 689.0, 2630.7999999999997, 2950.8999999999996, 3446.0, 3.509695533912433, 14.025072387470386, 3.3074767482670877], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Main_Page-3", 40, 0, 0.0, 1180.8249999999998, 354, 2657, 1051.5, 1962.9999999999998, 2609.399999999999, 2657.0, 3.5090797438371784, 32.66117093604702, 3.423408851653654], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Main_Page-9", 40, 0, 0.0, 1659.5250000000003, 583, 3366, 1755.0, 3158.999999999999, 3282.5499999999997, 3366.0, 3.2425421530479897, 167.83955496108948, 3.12537998540856], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Main_Page-8", 40, 0, 0.0, 1203.2749999999999, 345, 3156, 1099.0, 2412.3999999999996, 2625.5499999999997, 3156.0, 3.4390852033359125, 29.786373699595906, 3.469311538130857], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Main_Page-7", 40, 0, 0.0, 1176.5749999999998, 330, 3813, 995.5, 2677.4, 3138.1, 3813.0, 3.525782282944028, 28.337097840458352, 3.549884310268841], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Main_Page-23", 40, 0, 0.0, 806.2750000000001, 101, 3979, 499.5, 1703.1, 2585.249999999998, 3979.0, 3.880481179666279, 13.346733119906869, 3.7402684807916184], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Portal:Current_events", 40, 0, 0.0, 4461.775, 3267, 5319, 4479.0, 5105.8, 5162.45, 5319.0, 5.519525320822409, 1848.2897287239548, 124.7013850558852], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Wikipedia:Contact_us", 40, 0, 0.0, 1916.7500000000002, 688, 3307, 1879.0, 2428.6, 2725.499999999999, 3307.0, 7.0064809949203015, 1532.7416141180593, 63.58518348222106], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Portal:Current_events-19", 40, 0, 0.0, 836.3749999999999, 240, 2184, 734.0, 1554.0999999999997, 1997.8999999999987, 2184.0, 8.322929671244278, 24.269792967124427, 7.363842072409488], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Portal:Current_events-18", 40, 0, 0.0, 678.275, 220, 1910, 661.5, 959.6, 1013.5499999999998, 1910.0, 7.187780772686433, 19.88572551662174, 6.401617250673854], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Portal:Current_events-17", 40, 0, 0.0, 876.375, 308, 2864, 786.0, 1421.8999999999999, 2097.699999999997, 2864.0, 8.151620134501732, 25.593221418381905, 7.3237212145914], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Portal:Current_events-16", 40, 0, 0.0, 830.3000000000001, 423, 1889, 734.5, 1486.7999999999997, 1798.35, 1889.0, 8.13338755591704, 24.74189997204148, 7.545623220821472], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Wikipedia:Contents-0", 40, 0, 0.0, 802.4500000000002, 258, 3183, 579.5, 1891.5, 3142.3499999999976, 3183.0, 5.23149359142035, 583.4954551399425, 4.904525241956579], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Portal:Current_events-15", 40, 0, 0.0, 884.25, 257, 2838, 727.5, 1673.0999999999997, 1861.7, 2838.0, 8.148299042574862, 23.04420929669994, 7.161590955388063], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Portal:Current_events-14", 40, 0, 0.0, 798.3249999999999, 150, 1894, 729.5, 1324.8, 1798.199999999999, 1894.0, 8.001600320064012, 31.779793458691742, 6.938887777555512], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Portal:Current_events-13", 40, 0, 0.0, 799.2499999999999, 185, 2182, 653.0, 1574.7999999999997, 1875.8, 2182.0, 6.968641114982578, 23.4102787456446, 6.356162891986062], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Portal:Current_events-12", 40, 0, 0.0, 1049.875, 266, 3371, 895.0, 1616.9999999999998, 3251.849999999993, 3371.0, 7.344840249724569, 20.894062155710614, 6.362180958501653], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Wikipedia:Contents-4", 40, 0, 0.0, 476.1500000000001, 108, 4565, 204.0, 758.8999999999999, 1826.9499999999996, 4565.0, 5.572582892170521, 7.205175536361104, 5.730400181108944], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Portal:Current_events-11", 40, 0, 0.0, 1028.875, 423, 2481, 870.0, 1644.4999999999998, 2149.299999999999, 2481.0, 7.817080320500294, 27.1765683017393, 7.130032245456322], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Wikipedia:Contents-3", 40, 0, 0.0, 415.5000000000001, 103, 1860, 207.5, 1043.5, 1706.3499999999972, 1860.0, 5.571806658308956, 7.280348934391976, 5.577247875748712], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Portal:Current_events-10", 40, 0, 0.0, 1025.575, 460, 2190, 841.5, 1849.0999999999997, 2022.0999999999997, 2190.0, 8.036970062286517, 25.31174653405666, 7.220715290335543], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Wikipedia:Contents-2", 40, 0, 0.0, 388.0750000000001, 107, 1742, 203.5, 1387.0999999999995, 1660.5999999999992, 1742.0, 5.580357142857143, 6.987162998744419, 5.602155412946429], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Wikipedia:Contents-1", 40, 0, 0.0, 742.6250000000002, 209, 2821, 489.5, 1821.9999999999995, 2514.9999999999977, 2821.0, 5.470459518599562, 744.9868367067834, 6.85410113512035], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Wikipedia:Contents-8", 40, 0, 0.0, 863.625, 259, 3907, 681.0, 1640.1999999999998, 1856.3499999999995, 3907.0, 5.5233360950013815, 17.815995236122617, 4.935402858326429], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Wikipedia:Contents-7", 40, 0, 0.0, 731.9000000000001, 163, 2289, 568.0, 1680.8999999999994, 2096.3999999999987, 2289.0, 5.46000546000546, 21.70138888888889, 4.814829033579034], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Wikipedia:Contents-6", 40, 0, 0.0, 385.22499999999997, 113, 2575, 212.5, 759.7999999999998, 1820.9999999999955, 2575.0, 5.5578713352785885, 14.8987859524802, 5.123662637209948], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Wikipedia:Contents-5", 40, 0, 0.0, 339.5750000000001, 111, 2575, 197.0, 624.6, 1439.799999999997, 2575.0, 5.561735261401558, 9.369134107341491, 5.013165670189099], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Wikipedia:Contents-9", 40, 0, 0.0, 767.4749999999999, 154, 2508, 594.0, 1676.6, 2448.8499999999985, 2508.0, 5.518002483101117, 9.370904607532074, 4.95758035591116], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Wikipedia:About-8", 40, 0, 0.0, 494.17499999999995, 350, 972, 466.0, 632.6999999999999, 696.95, 972.0, 10.698047606311848, 20.76925648569136, 9.601079834180263], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Wikipedia:About-9", 40, 0, 0.0, 464.125, 135, 948, 439.5, 656.3999999999999, 705.8499999999998, 948.0, 10.584810796507012, 13.262023683514158, 10.998279968245567], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Wikipedia:About-6", 40, 0, 0.0, 168.22500000000002, 106, 375, 151.5, 239.89999999999998, 253.44999999999996, 375.0, 10.758472296933835, 14.961000537923615, 10.705940693921463], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Wikipedia:About-7", 40, 0, 0.0, 469.87499999999994, 108, 891, 492.5, 684.6999999999999, 746.7999999999997, 891.0, 10.81665765278529, 20.027717685235263, 9.62302257977285], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Wikipedia:About-4", 40, 0, 0.0, 217.92499999999998, 102, 538, 148.5, 467.0, 498.4499999999999, 538.0, 10.121457489878543, 13.086728238866398, 10.408100328947368], "isController": false}, {"data": ["https://en.wikipedia.org/w/api.php?action=query&format=json&formatversion=2&uselang=en&list=linterrors&lntcategories=fostered&lntlimit=1&lnttitle=Wikipedia%3AContact_us", 40, 0, 0.0, 493.57500000000005, 386, 890, 470.0, 677.2999999999998, 793.2499999999998, 890.0, 7.384160974709249, 9.835933173343179, 6.965917482001108], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Wikipedia:About-5", 40, 0, 0.0, 182.27499999999992, 106, 584, 152.0, 279.0, 353.0499999999997, 584.0, 10.758472296933835, 14.183532813340506, 10.737459655728886], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Wikipedia:About-2", 40, 0, 0.0, 200.25, 105, 557, 151.5, 437.19999999999993, 492.24999999999994, 557.0, 10.057832537088256, 12.601756977621323, 10.09712094543626], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Wikipedia:About-3", 40, 0, 0.0, 199.975, 102, 590, 151.0, 450.49999999999994, 537.9499999999999, 590.0, 10.822510822510822, 14.141132305194805, 10.83307968073593], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Wikipedia:About-10", 40, 0, 0.0, 449.94999999999993, 144, 607, 451.0, 584.6, 588.85, 607.0, 10.584810796507012, 13.262023683514158, 11.091310531886743], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Wikipedia:About-0", 40, 0, 0.0, 542.075, 247, 940, 517.0, 891.4, 915.85, 940.0, 9.445100354191263, 1586.5370425029514, 8.82711038961039], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Wikipedia:Contact_us-5", 40, 0, 0.0, 430.8500000000002, 178, 751, 411.5, 687.8, 709.9499999999999, 751.0, 7.765482430596, 110.49128809939818, 6.969217142302466], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Wikipedia:About-1", 40, 0, 0.0, 145.67499999999998, 96, 241, 136.0, 217.79999999999998, 230.89999999999998, 241.0, 10.735373054213635, 17.31917606011809, 13.723245437466453], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Wikipedia:Contact_us-4", 40, 0, 0.0, 421.82500000000005, 102, 1228, 342.0, 849.4999999999998, 979.2999999999998, 1228.0, 7.867820613690008, 10.172846184107003, 8.090639752163652], "isController": false}, {"data": ["https://en.wikipedia.org/w/api.php?action=visualeditor&format=json&formatversion=2&uselang=en&paction=metadata&page=Wikipedia%3AAbout", 40, 0, 0.0, 877.9250000000001, 618, 1279, 895.0, 1032.3, 1065.5, 1279.0, 11.016248967226659, 160.11214197190858, 10.015749793445332], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Wikipedia:Contact_us-3", 40, 0, 0.0, 385.32500000000005, 102, 1224, 337.0, 635.6, 671.3999999999999, 1224.0, 7.863180656575585, 10.274351287595833, 7.870859543935523], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Wikipedia:Contact_us-2", 40, 0, 0.0, 400.2750000000001, 102, 1270, 336.0, 680.0, 986.7499999999994, 1270.0, 7.869368483179225, 9.859765394452095, 7.900108203816643], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Wikipedia:Contact_us-1", 40, 0, 0.0, 968.825, 209, 2594, 964.0, 1480.8, 1955.4999999999984, 2594.0, 7.3461891643709825, 1030.3518135904499, 9.13251836547291], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Wikipedia:Contact_us-0", 40, 0, 0.0, 662.75, 137, 2257, 444.5, 1316.4, 1355.25, 2257.0, 7.6452599388379205, 430.6282253440367, 7.182363340978593], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Wikipedia:Contact_us-8", 40, 0, 0.0, 804.7499999999999, 322, 1550, 828.0, 1210.0, 1262.6999999999998, 1550.0, 7.517383950385266, 9.418753523773727, 7.877102518323624], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Wikipedia:Contact_us-7", 40, 0, 0.0, 807.2249999999999, 320, 1287, 833.0, 1249.5, 1286.1, 1287.0, 7.517383950385266, 9.418753523773727, 7.81103176094719], "isController": false}, {"data": ["https://en.wikipedia.org/wiki/Wikipedia:Contact_us-6", 40, 0, 0.0, 367.29999999999995, 111, 679, 345.0, 633.0, 656.75, 679.0, 7.869368483179225, 12.518751229588824, 6.8856974227818215], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 3880, 0, null, null, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
