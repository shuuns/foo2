

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


app.service('cwQuery', function(){
	//total summary by month
	this.sumByMonth = function(y, m, type) {
		return "select sum(i_money) from rec_table where i_date between " + cwDate(new Date(y, m - 1, 1)) + " and " + cwDate(new Date(y, m, 0)) + " and i_type=" + type + ";";
	};
	//kind summary by month
	this.groupByMonth = function(y, m, type) {
	    return "select i_kind, sum(i_money) from rec_table where i_date between " + cwDate(new Date(y, m - 1, 1)) + " and " + cwDate(new Date(y, m, 0)) + " and i_type=" + type + " group by i_kind;";
	};
	//kind sum JOIN tilte (in)
	this.groupNameByMonth = function(y, m, type) {
	    var sql;
	    type = 1;
	    sql = 'select kindtext, A.i_kind,  i_money from ' +
		     ' (select i_kind, sum(i_money) as i_money from rec_table where i_date between ' + cwDate(new Date(y, m - 1, 1)) + ' and ' + cwDate(new Date(y, m, 0)) + ' and i_type=' + type +
	         ' group by i_kind order by i_kind) A, kind_table B where A.i_kind=B._id';
	    return sql;
	};
	//Ex Kind
	this.getKind = "select _id, kindtext, premoney from kind_table;";
	//Ex Sub Kind
	this.getKinds = "select _id, kindid, kindstext, premoney from kinds_table;";
	//in Kind
	this.getInKind = "select _id, kindtext, premoney from in_kind_table;";
	//In Sub Kind
	this.getInKinds = "select _id, kindid, kindstext, premoney from in_kinds_table;";
	//sqlite_master
	this.getSqliteMaster = "SELECT `name`, `sql` FROM `sqlite_master` WHERE type='table';";
	//Accounts
	this.getAcc = "select _id, acctext, accrate, accnote, accmoney, accsort, accinit, rev1, rev2, rev3 from acc_table;";
	
});


app.factory('sqliteFactory', function () {
    var factory = {};

    var file = 'api/2015_12_01_CHT.iDB';
    //var uInt8Array = new Uint8Array(this.response)
    //var db = new SQL.Database(file);
    //factory.db = db;

    factory.getDB = function (file, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', file, true);
        xhr.responseType = 'arraybuffer';

        xhr.onload = function (e) {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    //console.log(xhr.responseText);
                    console.log("200 load file success");
                    console.log(this.response);
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

    factory.getLocalDB = function (file, callback) {
        var reader = new FileReader();
        reader.onloadend = function (evt) {
            // file is loaded
            var uInt8Array = new Uint8Array(evt.target.result);
            var db = new SQL.Database(uInt8Array);
            //callback function
            callback(db);
        };
        reader.readAsArrayBuffer(file);
    };


    return factory;
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