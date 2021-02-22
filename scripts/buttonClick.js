var myCharacteristic;
// var cnt = 0;
var chartRange = 50;
var a = [];
var rone = 47;
var vout = 0;
var rtwo = 0;

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
  // Convert raw data bytes to hex values just for the sake of showing something.
  // In the "real" world, you'd use data.getUint8, data.getUint16 or even
  // TextDecoder to process raw data bytes.
  for (let i = 0; i < value.byteLength; i+=2) {
    vout = parseInt('0x'+ value.getUint16(i).toString(16))/1000;
    rtwo = (vout * rone)/(3.3 - vout);
    a.push(rtwo);
  }

  // console.log('> ' + a.join(' '));
}

  // Plotly.extendTraces('chart',{y: [[a[0]], [a[1]],[a[2]]]}, [0, 1, 2]);
  // cnt++;
  // console.log(cnt)
  // if(cnt > 10) {
  //     Plotly.relayout('chart',{
  //         xaxis: {
  //             range: [cnt-10,cnt]
  //         }
  //     });
  // }

  // Plotly.extendTraces('chart',{y: [[getData()], [getData()], [getData()]]}, [0, 1, 2]);
  // cnt++;
  // if(cnt > 50) {
  //     Plotly.relayout('chart',{
  //         xaxis: {
  //             range: [cnt-50,cnt]
  //         }
  //     });
  // }
