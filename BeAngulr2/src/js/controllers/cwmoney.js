app.controller('cwmoneyCtrl', function ($scope, sqliteFactory, cwmoneyFactory) {

    $scope.app.settings.asideFolded = true;
    $scope.app.settings.asideDock = false;
    $scope.app.settings.asideFixed = true;

    console.log('cwmoney #1')

    getDBcallback = function (db) {
        var contents = db.exec(groupNameByMonth(2015, 11, 1));
        console.log(contents);
        $scope.columns = contents[0].columns;
        $scope.values = contents[0].values;
        
        //var str_sql = groupByMonth(2015,11,1);
    };
    //load db
    sqliteFactory.getDB('api/2015_12_01_CHT.iDB', getDBcallback);

    //console.log(cwmoneyFactory.getAcc());
    cwmoneyFactory.getAcc();

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


app.controller('cwmDateCtrl', function ($scope, $filter) {
    $scope.open = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };

    $scope.dt = $filter('date')(new Date(),'yyyy-MM-dd');
    $scope.dt2 = null;
});

