const request = require("request")
const Nightmare = require('nightmare')
const nightmare = Nightmare({ show: false })

const BaseAvia = {
    url: '',
    city_from: '',
    city_to: '',
    date_from: ''
}

// VKO
// bergamo BGY
// rome f FCO
// girona GRO
// gelenzjik GDZ

const Pobeda = new Object(BaseAvia)
Pobeda.url = 'https://booking.pobeda.aero/ScheduleSelect.aspx';
Pobeda.city_from = process.argv[2];
Pobeda.city_to = process.argv[3];
Pobeda.date_from = '01.08.2019';
Pobeda.parsePrices = function () {
    let jsonArray = [];
    document.querySelectorAll('#carouselMonthContainer li div.date.showPrice').forEach(item => {
        let price = +item.getAttribute('data-min-fare')
        if (price > 0) {
            jsonArray.push({
                date: item.getAttribute('data-date'),
                price: price
            })
        }
    })
    return jsonArray
}

Pobeda.check = function () {
    if (typeof this.city_from === "undefined" || typeof this.city_to === "undefined") {
        throw "Invalid from/to arguments. Example: node scrap.js VKO GDZ"
    }
    nightmare
        .goto(this.url)
        .wait('#newSearchWidget')
        .click('#label-thirdParties-IntentMedia')
        .click("._aeroplane-ticket-city-from div.form-dropoutList__item[data-iata='" + this.city_from + "']")
        .click("._aeroplane-ticket-city-to div.form-dropoutList__item[data-iata='" + this.city_to + "']")
        .evaluate(() => {
            document
                .querySelector('div.header-form__item._calendar[data-item="aeroplane-ticket-departure-date"] input[name="beginDate"]')
                .setAttribute('value', '25.09.2019')
        })
        .click('div.header-form__noreturn-button')
        .click('#searchButton')
        .wait('div[data-calendar="month"]')
        .click('div[data-calendar="month"]')
        .wait('#carouselMonthContainer ul.tabsHeader')
        .evaluate(() => {
            let jsonArray = [];
            document.querySelectorAll('#carouselMonthContainer li div.date.showPrice').forEach(item => {
                let price = +item.getAttribute('data-min-fare')
                if (price > 0) {
                    jsonArray.push({
                        date: item.getAttribute('data-date'),
                        price: price
                    })
                }
            })
            return jsonArray
        })
        .end()
        .then(result => {
            console.log(Pobeda.city_from + ' -> ' + Pobeda.city_to)
            console.log(result)
        })
        .catch(error => {
            console.error('Search failed:', error)
        })
};

Pobeda.check();

/*
nightmare
    .goto(Pobeda.url)
    .wait('.loader__stripes.--animation-finished')
    .evaluate(function () {
        let json_array = []
        document.querySelectorAll('.buy-button__button').forEach(function(item) {
            let info = JSON.parse(item.getAttribute('data-metainfo'))
            json_array.push(info)
        })

        return {data: json_array}
    })
    .end()
    .then(function (result) {
        request.post('http://3b846233.ngrok.io/', {form: result})
    })
    .catch((error) => {
        console.error('Search failed:', error)
    })
*/

/*
const st = JSON.parse(document.querySelector('.searchform.searchform-widget').getAttribute('data-newsearchwidgetjson')).stations
var data2 = {};
for (let name in st) {
	let country = st[name].Country
	if (typeof data2[country] === 'undefined') { data2[country] = [] }
	data2[country].push({ name: st[name].cultures.en, code: name })

}




* */
const names = {
    "RU": [{"name": "Anapa", "code": "AAQ"}, {"name": "Sochi", "code": "AER"}, {"name": "Astrakhan", "code": "ASF"}, {
        "name": "БАН",
        "code": "BAX"
    }, {"name": "Chelyabinsk", "code": "CEK"}, {"name": "Cheboksary", "code": "CSY"}, {"name": "БЕД", "code": "EGO"}, {
        "name": "Gelendzhik",
        "code": "GDZ"
    }, {"name": "Saratov (Gagarin)", "code": "GSV"}, {"name": "Nazran (Magas)", "code": "IGT"}, {
        "name": "Izhevsk (bus terminal)",
        "code": "IJK"
    }, {"name": "Irkutsk", "code": "IKT"}, {"name": "Kemerovo", "code": "KEJ"}, {"name": "Kaliningrad", "code": "KGD"}, {
        "name": "Krasnoyarsk",
        "code": "KJA"
    }, {"name": "Krasnodar", "code": "KRR"}, {"name": "Samara", "code": "KUF"}, {"name": "Kirov", "code": "KVX"}, {
        "name": "Kazan",
        "code": "KZN"
    }, {"name": "Saint Petersburg", "code": "LED"}, {"name": "Makhachkala", "code": "MCX"}, {"name": "Murmansk", "code": "MMK"}, {
        "name": "МГС",
        "code": "MQF"
    }, {"name": "Mineralnye Vody", "code": "MRV"}, {"name": "Nalchik", "code": "NAL"}, {"name": "Naberezhnie Chelny", "code": "NBC"}, {
        "name": "Vladikavkaz",
        "code": "OGZ"
    }, {"name": "Omsk", "code": "OMS"}, {"name": "Novosibirsk", "code": "OVB"}, {"name": "Perm", "code": "PEE"}, {
        "name": "Petrozavodsk",
        "code": "PES"
    }, {"name": "Orenburg", "code": "REN"}, {"name": "Gorno-Altaisk", "code": "RGK"}, {"name": "Rostov-on-Don", "code": "ROV"}, {
        "name": "Surgut",
        "code": "SGC"
    }, {"name": "Ekaterinburg", "code": "SVX"}, {"name": "Tyumen", "code": "TJM"}, {"name": "Tomsk", "code": "TOF"}, {
        "name": "УФА",
        "code": "UFA"
    }, {"name": "Ulyanovsk", "code": "ULV"}, {"name": "Ulan-Ude", "code": "UUD"}, {"name": "Moscow (Vnukovo)", "code": "VKO"}, {
        "name": "Volgograd",
        "code": "VOG"
    }],
    "TR": [{"name": "Antalya", "code": "AYT"}, {"name": "Milas-Bodrum", "code": "BJV"}, {"name": "Dalaman", "code": "DLM"}, {
        "name": "Alanya",
        "code": "GZP"
    }, {"name": "Istanbul (Atatürk)", "code": "IST"}, {"name": "Istanbul (Sabiha Gökçen)", "code": "SAW"}],
    "IT": [{"name": "Milan (Bergamo)", "code": "BGY"}, {"name": "Bari", "code": "BRI"}, {"name": "Cagliari", "code": "CAG"}, {
        "name": "Catania",
        "code": "CTA"
    }, {"name": "Rome", "code": "FCO"}, {"name": "Genoa", "code": "GOA"}, {"name": "Palermo", "code": "PMO"}, {
        "name": "Pisa",
        "code": "PSA"
    }, {"name": "Rimini", "code": "RMI"}, {"name": "Venice (Treviso)", "code": "TSF"}, {"name": "Milan (central station)", "code": "XIK"}],
    "SK": [{"name": "Bratislava", "code": "BTS"}],
    "DE": [{"name": "Cologne/Bonn", "code": "CGN"}, {"name": "Baden-Baden", "code": "FKB"}, {"name": "Munich (Memmingen)", "code": "FMM"}, {
        "name": "Leipzig",
        "code": "LEJ"
    }, {"name": "Berlin (Tegel)", "code": "TXL"}, {"name": "Munich (central station)", "code": "ZMU"}],
    "AE": [{"name": "Dubai Airport", "code": "DXB"}],
    "NL": [{"name": "Eindhoven", "code": "EIN"}, {"name": "Amsterdam Centraal Station", "code": "ZYA"}],
    "IL": [{"name": "Ramon", "code": "ETM"}],
    "ES": [{"name": "Barcelona (Girona)", "code": "GRO"}, {"name": "Barcelona (Reus)", "code": "REU"}],
    "FI": [{"name": "Helsinki", "code": "HEL"}],
    "AT": [{"name": "Innsbruck", "code": "INN"}, {"name": "Salzburg", "code": "SZG"}, {"name": "Vienna (central station)", "code": "XWC"}],
    "CZ": [{"name": "Karlovy Vary", "code": "KLV"}],
    "CY": [{"name": "Larnaca", "code": "LCA"}],
    "AM": [{"name": "Gyumri", "code": "LWN"}, {"name": "Yerevan (Hrazdan stadium)", "code": "XAA"}],
    "BE": [{"name": "Bruges(Ostend)", "code": "OST"}],
    "LV": [{"name": "Riga", "code": "RIX"}],
    "GB": [{"name": "London (Stansted)", "code": "STN"}],
    "ME": [{"name": "Tivat", "code": "TIV"}],
    "BG": [{"name": "Varna", "code": "VAR"}],
    "CH": [{"name": "Zurich (central station)", "code": "ZLP"}]
}
