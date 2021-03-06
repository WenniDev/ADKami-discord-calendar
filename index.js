const { token } = require("./config.json")

const { Client, Intents, Collection, MessageEmbed, MessageActionRow, MessageButton} = require("discord.js");
const fs = require("fs")

const client = new Client({ 
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS]
})

client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

client.once('ready', () => {
	console.log('Ready!');
})

client.on('interactionCreate', interaction => {

	let command;

    if (interaction.isSelectMenu()){
		command = client.commands.get("calendar");
	} else {
		command = client.commands.get(interaction.commandName);
	}

	if (!command) return;

	try {
		command.execute(interaction);
	} catch (error) {
		console.error(error);
		interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});


client.login(token);