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

    var data = {"OkPercent": 35.981818181818184, "KoPercent": 64.01818181818182};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.3271363636363636, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.1155, 500, 1500, "/include/ajax/nikolaus_pizza.php-7"], "isController": false}, {"data": [0.9825, 500, 1500, "/upload/resize_cache/iblock/b40/100_100_1/zribf5ykbp222cgylfsm17d099ub4pzk.jpg-6"], "isController": false}, {"data": [0.139, 500, 1500, "/include/ajax/ym_ecommerce.php-8"], "isController": false}, {"data": [0.031, 500, 1500, "/checkout/-9"], "isController": false}, {"data": [0.9325, 500, 1500, "/upload/resize_cache/iblock/b40/150_150_1/zribf5ykbp222cgylfsm17d099ub4pzk.jpg-11"], "isController": false}, {"data": [0.024, 500, 1500, "/include/ajax/nikolaus_pizza.php-1"], "isController": false}, {"data": [0.9415, 500, 1500, "/upload/resize_cache/iblock/c2f/150_150_1/jolfm1cmof3yfsvr91utri8ioggkcr1f.jpg-10"], "isController": false}, {"data": [0.139, 500, 1500, "/include/ajax/ym_ecommerce.php-2"], "isController": false}, {"data": [0.107, 500, 1500, "/include/ajax/nikolaus_pizza.php-3"], "isController": false}, {"data": [0.0965, 500, 1500, "/include/ajax/ym_ecommerce.php-4"], "isController": false}, {"data": [0.09, 500, 1500, "/include/ajax/nikolaus_pizza.php-5"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 11000, 7042, 64.01818181818182, 954.4430000000015, 39, 16464, 453.0, 2269.5999999999985, 4790.0, 9889.789999999843, 614.3535325328121, 1968.0219277960066, 309.0857127897235], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/include/ajax/nikolaus_pizza.php-7", 1000, 883, 88.3, 520.9889999999998, 40, 4408, 592.0, 710.0, 1460.7499999999982, 1842.92, 58.9518363497023, 38.02381930525261, 32.23928550374344], "isController": false}, {"data": ["/upload/resize_cache/iblock/b40/100_100_1/zribf5ykbp222cgylfsm17d099ub4pzk.jpg-6", 1000, 0, 0.0, 102.33399999999993, 39, 1982, 48.0, 169.0, 446.8499999999998, 902.8100000000002, 59.02490851139181, 283.59624011332784, 26.688020157006257], "isController": false}, {"data": ["/include/ajax/ym_ecommerce.php-8", 1000, 861, 86.1, 457.437, 40, 3963, 491.5, 686.0, 759.0, 1710.7900000000002, 59.23117929277972, 37.02625468296512, 30.078333234614703], "isController": false}, {"data": ["/checkout/-9", 1000, 969, 96.9, 97.32400000000007, 39, 4151, 85.0, 100.0, 347.4999999999993, 379.98, 59.389476184820055, 46.134313476214516, 28.76677752702221], "isController": false}, {"data": ["/upload/resize_cache/iblock/b40/150_150_1/zribf5ykbp222cgylfsm17d099ub4pzk.jpg-11", 1000, 0, 0.0, 208.7159999999998, 40, 2409, 90.0, 546.0, 671.0, 1296.7900000000002, 59.60185957801883, 576.4035306651568, 27.472732149243058], "isController": false}, {"data": ["/include/ajax/nikolaus_pizza.php-1", 1000, 772, 77.2, 5740.613999999999, 127, 16464, 4799.0, 10364.7, 10640.749999999998, 15219.0, 57.937427578215534, 51.19812789687138, 31.62795118771726], "isController": false}, {"data": ["/upload/resize_cache/iblock/c2f/150_150_1/jolfm1cmof3yfsvr91utri8ioggkcr1f.jpg-10", 1000, 0, 0.0, 205.82199999999997, 40, 2457, 92.5, 544.9, 663.9499999999999, 1251.7400000000002, 59.605412171425165, 911.485497258151, 27.474369672766286], "isController": false}, {"data": ["/include/ajax/ym_ecommerce.php-2", 1000, 856, 85.6, 1058.0670000000007, 40, 15426, 776.0, 1747.6999999999998, 2553.399999999999, 7393.39, 58.278454455387845, 36.21368523806749, 29.59452765312664], "isController": false}, {"data": ["/include/ajax/nikolaus_pizza.php-3", 1000, 890, 89.0, 769.0199999999994, 39, 7445, 664.5, 1684.9, 1903.9999999999986, 4257.540000000001, 58.41462702260646, 41.655789984812195, 31.888453618786144], "isController": false}, {"data": ["/include/ajax/ym_ecommerce.php-4", 1000, 903, 90.3, 705.9670000000001, 41, 8065, 669.0, 1555.6999999999998, 1708.85, 3699.76, 58.424865622809065, 35.796127800742, 29.66887707408273], "isController": false}, {"data": ["/include/ajax/nikolaus_pizza.php-5", 1000, 908, 90.8, 632.5830000000002, 40, 15586, 644.0, 858.4999999999997, 1641.0, 2037.7700000000011, 58.568583811643435, 34.676719720042165, 30.085034262621527], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["503/Service Unavailable", 7042, 100.0, 64.01818181818182], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 11000, 7042, "503/Service Unavailable", 7042, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["/include/ajax/nikolaus_pizza.php-7", 1000, 883, "503/Service Unavailable", 883, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["/include/ajax/ym_ecommerce.php-8", 1000, 861, "503/Service Unavailable", 861, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/checkout/-9", 1000, 969, "503/Service Unavailable", 969, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["/include/ajax/nikolaus_pizza.php-1", 1000, 772, "503/Service Unavailable", 772, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["/include/ajax/ym_ecommerce.php-2", 1000, 856, "503/Service Unavailable", 856, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/include/ajax/nikolaus_pizza.php-3", 1000, 890, "503/Service Unavailable", 890, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/include/ajax/ym_ecommerce.php-4", 1000, 903, "503/Service Unavailable", 903, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/include/ajax/nikolaus_pizza.php-5", 1000, 908, "503/Service Unavailable", 908, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
