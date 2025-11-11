"""
United States Geographical Seed Data
Contains countries, states, and cities for United States
"""

US_COUNTRIES = [
    {
        "name": "United States",
        "code": "US",
        "phone_code": "+1",
        "currency_code": "USD",
        "states": [
            {
                "name": "California",
                "code": "CA",
                "cities": [
                    {"name": "Los Angeles", "code": "LAX", "postal_code": "90001", "latitude": "34.0522", "longitude": "-118.2437"},
                    {"name": "San Francisco", "code": "SFO", "postal_code": "94102", "latitude": "37.7749", "longitude": "-122.4194"},
                    {"name": "San Diego", "code": "SAN", "postal_code": "92101", "latitude": "32.7157", "longitude": "-117.1611"},
                    {"name": "San Jose", "code": "SJC", "postal_code": "95101", "latitude": "37.3382", "longitude": "-121.8863"},
                    {"name": "Sacramento", "code": "SAC", "postal_code": "94214", "latitude": "38.5816", "longitude": "-121.4944"}
                ]
            },
            {
                "name": "Texas",
                "code": "TX",
                "cities": [
                    {"name": "Houston", "code": "IAH", "postal_code": "77001", "latitude": "29.7604", "longitude": "-95.3698"},
                    {"name": "San Antonio", "code": "SAT", "postal_code": "78201", "latitude": "29.4241", "longitude": "-98.4936"},
                    {"name": "Dallas", "code": "DFW", "postal_code": "75201", "latitude": "32.7767", "longitude": "-96.7970"},
                    {"name": "Austin", "code": "AUS", "postal_code": "73301", "latitude": "30.2672", "longitude": "-97.7431"},
                    {"name": "Fort Worth", "code": "FTW", "postal_code": "76101", "latitude": "32.7555", "longitude": "-97.3308"}
                ]
            },
            {
                "name": "New York",
                "code": "NY",
                "cities": [
                    {"name": "New York", "code": "NYC", "postal_code": "10001", "latitude": "40.7128", "longitude": "-74.0060"},
                    {"name": "Buffalo", "code": "BUF", "postal_code": "14201", "latitude": "42.8864", "longitude": "-78.8784"},
                    {"name": "Rochester", "code": "ROC", "postal_code": "14604", "latitude": "43.1566", "longitude": "-77.6088"},
                    {"name": "Yonkers", "code": "YON", "postal_code": "10701", "latitude": "40.9312", "longitude": "-73.8988"},
                    {"name": "Syracuse", "code": "SYR", "postal_code": "13201", "latitude": "43.0481", "longitude": "-76.1474"}
                ]
            },
            {
                "name": "Florida",
                "code": "FL",
                "cities": [
                    {"name": "Jacksonville", "code": "JAX", "postal_code": "32201", "latitude": "30.3322", "longitude": "-81.6557"},
                    {"name": "Miami", "code": "MIA", "postal_code": "33101", "latitude": "25.7617", "longitude": "-80.1918"},
                    {"name": "Tampa", "code": "TPA", "postal_code": "33601", "latitude": "27.9506", "longitude": "-82.4572"},
                    {"name": "Orlando", "code": "ORL", "postal_code": "32801", "latitude": "28.5383", "longitude": "-81.3792"},
                    {"name": "St. Petersburg", "code": "PIE", "postal_code": "33701", "latitude": "27.7706", "longitude": "-82.6279"}
                ]
            },
            {
                "name": "Illinois",
                "code": "IL",
                "cities": [
                    {"name": "Chicago", "code": "ORD", "postal_code": "60601", "latitude": "41.8781", "longitude": "-87.6298"},
                    {"name": "Aurora", "code": "ARR", "postal_code": "60501", "latitude": "41.7606", "longitude": "-88.3201"},
                    {"name": "Rockford", "code": "RFD", "postal_code": "61101", "latitude": "42.2711", "longitude": "-89.0937"},
                    {"name": "Joliet", "code": "JOT", "postal_code": "60431", "latitude": "41.5250", "longitude": "-88.0817"},
                    {"name": "Naperville", "code": "NPV", "postal_code": "60540", "latitude": "41.7508", "longitude": "-88.1535"}
                ]
            }
        ]
    }
]

def get_us_data():
    """Return United States geographical data"""
    return US_COUNTRIES
