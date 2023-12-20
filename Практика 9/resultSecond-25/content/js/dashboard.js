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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.94, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.96, 500, 1500, "/include/ajax/nikolaus_pizza.php-7"], "isController": false}, {"data": [1.0, 500, 1500, "/upload/resize_cache/iblock/b40/100_100_1/zribf5ykbp222cgylfsm17d099ub4pzk.jpg-6"], "isController": false}, {"data": [1.0, 500, 1500, "/include/ajax/ym_ecommerce.php-8"], "isController": false}, {"data": [1.0, 500, 1500, "/checkout/-9"], "isController": false}, {"data": [1.0, 500, 1500, "/upload/resize_cache/iblock/b40/150_150_1/zribf5ykbp222cgylfsm17d099ub4pzk.jpg-11"], "isController": false}, {"data": [0.42, 500, 1500, "/include/ajax/nikolaus_pizza.php-1"], "isController": false}, {"data": [1.0, 500, 1500, "/upload/resize_cache/iblock/c2f/150_150_1/jolfm1cmof3yfsvr91utri8ioggkcr1f.jpg-10"], "isController": false}, {"data": [1.0, 500, 1500, "/include/ajax/ym_ecommerce.php-2"], "isController": false}, {"data": [1.0, 500, 1500, "/include/ajax/nikolaus_pizza.php-3"], "isController": false}, {"data": [1.0, 500, 1500, "/include/ajax/ym_ecommerce.php-4"], "isController": false}, {"data": [0.96, 500, 1500, "/include/ajax/nikolaus_pizza.php-5"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 275, 0, 0.0, 197.77454545454546, 40, 2706, 84.0, 140.00000000000003, 1567.3999999999996, 2635.4400000000005, 62.986715529088414, 255.432156865552, 31.6890728784929], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/include/ajax/nikolaus_pizza.php-7", 25, 0, 0.0, 150.99999999999997, 60, 1959, 64.0, 177.0000000000005, 1467.5999999999988, 1959.0, 7.167431192660551, 7.923371201261468, 3.9196889334862384], "isController": false}, {"data": ["/upload/resize_cache/iblock/b40/100_100_1/zribf5ykbp222cgylfsm17d099ub4pzk.jpg-6", 25, 0, 0.0, 42.199999999999996, 40, 45, 42.0, 45.0, 45.0, 45.0, 7.212925562608194, 34.655853289094054, 3.2613130229371032], "isController": false}, {"data": ["/include/ajax/ym_ecommerce.php-8", 25, 0, 0.0, 88.24, 81, 100, 87.0, 96.4, 99.1, 100.0, 7.10025560920193, 6.247392874893496, 3.605598551547856], "isController": false}, {"data": ["/checkout/-9", 25, 0, 0.0, 109.63999999999999, 97, 145, 109.0, 118.60000000000001, 137.79999999999998, 145.0, 7.048209754722301, 47.955909042853115, 3.4139765999436142], "isController": false}, {"data": ["/upload/resize_cache/iblock/b40/150_150_1/zribf5ykbp222cgylfsm17d099ub4pzk.jpg-11", 25, 0, 0.0, 42.96, 40, 47, 43.0, 46.0, 46.7, 47.0, 7.159221076746849, 69.23609992482818, 3.2999534650630014], "isController": false}, {"data": ["/include/ajax/nikolaus_pizza.php-1", 25, 0, 0.0, 1262.5600000000002, 134, 2706, 1531.0, 2640.4, 2691.9, 2706.0, 6.952169076751947, 13.198258481646274, 3.795178236234705], "isController": false}, {"data": ["/upload/resize_cache/iblock/c2f/150_150_1/jolfm1cmof3yfsvr91utri8ioggkcr1f.jpg-10", 25, 0, 0.0, 44.84, 40, 86, 44.0, 45.0, 73.69999999999997, 86.0, 7.148984844152131, 109.32222038533028, 3.295235201601373], "isController": false}, {"data": ["/include/ajax/ym_ecommerce.php-2", 25, 0, 0.0, 89.0, 81, 98, 89.0, 96.4, 97.7, 98.0, 7.159221076746849, 6.040592783505154, 3.6355419530355095], "isController": false}, {"data": ["/include/ajax/nikolaus_pizza.php-3", 25, 0, 0.0, 95.99999999999999, 87, 109, 94.0, 105.2, 108.4, 109.0, 7.126567844925884, 12.52717003990878, 3.8903822512827824], "isController": false}, {"data": ["/include/ajax/ym_ecommerce.php-4", 25, 0, 0.0, 88.56, 81, 97, 88.0, 94.0, 96.1, 97.0, 7.1285999429712, 6.2723325670088395, 3.6199921585400627], "isController": false}, {"data": ["/include/ajax/nikolaus_pizza.php-5", 25, 0, 0.0, 160.52000000000004, 60, 2462, 64.0, 70.0, 1744.3999999999983, 2462.0, 7.175660160734788, 4.821146670493685, 3.6859348091274398], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 275, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
