"""
South Africa Geographical Seed Data
Contains countries, states, and cities for South Africa and surrounding regions
"""

SOUTH_AFRICA_COUNTRIES = [
    {
        "name": "South Africa",
        "code": "ZA",
        "phone_code": "+27",
        "currency_code": "ZAR",
        "states": [
            {
                "name": "Gauteng",
                "code": "GP",
                "cities": [
                    {"name": "Johannesburg", "code": "JNB", "postal_code": "2000", "latitude": "-26.2041", "longitude": "28.0473"},
                    {"name": "Pretoria", "code": "PRY", "postal_code": "0001", "latitude": "-25.7479", "longitude": "28.2293"},
                    {"name": "Soweto", "code": "SWT", "postal_code": "1808", "latitude": "-26.2679", "longitude": "27.8585"},
                    {"name": "Sandton", "code": "SND", "postal_code": "2031", "latitude": "-26.1076", "longitude": "28.0567"},
                    {"name": "Midrand", "code": "MID", "postal_code": "1685", "latitude": "-26.1333", "longitude": "28.1333"}
                ]
            },
            {
                "name": "Western Cape",
                "code": "WC",
                "cities": [
                    {"name": "Cape Town", "code": "CPT", "postal_code": "8000", "latitude": "-33.9249", "longitude": "18.4241"},
                    {"name": "Stellenbosch", "code": "STB", "postal_code": "7600", "latitude": "-33.9333", "longitude": "18.8667"},
                    {"name": "Paarl", "code": "PAE", "postal_code": "7620", "latitude": "-33.7333", "longitude": "18.9833"},
                    {"name": "Worcester", "code": "WOR", "postal_code": "6849", "latitude": "-33.6500", "longitude": "19.4500"},
                    {"name": "George", "code": "GRG", "postal_code": "6529", "latitude": "-33.9667", "longitude": "22.4667"}
                ]
            },
            {
                "name": "KwaZulu-Natal",
                "code": "KZN",
                "cities": [
                    {"name": "Durban", "code": "DUR", "postal_code": "4000", "latitude": "-29.8587", "longitude": "31.0218"},
                    {"name": "Pietermaritzburg", "code": "PMB", "postal_code": "3200", "latitude": "-29.6000", "longitude": "30.3833"},
                    {"name": "Richards Bay", "code": "RCB", "postal_code": "3900", "latitude": "-28.8000", "longitude": "32.0500"},
                    {"name": "Newcastle", "code": "NCL", "postal_code": "2940", "latitude": "-27.7667", "longitude": "29.9333"},
                    {"name": "Ladysmith", "code": "LDS", "postal_code": "3370", "latitude": "-28.5500", "longitude": "29.7667"}
                ]
            },
            {
                "name": "Eastern Cape",
                "code": "EC",
                "cities": [
                    {"name": "Port Elizabeth", "code": "PLZ", "postal_code": "6000", "latitude": "-33.9608", "longitude": "25.6022"},
                    {"name": "East London", "code": "ELS", "postal_code": "5200", "latitude": "-33.0153", "longitude": "27.9116"},
                    {"name": "Mthatha", "code": "UTT", "postal_code": "5100", "latitude": "-31.5833", "longitude": "28.7833"},
                    {"name": "Grahamstown", "code": "GRJ", "postal_code": "6139", "latitude": "-33.3167", "longitude": "26.5167"},
                    {"name": "Queenstown", "code": "QTN", "postal_code": "5320", "latitude": "-31.8833", "longitude": "26.8833"}
                ]
            }
        ]
    }
]

def get_south_africa_data():
    """Return South Africa geographical data"""
    return SOUTH_AFRICA_COUNTRIES
