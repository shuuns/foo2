app.controller('cwmoneyCtrl', function ($scope, sqliteFactory) {
    console.log('cwmoney #1')
    getDBcallback = function (db) {
        var sqlite_master = db.exec("SELECT `name`, `sql` FROM `sqlite_master` WHERE type='table';");
        //console.log(contents);
        $scope.columns = sqlite_master[0].columns;
        $scope.values = sqlite_master[0].values;
        
        var str_sql = groupByMonth(2015,11,1);
        var contents = db.exec(str_sql);
        console.log(contents);
        //console.log(new Date(2015,11,1).getTime() / 1000);
    };
    //load db
    sqliteFactory.getDB('api/2015_12_01_CHT.iDB', getDBcallback);
});

app.controller('cwmoneyChart', function ($scope) {
    
    $scope.d0_1 = [[0, 7], [1, 6.5], [2, 12.5], [3, 7], [4, 9], [5, 6], [6, 11], [7, 6.5], [8, 8], [9, 7]];

    $scope.d0_2 = [[0, 4], [1, 4.5], [2, 7], [3, 4.5], [4, 3], [5, 3.5], [6, 6], [7, 3], [8, 4], [9, 3]];

    $scope.d0 = [
        {
            data: $scope.d0_1,
            label: 'Unique Visits',
            points: {
                show: true
            }
        }, {
            data: $scope.d0_2,
            label: 'Page Views',
            bars: {
                show: true,
                barWidth: 0.6,
                fillColor: {
                    colors: [{
                        opacity: 0.2
                    }, {
                        opacity: 0.4
                    }
                    ]
                }
            }
        }
    ];

    $scope.barConfig = {
        colors: [$scope.app.color.info, $scope.app.color.success],
        series: {
            shadowSize: 2
        },
        xaxis: {
            font: {
                color: '#ccc'
            }
        },
        yaxis: {
            font: {
                color: '#ccc'
            }
        },
        grid: {
            hoverable: true,
            clickable: true,
            borderWidth: 0,
            color: '#ccc'
        },
        tooltip: true,
        tooltipOpts: {
            content: '%s of %x.1 is %y.4',
            defaultTheme: false,
            shifts: {
                x: 0,
                y: 20
            }
        }
    };

    $scope.d3 = [
      { label: "iPhone5S", data: 40 },
      { label: "iPad Mini", data: 10 },
      { label: "iPad Mini Retina", data: 20 },
      { label: "iPhone4S", data: 12 },
      { label: "iPad Air", data: 18 }
    ];

    $scope.pieConfig = {
        series: {
            pie: {
                show: true,
                innerRadius: 0.5,
                stroke: {
                    width: 0
                },
                label: {
                    show: true,
                    threshold: 0.05
                }
            }
        },
        colors: [$scope.app.color.primary, $scope.app.color.info, $scope.app.color.success, $scope.app.color.warning, $scope.app.color.danger],
        grid: {
            hoverable: true,
            clickable: true,
            borderWidth: 0,
            color: '#ccc'
        },
        tooltip: true,
        tooltipOpts: {
            content: '%s: %p.0%'
        }
    };

    //$scope.allPieConfig = [$scope.d3, $scope.pieConfig];

});

function cwDate(date){
	return date/1000;
};

function sumByMonth (y, m, type){
var sql;
	sql = "select sum(i_money) from rec_table where i_date between " + cwDate(new Date(y, m - 1, 1)) + " and " + cwDate(new Date(y, m, 0)) + " and i_type=" + type + ";";
	return sql;
};

function groupByMonth (y, m, type){
	var sql;
	sql = "select i_kind, sum(i_money) from rec_table where i_date between " + cwDate(new Date(y, m - 1, 1)) + " and " + cwDate(new Date(y, m, 0)) + " and i_type=" + type + " group by i_kind;"; 
	return sql;
};

function groupNameByMonth (y, m, type){
	var sql;
	
	//select kindtext, a.i_kind,  i_money from (
	//  select i_kind, sum(i_money) as i_money from rec_table where i_date between 1446307200 and 1448812800 and i_type=1 group by i_kind order by i_kind) a, kind_table b
	//where a.i_kind=b._id
			
	sql = "select i_kind, sum(i_money) from rec_table where i_date between " + cwDate(new Date(y, m - 1, 1)) + " and " + cwDate(new Date(y, m, 0)) + " and i_type=" + type + " group by i_kind"; 
	return sql;
};

app.controller('cwmDateCtrl', function ($scope, $filter) {
    $scope.open = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };

    $scope.dt = $filter('date')(new Date(),'yyyy-MM-dd');
    $scope.dt2 = null;
    

});

//app.filter('cwMoney', function () {
//      return function (date) {
//          return moment(date).fromNow();
//      }
//});

//angular.module('yourmodule').filter('date', function($filter)
//{
//    return function(input)
//    {
//        if(input == null){ return ""; } 
 
//        if (false) {
//            var _date = $filter('date')(new Date(input), 'MMM dd yyyy');
//        }
//        else {
//            var _date = $filter('date')(new Date(input), 'MM dd yyyy');
//        }
 
//    return _date.toUpperCase();

//};
//});

angular.module('app')
.filter('percentage', ['$filter', function ($filter) {
    return function (input, decimals) {
        return $filter('number')(input * 100, decimals) + '%';
    };
}]);

app.controller('sqliteCtrl', function ($scope, sqliteFactory) {
    
    getDBcallback = function (db) {
        var contents = db.exec("SELECT `name`, `sql` FROM `sqlite_master` WHERE type='table';");
        console.log(contents);
    };
    //load db
    sqliteFactory.getDB('api/2013_05_21_CHT.iDB', getDBcallback);
});

app.factory('sqliteFactory', function () {
    var factory = {};

    factory.getDB = function (file, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', file, true);
        xhr.responseType = 'arraybuffer';

        xhr.onload = function (e) {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    //console.log(xhr.responseText);
                    console.log("200 load file success");
                    var uInt8Array = new Uint8Array(this.response);
                    var db = new SQL.Database(uInt8Array);
                    //callback function
                    callback(db);
                } else {
                    console.error(xhr.statusText);
                }
            }
        };
        xhr.send();
    };


    return factory;
});


function loadDbSample(file) {
    //file = 'api/2013_05_21_CHT.iDB';
    var xhr = new XMLHttpRequest();
    xhr.open('GET', file, true);
    xhr.responseType = 'arraybuffer';

    xhr.onload = function (e) {
        var uInt8Array = new Uint8Array(this.response);
        var db = new SQL.Database(uInt8Array);
        var contents = db.exec("SELECT `name`, `sql` FROM `sqlite_master` WHERE type='table';");
        console.log(contents);
        // contents is now [{columns:['col1','col2',...], values:[[first row], [second row], ...]}]
    };
    xhr.send();
};