const redis = require("redis");
const client = redis.createClient();

client.on("error", function (err) {
    console.log("Error " + err);
});


containsValue = (type, value) => {
    // client.hexists(type, key, value);
}

saveValue = (type,  value) => {

   // client.set(type, value);

    client.get(type, function (err, data) {
        console.log(data);
    });
}

module.exports = {
    containsValue,
    saveValue
};