// mqttClient.js
const mqtt = require('mqtt');

const options = {
  host: '192.168.1.2',
  port: 1883,
  protocol: 'mqtt',
  username: 'technivor',
  password: 'bdzaa$'
};

const client = mqtt.connect(options);

client.on('connect', () => {
  console.log('Connected to MQTT broker');

  // Example subscription
  client.subscribe('myTopic', (err) => {
    if (!err) {
      console.log('Subscribed to myTopic');
    } else {
      console.error('Subscription error:', err);
    }
  });
});

client.on('message', (topic, message) => {
  // Handle incoming messages
  console.log(`Received message: ${message.toString()} on topic: ${topic}`);
});

client.on('error', (err) => {
  console.error('MQTT error:', err);
});

module.exports = client;
