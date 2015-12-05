app.controller('mqttMainCtrl', function ($scope) {
            
    console.log('mqttMainCtrl');
});

app.controller('mqttCtrl1', function ($scope, mqttFactory) {

    callbackFn = function (cc) {
        console.log(cc);
    };

    mqttFactory.connect('mqttCtrl1', callbackFn);

    //mqtt_client.subscribe('team5/#');

    console.log('mqttCtrl1');
});

app.controller('mqttCtrl2', function ($scope) {

    

    console.log('mqttCtrl2');
});
