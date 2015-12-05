// 從產生連結mqtt的client
angular.module('app')
    .service('mqttService', function (mqttFactory) {

        //console.log("service call mqttFactory");
        //mqttFactory.subscribe('#');
        //mqtt_client.unsubscribe(topic);

        //var topic = "witlab/stocks/" + stock.Symbol;
        //var qos = 0;
        //// 轉換Javascript Object變成JSON字串
        //var stockJSON = JSON.stringify(stock);
        //var messageObj = new Paho.MQTT.Message(stockJSON); // get Message object
        //messageObj.qos = Number(qos); // set QoS level
        //messageObj.destinationName = topic; // set Topic destination
        //mqtt_client.send(messageObj); // send out the message
        //return mqttFactory;
    });

// 從產生連結mqtt的client
angular.module('app')
    .factory('mqttFactory', function () {
        var factory = {};
        factory.messages = [];
        var mqtt_client;
        var mqtt_broker_host = "localhost";//"10.34.216.173";
        var mqtt_broker_port = 8080;

        // Create a client instance
        //mqtt_client = new Paho.MQTT.Client(mqtt_broker_host, Number(mqtt_broker_port), "team5_webui_mqttFactory");

        ////other option
        //var connOptions = {
        //    timeout: 3,
        //    //useSSL: useTLS,
        //    cleanSession: $scope.mqtt_conn.clean_session,
        //    onSuccess: onConnect,
        //    onFailure: onConnectFail
        //};

        ////lastwill 
        //$scope.mqtt_conn.lastwill_topic = "demo/whoisonline/" + $scope.mqtt_userInfo.username + "/presence";
        //var willmsg = new Paho.MQTT.Message($scope.mqtt_conn.lastwill_message);
        //willmsg.qos = $scope.mqtt_conn.lastwill_qos;
        //willmsg.destinationName = $scope.mqtt_conn.lastwill_topic;
        //willmsg.retained = $scope.mqtt_conn.lastwill_retain;
        //connOptions.willMessage = willmsg;

        //// set callback handlers
        //mqtt_client.onConnectionLost = onConnectionLostDefault;
        //mqtt_client.onMessageArrived = onMessageArrivedDefault;
        //mqtt_client.connect({ onSuccess: onConnectDeafult });

        //custom factory connect
        factory.connect = function (clientId, sucessFn) {
            //mqtt_client.connect({ onSuccess: onConnect });
            //console.log(clientId+'xx');
            mqtt_client = new Paho.MQTT.Client(mqtt_broker_host, Number(mqtt_broker_port), clientId);
            mqtt_client.onConnectionLost = onConnectionLostDefault;
            mqtt_client.onMessageArrived = onMessageArrivedDefault;
            //var onConnect = (sucessFn) ? sucessFn(mqtt_client) : onConnectDeafult;
            //mqtt_client.connect({ onSuccess: sucessFn(mqtt_client) });
            mqtt_client.connect({ onSuccess: sucessFn('xx') });
        };
        ////custom factory publish
        //factory.subscribe = function () {
        //};

        //mqtt client operation callback function 
        // called when the client connects
        function onConnectDeafult() {
            // Once a connection has been made, make a subscription and send a message.
            console.log("onConnect");
            //mqtt_client.subscribe('team5/#');
        }
        // called when faided
        function onConnectFail(message) {
            //Notification.error({ title: 'MQTT Connection Status', message: "MQTT Broker Connection failed: " + message.errorMessage });
            console.log("Connection failed");
        }
        // called when the client loses its connection
        function onConnectionLostDefault(responseObject) {
            if (responseObject.errorCode !== 0) {
                console.log("onConnectionLost:" + responseObject.errorMessage);
            }
        }
        // called when a message arrives
        function onMessageArrivedDefault(message) {
            console.log("onMessageArrived:" + message.payloadString);
            //factory.messages.push(message);
            //return message;
        }

        return factory;
    });

// define a factory for chart demo
angular.module('app')
.service('mqtt_config', function () {
    this.mqtt_broker_url = '10.34.216.173'; //'localhost'; //"10.34.216.173" //mqtt broker uri (make sure this mqtt broker enable WebSocket support)
    this.mqtt_broker_port = 8080; //mqtt broker WebSocket connection port
    this.uniqueId = makeid();
    //this.http_host = '52.69.150.31'; //this setting is for iot_smartphone_collector QR code

    //Random client ID
    function makeid() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var length = 7;
        for (var i = 0; i < length; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }

});

//angular.module('app')
//    .factory('EventBusHub', ['$rootScope', function ($rootScope) {
//        $rootScope.$broadcast("eventname", "event");

//        var broadcastEventViaServer = function (signalrEvent) {
//            hub.BroadcastAll(signalrEvent); //呼叫Sever的method
//        };d
//        //回傳一個javascript物件裡面包含了一個可以用來
//        //廣播Event給其它Singalr的connection的方法(Method)
//        return {
//            broadcastEvent: broadcastEventViaServer
//        };
//    }]);