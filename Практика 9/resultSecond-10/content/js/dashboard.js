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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9818181818181818, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "/include/ajax/nikolaus_pizza.php-7"], "isController": false}, {"data": [1.0, 500, 1500, "/upload/resize_cache/iblock/b40/100_100_1/zribf5ykbp222cgylfsm17d099ub4pzk.jpg-6"], "isController": false}, {"data": [1.0, 500, 1500, "/include/ajax/ym_ecommerce.php-8"], "isController": false}, {"data": [1.0, 500, 1500, "/checkout/-9"], "isController": false}, {"data": [1.0, 500, 1500, "/upload/resize_cache/iblock/b40/150_150_1/zribf5ykbp222cgylfsm17d099ub4pzk.jpg-11"], "isController": false}, {"data": [0.8, 500, 1500, "/include/ajax/nikolaus_pizza.php-1"], "isController": false}, {"data": [1.0, 500, 1500, "/upload/resize_cache/iblock/c2f/150_150_1/jolfm1cmof3yfsvr91utri8ioggkcr1f.jpg-10"], "isController": false}, {"data": [1.0, 500, 1500, "/include/ajax/ym_ecommerce.php-2"], "isController": false}, {"data": [1.0, 500, 1500, "/include/ajax/nikolaus_pizza.php-3"], "isController": false}, {"data": [1.0, 500, 1500, "/include/ajax/ym_ecommerce.php-4"], "isController": false}, {"data": [1.0, 500, 1500, "/include/ajax/nikolaus_pizza.php-5"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 110, 0, 0.0, 115.80000000000001, 39, 1130, 83.5, 130.60000000000002, 342.4499999999984, 1122.41, 43.06969459671104, 174.6582413615897, 21.66867536217698], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/include/ajax/nikolaus_pizza.php-7", 10, 0, 0.0, 65.6, 60, 77, 66.0, 76.2, 77.0, 77.0, 6.309148264984227, 6.974566246056782, 3.4503154574132493], "isController": false}, {"data": ["/upload/resize_cache/iblock/b40/100_100_1/zribf5ykbp222cgylfsm17d099ub4pzk.jpg-6", 10, 0, 0.0, 42.4, 39, 46, 42.0, 45.9, 46.0, 46.0, 6.39386189258312, 30.72050831202046, 2.8909746643222505], "isController": false}, {"data": ["/include/ajax/ym_ecommerce.php-8", 10, 0, 0.0, 88.1, 83, 101, 87.0, 100.0, 101.0, 101.0, 6.207324643078834, 5.461718265052762, 3.1521570453134697], "isController": false}, {"data": ["/checkout/-9", 10, 0, 0.0, 110.6, 98, 127, 110.5, 126.8, 127.0, 127.0, 6.105006105006105, 41.53252346611722, 2.9571123321123323], "isController": false}, {"data": ["/upload/resize_cache/iblock/b40/150_150_1/zribf5ykbp222cgylfsm17d099ub4pzk.jpg-11", 10, 0, 0.0, 42.8, 40, 46, 42.5, 46.0, 46.0, 46.0, 6.325110689437065, 61.16950308349146, 2.9154807084123973], "isController": false}, {"data": ["/include/ajax/nikolaus_pizza.php-1", 10, 0, 0.0, 533.3, 139, 1130, 349.5, 1123.1, 1130.0, 1130.0, 5.555555555555555, 10.546875, 3.0327690972222223], "isController": false}, {"data": ["/upload/resize_cache/iblock/c2f/150_150_1/jolfm1cmof3yfsvr91utri8ioggkcr1f.jpg-10", 10, 0, 0.0, 43.3, 41, 49, 42.5, 48.7, 49.0, 49.0, 6.297229219143577, 96.2971800220403, 2.902629093198992], "isController": false}, {"data": ["/include/ajax/ym_ecommerce.php-2", 10, 0, 0.0, 98.2, 86, 131, 95.5, 128.0, 131.0, 131.0, 6.234413965087282, 5.260286783042393, 3.165913341645885], "isController": false}, {"data": ["/include/ajax/nikolaus_pizza.php-3", 10, 0, 0.0, 96.89999999999999, 89, 103, 97.0, 103.0, 103.0, 103.0, 6.20347394540943, 10.904544044665013, 3.3864667338709675], "isController": false}, {"data": ["/include/ajax/ym_ecommerce.php-4", 10, 0, 0.0, 87.8, 80, 103, 86.5, 101.9, 103.0, 103.0, 6.238303181534623, 5.488975748596382, 3.1678883343730506], "isController": false}, {"data": ["/include/ajax/nikolaus_pizza.php-5", 10, 0, 0.0, 64.8, 61, 69, 64.0, 69.0, 69.0, 69.0, 6.297229219143577, 4.230950881612091, 3.234709540302267], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 110, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
