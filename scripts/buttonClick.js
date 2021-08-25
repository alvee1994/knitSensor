var myCharacteristic;

var a = [];
var sensor = [];

var rone = 25;
var vout = 0;
var rtwo = 0;

var vnot = [0, 0, 0];
var count = 0;

var notif = false;

async function onStartButtonClick() {
  let serviceUuid = '19b10010-e8f2-537e-4f6c-d104768a1214'; //document.querySelector('#service').value;
  if (serviceUuid.startsWith('0x')) {
    serviceUuid = parseInt(serviceUuid);
  }

  let characteristicUuid = '19b10012-e8f2-537e-4f6c-d104768a1214'; //document.querySelector('#characteristic').value;
  if (characteristicUuid.startsWith('0x')) {
    characteristicUuid = parseInt(characteristicUuid);
  }

  try {
    console.log('Requesting Bluetooth Device...');
    const device = await navigator.bluetooth.requestDevice({
        filters: [{services: [serviceUuid]}]});

    console.log('Connecting to GATT Server...');
    const server = await device.gatt.connect();

    console.log('Getting Service...');
    const service = await server.getPrimaryService(serviceUuid);

    console.log('Getting Characteristic...');
    myCharacteristic = await service.getCharacteristic(characteristicUuid);

    await myCharacteristic.startNotifications();

    notif = true;
    // cnt = 0;

    console.log('> Notifications started');
    myCharacteristic.addEventListener('characteristicvaluechanged',
        handleNotifications);
  } catch(error) {
    console.log('Argh! ' + error);
  }
}

async function onStopButtonClick() {
  notif = false;
  if (myCharacteristic) {
    try {
      await myCharacteristic.stopNotifications();
      console.log('> Notifications stopped');
      myCharacteristic.removeEventListener('characteristicvaluechanged',
          handleNotifications);
    } catch(error) {
      console.log('Argh! ' + error);
    }
  }
}


function handleNotifications(event) {
  let value = event.target.value;
  a = []
  sensor = []

  for (let i = 0; i < value.byteLength; i+=2) {
    vout = parseInt('0x'+ value.getUint16(i).toString(16))/1000;
    rtwo = (vout * rone)/(3.3 - vout);
    a.push(rtwo);
  }

  for (let j = 0; j < 3; j++){
    if(count < 10){
      vnot[j] = vnot[j] + a[j]
    } else {
      sensor.push(a[j]/(vnot[j]/10))
    }
  }
  count++
}
