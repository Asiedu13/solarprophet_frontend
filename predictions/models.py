from django.db import models


class Prediction(models.Model): # going to predict output based on these inputs.

# Two MODEL FIELD: CharField and FloatField were used.
# The CharField used to store text data
# FloatFileld used to store decimal numbers since the umber to be given aren't whole numbers.


    location_name= models.CharField(max_length=150)

    wind_speed = models.FloatField()

    temperature = models.FloatField()

    humidity = models.FloatField()

    solar_irradiance = models.FloatField()

    daily_output = models.FloatField()

    weekly_output = models.FloatField()

    monthly_output = models.FloatField()

    created_at = models.DateTimeField(auto_now_add=True)
# We need context for the prediction
# We store the dat and time when the prediction was made.

    def __str__(self):
        return f"Prediction for {self.location_name} at {self.created_at}"

# The object introduces itself as "Prediction for Tema at 2023-07-01 12:35:00"
# This piece appears more clear and not murky.
