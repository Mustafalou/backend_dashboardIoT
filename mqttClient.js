// mqttClient.js
const mqtt = require("mqtt");
const influx = require("./influxClient");
const { CheckData } = require("./controllers/dataController");
const { logAlert } = require("./controllers/alertController");
// connexion au broker
const options = {
  host: "localhost",
  port: 1883,
  protocol: "mqtt",
  username: "technivor",
  password: "bdzaa$",
};
var notifications = {};
const client = mqtt.connect(options); // ici on se connecte avec mqtt.connect
// si la connexion est établie alors ca envoie un message que la connexion a été etablie
client.on("connect", () => {
  console.log("Connected to MQTT broker");

  // Example subscription
  // donc si la connexion est etablie on s'abonne à # (càd tous les topics)
  client.subscribe("#", (err) => {
    // si pas error alors ca envoie un message qu'on s'est abonné à #
    if (!err) {
      //console.log('Subscribed to #');
    } else {
      //console.error('Subscription error:', err);
    }
  }); // sinon error
});
// a chaque message reçu
client.on("message", async (topic, message) => {
  const check = await CheckData(topic, message.toString()); // on passe topic et message dans CheckData
  // si une alerte est détecté alors on logue une alerte grâce à la fct logAlert
  if (check !== null) {
    //console.log("notification sent")
    logAlert(topic, check.notification);
    client.publish("notification", check.notification); // on publie la notif sur le topic MQTT
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

client.on("error", (err) => {
  //console.error('MQTT error:', err);
}); // si error

module.exports = {
  client,
}; // on export ca
