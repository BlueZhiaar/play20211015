'use strict';
const http = require('http');
const pug = require('pug');
let userAnswer;
const server = http
  .createServer((req, res) => {
    const now = new Date();
    console.info('[' + now + '] Requested by ' + req.socket.remoteAddress);
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8'
    });

    switch (req.method) {
      case 'GET':
        res.write(pug.renderFile('./form.pug'));
        res.end();
        break;
      case 'POST':
        let rawData = '';
        req
          .on('data', chunk => {
            rawData = rawData + chunk;
          })
          .on('end', () => {
            const qs = require('querystring');
            const answer = qs.parse(rawData);
            userAnswer = answer['janken'];
            let result = janken();
            const body = answer['name'] + 'さんは' +
              answer['janken'] + 'を出しましたワタシは' + result + 'を出しました。' + shouhai(userAnswer,result);
            console.info('[' + now + '] ' + body);
            res.write('<!DOCTYPE html><html lang="ja"><body><h1>' +
              body + '</h1></body></html>');
            res.end();
          });
        break;
      default:
        break;
    }
  })
  .on('error', e => {
    console.error('[' + new Date() + '] Server Error', e);
  })
  .on('clientError', e => {
    console.error('[' + new Date() + '] Client Error', e);
  });
const port = 8000;
server.listen(port, () => {
  console.info('[' + new Date() + '] Listening on ' + port);
});

/**
 * ランダムに0-2までの数を出す
 * @return {int}
 */

function ran(){
  return Math.floor(Math.random() * 2);
}

/**
 * ０-２までの数字にぐーちょきぱーを割り当てる
 * @param {int}
 * @return {string}
 */

function janken(){
  let num = ran();
  if(num === 0){
    return 'グー';
  } else if(num === 1){
    return 'チョキ';
  } else{
    return 'パー';
  }
}

/**
 * じゃんけんの勝敗を判定
 */
function shouhai(uanswer, comresult) {
  switch (uanswer) {
    case 'グー':
      switch (comresult) {
        case 'グー':
          return 'あいこ';
        case 'チョキ':
          return 'あなたの勝ち';
        case 'パー':
          return 'あなたの負け';
      }
      break;
    case 'チョキ':
      switch (comresult) {
        case 'グー':
          return 'あなたの負け';
        case 'チョキ':
          return 'あいこ';
        case 'パー':
          return 'あなたの勝ち';
      }
      break;
    case 'パー':
      switch (comresult) {
        case 'グー':
          return 'あなたの勝ち';
        case 'チョキ':
          return 'あなたの負け';
        case 'パー':
          return 'あいこ';
      }
      break;
  }
}