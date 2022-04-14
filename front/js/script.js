// Récupération des articles de l'API

async function getProducts() {
  const result = await fetch("http://localhost:3000/api/products");
  if (result.status === 200) {
    return result.json();
  } else {
    return result;
  }
}

cards();

// Répartition des données de l'API dans le DOM

async function cards() {
  getProducts()
    .then(function (resultatAPI) {
      console.log(resultatAPI);
      for (let article in resultatAPI) {
        const product = resultatAPI[article];

        // Insertion de l'élément "a"
        let productLink = document.createElement("a");
        document.querySelector(".items").appendChild(productLink);
        productLink.href = `product.html?_id=${product._id}`;

        // Insertion de l'élément "article"
        let productArticle = document.createElement("article");
        productLink.appendChild(productArticle);

        // Insertion de l'image
        let productImg = document.createElement("img");
        productArticle.appendChild(productImg);
        productImg.src = product.imageUrl;
        productImg.alt = product.altTxt;
        productImg.title = product.name;

        // Insertion du titre "h3"
        let productName = document.createElement("h3");
        productArticle.appendChild(productName);
        productName.classList.add("productName");
        productName.innerHTML = product.name;

        // Insertion de la description "p"
        let productDescription = document.createElement("p");
        productArticle.appendChild(productDescription);
        productDescription.classList.add("productName");
        productDescription.innerHTML = product.description;
      }
    })
    .catch(function (error) {
      console.log(error);
      return error;
    });
}
