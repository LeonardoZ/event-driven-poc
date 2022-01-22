const setup = require("./setup");

async function produce() {
  try {
    const timeChannel = setup.timeChannel;

    setInterval(() => {
      const now = new Date();
      const time = { time: now };
      if (!timeChannel) {
        console.log("Channel not available");
        return;
      }
      timeChannel.publish(
        setup.exchanges.time_tick,
        "",
        Buffer.from(JSON.stringify(time)),
        {},
        (err, ok) => {
          if (err !== null) console.warn("Message nacked!");
          else console.log("Message acked");
        }
      );
    }, 500);
  } catch (error) {
    console.log(error);
  }
}

module.exports = { produce };
