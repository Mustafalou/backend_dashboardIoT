// mqttClient.js
const mqtt = require('mqtt');
const influx = require('./influxClient');

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
  client.subscribe('test', (err) => {
    if (!err) {
      console.log('Subscribed to test');
    } else {
      console.error('Subscription error:', err);
    }
  });
});

client.on('message', (topic, message) => {
  // Write data to InfluxDB
  influx.writePoints([
    {
      measurement: 'test_data',
      tags: { topic: topic },
      fields: { value: message }, // Adjust fields as per your data structure
      timestamp: new Date() // Optional: let InfluxDB handle timestamps automatically
    }
  ]).catch((error) => {
    console.error(`Error writing tonfluxDB: ${error.message}`);
  })
});

client.on('error', (err) => {
  console.error('MQTT error:', err);
});

module.exports = client;
