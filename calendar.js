const cheerio = require("cheerio");
const axios = require("axios").default;

async function getJSON() {
    let agenda = {
        Lundi : [],
        Mardi : [],
        Mercredi : [],
        Jeudi : [],
        Vendredi : [],
        Samedi : [],
        Dimanche : []
    };

    try {

        response = await axios("https://www.adkami.com/agenda");
        let $ = await cheerio.load(response.data);

        $("#body > section > div > div.agenda-list > div > div").toArray().map(days => {
            if ($(days).text() == "\n") return;
            let day;
            $(days).children().toArray().map( el => {
                
                if($(el)[0].name == "h3") { 
                    day = $(el).text(); 
                    return; 
                }

                let title = $('.title', el).text();
                let number = Number($('.epis', el).text().split(" ")[1]);
                let timestamp = Number($(".date_hour", el).attr("data-time"));
                
                let available = false;
                if($(el)[0].name == 'a') available = true;
                
                let fansub = false
                if($(el).hasClass("vag")) fansub = true;

                let vf = false;
                if($('.epis', el).text().includes("vf")) vf = true;
                
                agenda[day].push(
                    {
                        title : title, 
                        number : number,
                        timestamp : timestamp,
                        available: available,
                        fansub : fansub,
                        vf : vf
                    }
                );
            })
        })

        return agenda;

    } catch(e){
        console.log(e);
    }
}

module.exports = getJSON;