const TurtleCoind = require('turtlecoin-rpc').TurtleCoind;
const DiscordJS = require('discord.js');


//------------------------  SETTINGS  -----------------------------------------------------//
// ENTER THE BOT'S TOKEN HERE
const discordToken = '';

// ENTER THE IP ADDRESS OR URL OF THE DAEMON HERE, FOR EXAMPLE '127.0.0.1' FOR A LOCAL NODE
const daemonHost = '127.0.0.1';

// ENTER THE IP PORT OF THE DAEMON HERE, FOR EXAMPLE 64023 FOR JITBIT
const daemonPort = 24524;

// ENTER THE COIN'S NAME HERE, FOR EXAMPLE 'TurtleCoin'
const coinName = 'Avrio';

// ENTER THE COIN'S TICKER HERE, FOR EXAMPLE 'JBT' FOR 'JitBit'
const coinTicker = 'AIO';

// COIN DECIMAL DIVISOR
const coinDivisor = 10000;

// ENTER THE LOGO'S URL HERE
const logoURL = 'https://avatars1.githubusercontent.com/u/54186248?s=200&v=4';

// ENTER A HEX COLOR OR A RGB ARRAY FOR CUSTOMIZATION
const msgColor = '#4fc470';

// ENTER THE NAME OF THE CHANNEL YOU WANT THE UPDATES IN HERE, FOR EXAMPLE 'netstats'
const msgChannel = 'network-stats';

// ENTER THE INTERVAL HERE (IN MILLISECONDS)
const checkInterval = 10000;

// SET TO TRUE IF BOT SHOULDN'T DELETE OLD STATISTICS
const keepOldStats = false;
//-----------------------------------------------------------------------------------------//



// DO NOT MESS WITH THE STUFF DOWN HERE!!!
const daemon = new TurtleCoind({
  host: daemonHost,
  port: daemonPort,
  timeout: 5000,
  ssl: false
});
const discord = new DiscordJS.Client();


lastStats = false;

setInterval(() => {

    stats = {
        hashrate: false,       // done by getInfo()
        height: false,         // done by geBlockCount()
        lastHash: "",          // done by getBlockhash()
        timestamp: false,      // done by getBlock()
        difficulty: false,     // done by getBlock()
        softFork: false,       // done by getBlock()
        hardFork: false,       // done by getBlock()
        numTxnsInside: false,  // done by getBlock()
        numTxnsPending: false  // done by getTransactionPool()
    }

    daemon.getBlockCount().then(height => {
        stats.height = height;

        return daemon.getBlockHash({
            height: height
        })
    }).then((hash) => {
        stats.lastHash = hash;

        return daemon.getBlock({
            hash: hash
        })
    }).then((block) => {
        stats.softFork = block.major_version;
        stats.hardFork = block.minor_version;
        stats.timestamp = block.timestamp;
        stats.reward = block.reward / coinDivisor;
        stats.numTxnsInside = block.transactions.length;

        return daemon.getInfo();
    }).then((info) => {
        stats.hashrate = info.hashrate;
        stats.difficulty = info.difficulty;

        return daemon.getTransactionPool();
    }).then((txns) => {
        stats.numTxnsPending = txns.length || 0;
    }).then(() => {
        console.log(`Height                 : ${stats.height} blocks`);
        console.log(`Hashrate               : ${stats.hashrate} h/s`);
        console.log(`Difficulty             : ${stats.difficulty}`);
        console.log(`Block reward           : ${stats.reward} ${coinTicker}`);
        console.log(`Last blockhash         : ${stats.lastHash}`);
        console.log(`Timestamp of last block: ${stats.timestamp}`);
        console.log(`Transactions           : ${stats.numTxnsInside}`);
        console.log(`Pending Txns           : ${stats.numTxnsPending}`);
        console.log(`Soft fork nr           : ${stats.softFork}`);
        console.log(`Hard fork nr           : ${stats.hardFork}\n\n`);

        now = new Date(Date.now());
        time = `${now.getFullYear()}/${now.getMonth()+1}/${now.getDate()} @ ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
        let hashrate = stats.hashrate;
	let contentEmbed = new DiscordJS.RichEmbed()
	if stats.hashrate / 1000 > 1000 {
		hashrate = (stats.hashrate / 1000) / 1000;
		contentEmbed = new DiscordJS.RichEmbed()
            .setColor(msgColor)
            .setTitle(`__**${coinName} network statistics**__`)
            .setDescription(`These are the network statistics of ${coinName}!`)
            .setThumbnail(logoURL)
            .setTimestamp()
            .addField('Height', `${stats.height} blocks`)
            .addField('Hashrate', `${hashrate} mh/s`)
            .addField('Difficulty', stats.difficulty)
            .addField('Block reward', `${stats.reward} ${coinTicker}`)
            .addField('Last blockhash', stats.lastHash)
            .addField('Timestamp of last block', stats.timestamp)
            .addField('Transactions in last block', `${stats.numTxnsInside} transaction(s)`)
            .addField('Pending transactions', `${stats.numTxnsPending} transaction(s)`)
            .addField('Softfork number', stats.softFork)
            .addField('Hardfork number', stats.hardFork);
	} else {
		if stats.hashrate / 1000 > 1 {
			hashrate = stats.hashrate / 1000;
		contentEmbed = new DiscordJS.RichEmbed()
            .setColor(msgColor)
            .setTitle(`__**${coinName} network statistics**__`)
            .setDescription(`These are the network statistics of ${coinName}!`)
            .setThumbnail(logoURL)
            .setTimestamp()
            .addField('Height', `${stats.height} blocks`)
            .addField('Hashrate', `${hashrate} kh/s`)
            .addField('Difficulty', stats.difficulty)
            .addField('Block reward', `${stats.reward} ${coinTicker}`)
            .addField('Last blockhash', stats.lastHash)
            .addField('Timestamp of last block', stats.timestamp)
            .addField('Transactions in last block', `${stats.numTxnsInside} transaction(s)`)
            .addField('Pending transactions', `${stats.numTxnsPending} transaction(s)`)
            .addField('Softfork number', stats.softFork)
            .addField('Hardfork number', stats.hardFork);
		}
		else {
			hashrate = stats.hashrate;
		contentEmbed = new DiscordJS.RichEmbed()
            .setColor(msgColor)
            .setTitle(`__**${coinName} network statistics**__`)
            .setDescription(`These are the network statistics of ${coinName}!`)
            .setThumbnail(logoURL)
            .setTimestamp()
            .addField('Height', `${stats.height} blocks`)
            .addField('Hashrate', `${hashrate} h/s`)
            .addField('Difficulty', stats.difficulty)
            .addField('Block reward', `${stats.reward} ${coinTicker}`)
            .addField('Last blockhash', stats.lastHash)
            .addField('Timestamp of last block', stats.timestamp)
            .addField('Transactions in last block', `${stats.numTxnsInside} transaction(s)`)
            .addField('Pending transactions', `${stats.numTxnsPending} transaction(s)`)
            .addField('Softfork number', stats.softFork)
            .addField('Hardfork number', stats.hardFork);
		}
	}
            
        if (lastStats.height !== stats.height) {
            for(let guild of discord.guilds.array()) {
                console.log('Finding channel ' + msgChannel + ' in guild ' + guild.name + '...');
                channel = guild.channels.find(channel => channel.name === msgChannel);
            
                if (channel == undefined) {
                    console.log('Guild ' + guild.name + ' (' + guild.nameAcronym + ') doesn\'t have a channel for me :(');
                    continue;
                }

		        console.log('Found channel ' + channel.name + ' in guild ' + guild.name);
                channel.fetchMessages({limit: 1}).then(msgs => {
                    msgs = msgs.array();

                    if(msgs.length == 0 || msgs == undefined) {
	                    channel.send('', contentEmbed);
                    } else if (msgs[0].author.tag === discord.user.tag && !keepOldStats)  {
                        console.log('Found message from me...\nEditing for new stats...');
                        msgs[0].edit(embed=contentEmbed);
                    } else {
	                    channel.send('', contentEmbed);
		            }
                });
            }

            lastStats = stats;
            return;
        } else if (lastStats.numTxnsPending !== stats.numTxnsPending) {
            for(let guild of discord.guilds.array()) {
                console.log('Finding channel ' + msgChannel + ' in guild ' + guild.name + '...');
                channel = guild.channels.find(channel => channel.name === msgChannel);

                if (channel == undefined) {
                    console.log('Guild ' + guild.name + ' (' + guild.nameAcronym + ') doesn\'t have a channel for me :(');
                    continue;
                }

                console.log('Found channel ' + channel.name + ' in guild ' + guild.name);
                channel.fetchMessages({limit: 1}).then(msgs => {
                    msgs = msgs.array();

                    if(msgs.length == 0 || msgs == undefined) {
	                    channel.send('', contentEmbed);
                    } else if (msgs[0].author.tag === discord.user.tag && !keepOldStats)  {
                        console.log('Found message from me...\nEditing for new stats...');
                        msgs[0].edit(embed=contentEmbed);
                    } else {
	                    channel.send('', contentEmbed);
		            }
                });
            }

            lastStats = stats;
            return;
        }
    }).catch(error => {
        console.log('An error occurred: ' + error);
    });
}, checkInterval);

discord.on('ready', () => {
    console.log('Connected as ' + discord.user.tag);
    console.log('Guilds I\'m in:');
    discord.guilds.array().forEach(guild => {
        console.log('- ' + guild.name + ' (' + guild.nameAcronym + ')');
    });

    console.log(`Add me to your guild via this link: https://discordapp.com/api/oauth2/authorize?client_id=${discord.user.id}&permissions=18432&scope=bot`);
});

discord.on('guildCreate', (guild) => {
    console.log('Added to ' + guild.name + ' (' + guild.nameAcronym + ')');
});

discord.login(discordToken);
