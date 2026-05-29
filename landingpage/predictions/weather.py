import requests # this is used to retrieve weather data from an API.


def get_weather(latitude, longitude): # Function retrieves weather data from a location.
    

   
    url = (
         "https://api.open-meteo.com/v1/forecast"
        f"?latitude={latitude}"
        f"&longitude={longitude}"
        "&current=wind_speed_10m"
        "&hourly=shortwave_radiation"
    )
    # A url that provides weather data and it requests current wind speed and solar irradiance.

    response = requests.get(url) # Sends a GET request and retrieves the weather data from the API.

    data= response.json() # Converts the response to JSON format

    wind_speed = data["current"]["wind_speed_10m"] # first current wind speed value

    # first hourly solar value
    irradiance = data["hourly"]["shortwave_radiation"][0]

    print("irradiance", irradiance)
    print(data["hourly"]["shortwave_radiation"])
    
   
    

    return {
        "wind_speed": wind_speed,
        "solar_irradiance": irradiance
    }


