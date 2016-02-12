var RollHandler = RollHandler || {
    standardRoll: function(msg) {
        var input = msg.content.split('|');
        var character = input[1];
        var char_id = input[2];
        var type = input[3];
        var dice = msg.inlinerolls[0].results.total;
        var output = "/em " + type + "s: [[";
        var test = "!power {{ --emote|" + character + " makes an attempt to " + type + ". --charid|" + char_id + " --name|" + type + " Roll --Roll|[[ [$chk] ";
        
        if (dice > 0) {
            output += dice + "d6kh1]]";
            test += dice + "d6kh1 ]] ";
        } else {
            output += "2d6kl1]]";
            test += "2d6kl1 ]] ";
        }
        
        test += "--?? $chk.total < 4 ?? Bad Outcome:|Things go poorly. ";
        test += "--?? $chk.total > 3 AND $chk.total < 6 ?? Partial Success:|Mostly good, but with trouble attached. ";
        test += "--?? $chk.total > 5 ?? Full Success:|Things go well.";
        
        //sendChat(character,output);
        sendChat(character,test);
    },
    
    defenseRoll: function(msg) {
        var input = msg.content.split('|');
        var character = input[1];
        var char_id = input[2];
        var type = input[3];
        var skill1 = input[4];
        var skill2 = input[5];
        var skill3 = input[6];
        var skill4 = input[7];
        var mod = input[8];
        var dice = 0;
        var output = "/em defends themselves with their " + type + ": [[";
        var test = "!power {{ --emote|" + character + " defends with their " + type + ". --charid|" + char_id + " --name|" + type + " Defense Roll --Roll|[[ [$chk] ";
        
        if (skill1 > 0) dice++;
        if (skill2 > 0) dice++;
        if (skill3 > 0) dice++;
        if (skill4 > 0) dice++;
        dice = parseInt(dice) + parseInt(mod);
        
        if (dice > 0) {
            output += dice + "d6kh1]]"
            test += dice + "d6kh1 ]]"
        } else {
            output += "2d6kl1]]"
            test += "2d6kl1 ]]"
        }
        
        test += "--?? $chk.total < 4 ?? Bad Outcome:|Things go poorly. ";
        test += "--?? $chk.total > 3 AND $chk.total < 6 ?? Partial Success:|Mostly good, but with trouble attached. ";
        test += "--?? $chk.total > 5 ?? Full Success:|Things go well.";
        
        //sendChat(character, output);
        sendChat(character,test);
    },
    
    registerHandler: function() {
        //function for future functionality, and to insure object instantiation
    }
};

var MessageHandler = MessageHandler || {
    fromSheet: function(msg) {
        var input = msg.content.split('|'); //my api messages are | delimited
        var id = input[1];
        var message = input[2];
        
        sendChat("character|" + id, message);
    },
    
    handleChatMessage: function(msg) {
        if (msg.type != "api") return;
        
        var command = msg.content.split('|')[0];
        
        switch (command) {
            case "!defense":
                RollHandler.defenseRoll(msg);
                break;
            case "!roll":
                RollHandler.standardRoll(msg);
                break;
            case "!debug":
                log(msg.content);
                break;
            case "!fromsheet":
                MessageHandler.fromSheet(msg);
                break;
        }
    },
    
    registerHandler: function() {
        on("chat:message", MessageHandler.handleChatMessage);
    }
};

on("ready", function() {
    RollHandler.registerHandler();
    MessageHandler.registerHandler();
});