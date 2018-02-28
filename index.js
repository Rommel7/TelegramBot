//import { request } from "http";

const TelegramBot = require("node-telegram-bot-api");
const Request = require("request");
const _ = require("lodash");

const Token = "518239339:AAFqUGzNkBBixXpkMvXFjx0Oe-jho0V_ZOc";

const Bot = new TelegramBot(Token, {
  polling: true
});

const KB = {
  currency: "Currency",
  back: "Back"
};

Bot.onText(/\/start/, msg => {
  //console.log(msg)
  const text = `Hello there, ${
    msg.from.first_name
  }!\nWhat would you like to do?`;
  Bot.sendMessage(msg.chat.id, text, {
    reply_markup: {
      keyboard: [[KB.currency]]
    }
  });
});

Bot.on("message", msg => {
  switch (msg.text) {
    case KB.currency:
      sendCurrency(msg.chat.id);
      break;
    case KB.back:
      Bot.sendMessage(msg.chat.id, text, {
        reply_markup: {
          keyboard: [[Kb.currency]]
        }
      });
      break;
  }
});

Bot.on("callback_query", query => {
  //console.log(JSON.stringify(query, null, 2))
  const base = query.data;
  const symbol = "AZN";

  Bot.answerCallbackQuery({
    callback_query_id: query.id,
    text: `You choosed ${base}`
  });
  request(
    `https://api.fixer.io/latest?symbols=${symbol}&base=${base}`,
    (error, response, body) => {
      if (error) throw new Error(error);
      if (response.statusCode === 200) {
        const currencyData = JSON.parse(body);
        //console.log(currencyData);
        const html = `<b>1 ${symbol}</b> - <em>${
          currencyData.rates[symbol]
        } ${base}</em>`;
        Bot.sendMessage(query.message.chat.id, html, {
          parse_mode: "HTML"
        });
      }
    }
  );
});

function sendCurrency(chatId) {
  Bot.sendMessage(chatId, "Choose your currency:", {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Dollar",
            callback_data: "USD"
          }
        ],
        [
          {
            text: "Euro",
            callback_data: "EUR"
          }
        ]
      ]
    }
  });
}
