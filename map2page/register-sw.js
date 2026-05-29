/* ================================================
   SOLARPROPHET — register-sw.js

   Add this to the <head> of every HTML page:
   <script src="register-sw.js"></script>

   This tells the browser to start the service
   worker which handles offline caching.
================================================ */

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker
      .register('/sw.js')
      .then(function() {
        console.log('Offline support enabled');
      })
      .catch(function(error) {
        console.log('Offline support not available:', error);
      });
  });
}
