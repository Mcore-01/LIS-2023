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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9245454545454546, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.99, 500, 1500, "/include/ajax/nikolaus_pizza.php-7"], "isController": false}, {"data": [1.0, 500, 1500, "/upload/resize_cache/iblock/b40/100_100_1/zribf5ykbp222cgylfsm17d099ub4pzk.jpg-6"], "isController": false}, {"data": [0.96, 500, 1500, "/include/ajax/ym_ecommerce.php-8"], "isController": false}, {"data": [1.0, 500, 1500, "/checkout/-9"], "isController": false}, {"data": [1.0, 500, 1500, "/upload/resize_cache/iblock/b40/150_150_1/zribf5ykbp222cgylfsm17d099ub4pzk.jpg-11"], "isController": false}, {"data": [0.3, 500, 1500, "/include/ajax/nikolaus_pizza.php-1"], "isController": false}, {"data": [1.0, 500, 1500, "/upload/resize_cache/iblock/c2f/150_150_1/jolfm1cmof3yfsvr91utri8ioggkcr1f.jpg-10"], "isController": false}, {"data": [1.0, 500, 1500, "/include/ajax/ym_ecommerce.php-2"], "isController": false}, {"data": [0.96, 500, 1500, "/include/ajax/nikolaus_pizza.php-3"], "isController": false}, {"data": [1.0, 500, 1500, "/include/ajax/ym_ecommerce.php-4"], "isController": false}, {"data": [0.96, 500, 1500, "/include/ajax/nikolaus_pizza.php-5"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 550, 0, 0.0, 287.4927272727272, 40, 3927, 83.0, 140.0, 2378.45, 3572.710000000001, 99.5114890537362, 403.5470050434232, 50.06495103582414], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/include/ajax/nikolaus_pizza.php-7", 50, 0, 0.0, 77.42, 57, 736, 64.0, 69.9, 71.0, 736.0, 10.59322033898305, 11.71047404661017, 5.793167372881356], "isController": false}, {"data": ["/upload/resize_cache/iblock/b40/100_100_1/zribf5ykbp222cgylfsm17d099ub4pzk.jpg-6", 50, 0, 0.0, 42.98, 40, 85, 41.5, 45.0, 47.449999999999996, 85.0, 10.651896037494673, 51.179031742650196, 4.816238149765658], "isController": false}, {"data": ["/include/ajax/ym_ecommerce.php-8", 50, 0, 0.0, 229.94, 78, 3799, 89.0, 97.8, 1599.7499999999857, 3799.0, 10.557432432432432, 9.289303341427365, 5.361196157094595], "isController": false}, {"data": ["/checkout/-9", 50, 0, 0.0, 109.72, 93, 148, 108.0, 118.0, 127.35, 148.0, 10.539629005059023, 71.70529550484824, 5.105132799325464], "isController": false}, {"data": ["/upload/resize_cache/iblock/b40/150_150_1/zribf5ykbp222cgylfsm17d099ub4pzk.jpg-11", 50, 0, 0.0, 42.44, 40, 46, 41.0, 45.9, 46.0, 46.0, 10.699764605178686, 103.47633680184036, 4.93192274769955], "isController": false}, {"data": ["/include/ajax/nikolaus_pizza.php-1", 50, 0, 0.0, 2052.22, 130, 3927, 2361.5, 3530.8, 3817.2999999999997, 3927.0, 10.38637307852098, 19.717880141254675, 5.669904834856668], "isController": false}, {"data": ["/upload/resize_cache/iblock/c2f/150_150_1/jolfm1cmof3yfsvr91utri8ioggkcr1f.jpg-10", 50, 0, 0.0, 43.14, 40, 49, 42.0, 46.0, 46.449999999999996, 49.0, 10.699764605178686, 163.62071675048148, 4.93192274769955], "isController": false}, {"data": ["/include/ajax/ym_ecommerce.php-2", 50, 0, 0.0, 88.12, 79, 112, 87.0, 97.0, 100.24999999999997, 112.0, 10.5999576001696, 8.9437142251431, 5.382790968836125], "isController": false}, {"data": ["/include/ajax/nikolaus_pizza.php-3", 50, 0, 0.0, 203.52000000000004, 87, 3209, 97.0, 107.9, 1108.9499999999907, 3209.0, 10.557432432432432, 18.557986697635137, 5.7632858688766895], "isController": false}, {"data": ["/include/ajax/ym_ecommerce.php-4", 50, 0, 0.0, 87.56000000000002, 77, 103, 87.0, 94.0, 98.35, 103.0, 10.575296108291033, 9.305021282783418, 5.37026755499154], "isController": false}, {"data": ["/include/ajax/nikolaus_pizza.php-5", 50, 0, 0.0, 185.35999999999999, 58, 3182, 63.0, 68.0, 1406.2499999999873, 3182.0, 10.606703436571912, 7.126378871446754, 5.448365241832838], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 550, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
