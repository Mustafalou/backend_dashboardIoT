// mqttClient.js
const mqtt = require('mqtt');
const influx = require('./influxClient');
const { CheckData } = require('./controllers/dataController');

const options = {
  host: '192.168.1.63',
  port: 1883,
  protocol: 'mqtt',
  username: 'technivor',
  password: 'bdzaa$',
};

const client = mqtt.connect(options);

client.on('connect', () => {
  console.log('Connected to MQTT broker');

  // Example subscription
  client.subscribe('#', (err) => {
    if (!err) {
      console.log('Subscribed to #');
    } else {
      console.error('Subscription error:', err);
    }
  });
});

client.on('message',async  (topic, message) => {
  const check = await CheckData(topic,message.toString());
  if (check!==null){
    client.publish("notification",check.notification)
  }
  // Write data to InfluxDB
  /*influx.writePoints([
    {
      measurement: 'test_data',
      tags: { topic: topic },
      fields: { value: message }, // Adjust fields as per your data structure
      timestamp: new Date() // Optional: let InfluxDB handle timestamps automatically
    }
  ]).catch((error) => {
    console.error(`Error writing to InfluxDB: ${error.message}`);
  })*/
});

client.on('error', (err) => {
  console.error('MQTT error:', err);
});



module.exports = {
  client,
};