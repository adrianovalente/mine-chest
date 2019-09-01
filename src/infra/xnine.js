const request = require('request')

const {
  XNINE_BOT_URL,
  CHAT_ID
} = process.env

/*
 * xnine is a bot that sends me messages so I get notified
 * of important events I don't want to miss on the server.
 * You can also implement your own reporting service and
 * set these two environments when initializing mine-chest
 */
module.exports.reportMessage = function reportMessage (message) {
  if (!XNINE_BOT_URL || !CHAT_ID) {
    console.log(`Would report message: ${message}`)
    return; // eslint-disable-line
  }

  return new Promise((resolve, reject) => request({
    url: `${XNINE_BOT_URL}/message`,
    method: 'POST',
    json: true,
    body: {
      chatId: CHAT_ID,
      message
    }
  }, (err, response) => {
    if (err) return reject(err)
    if (response.statusCode !== 200) {
      reject(new Error(`Status Code ${response.statusCode}`))
    } else {
      resolve()
    }
  }))
}
