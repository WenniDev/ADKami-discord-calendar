const { SlashCommandBuilder } = require('@discordjs/builders');
const {MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu} = require("discord.js");

const getJSON = require("../calendar");
const days = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

module.exports = {
	data: new SlashCommandBuilder()
		.setName('calendar')
		.setDescription('get anime calendar from adkami'),

	async execute(interaction) {

		async function createEmbed(day){

			const calendar = await getJSON()

			const embed = new MessageEmbed()
			.setTitle(`Anime de ${day}`)
			.setColor("#9BD300")
			.setDescription(":green_circle: / :red_circle: => diponible / non disponible\n:pencil2: => fansub (retard possible)\n:flag_fr: => épisode en VF")
			
			calendar[day].forEach(anime => {

				const date = new Date(anime.timestamp * 1000)
				let hours = date.getHours().toString();
					if (hours.length <= 1) hours = "0" + hours;
				let minutes = date.getMinutes().toString();
					if (minutes.length <= 1) minutes = "0" + minutes;
				const time = `${hours}:${minutes}`
				

				let available = anime.available ? ":green_circle:" : ":red_circle:";
				let title = `${anime.title} ${available}`;
				if(anime.fansub) title = title + " :pencil2: "
			
				let description = `Episode ${anime.number} | ${time}`;

				if(anime.vf) description = description + " | :flag_fr:" 

				

				embed.addField(title, description)
			});

			return embed
		}

		function createMenu(){
			const row = new MessageActionRow().addComponents(
				new MessageSelectMenu()
					.setCustomId("selected_day")
					.setPlaceholder("Changer de jour")
					.addOptions([
					{
						label: "Lundi",
						description: "Animes du Lundi",
						value: "Lundi"
					},
					{
						label: "Mardi",
						description: "Animes du Mardi",
						value: "Mardi"
	
					},
					{
						label: "Mercredi",
						description: "Animes du Mercredi",
						value: "Mercredi"
					},
					{
						label: "Jeudi",
						description: "Animes du Jeudi",
						value: "Jeudi"
					},
					{
						label: "Vendredi",
						description: "Animes du Vendredi",
						value: "Vendredi"
					},
					{
						label: "Samedi",
						description: "Animes du Samedi",
						value: "Samedi"
					},
					{
						label: "Dimanche",
						description: "Animes du Dimanche",
						value: "Dimanche"
					},
				])
			);

			return row
		}

		if (interaction.isSelectMenu()){

			const day = interaction.values[0];
			const embed = await createEmbed(day);
			const row = createMenu();

			return await interaction.update({ embeds: [embed], components: [row] })


		} else {

		const day = new Date().getDay();
		const embed = await createEmbed(days[day]);
		const row = createMenu();
	
		return interaction.reply({ embeds: [embed], components: [row] });

		}
	
    }
};