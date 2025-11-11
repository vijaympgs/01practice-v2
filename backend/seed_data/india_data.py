"""
India Geographical Seed Data
Contains countries, states, and cities for India
"""

INDIA_COUNTRIES = [
    {
        "name": "India",
        "code": "IN",
        "phone_code": "+91",
        "currency_code": "INR",
        "states": [
            {
                "name": "Maharashtra",
                "code": "MH",
                "cities": [
                    {"name": "Mumbai", "code": "BOM", "postal_code": "400001", "latitude": "19.0760", "longitude": "72.8777"},
                    {"name": "Pune", "code": "PNQ", "postal_code": "411001", "latitude": "18.5204", "longitude": "73.8567"},
                    {"name": "Nagpur", "code": "NAG", "postal_code": "440001", "latitude": "21.1458", "longitude": "79.0882"},
                    {"name": "Thane", "code": "THA", "postal_code": "400601", "latitude": "19.2183", "longitude": "72.9781"},
                    {"name": "Nashik", "code": "NASK", "postal_code": "422001", "latitude": "19.9975", "longitude": "73.7898"},
                    {"name": "Aurangabad", "code": "IXU", "postal_code": "431001", "latitude": "19.8762", "longitude": "75.3433"},
                    {"name": "Solapur", "code": "SSE", "postal_code": "413001", "latitude": "17.6599", "longitude": "75.9064"},
                    {"name": "Amravati", "code": "AMI", "postal_code": "444602", "latitude": "20.9387", "longitude": "77.7796"},
                    {"name": "Kolhapur", "code": "KLH", "postal_code": "416001", "latitude": "16.7057", "longitude": "74.2433"},
                    {"name": "Sangli", "code": "SGX", "postal_code": "416416", "latitude": "16.8524", "longitude": "74.5815"}
                ]
            },
            {
                "name": "Karnataka",
                "code": "KA",
                "cities": [
                    {"name": "Bengaluru", "code": "BLR", "postal_code": "560001", "latitude": "12.9716", "longitude": "77.5946"},
                    {"name": "Mysuru", "code": "MYQ", "postal_code": "570001", "latitude": "12.2958", "longitude": "76.6394"},
                    {"name": "Hubballi", "code": "HBX", "postal_code": "580025", "latitude": "15.3647", "longitude": "75.1240"},
                    {"name": "Mangaluru", "code": "IXE", "postal_code": "575001", "latitude": "12.9141", "longitude": "74.8560"},
                    {"name": "Belagavi", "code": "IXG", "postal_code": "590001", "latitude": "15.8497", "longitude": "74.4977"},
                    {"name": "Gulbarga", "code": "GBY", "postal_code": "585101", "latitude": "17.3297", "longitude": "76.8343"},
                    {"name": "Davanagere", "code": "DVG", "postal_code": "577002", "latitude": "14.4636", "longitude": "75.9238"},
                    {"name": "Bellary", "code": "BEP", "postal_code": "583101", "latitude": "15.1394", "longitude": "76.9214"},
                    {"name": "Bijapur", "code": "BJP", "postal_code": "586101", "latitude": "16.8302", "longitude": "75.7236"},
                    {"name": "Shimoga", "code": "SMQ", "postal_code": "577201", "latitude": "13.9299", "longitude": "75.5681"}
                ]
            },
            {
                "name": "Tamil Nadu",
                "code": "TN",
                "cities": [
                    {"name": "Chennai", "code": "MAA", "postal_code": "600001", "latitude": "13.0827", "longitude": "80.2707"},
                    {"name": "Coimbatore", "code": "CJB", "postal_code": "641001", "latitude": "11.0168", "longitude": "76.9558"},
                    {"name": "Madurai", "code": "IXM", "postal_code": "625001", "latitude": "9.9252", "longitude": "78.1198"},
                    {"name": "Tiruchirappalli", "code": "TRZ", "postal_code": "620001", "latitude": "10.7905", "longitude": "78.7047"},
                    {"name": "Salem", "code": "SXV", "postal_code": "636001", "latitude": "11.6643", "longitude": "78.1460"},
                    {"name": "Tirunelveli", "code": "TEN", "postal_code": "627001", "latitude": "8.7139", "longitude": "77.7567"},
                    {"name": "Tiruppur", "code": "TUP", "postal_code": "641001", "latitude": "11.1085", "longitude": "77.3411"},
                    {"name": "Vellore", "code": "VLR", "postal_code": "632001", "latitude": "12.9165", "longitude": "79.1325"},
                    {"name": "Erode", "code": "ED", "postal_code": "638001", "latitude": "11.3410", "longitude": "77.7172"},
                    {"name": "Thoothukudi", "code": "TUT", "postal_code": "628001", "latitude": "8.7642", "longitude": "78.1348"}
                ]
            },
            {
                "name": "Delhi",
                "code": "DL",
                "cities": [
                    {"name": "New Delhi", "code": "DEL", "postal_code": "110001", "latitude": "28.6139", "longitude": "77.2090"},
                    {"name": "North Delhi", "code": "NDL", "postal_code": "110006", "latitude": "28.7333", "longitude": "77.1333"},
                    {"name": "South Delhi", "code": "SDL", "postal_code": "110017", "latitude": "28.5167", "longitude": "77.2000"},
                    {"name": "East Delhi", "code": "EDL", "postal_code": "110092", "latitude": "28.6167", "longitude": "77.2833"},
                    {"name": "West Delhi", "code": "WDL", "postal_code": "110018", "latitude": "28.6500", "longitude": "77.1167"},
                    {"name": "Central Delhi", "code": "CDL", "postal_code": "110001", "latitude": "28.6333", "longitude": "77.2167"},
                    {"name": "North East Delhi", "code": "NED", "postal_code": "110093", "latitude": "28.6833", "longitude": "77.3167"},
                    {"name": "South East Delhi", "code": "SED", "postal_code": "110048", "latitude": "28.5667", "longitude": "77.2667"},
                    {"name": "South West Delhi", "code": "SWD", "postal_code": "110025", "latitude": "28.6000", "longitude": "77.0833"},
                    {"name": "North West Delhi", "code": "NWD", "postal_code": "110036", "latitude": "28.7167", "longitude": "77.1667"}
                ]
            },
            {
                "name": "Gujarat",
                "code": "GJ",
                "cities": [
                    {"name": "Ahmedabad", "code": "AMD", "postal_code": "380001", "latitude": "23.0225", "longitude": "72.5714"},
                    {"name": "Surat", "code": "STV", "postal_code": "395001", "latitude": "21.1702", "longitude": "72.8311"},
                    {"name": "Vadodara", "code": "BDQ", "postal_code": "390001", "latitude": "22.3072", "longitude": "73.1812"},
                    {"name": "Rajkot", "code": "RAJ", "postal_code": "360001", "latitude": "22.3039", "longitude": "70.8022"},
                    {"name": "Bhavnagar", "code": "BHU", "postal_code": "364001", "latitude": "21.7642", "longitude": "72.1519"},
                    {"name": "Jamnagar", "code": "JGA", "postal_code": "361001", "latitude": "22.4707", "longitude": "70.0577"},
                    {"name": "Junagadh", "code": "JUN", "postal_code": "362001", "latitude": "21.5222", "longitude": "70.4531"},
                    {"name": "Gandhinagar", "code": "GID", "postal_code": "382010", "latitude": "23.2167", "longitude": "72.6833"},
                    {"name": "Anand", "code": "ANV", "postal_code": "388001", "latitude": "22.5500", "longitude": "72.9333"},
                    {"name": "Nadiad", "code": "ND", "postal_code": "387001", "latitude": "22.5667", "longitude": "72.8667"}
                ]
            },
            {
                "name": "West Bengal",
                "code": "WB",
                "cities": [
                    {"name": "Kolkata", "code": "CCU", "postal_code": "700001", "latitude": "22.5726", "longitude": "88.3639"},
                    {"name": "Howrah", "code": "HWH", "postal_code": "711101", "latitude": "22.5958", "longitude": "88.2636"},
                    {"name": "Durgapur", "code": "RDP", "postal_code": "713201", "latitude": "23.5500", "longitude": "87.3167"},
                    {"name": "Siliguri", "code": "IXB", "postal_code": "734001", "latitude": "26.7167", "longitude": "88.4167"},
                    {"name": "Asansol", "code": "IXQ", "postal_code": "713301", "latitude": "23.6833", "longitude": "86.9667"},
                    {"name": "Bardhaman", "code": "BWN", "postal_code": "713101", "latitude": "23.2333", "longitude": "87.8667"},
                    {"name": "Malda", "code": "LDA", "postal_code": "732101", "latitude": "25.0000", "longitude": "88.1500"},
                    {"name": "Baharampur", "code": "RDP", "postal_code": "742101", "latitude": "24.1000", "longitude": "88.2500"},
                    {"name": "Habra", "code": "HBA", "postal_code": "743222", "latitude": "22.8333", "longitude": "88.6167"},
                    {"name": "Kharagpur", "code": "KGP", "postal_code": "721301", "latitude": "22.3500", "longitude": "87.3167"}
                ]
            },
            {
                "name": "Uttar Pradesh",
                "code": "UP",
                "cities": [
                    {"name": "Lucknow", "code": "LKO", "postal_code": "226001", "latitude": "26.8467", "longitude": "80.9462"},
                    {"name": "Kanpur", "code": "KNU", "postal_code": "208001", "latitude": "26.4499", "longitude": "80.3319"},
                    {"name": "Ghaziabad", "code": "GZB", "postal_code": "201001", "latitude": "28.6692", "longitude": "77.4538"},
                    {"name": "Agra", "code": "AGR", "postal_code": "282001", "latitude": "27.1767", "longitude": "78.0081"},
                    {"name": "Varanasi", "code": "VNS", "postal_code": "221001", "latitude": "25.3176", "longitude": "82.9739"},
                    {"name": "Meerut", "code": "MUT", "postal_code": "250001", "latitude": "28.9833", "longitude": "77.7064"},
                    {"name": "Allahabad", "code": "IXD", "postal_code": "211001", "latitude": "25.4333", "longitude": "81.8333"},
                    {"name": "Bareilly", "code": "BEK", "postal_code": "243001", "latitude": "28.3667", "longitude": "79.4167"},
                    {"name": "Aligarh", "code": "AIL", "postal_code": "202001", "latitude": "27.8833", "longitude": "78.0833"},
                    {"name": "Moradabad", "code": "MB", "postal_code": "244001", "latitude": "29.0000", "longitude": "78.7833"}
                ]
            },
            {
                "name": "Rajasthan",
                "code": "RJ",
                "cities": [
                    {"name": "Jaipur", "code": "JAI", "postal_code": "302001", "latitude": "26.9124", "longitude": "75.7873"},
                    {"name": "Jodhpur", "code": "JDH", "postal_code": "342001", "latitude": "26.2389", "longitude": "73.0243"},
                    {"name": "Udaipur", "code": "UDR", "postal_code": "313001", "latitude": "24.5788", "longitude": "73.6867"},
                    {"name": "Kota", "code": "KTU", "postal_code": "324001", "latitude": "25.2138", "longitude": "75.8648"},
                    {"name": "Ajmer", "code": "AII", "postal_code": "305001", "latitude": "26.4500", "longitude": "74.6333"},
                    {"name": "Bikaner", "code": "BKB", "postal_code": "334001", "latitude": "28.0229", "longitude": "73.3117"},
                    {"name": "Bhilwara", "code": "BHL", "postal_code": "311001", "latitude": "25.3500", "longitude": "74.6333"},
                    {"name": "Udaipurwati", "code": "UTP", "postal_code": "333021", "latitude": "28.0167", "longitude": "75.8500"},
                    {"name": "Sikar", "code": "SIK", "postal_code": "332001", "latitude": "27.6000", "longitude": "75.1500"},
                    {"name": "Pali", "code": "PBL", "postal_code": "306001", "latitude": "25.7667", "longitude": "73.3167"}
                ]
            },
            {
                "name": "Andhra Pradesh",
                "code": "AP",
                "cities": [
                    {"name": "Visakhapatnam", "code": "VTZ", "postal_code": "530001", "latitude": "17.6868", "longitude": "83.2185"},
                    {"name": "Vijayawada", "code": "VGA", "postal_code": "520001", "latitude": "16.5062", "longitude": "80.6480"},
                    {"name": "Guntur", "code": "GUT", "postal_code": "522001", "latitude": "16.3067", "longitude": "80.4365"},
                    {"name": "Nellore", "code": "NRE", "postal_code": "524001", "latitude": "14.4426", "longitude": "79.9865"},
                    {"name": "Kurnool", "code": "KRL", "postal_code": "518001", "latitude": "15.8333", "longitude": "78.0500"},
                    {"name": "Rajahmundry", "code": "RJA", "postal_code": "533001", "latitude": "17.0000", "longitude": "81.8000"},
                    {"name": "Tirupati", "code": "TIR", "postal_code": "517501", "latitude": "13.6288", "longitude": "79.4191"},
                    {"name": "Kakinada", "code": "KJA", "postal_code": "533001", "latitude": "16.9833", "longitude": "82.2500"},
                    {"name": "Anantapur", "code": "ATP", "postal_code": "515001", "latitude": "14.6833", "longitude": "77.6000"},
                    {"name": "Eluru", "code": "ELU", "postal_code": "534001", "latitude": "16.7167", "longitude": "81.1167"}
                ]
            },
            {
                "name": "Telangana",
                "code": "TS",
                "cities": [
                    {"name": "Hyderabad", "code": "HYD", "postal_code": "500001", "latitude": "17.3850", "longitude": "78.4867"},
                    {"name": "Warangal", "code": "WGC", "postal_code": "506001", "latitude": "18.0000", "longitude": "79.5833"},
                    {"name": "Nizamabad", "code": "NZB", "postal_code": "503001", "latitude": "18.6725", "longitude": "78.0947"},
                    {"name": "Karimnagar", "code": "KRJ", "postal_code": "505001", "latitude": "18.4333", "longitude": "79.1167"},
                    {"name": "Ramagundam", "code": "RMP", "postal_code": "505001", "latitude": "18.8000", "longitude": "79.4500"},
                    {"name": "Khammam", "code": "KMM", "postal_code": "507001", "latitude": "17.2500", "longitude": "80.1500"},
                    {"name": "Mahbubnagar", "code": "MBN", "postal_code": "509001", "latitude": "16.7333", "longitude": "78.1667"},
                    {"name": "Nalgonda", "code": "NLG", "postal_code": "508001", "latitude": "17.0500", "longitude": "79.2667"},
                    {"name": "Suryapet", "code": "SPT", "postal_code": "508001", "latitude": "17.1500", "longitude": "79.6167"},
                    {"name": "Adilabad", "code": "ADB", "postal_code": "504001", "latitude": "19.6667", "longitude": "78.5333"}
                ]
            }
        ]
    }
]

def get_india_data():
    """Return India geographical data"""
    return INDIA_COUNTRIES
