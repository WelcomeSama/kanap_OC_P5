//local storage de format json à objet js
let productPanier = JSON.parse(localStorage.getItem("produit"));

//affichage des produits
const panierPosition = document.querySelector("#cart__items");

//affichage du panier
async function panier() {
  //si le panier est vide : afficher "le panier est vide"
  if (productPanier === null) {
    panierPosition.InnerText = `Votre panier est vide!`;
  } else {
    //si il y'a des articles dans le panier
    let panier = [];

    let total = parseInt("0"); //valeur du prix total a "0" de base

    for (i = 0; i < productPanier.length; i++) {
      let price = await recuperationProduit(productPanier[i][0]);

      //total du prix
      total += parseInt(price) * parseInt(productPanier[i][6]);

      //affichage du panier
      panier =
        panier +
        `
      <article class="cart__item" data-id="{product-ID}" data-color="{product-color}">
      <div class="cart__item__img">
        <img src="${productPanier[i][1]}" alt="${productPanier[i][2]}">
      </div>
      <div class="cart__item__content">
        <div class="cart__item__content__description">
          <h2>${productPanier[i][3]}</h2>
          <p>${productPanier[i][4]}</p>
          <p>${price}€</p>
        </div>
        <div class="cart__item__content__settings">
          <div class="cart__item__content__settings__quantity">
            <p>Qté : </p>
            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${productPanier[i][6]}">
          </div>
          <div class="cart__item__content__settings__delete">
            <p class="deleteItem">Supprimer</p>
          </div>
        </div>
      </div>
    </article>
      `;
    }

    //afficher le prix total
    document.getElementById("totalPrice").InnerText = total;

    if (i == productPanier.length) {
      panierPosition.InnerText = panier;
    }
  }
  totalQty();
  modifQty();
}
//récupération des prix des produits
async function recuperationProduit(_id) {
  const response = await fetch("http://localhost:3000/api/products/" + _id);
  const Product = await response.json();
  return [Product.price];
}
panier();

// Récupération du total des quantités
function totalQty() {
  let elementQuantity = document.getElementsByClassName("itemQuantity");
  let quantity = elementQuantity.length,
    totalQuantity = 0;

  for (let i = 0; i < quantity; ++i) {
    totalQuantity += elementQuantity[i].valueAsNumber;
  }

  let productTotalQuantity = document.getElementById("totalQuantity");
  productTotalQuantity.InnerText = totalQuantity;
}

// Suppression d'un produit
function deleteProduct() {
  let btn_supprimer = document.querySelectorAll(".deleteItem");

  for (let j = 0; j < btn_supprimer.length; j++) {
    btn_supprimer[j].addEventListener("click", (event) => {
      event.preventDefault();

      let idDelete = productPanier[j][0];
      let colorDelete = productPanier[j][6];
      console.log(idDelete);
      console.log(colorDelete);

      productPanier = productPanier.filter(
        (el) => el[0] !== idDelete || el[6] !== colorDelete
      );
      localStorage.setItem("produit", JSON.stringify(productPanier));

      alert("Votre produit a bien été supprimé du panier");
      location.reload();
    });
  }
}
deleteProduct();

//modifier quantité
function modifQty() {
  let modifQuantity = document.getElementsByName("itemQuantity");
  modifQuantity.forEach(function (currentValue, index) {
    currentValue.addEventListener("change", function () {
      let listProduct = JSON.parse(localStorage.getItem("produit"));
      let total = parseInt("0");
      total = parseInt(
        document.getElementById("totalPrice").InnerText -
          listProduct[index][6] * "prix"
      );
      listProduct[index][6] = currentValue.value;
      total += parseInt(listProduct[index][6] * "prix");
      document.getElementById("totalPrice").InnerText = total;
      localStorage.setItem("produit", JSON.stringify(listProduct));
      alert("Votre quantité a bien été mofifiée");
      location.reload();
    });
  });
}

//création des constante des données saisie dans le formulaire
const inputName = document.getElementById("firstName");
const inputLastName = document.getElementById("lastName");
const inputAdress = document.getElementById("address");
const inputCity = document.getElementById("city");
const inputMail = document.getElementById("email");

//validation du formulaire
function validForm() {
  //Création des expressions régulières
  let emailRegExp = new RegExp(
    "^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$"
  );
  let nameRegExp = new RegExp("^[a-zA-Z ,.'-]+$");
  let addressRegExp = new RegExp(
    "^[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+"
  );

  //passer la commande avec regex
  let isValid = true;

  //validation du champ firstname
  if (!nameRegExp.test(inputName.value)) {
    isValid = false;
    document.getElementById("firstNameErrorMsg").innerText =
      "Veuillez renseigner ce champ.";
  }

  //validation du champ lastname
  if (!nameRegExp.test(inputLastName.value)) {
    isValid = false;
    document.getElementById("lastNameErrorMsg").innerText =
      "Veuillez renseigner ce champ.";
  }

  //validation de l'adresse
  if (!addressRegExp.test(inputAdress.value)) {
    isValid = false;
    document.getElementById("addressErrorMsg").innerText =
      "Veuillez renseigner ce champ.";
  }

  //validation de la ville
  if (!nameRegExp.test(inputCity.value)) {
    isValid = false;
    document.getElementById("cityErrorMsg").innerText =
      "Veuillez renseigner ce champ.";
  }

  //validation de l'email
  if (!emailRegExp.test(inputMail.value)) {
    isValid = false;
    document.getElementById("emailErrorMsg").innerText =
      "Veuillez renseigner un email valide.";
  }

  return isValid;
}

//récuperation du formulaire
let btn_commander = document.getElementById("order");

//passage de commande au clique "commander"
btn_commander.addEventListener("click", function () {
  //récupération de l'id du(des) produit(s)
  let idProducts = [];
  for (let i = 0; i < productPanier.length; i++) {
    idProducts.push(productPanier[i][0]);
  }

  //récupération du formulaire
  const order = {
    contact: {
      firstName: inputName.value,
      lastName: inputLastName.value,
      address: inputAdress.value,
      city: inputCity.value,
      email: inputMail.value,
    },
    //récupération de l'id
    products: idProducts,
  };

  //
  localStorage.setItem("commande", JSON.stringify(order));
  let isValid = validForm();
  if (isValid) {
    getOrder(order);
  }
});

//post de la commande pour récupérer un numero de commande
function getOrder(order) {
  let fetchData = {
    method: "POST",
    body: JSON.stringify(order),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };
  fetch("http://localhost:3000/api/products/order", fetchData)
    .then((response) => response.json())
    .then((data) => {
      localStorage.clear();

      //redirection sur la page confirmation et envoi de l'id dans l'url
      document.location.href = `confirmation.html?_id=${data.orderId}`;
    });
}
