//récupération de l'id dans l'url et affichage du numero de commande
function getId() {
  const urlParams = new URLSearchParams(window.location.search);
  orderId.innerText = urlParams.get("_id");
}
getId();

