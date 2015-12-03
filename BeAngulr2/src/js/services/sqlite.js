
app.factory('myFactory', function (DBA) {
    var self = this;
   

    self.getAcc = function () {
        return DBA.query(getAcc());
    };

    self.getKind = function () {
        return DBA.query(getKind());
    };
    return self;
});


app.factory('DBA2', function (sqliteFactory, $q) {
    var factory = {};

    var q = $q.defer();

    sqliteFactory.getDB('api/2015_12_01_CHT.iDB', function (db) {
        //var result = db.exec(query);
        //q.resolve(result);
        
        factory.getAcc = function () {
            return db.exec(getAcc());
        };

        factory.getKind = function () {
            return db.exec(getKind());
        };
        q.resolve(factory);
        
    });
    return q.promise;


    //return factory;
});

app.factory('DBA', function (sqliteFactory, $q) {
    var factory = {};

    factory.query = function (query) { // 執行資料庫SCRUD動作
        //params = params || [];
        var q = $q.defer();

        sqliteFactory.getDB('api/2015_12_01_CHT.iDB', function (db) {
            var result = db.exec(query);
            q.resolve(result);
        });

        return q.promise;
    }


    return factory;
});

app.service('myService', function (sqliteFactory) {

    var self = this;

    getDBcallback = function (db) {
        //console.log(db.exec(getAcc()));
        self.getAcc = function () {
            return db.exec(getAcc());
        };
    };
    sqliteFactory.getDB('api/2015_12_01_CHT.iDB', getDBcallback);

    self.getName = function () {
        return 'John';
    };

});

app.factory('sqliteFactory', function () {
    var factory = this;
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
    factory.query = function (file, query, callback) {
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
                    var result = db.exec(query);
                    //callback function
                    callback(result);
                } else {
                    console.error(xhr.statusText);
                }
            }
        };
        xhr.send();
    };

    return factory;
});

app.service('sqliteService', function () {
    file = 'api/2015_12_01_CHT.iDB';
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
                return db;
                //callback(db);
            } else {
                console.error(xhr.statusText);
            }
        }
    };
    xhr.send();
});


//timestamp transform
function cwDate(date) {
    return date / 1000;
};

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


/* SQL for query cwmoney [Start] */
//Summary by Month
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
//月分類加總+名稱(in=1)
function groupNameByMonth(y, m, type) {
    var sql;
    type = 1;
    sql = 'select kindtext, A.i_kind,  i_money from ' +
	     ' (select i_kind, sum(i_money) as i_money from rec_table where i_date between ' + cwDate(new Date(y, m - 1, 1)) + ' and ' + cwDate(new Date(y, m, 0)) + ' and i_type=' + type +
         ' group by i_kind order by i_kind) A, kind_table B where A.i_kind=B._id';
    return sql;
};
//ex - Category
function getKind() {
    return "select _id, kindtext, premoney from kind_table;";
};
//ex - SubCate/
function getKinds() {
    return "select _id, kindid, kindstext, premoney from kinds_table;";
};
//in - Category
function getInKind() {
    return "select _id, kindtext, premoney from in_kind_table;";
};
//in - SubCate.
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

