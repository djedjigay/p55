// Récupération de l'id de la commande via l' URL
//--------------------------------------------------------------------------
//la variable params récupère l'url de la page   https://qastack.fr/programming/9870512/how-to-obtain-the-query-string-from-the-current-url-with-javascript
const params = new URLSearchParams(document.location.search); //console.log(document.location);  https://developer.mozilla.org/fr/docs/Web/API/Document/location
// la variable id va récupérer la valeur du paramètre commande
const commande = params.get("commande");

document.getElementById('orderId').innerHTML = commande;