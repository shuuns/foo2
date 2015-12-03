angular.module('starter.services', [])
        // DBA服務: 提供資料庫存取服務
        .factory('DBA', function ($cordovaSQLite, $q) {
            var self = this;
            self.query = function (query, params) { // 執行資料庫SCRUD動作
                params = params || [];
                var q = $q.defer();
                $cordovaSQLite.execute(db, query, params).then(function (result) {
                    q.resolve(result);
                }, function (error) {
                    console.warn(error);
                    q.reject(error);
                })
                return q.promise;
            }
            self.getAll = function (result) {   // 處理query resultSet,回傳所有資料
                var output = [];
                for (var i = 0; i < result.rows.length; i++) {
                    output.push(result.rows.item(i));
                }
                return output;
            }
            self.getById = function (result) {  // 處理query result,回傳一筆
                var output = null;
                output = angular.copy(result.rows.item(0));
                return output;
            }
            return self;
        })
        // Note服務: note資料表存取功能
        // note (id integer primary key, title text, message text, date text)
        .factory('Note', function ($cordovaSQLite, DBA) {
            var self = this;
            // 取得所有資料
            self.all = function () {
                return DBA.query('SELECT * FROM note')
                        .then(function (result) {
                            return DBA.getAll(result);
                        });
            };
            // 取得某一筆資料
            self.get = function (id) {
                params = [id];
                return DBA.query('SELECT * FROM note WHERE id=(?)', params)
                        .then(function (result) {
                            return DBA.getById(result);
                        });
            };
            // 新增
            self.add = function (note) {
                params = [note.title, note.message, new Date().toLocaleDateString()];
                return DBA.query("INSERT INTO note('id','title','message','date') VALUES (NULL,?,?,?)", params);
            };
            self.remove = function (note) {
                params = [note.id];
                return DBA.query("DELETE FROM note WHERE id=(?)", params)
            }
            self.update = function (note) {
                params = [note.title, note.message, new Date().toLocaleDateString(), note.id];
                return DBA.query("UPDATE note SET title=(?), message=(?),date=(?) WHERE id=(?)", params);
            }
            return self;
        });