// pour différancier la page confirmation et panier
const page = document.location.href;
//----------------------------------------------------------------
// Récupération des produits de l'api
//----------------------------------------------------------------
// appel de la ressource api product (voir script.js) si on est sur la page panier
if (page.match("cart")) {
fetch("http://localhost:3000/api/products")
  .then((res) => res.json())
  .then((objetProduits) => {
      console.log(objetProduits);
      // appel de la fonction affichagePanier
      affichagePanier(objetProduits);
  })
  .catch((err) => {
      document.querySelector("#cartAndFormContainer").innerHTML = "<h1>erreur 404</h1>";
      console.log("erreur 404, sur ressource api: " + err);
  });
} else {
  console.log("sur page confirmation");
}
//--------------------------------------------------------------
// Fonction détermine les conditions d'affichage des produits du panier
//--------------------------------------------------------------
function affichagePanier(index) {
  let panier = JSON.parse(localStorage.getItem("panierStocké"));
   if (panier && panier.length != 0) {
    for (let produit of panier) {
      console.log(produit);
      for (let g = 0, h = index.length; g < h; g++) {
        if (produit._id === index[g]._id) {
          produit.name = index[g].name;
          produit.prix = index[g].price;
          produit.image = index[g].imageUrl;
          produit.description = index[g].description;
          produit.alt = index[g].altTxt;
        }
      }
    }
    // on joue affiche,  panier a des clefs/valeurs ajoutés que l'on a pas remonté dans le local storage et sont pourtant réèlles
    // ici panier à les valeurs du local storage + les valeurs définies au dessus
    //on demande à affiche() de jouer avec les données panier 
    //les valeurs ajoutés à panier ont un scope agrandi puisque appelé via la fonction affiche() d'ailleur dans affiche() il n'y a pas d'appel à panier de local storage.
    affiche(panier);
  } else {
    document.querySelector("#totalQuantity").innerHTML = "0";
    document.querySelector("#totalPrice").innerHTML = "0";
    document.querySelector("h1").innerHTML =
      "Vous n'avez pas d'article dans votre panier";
  }
  modifQuantité();
  suppression();
}
//--------------------------------------------------------------
//Fonction d'affichage d'un panier (tableau)
//--------------------------------------------------------------
function affiche(indexé) {
  
  let zonePanier = document.querySelector("#cart__items");
  zonePanier.innerHTML += indexé.map((produit) => 
  `<article class="cart__item" data-id="${produit._id}" data-couleur="${produit.couleur}" data-quantité="${produit.quantité}" data-prix="${produit.prix}"> 
    <div class="cart__item__img">
      <img src="${produit.image}" alt="${produit.alt}">
    </div>
    <div class="cart__item__content">
      <div class="cart__item__content__titlePrice">
        <h2>${produit.name}</h2>
        <span>couleur : ${produit.couleur}</span>
        <p data-prix="${produit.prix}">${produit.prix} €</p>
      </div>
      <div class="cart__item__content__settings">
        <div class="cart__item__content__settings__quantity">
          <p>Qté : </p>
          <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${produit.quantité}">
        </div>
        <div class="cart__item__content__settings__delete">
          <p class="deleteItem" data-id="${produit._id}" data-couleur="${produit.couleur}">Supprimer</p>
        </div>
      </div>
    </div>
  </article>`
    ).join(""); //on remplace les virgules de jonctions des objets du tableau par un vide
  // reste à l'écoute des modifications de quantité pour l'affichage et actualiser les données
  totalProduit();
}
//--------------------------------------------------------------
// fonction modifQuantité on modifie dynamiquement les quantités du panier
//--------------------------------------------------------------
function modifQuantité() {
  const cart = document.querySelectorAll(".cart__item");
  cart.forEach((cart) => {
    cart.addEventListener("change", (eq) => {
      let panier = JSON.parse(localStorage.getItem("panierStocké"));
      for (article of panier)
        if (
          article._id === cart.dataset.id &&
          cart.dataset.couleur === article.couleur
        ) {
          article.quantité = eq.target.value;
          localStorage.panierStocké = JSON.stringify(panier);
          cart.dataset.quantité = eq.target.value;
          totalProduit();
        }
    });
  });
}
//--------------------------------------------------------------
// fonction supression on supprime un article dynamiquement du panier et donc de l'affichage
//--------------------------------------------------------------
function suppression() {
  const cartdelete = document.querySelectorAll(".cart__item .deleteItem");
  cartdelete.forEach((cartdelete) => {
    cartdelete.addEventListener("click", () => {
      let panier = JSON.parse(localStorage.getItem("panierStocké"));
      for (let d = 0, c = panier.length; d < c; d++)
        if (
          panier[d]._id === cartdelete.dataset.id &&
          panier[d].couleur === cartdelete.dataset.couleur
        ) {        
            const num = [d];
          let nouveauPanier = JSON.parse(localStorage.getItem("panierStocké"));
          nouveauPanier.splice(num, 1);
          if (nouveauPanier && nouveauPanier.length == 0) {
            document.querySelector("#totalQuantity").innerHTML = "0";
            document.querySelector("#totalPrice").innerHTML = "0";
            document.querySelector("h1").innerHTML =
              "Vous n'avez pas d'article dans votre panier";
          }
          localStorage.panierStocké = JSON.stringify(nouveauPanier);
          totalProduit(); 
          return location.reload();
        }
    });
  });
}
//--------------------------------------------------------------
// fonction ajout nombre total produit et coût total
//--------------------------------------------------------------
function totalProduit() {
  let totalArticle = 0;
  let totalPrix = 0;
  const cart = document.querySelectorAll(".cart__item");
  cart.forEach((cart) => {
    totalArticle += JSON.parse(cart.dataset.quantité);
    totalPrix += cart.dataset.quantité * cart.dataset.prix;
  });
  document.getElementById("totalQuantity").textContent = totalArticle;
  document.getElementById("totalPrice").textContent = totalPrix;
}
//--------------------------------------------------------------
//  formulaire
//--------------------------------------------------------------
// les données du client seront stockées dans ce tableau pour la commande sur page panier
if (page.match("cart")) {
  var contactClient = {};
  localStorage.contactClient = JSON.stringify(contactClient);
  var prenom = document.querySelector("#firstName");
  prenom.classList.add("regex_texte");
  var nom = document.querySelector("#lastName");
  nom.classList.add("regex_texte");
  var ville = document.querySelector("#city");
  ville.classList.add("regex_texte");
  var adresse = document.querySelector("#address");
  adresse.classList.add("regex_adresse");
  var email = document.querySelector("#email");
  email.classList.add("regex_email");
  var regexTexte = document.querySelectorAll(".regex_texte");
  document.querySelector("#email").setAttribute("type", "text");
}
//--------------------------------------------------------------
//regex 
//--------------------------------------------------------------
let regexLettre = /^[a-záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ\s-]{1,31}$/i;
let regexChiffreLettre = /^[a-z0-9áàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ\s-]{1,60}$/i;
let regValideEmail = /^[a-z0-9æœ.!#$%&’*+/=?^_`{|}~"(),:;<>@[\]-]{1,60}$/i;
let regMatchEmail = /^[a-zA-Z0-9æœ.!#$%&’*+/=?^_`{|}~"(),:;<>@[\]-]+@([\w-]+\.)+[\w-]{2,4}$/i;
//--------------------------------------------------------------
// Ecoute et attribution de point(pour sécurité du clic) si ces champs sont ok d'après la regex
//--------------------------------------------------------------
if (page.match("cart")) {
  regexTexte.forEach((regexTexte) =>
    regexTexte.addEventListener("input", (e) => {
      valeur = e.target.value;
      let regNormal = valeur.search(regexLettre);
      if (regNormal === 0) {
        contactClient.firstName = prenom.value;
        contactClient.lastName = nom.value;
        contactClient.city = ville.value;
      }
      if (
        contactClient.city !== "" &&
        contactClient.lastName !== "" &&
        contactClient.firstName !== "" &&
        regNormal === 0
      ) {
        contactClient.regexNormal = 3;
      } else {
        contactClient.regexNormal = 0;
      }
      localStorage.contactClient = JSON.stringify(contactClient);
      couleurRegex(regNormal, valeur, regexTexte);
      valideClic();
    })
  );
}

texteInfo(regexLettre, "#firstNameErrorMsg", prenom);
texteInfo(regexLettre, "#lastNameErrorMsg", nom);
texteInfo(regexLettre, "#cityErrorMsg", ville);
if (page.match("cart")) {
  let regexAdresse = document.querySelector(".regex_adresse");
  regexAdresse.addEventListener("input", (e) => {
    valeur = e.target.value;
    let regAdresse = valeur.search(regexChiffreLettre);
    if (regAdresse == 0) {
      contactClient.address = adresse.value;
    }
    if (contactClient.address !== "" && regAdresse === 0) {
      contactClient.regexAdresse = 1;
    } else {
      contactClient.regexAdresse = 0;
    }
    localStorage.contactClient = JSON.stringify(contactClient);
    couleurRegex(regAdresse, valeur, regexAdresse);
    valideClic();
  });
}
//------------------------------------
// le champ écouté via la regex regexChiffreLettre fera réagir, grâce à texteInfo, la zone concernée
//------------------------------------
texteInfo(regexChiffreLettre, "#addressErrorMsg", adresse);
//--------------------------------------------------------------
// Ecoute et attribution de point(pour sécurité du clic) si ce champ est ok d'après les regex
//--------------------------------------------------------------
if (page.match("cart")) {
  let regexEmail = document.querySelector(".regex_email");
  regexEmail.addEventListener("input", (e) => {
    valeur = e.target.value;
    let regMatch = valeur.match(regMatchEmail);
    let regValide = valeur.search(regValideEmail);
    if (regValide === 0 && regMatch !== null) {
      contactClient.email = email.value;
      contactClient.regexEmail = 1;
    } else {
      contactClient.regexEmail = 0;
    }
    localStorage.contactClient = JSON.stringify(contactClient);
    couleurRegex(regValide, valeur, regexEmail);
    valideClic();
  });
}
//------------------------------------
// texte sous champ email
//------------------------------------
if (page.match("cart")) {
  email.addEventListener("input", (e) => {
    // valeur sera la valeur de l'input en dynamique
    valeur = e.target.value;
    let regMatch = valeur.match(regMatchEmail);
    let regValide = valeur.search(regValideEmail);
    // si valeur est toujours un string vide et la regex différante de 0 (regex à -1 et le champ est vide mais pas d'erreur)
    if (valeur === "" && regMatch === null) {
      document.querySelector("#emailErrorMsg").textContent = "Veuillez renseigner votre email.";
      document.querySelector("#emailErrorMsg").style.color = "white";
      // si valeur n'est plus un string vide et la regex différante de 0 (regex à -1 et le champ n'est pas vide donc il y a une erreur)
    } else if ( regValide !== 0) {
      document.querySelector("#emailErrorMsg").innerHTML = "Caractère non valide";
      document.querySelector("#emailErrorMsg").style.color = "white";
      // pour le reste des cas (quand la regex ne décèle aucune erreur et est à 0 peu importe le champ vu qu'il est validé par la regex)
    } else if (valeur != "" && regMatch == null) {
      document.querySelector("#emailErrorMsg").innerHTML = "Caratères acceptés pour ce champ. Forme email pas encore conforme";
      document.querySelector("#emailErrorMsg").style.color = "white";
    } else {
      document.querySelector("#emailErrorMsg").innerHTML = "Forme email conforme.";
      document.querySelector("#emailErrorMsg").style.color = "white";
    }
  });
}
//--------------------------------------------------------------
// fonction couleurRegex qui modifira la couleur de l'input par remplissage tapé, aide visuelle et accessibilité
//--------------------------------------------------------------
// on détermine une valeur de départ à valeur qui sera un string
let valeurEcoute = "";
// fonction à 3 arguments réutilisable, la regex, la valeur d'écoute, et la réponse à l'écoute
function couleurRegex(regSearch, valeurEcoute, inputAction) {
  // si valeur est toujours un string vide et la regex différante de 0 (regex à -1 et le champ est vide mais pas d'erreur)
  if (valeurEcoute === "" && regSearch != 0) {
    inputAction.style.backgroundColor = "white";
    inputAction.style.color = "black";
    // si valeur n'est plus un string vide et la regex différante de 0 (regex à -1 et le champ n'est pas vide donc il y a une erreur)
  } else if (valeurEcoute !== "" && regSearch != 0) {
    inputAction.style.backgroundColor = "rgb(220, 50, 50)";
    inputAction.style.color = "white";
    // pour le reste des cas (quand la regex ne décèle aucune erreur et est à 0 peu importe le champ vu qu'il est validé par la regex)
  } else {
    inputAction.style.backgroundColor = "rgb(0, 138, 0)";
    inputAction.style.color = "white";
  }
}
//--------------------------------------------------------------
// fonction d'affichage individuel des paragraphes sous input sauf pour l'input email
//--------------------------------------------------------------
function texteInfo(regex, pointage, zoneEcoute) {
      if (page.match("cart")) {
      zoneEcoute.addEventListener("input", (e) => {
      // valeur sera la valeur de l'input en dynamique
      valeur = e.target.value;
      index = valeur.search(regex);
    // si valeur est toujours un string vide et la regex différante de 0 (regex à -1 et le champ est vide mais pas d'erreur)
      if (valeur === "" && index != 0) {
        document.querySelector(pointage).textContent = "Veuillez renseigner ce champ.";
        document.querySelector(pointage).style.color = "white";
        // si valeur n'est plus un string vide et la regex différante de 0 (regex à -1 et le champ n'est pas vide donc il y a une erreur)
      } else if (valeur !== "" && index != 0) {
        document.querySelector(pointage).innerHTML = "Reformulez cette donnée";
        document.querySelector(pointage).style.color = "white";
        // pour le reste des cas (quand la regex ne décèle aucune erreur et est à 0 peu importe le champ vu qu'il est validé par la regex)
      } else {
      document.querySelector(pointage).innerHTML = "Caratères acceptés pour ce champ.";
      document.querySelector(pointage).style.color = "white";
      }
    });
  }
}
//--------------------------------------------------------------
// Fonction de validation/d'accés au clic du bouton du formulaire
//--------------------------------------------------------------
let commande = document.querySelector("#order");
// la fonction sert à valider le clic de commande de manière interactive
function valideClic() {
  let contactRef = JSON.parse(localStorage.getItem("contactClient"));
  let somme =
    contactRef.regexNormal + contactRef.regexAdresse + contactRef.regexEmail;
  if (somme === 5) {
    commande.removeAttribute("disabled", "disabled");
    document.querySelector("#order").setAttribute("value", "Commander !");
  } else {
    commande.setAttribute("disabled", "disabled");
    document.querySelector("#order").setAttribute("value", "Remplir le formulaire");
  }
}
//----------------------------------------------------------------
// Envoi de la commande
//----------------------------------------------------------------
if (page.match("cart")) {
  commande.addEventListener("click", (e) => {
    // empeche de recharger la page on prévient le reload du bouton
    e.preventDefault();
    valideClic();
    envoiPaquet();
  });
}
//----------------------------------------------------------------
// fonction récupérations des id puis mis dans un tableau
//----------------------------------------------------------------
// définition du panier quine comportera que les id des produits choisi du local storage
let panierId = [];
function tableauId() {
// appel des ressources
let panier = JSON.parse(localStorage.getItem("panierStocké"));
// récupération des id produit dans panierId
if (panier && panier.length > 0) {
  for (let indice of panier) {
    panierId.push(indice._id);
  }
} else {
  console.log("le panier est vide");
  document.querySelector("#order").setAttribute("value", "Panier vide!");
}
}
//----------------------------------------------------------------
// fonction récupération des donnée client et panier avant transformation
//----------------------------------------------------------------
let contactRef;
let commandeFinale;
function paquet() {
  contactRef = JSON.parse(localStorage.getItem("contactClient"));
  // définition de l'objet commande
  commandeFinale = {
    contact: {
      firstName: contactRef.firstName,
      lastName: contactRef.lastName,
      address: contactRef.address,
      city: contactRef.city,
      email: contactRef.email,
    },
    products: panierId,
  };
}
//----------------------------------------------------------------
// fonction sur la validation de l'envoi
//----------------------------------------------------------------
function envoiPaquet() {
  tableauId();
  paquet();
  // vision sur le paquet que l'on veut envoyer
  console.log(commandeFinale);
  let somme = contactRef.regexNormal + contactRef.regexAdresse + contactRef.regexEmail;
  // si le panierId contient des articles et que le clic est autorisé
  if (panierId.length != 0 && somme === 5) {
    // envoi à la ressource api
    fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(commandeFinale),
    })
      .then((res) => res.json())
      .then((data) => {
        // envoyé à la page confirmation, autre écriture de la valeur "./confirmation.html?commande=${data.orderId}"
        document.location.href = `confirmation.html?commande=${data.orderId}`;
      })
      .catch(function (err) {
        console.log(err);
        alert("erreur");
      });
  }
}
//------------------------------------------------------------
// fonction affichage autoinvoquée du numéro de commande et vide du storage lorsque l'on est sur la page confirmation
//------------------------------------------------------------
(function Commande() {
  if (page.match("confirmation")) {
    sessionStorage.clear();
    localStorage.clear();
    let numCom = new URLSearchParams(document.location.search).get("commande");
    document.querySelector("#orderId").innerHTML = `<br>${numCom}<br>Merci pour votre achat`;
    console.log("valeur de l'orderId venant de l'url: " + numCom);
    numCom = undefined;
  } else {
    console.log("sur page cart");
  }
})();