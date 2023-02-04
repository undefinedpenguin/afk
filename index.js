const express = require('express')();
express.get('/', (req, res) => res.send('OKOK'))
express.listen(3000);
const mineflayer = require('mineflayer');
const fs = require('fs');

var connected = false;

function startBot() {
  if (!connected) {
    var lasttime = -1;
    var moving = 0;
    var actions = [ 'forward', 'back', 'left', 'right']
    var lastaction;
    var pi = 3.14159;
    var moveinterval = 2; // 2 second movement interval
    var maxrandom = 5; // 0-5 seconds added to movement interval (randomly)
    var host = "root.fr.to";
    var port = "55738";
    var username = "zeroB0T" + Math.floor(Math.random() * 100000);
    var bot = mineflayer.createBot({
      host: host,
      port: port,
      username: username
    });
  
    function getRandomArbitrary(min, max) {
      return Math.random() * (max - min) + min;
    }
    
    bot.on('login',function(){
      console.log("Logged In")
      connected = true;
      bot.chat("Bot Running...");
    });
    
    bot.on('time', function() {
      if (lasttime<0) {
        lasttime = bot.time.age;
      } else {
        var randomadd = Math.random() * maxrandom * 20;
        var interval = moveinterval*20 + randomadd;
        if (bot.time.age - lasttime > interval) {
          if (moving == 1) {
            bot.setControlState(lastaction,false);
            moving = 0;
            lasttime = bot.time.age;
          } else {
            var yaw = Math.random()*pi - (0.5*pi);
            var pitch = Math.random()*pi - (0.5*pi);
            bot.look(yaw,pitch,false);
            lastaction = actions[Math.floor(Math.random() * actions.length)];
            bot.setControlState(lastaction,true);
            moving = 1;
            lasttime = bot.time.age;
            bot.activateItem();
          }
        }
      }
    });
    
    bot.on('end', function() {
      connected = false;
      startBot();
    });
  }
}

startBot();
