fetch("http://localhost:3000/api/products")
  .then((res) => res.json())
  .then((objetProduits) => {
    console.table(objetProduits);
    kanaps(objetProduits);
  })
   
function kanaps(produits) {
  let zoneArticle = document.querySelector("#items");
  const baseLink = "./product.html?_id=";
  for (let produit of produits) {
    /* creation du lien */
    const link = document.createElement('a');
    zoneArticle.appendChild(link);
    link.setAttribute('href', baseLink+produit._id);
    
    /* creation article */
    const article = document.createElement('article');  
    link.appendChild(article);  

    /* Creation image */
    const image = document.createElement('img');
    article.appendChild(image);
    image.setAttribute('src', produit.imageUrl);
    image.setAttribute('alt', produit.altTxt);

    const name = document.createElement('h3');
    article.appendChild(name);
    name.setAttribute('class', 'productName');
    name.innerHTML = produit.name;

    const description = document.createElement('p');
    article.appendChild(description);
    description.setAttribute('class', 'productDescription');
    description.innerHTML = produit.description;

      /*zoneArticle.innerHTML += `<a href="./product.html?_id=${article._id}">
      <article>
        <img src="${article.imageUrl}" alt="${article.altTxt}">
        <h3 class="productName">${article.name}</h3>
        <p class="productDescription">${article.description}</p>
      </article>
    </a>`;*/
  }
}
