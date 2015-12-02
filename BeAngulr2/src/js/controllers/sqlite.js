app.controller('cwmoneyCtrl', function ($scope, sqliteFactory) {
    console.log('cwmoney #1')
    getDBcallback = function (db) {
        var contents = db.exec(getAccs());
        console.log(contents);
        $scope.columns = contents[0].columns;
        $scope.values = contents[0].values;
        
        //var str_sql = groupByMonth(2015,11,1);
        //var contents = db.exec(getKinds());
        //console.log(contents);
        //console.log(new Date(2015,11,1).getTime() / 1000);
    };
    //load db
    sqliteFactory.getDB('api/2015_12_01_CHT.iDB', getDBcallback);
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
	
//	select kindtext, a.i_kind,  i_money from (
//	  select i_kind, sum(i_money) as i_money from rec_table where i_date between 1446307200 and 1448812800 and i_type=1 group by i_kind order by i_kind) a, kind_table b
//	where a.i_kind=b._id
			
	sql = "select i_kind, sum(i_money) from rec_table where i_date between " + cwDate(new Date(y, m - 1, 1)) + " and " + cwDate(new Date(y, m, 0)) + " and i_type=" + type + " group by i_kind"; 
	return sql;
};
//支出分類
function getKind(){
	return "select _id, kindtext from kind_table;";
};
//支出子分類
function getKinds(){
	return "select _id, kindid, kindstext from kinds_table;";
};
//收入分類
function getInKind(){
	return "select _id, kindtext from in_kind_table;";
};
//收入子分類
function getInKinds(){
	return "select _id, kindid, kindstext from in_kinds_table;";
};
//accounts
function getAccs(){
	return "select _id, acctext, accrate, accnote, accmoney, accsort, accinit, rev1, rev2, rev3 from acc_table;";
};
//sqlite_master
function getMaster() {
	return "SELECT `name`, `sql` FROM `sqlite_master` WHERE type='table';";
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