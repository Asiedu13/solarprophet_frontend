from django.urls import path 

from .views import PredictionView

urlpatterns = [

    path(

        "", 

        PredictionView.as_view() # run the API when someone visits the address and the prediction will be made

    ),

]

