

app.factory('cwmoneyFactory', function (sqliteFactory) {
    var factory = {};
    file = 'api/2015_12_01_CHT.iDB';

    getDBcallback = function (db) {
        return db;
    };

    //factory.getAcc = function () {
    //    getDBcallback.exec(getAcc());
    //};

    factory.getAcc2 = function () {
        console.log('getAcc2');
    };

    factory.getAcc = function (sql, result) {
        getDBcallback = function (db) {
            result = db.exec(getAcc());
        };
    };

    factory.getKind = function (sql, result) {
        getDBcallback = function (db) {
            result = db.exec(getKind());
        };
    };

    //load db
    sqliteFactory.getDB('api/2015_12_01_CHT.iDB', getDBcallback);

    return factory;
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

//app.service('sqliteService', function (sqliteFactory) {
//    file = 
//    return sqliteFactory.getDB();
//});

//timestamp transform
function cwDate(date) {
    return date / 1000;
};

/* SQL for query cwmoney [Start] */
//月加總
function sumByMonth(y, m, type) {
    var sql;
    sql = "select sum(i_money) from rec_table where i_date between " + cwDate(new Date(y, m - 1, 1)) + " and " + cwDate(new Date(y, m, 0)) + " and i_type=" + type + ";";
    return sql;
};
//月分類加總
function groupByMonth(y, m, type) {
    var sql;
    sql = "select i_kind, sum(i_money) from rec_table where i_date between " + cwDate(new Date(y, m - 1, 1)) + " and " + cwDate(new Date(y, m, 0)) + " and i_type=" + type + " group by i_kind;";
    return sql;
};
//月分類加總+名稱(收入)
function groupNameByMonth(y, m, type) {
    var sql;
    type = 1;
    sql = 'select kindtext, A.i_kind,  i_money from ' +
	     ' (select i_kind, sum(i_money) as i_money from rec_table where i_date between ' + cwDate(new Date(y, m - 1, 1)) + ' and ' + cwDate(new Date(y, m, 0)) + ' and i_type=' + type +
         ' group by i_kind order by i_kind) A, kind_table B where A.i_kind=B._id';
    return sql;
};
//支出分類
function getKind() {
    return "select _id, kindtext, premoney from kind_table;";
};
//支出子分類
function getKinds() {
    return "select _id, kindid, kindstext, premoney from kinds_table;";
};
//收入分類
function getInKind() {
    return "select _id, kindtext, premoney from in_kind_table;";
};
//收入子分類
function getInKinds() {
    return "select _id, kindid, kindstext, premoney from in_kinds_table;";
};
//sqlite_master
function getSqliteMaster() {
    return "SELECT `name`, `sql` FROM `sqlite_master` WHERE type='table';";
}
//Accounts
function getAcc() {
    return "select _id, acctext, accrate, accnote, accmoney, accsort, accinit, rev1, rev2, rev3 from acc_table;";
};
/* SQL for query cwmoney [End] */


//Sampel for load sqlite
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