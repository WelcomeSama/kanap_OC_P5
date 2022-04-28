// valeur de la quantité à 1 de base
document.getElementById("quantity").value = 1;

// Récupération de l'article de l'API
async function getProduct(_id) {
  const result = await fetch("http://localhost:3000/api/products/" + _id);
  if (result.status === 200) {
    return result.json();
  } else {
    return result;
  }
}

//Récuperation de l'id dans l'url
const urlParams = new URLSearchParams(window.location.search);
const myParam = urlParams.get("_id");

// Répartition des données de l'API dans le DOM
async function card() {
  //recupération de l'id dans l'url
  getProduct(myParam)
    // Répartition des données de l'API dans le DOM
    .then(function (resultatAPI) {
      console.log(resultatAPI);

      // Insertion de l'image
      let img = document.querySelector(".item__img");
      let productImg = document.createElement("img");
      img.appendChild(productImg);
      productImg.src = resultatAPI.imageUrl;
      productImg.alt = resultatAPI.altTxt;
      productImg.title = resultatAPI.name;

      // Insertion du titre "h1"
      let title = document.querySelector("#title");
      title.InnerText = resultatAPI.name;

      // Insertion du prix
      let price = document.querySelector("#price");
      price.InnerText = resultatAPI.price;

      // Insertion de la description "p"
      let description = document.querySelector("#description");
      description.InnerText = resultatAPI.description;

      // Insertion du choix de couleurs
      for (let colors of resultatAPI.colors) {
        let selectColor = document.createElement("option");
        document.querySelector("#colors").appendChild(selectColor);
        selectColor.value = colors;
        selectColor.InnerText = colors;
      }
    })
    .catch(function (error) {
      console.log(error);
      return error;
    });
}
card();

//envoi dans le panier
//recuperation des options du produit au click
let optionsProduct = document.getElementById("addToCart");

optionsProduct.addEventListener("click", function () {
  //empêche la saisie de 0 quantité
  const quantity = document.getElementById("quantity");
  if (quantity.value == 0) {
    quantity.value = 1;
  }

  //empêche le choix d'aucune couleur
  const color = document.getElementById("colors");
  console.log(color.value);
  if (color.value == "") {
    color.querySelectorAll("option")[1].selected = "selected";
  }

  //recupération des données du produit

  let idProduct = myParam;
  let imageProduct = document.querySelector(".item__img img").src;
  let altImage = document.querySelector(".item__img img").alt;
  let nameProduct = document.querySelector("#title").textContent;
  let descriptionProduct = document.querySelector("#description").textContent;
  let colorProduct = colors.value;
  let quantityProduct = document.getElementById("quantity").value;

  let result = [
    idProduct,
    imageProduct,
    altImage,
    nameProduct,
    descriptionProduct,
    colorProduct,
    quantityProduct,
  ];

  //variable ou on met les key et value qui sont dans le local storage de format json à objet js
  let productPanier = JSON.parse(localStorage.getItem("produit"));

  //popup de confirmation et de re-direction au panier ou non
  const popupConfirmation = () => {
    if (
      window.confirm(
        `${nameProduct} ${colorProduct} a bien été ajouté au panier. Pour acceder à votre panier cliquer sur OK pour revenir à l'accueil cliquer sur ANNULER`
      )
    ) {
      window.location.href = "http://127.0.0.1:5501/front/html/cart.html";
    } else {
      window.location.href = "http://127.0.0.1:5501/front/html/index.html";
    }
  };

  //fonction pour ajouté un produit dans le local storage
  const addProduct = () => {
    productPanier.push(result);
    localStorage.setItem("produit", JSON.stringify(productPanier));
  };

  //si il ya déjà des produits enregistré dans le local storage
  //si le produit (id + couleur) est déjà dans le local storage
  if (productPanier) {
    const urlParams = new URLSearchParams(window.location.search);
    const idParams = urlParams.get("_id");
    const color = document.getElementById("colors").value;
    const quantity = document.getElementById("quantity").value;

    let isExist = false;
    let total = parseInt("0");

    for (let i = 0; i < productPanier.length; i++) {
      if (productPanier[i][0] === idParams && productPanier[i][5] === color) {
        isExist = true;
        total = parseInt(productPanier[i][6]) + parseInt(quantity);
        productPanier[i][6] = total;
      }
    }

    // si il n'existe pas
    if (!isExist) {
      addProduct();
    }
    //si il existe ajout de la nouvelle quantitée
    else {
      localStorage.setItem("produit", JSON.stringify(productPanier));
    }
    popupConfirmation();
  }

  //si le local storage est vide
  else {
    productPanier = [];
    addProduct();
    popupConfirmation();
  }
});
