from django.shortcuts import render

from rest_framework.views import APIView # Builds API endpoints
from rest_framework.response import Response  # helps gets responses.
from .ghana_cities import GHANA_CITIES  # A dictionary of Ghanaian cities and their coordinates.

import math # Mathematical functions for calculations.

from .weather import get_weather # gets weather data from the API and import the function to views.py


class PredictionView(APIView): # Defines a class-based view for handling predictions.

    def post(self, request): # handles POST requests to the endpoint.

        city =request.data["city"] # extracts the city name from the request data.

        if city not in GHANA_CITIES:

            return Response(
                {"error": "City not found.Please provide a valid city in Ghana."},
                status=400
            )
        
        latitude, longitude = GHANA_CITIES[city] # retrieves latitude and longitude for specified city.
        
        

        weather = get_weather(latitude, longitude) # calls the function for a location.

    

        wind_speed = weather["wind_speed"] # retrieves the wind speed from the weather data.
        irradiance = weather["solar_irradiance"] # retrieves the solar irradiance from the weather data.
        
# Constants for wind and solar power computations.
        air_density = 1.225 # in kg/m^3 at sea level and 15 degrees Celsius
        turbine_radius = 30 # in meters

        panel_area = 12 # in square meters for a typical solar panel
        efficiency = 0.15 # 15% efficiency for solar panels

        # Wind power calculation
        swept_area = math.pi * (turbine_radius ** 2) # Area swept by the turbine blades

        wind_power = 0.5 * air_density * swept_area * (wind_speed ** 3) 

        # Solar Power Calculation
        
        solar_power = irradiance * panel_area * efficiency

        # Daily output
        wind_daily = wind_power *24
        solar_daily = solar_power * 6 # Assuming 6 hours of effective sunlight per day

        # Weekly output
        wind_weekly = wind_daily * 7
        solar_weekly = solar_daily * 7

        # Monthly output
        wind_monthly = wind_daily * 30
        solar_monthly = solar_daily * 30

        return Response({

            "wind": {
                "power": wind_power,
                "daily_Wh": wind_daily,
                "weekly_Wh": wind_weekly,
                "monthly_Wh": wind_monthly
            },

            "solar": {
                "power": solar_power,
                "daily_Wh": solar_daily,
                "weekly_Wh": solar_weekly,
                "monthly_Wh": solar_monthly
            },

           
        })

        
    
                

            



# Create your views here.
