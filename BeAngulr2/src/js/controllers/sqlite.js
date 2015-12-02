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