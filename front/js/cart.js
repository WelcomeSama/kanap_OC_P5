//variable ou on met les key et value qui sont dans le local storage de format json à objet js
let productPanier = JSON.parse(localStorage.getItem("produit"));
console.log(productPanier);

//affichage des produits

const panierPosition = document.querySelector("#cart__items");

//si le panier est vide : afficher "le panier est vide"
if (productPanier === null) {
  panierPosition.innerHTML = `Votre panier est vide!`;
} else {
  let panier = [];

  let total = parseInt("0");

  
async function recuperationProduit(id){
  const result = await fetch("http://localhost:3000/api/products/" + id);
  return result;
}
  for (i = 0; i < productPanier.length; i++) {
    const result = recuperationProduit(productPanier[i][0]);
    console.log(result);

    total += parseInt(productPanier[i][4]) * parseInt(productPanier[i][7]);
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
        <p>${productPanier[i][6]}</p>
        <p>${productPanier[i][4]}€</p>
      </div>
      <div class="cart__item__content__settings">
        <div class="cart__item__content__settings__quantity">
          <p>Qté : </p>
          <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${productPanier[i][7]}">
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
  document.getElementById("totalPrice").innerHTML = total;

  if (i == productPanier.length) {
    panierPosition.innerHTML = panier;
  }
}

// Récupération du total des quantités
let elementQuantity = document.getElementsByClassName("itemQuantity");
let quantity = elementQuantity.length,
  totalQuantity = 0;

for (let i = 0; i < quantity; ++i) {
  totalQuantity += elementQuantity[i].valueAsNumber;
}

let productTotalQuantity = document.getElementById("totalQuantity");
productTotalQuantity.innerHTML = totalQuantity;

// Suppression d'un produit
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

//modifier quantité
let modifQuantity = document.getElementsByName("itemQuantity");
modifQuantity.forEach(function (currentValue, index) {
  currentValue.addEventListener("change", function () {
    let listProduct = JSON.parse(localStorage.getItem("produit"));
    let total = parseInt("0");
    total = parseInt(
      document.getElementById("totalPrice").innerHTML -
        listProduct[index][7] * listProduct[index][4]
    );
    listProduct[index][7] = currentValue.value;
    total += parseInt(listProduct[index][7] * listProduct[index][4]);
    document.getElementById("totalPrice").innerHTML = total;
    localStorage.setItem("produit", JSON.stringify(listProduct));
    alert("Votre quantité a bien été mofifiée");
    location.reload();
  });
});

const inputName = document.getElementById("firstName");
const inputLastName = document.getElementById("lastName");
const inputAdress = document.getElementById("address");
const inputCity = document.getElementById("city");
const inputMail = document.getElementById("email");

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
    document.getElementById("firstNameErrorMsg").innerText = "test";
  }

  //validation du champ lastname
  if (!nameRegExp.test(inputLastName.value)) {
    isValid = false;
    document.getElementById("lastNameErrorMsg").innerText = "test";
  }

  //validation de l'adresse
  if (!addressRegExp.test(inputAdress.value)) {
    isValid = false;
    document.getElementById("addressErrorMsg").innerText = "test";
  }

  //validation de la ville
  if (!nameRegExp.test(inputCity.value)) {
    isValid = false;
    document.getElementById("cityErrorMsg").innerText = "test";
  }

  //validation de l'email
  if (!emailRegExp.test(inputMail.value)) {
    isValid = false;
    document.getElementById("emailErrorMsg").innerText = "test";
  }

  return isValid;
}

let btn_commander = document.getElementById("order");

btn_commander.addEventListener("click", function () {
  let idProducts = [];
  for (let i = 0; i < productPanier.length; i++) {
    idProducts.push(productPanier[i][0]); //push de l'id dans la commmande
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
    products: idProducts,
  };

  localStorage.setItem("commande", JSON.stringify(order));
  let isValid = validForm();
  if (isValid) {
    getOrder(order);
  }
});

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
      localStorage.setItem("orderId", data.orderId);

      document.location.href = "confirmation.html";
    });
}

//mettre en fonction et commenté chaque fonction
//"test" a changé

//recalé les chiffre ,array
//prix

//id en url param