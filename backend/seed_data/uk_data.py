"""
United Kingdom Geographical Seed Data
Contains countries, states, and cities for United Kingdom
"""

UK_COUNTRIES = [
    {
        "name": "United Kingdom",
        "code": "GB",
        "phone_code": "+44",
        "currency_code": "GBP",
        "states": [
            {
                "name": "England",
                "code": "ENG",
                "cities": [
                    {"name": "London", "code": "LON", "postal_code": "SW1A 0AA", "latitude": "51.5074", "longitude": "-0.1278"},
                    {"name": "Manchester", "code": "MAN", "postal_code": "M1 1AA", "latitude": "53.4808", "longitude": "-2.2426"},
                    {"name": "Birmingham", "code": "BHX", "postal_code": "B1 1AA", "latitude": "52.4862", "longitude": "-1.8904"},
                    {"name": "Liverpool", "code": "LPL", "postal_code": "L1 1AA", "latitude": "53.4084", "longitude": "-2.9916"},
                    {"name": "Bristol", "code": "BRS", "postal_code": "BS1 1AA", "latitude": "51.4545", "longitude": "-2.5879"},
                    {"name": "Leeds", "code": "LBA", "postal_code": "LS1 1AA", "latitude": "53.8008", "longitude": "-1.5491"},
                    {"name": "Sheffield", "code": "SHF", "postal_code": "S1 1AA", "latitude": "53.3811", "longitude": "-1.4701"},
                    {"name": "Newcastle upon Tyne", "code": "NCL", "postal_code": "NE1 1AA", "latitude": "54.9783", "longitude": "-1.6178"},
                    {"name": "Nottingham", "code": "NQT", "postal_code": "NG1 1AA", "latitude": "52.9548", "longitude": "-1.1581"},
                    {"name": "Leicester", "code": "LEI", "postal_code": "LE1 1AA", "latitude": "52.6369", "longitude": "-1.1398"}
                ]
            },
            {
                "name": "Scotland",
                "code": "SCT",
                "cities": [
                    {"name": "Edinburgh", "code": "EDI", "postal_code": "EH1 1AA", "latitude": "55.9533", "longitude": "-3.1883"},
                    {"name": "Glasgow", "code": "GLA", "postal_code": "G1 1AA", "latitude": "55.8642", "longitude": "-4.2518"},
                    {"name": "Aberdeen", "code": "ABZ", "postal_code": "AB1 1AA", "latitude": "57.1497", "longitude": "-2.0943"},
                    {"name": "Dundee", "code": "DND", "postal_code": "DD1 1AA", "latitude": "56.4620", "longitude": "-2.9707"},
                    {"name": "Inverness", "code": "INV", "postal_code": "IV1 1AA", "latitude": "57.4778", "longitude": "-4.2247"},
                    {"name": "Perth", "code": "PTK", "postal_code": "PH1 1AA", "latitude": "56.3952", "longitude": "-3.4314"},
                    {"name": "Stirling", "code": "STG", "postal_code": "FK8 1AA", "latitude": "56.1165", "longitude": "-3.9369"},
                    {"name": "Dumfries", "code": "DMF", "postal_code": "DG1 1AA", "latitude": "55.0709", "longitude": "-3.6055"},
                    {"name": "Ayr", "code": "AYR", "postal_code": "KA7 1AA", "latitude": "55.4585", "longitude": "-4.6292"},
                    {"name": "Kilmarnock", "code": "KMK", "postal_code": "KA1 1AA", "latitude": "55.6045", "longitude": "-4.4966"}
                ]
            },
            {
                "name": "Wales",
                "code": "WLS",
                "cities": [
                    {"name": "Cardiff", "code": "CWL", "postal_code": "CF1 1AA", "latitude": "51.4816", "longitude": "-3.1791"},
                    {"name": "Swansea", "code": "SWS", "postal_code": "SA1 1AA", "latitude": "51.6214", "longitude": "-3.9436"},
                    {"name": "Newport", "code": "NWP", "postal_code": "NP1 1AA", "latitude": "51.5877", "longitude": "-2.9983"},
                    {"name": "Wrexham", "code": "WRX", "postal_code": "LL1 1AA", "latitude": "53.0470", "longitude": "-2.9925"},
                    {"name": "Bangor", "code": "BNG", "postal_code": "LL1 1AA", "latitude": "53.2276", "longitude": "-4.1281"},
                    {"name": "Llandudno", "code": "LDN", "postal_code": "LL1 1AA", "latitude": "53.3250", "longitude": "-3.8325"},
                    {"name": "Barry", "code": "BRY", "postal_code": "CF1 1AA", "latitude": "51.3990", "longitude": "-3.2833"},
                    {"name": "Neath", "code": "NTA", "postal_code": "SA1 1AA", "latitude": "51.6633", "longitude": "-3.8036"},
                    {"name": "Merthyr Tydfil", "code": "MTH", "postal_code": "CF1 1AA", "latitude": "51.7467", "longitude": "-3.3767"},
                    {"name": "Bridgend", "code": "BDG", "postal_code": "CF1 1AA", "latitude": "51.5058", "longitude": "-3.5756"}
                ]
            },
            {
                "name": "Northern Ireland",
                "code": "NIR",
                "cities": [
                    {"name": "Belfast", "code": "BFS", "postal_code": "BT1 1AA", "latitude": "54.5973", "longitude": "-5.9301"},
                    {"name": "Derry", "code": "DERRY", "postal_code": "BT1 1AA", "latitude": "54.9966", "longitude": "-7.3086"},
                    {"name": "Lisburn", "code": "LSB", "postal_code": "BT1 1AA", "latitude": "54.5116", "longitude": "-6.0319"},
                    {"name": "Bangor", "code": "BGR", "postal_code": "BT1 1AA", "latitude": "54.6574", "longitude": "-5.6669"},
                    {"name": "Newtownabbey", "code": "NTA", "postal_code": "BT1 1AA", "latitude": "54.6397", "longitude": "-5.9349"},
                    {"name": "Craigavon", "code": "CRG", "postal_code": "BT1 1AA", "latitude": "54.4533", "longitude": "-6.3833"},
                    {"name": "Newry", "code": "NRW", "postal_code": "BT1 1AA", "latitude": "54.1755", "longitude": "-6.3361"},
                    {"name": "Armagh", "code": "ARM", "postal_code": "BT1 1AA", "latitude": "54.3502", "longitude": "-6.6536"},
                    {"name": "Coleraine", "code": "CLR", "postal_code": "BT1 1AA", "latitude": "55.1333", "longitude": "-6.6667"},
                    {"name": "Ballymena", "code": "BMN", "postal_code": "BT1 1AA", "latitude": "54.8667", "longitude": "-6.2833"}
                ]
            }
        ]
    }
]

def get_uk_data():
    """Return United Kingdom geographical data"""
    return UK_COUNTRIES
