//Contenedor de recomendados
const recomendation = document.getElementById("recomendations");
//contenedor de productos grilla
const productContainer = document.getElementById("products");
//Titulo de productos en grilla segun categoria
const titulo = document.querySelector(".populares");
//Contenedor de botones de categorias
const categoryBtn = document.querySelector(".categoriesContainer");
//Cada boton de categoria
const BtnCategory = document.querySelectorAll(".categoriesCard");
//Array de categorias
const categoriesList = document.querySelectorAll(".category");
//Boton de carrito
const cart = document.getElementById("carrito_icon");
//Contenedor del carrito
const cartOpen = document.getElementById("openCart");
//Boton cerrar de carrito
const cartCerrar = document.getElementById("cartClose");
//Boton agregar desde recomendados
const addButton = document.getElementById(".btnCart");
//Contenedor de productos agregados
const productosEnCarrito = document.getElementById("carritoContainer");
//Añadir producto
const agregarProducto = document.getElementById("addProduct");
//Total
const total = document.getElementById("total");
//subtotal
const subTotal = document.getElementById("subTotal");
//Boton comprar
const btnComprar = document.getElementById("btnBuy");
//LocalStorage
let cartLS = JSON.parse(localStorage.getItem("cartLS")) || [];

const saveLocalStorage = () => {
  //console.log("cartLS===>", typeof cartLS);
  // ACA, SE CAMBIO JSON.stringify(carrito) / JSON.stringify(carrito);
  localStorage.setItem("cartLS", JSON.stringify(cartLS));
};

//RENDERIZAR PRODUCTOS EN EL CARRITO
const renderCartProduct = (productAdd) => {
  const { id, img, precio, nombre, descripcion, cantidad } = productAdd;
  return `
  <div class="productsCartCard">
              <img src="${img}" alt="" />
              <div class="productsCartDatos">
                <h3>${nombre}</h3>
                <p>${descripcion}</p>
                <h4>$ ${precio}</h4>
              </div>
              <div class="productsCartQuantityControler">
                <button data-id="${id}" class="quantity-handler down" >-</button>
                <h3>${cantidad}</h3>
                <button data-id="${id}" class="quantity-handler up" >+</button>
              </div>
            </div>   
  `;
};
//QUE MOSTRAR EN CARRITO
const renderCart = () => {
  if (!cartLS.length) {
    productosEnCarrito.innerHTML = `<p class="empty-msg">No hay productos agregados</p>`;
    return;
  }
  productosEnCarrito.innerHTML = cartLS.map(renderCartProduct).join("");
};

//FUNCION QUE RENDERIZA LOS PRODUCTOS EN LA SECCION DE PRODUCTOS
const renderProducts = (product) => {
  const { id, Nombre, Descripcion, Precio, img, Categoria } = product;
  titulo.textContent = `${Categoria.toUpperCase()}`;
  productContainer.innerHTML += `
    <div class="productCard">
    <img src="${img}" alt="" />
    <div class="productCardDescription">
      <h3>${Nombre}</h3>
      <p>${Descripcion}</p>
      </div>
    <div class="productCardPrice">
      <p>$${Precio === 0 ?"Gratis": Precio}</p>
      <button class="addProduct" data-id="${id}"
      data-nombre="${Nombre}"
      data-precio="${Precio}"
      data-descripcion="${Descripcion}"
      data-img="${img}">Agregar</button>
      </div>
    `;
};

// CONSEGUIR TOTAL
const cartTotal = () => {
  return cartLS.reduce(
    (acc, cur) => acc + Number(cur.precio) * Number(cur.cantidad),0 );
};

//RENDERIZAR TOTAL
const renderTotal = () => {
  total.innerHTML = `$ ${cartTotal()}`;
};

//DESHABILITAR BOTON COMPRAR
const desactivarBtn = () => {
  if (!cartLS.length) {
    btnComprar.classList.add("disabled");
    btnComprar.style.background = "#4d4d4d";

    return;
  }
  btnComprar.classList.remove("disabled");
  btnComprar.style.background =
    "linear-gradient(98.81deg, #ffa100 -0.82%, #fb103d 101.53%)";
};

const productData = (id, nombre, precio, img, descripcion) => {
  return { id, nombre, precio, img, descripcion };
};

// Verificar si el producto existe
const existingCartProduct = (product) => {
  let result = cartLS.find((item) => item.id === product.id);
  if (result) {
    return true;
  }
};

//Agregar una unidad de producto
const addUnitProduct = (product) => {
  cartLS = cartLS.map((cartProduct) => {
    return cartProduct.id === product.id
      ? { ...cartProduct, cantidad: cartProduct.cantidad + 1 }
      : cartProduct;
  });
};

//Crear producto para subir
const createCartProduct = (product) => {
  cartLS = [...cartLS, { ...product, cantidad: 1 }];
};

//Mensaje de alerta
const showAlert = () => {
  Swal.fire({
    title: "¡Producto Añadido!",
    imageUrl: "./assets/img/hasbupizza.gif",
    imageWidth: 150,
    imageHeight: 100,
    imageAlt: "Hasbullapizza",
  });
};
//Mensaje de alerta 2

const showAlert2 = () => {
  Swal.fire({
    title: "¡Compra Realizada!",
    imageUrl: "./assets/img/GIF-Simpsons.gif",
    imageWidth: 150,
    imageHeight: 100,
    imageAlt: "Simpsons",
  });
};



//AGREGAR AL CARRITO Y AL LS LOS PRODUCTOS
const addProduct = (e) => {
  if (!e.target.classList.contains("addProduct")) return;
  const { id, nombre, precio, img, descripcion } = e.target.dataset;
  const product = productData(id, nombre, precio, img, descripcion);
  if (existingCartProduct(product)) {
    addUnitProduct(product);
  } else {
    createCartProduct(product);
  }
  showAlert();
  saveLocalStorage();
  renderCart();
  renderTotal(cartLS);
  desactivarBtn(btnComprar);
};

///LOGICA DEL BOTON AGREGAR Y QUITAR ELEMENTOS DEL CARRITO
const removeProductFromCart = (existingProduct) => {
  cartLS = cartLS.filter((product) => product.id !== existingProduct.id);
  saveLocalStorage();
  renderCart(cartLS);
  renderTotal(cartLS);
  desactivarBtn();
};

const sustractProductUnit = (existingProduct) => {
  cartLS = cartLS.map((cartProduct) => {
    return cartProduct.id === existingProduct.id
      ? {
          ...cartProduct,
          cantidad: cartProduct.cantidad - 1,
        }
      : cartProduct;
  });
};
const handlePlusBtn = (id) => {
  const existingCartProduct = cartLS.find((item) => item.id === id);
  addUnitProduct(existingCartProduct);
};

const handleMinusBtn = (id) => {
  const existingCartProduct = cartLS.find((item) => item.id === id);
  if (existingCartProduct.cantidad === 1) {
    if (
      confirm(
        "¿Esta seguro que desea eliminar el producto del Carrito de compras?"
      )
    ) {
      removeProductFromCart(existingCartProduct);
    }
    return;
  }
  sustractProductUnit(existingCartProduct);
};

const handleQuantity = (e) => {
  if (e.target.classList.contains("down")) {
    handleMinusBtn(e.target.dataset.id);
  } else if (e.target.classList.contains("up")) {
    handlePlusBtn(e.target.dataset.id);
  }

  saveLocalStorage();
  renderCart(cartLS);
  renderTotal(cartLS);
  desactivarBtn();
};

//FUNCION PARA TRAER EL MENU Y FILTRARLO SEGUN LA CATEGORIA QUE RECIBE DEL APPLYFILTER
const renderFilter = async (category) => {
  const menu = await request();

  const productsList = menu.filter(
    (product) => product.Categoria.toUpperCase() === category.toUpperCase()
  );
  productsList;
  productContainer.innerHTML = "";

  productsList.map(renderProducts).join("");
};

//SEGUN EL BOTON DE FILTRO SE ENVIA A RENDER LA CATEGORIA SELECCIONADA
const applyFilter = (e) => {
  // renderFilter(e.target.dataset.category);--->DA ERROR
  if (
    !e.target.matches(".categoriesCard") &&
    !e.target.matches(".categoriesCard img") &&
    !e.target.matches(".categoriesCard hr")
  )
    return;

  // categoryState(e.target.dataset.category);
  if (!e.target.dataset.category) {
    productContainer.innerHTML = "";
    renderFilter();
  } else {
    renderFilter(e.target.dataset.category);
  }
};

////FUNCION ABRIR Y CERRAR CARRITO
cart.addEventListener("click", () => {
  cartOpen.style.display = "flex";
});

cartClose.addEventListener("click", () => {
  cartOpen.style.display = "none";
});
////FIN ABRIR Y CERRAR
///FUNCION CERRAR CARRITO CUANDO HACES CLICK AFUERA
const closeOnClick = (e) => {
  if (!e.target.classList.contains("cartSection")) return;
  cartOpen.style.display = "none";
};
////FIN CERRAR CARRITO CUANDO HACES CLICK AFUERA

//FUNCION PARA MOSTRAR ALEATORIAMENTE PRODUCTOS RECOMENDADOS CON CADA CARGA DE PAGINA
const renderMenuToday = () => {
  window.addEventListener("DOMContentLoaded", async () => {
    const menuToday = await request();
    for (let i = 0; i < 3; i++) {
      let randomMenu = [Math.floor(Math.random() * menuToday.length)];
      const { Nombre, Descripcion, Precio, img, id } = menuToday[randomMenu];

      recomendation.innerHTML += `
      <div class="recomendationsCard">
      <img src=${img} alt="" />
      <div class="recomendationsItems">
      <h3>${Nombre} </h3>
      <p>${Descripcion} </p>
      <h4>$ ${Precio === 0 ?"Gratis": Precio}</h4>
      </div>
      <button class="addProduct btnCart" data-id="${id}"
      data-nombre="${Nombre}"
      data-precio="${Precio}"
      data-descripcion="${Descripcion}"
      data-img="${img}">Agregar</button>
      </div>
      `;
    }
  });
};

// Funcion boton comprar realizada

const resetCartItem = () => {
  cartLS = [];
  saveLocalStorage();
  renderCart(cartLS);
  renderTotal(cartLS);
  desactivarBtn(btnComprar);
};

const compraRealizada = () => {
  if (!cartLS.length) return;
  if (window.confirm("deseas comprar?")) {
    resetCartItem();
    alert("la compra funco perrito");
    showAlert2();
  }
};

// Fin funcion comprar
const init = () => {
  categoryBtn.addEventListener("click", applyFilter);
  renderMenuToday();
  renderFilter("populares");
  productContainer.addEventListener("click", addProduct);
  document.addEventListener("DOMContentLoaded", renderCartProduct);
  document.addEventListener("DOMContentLoaded", renderTotal);
  document.addEventListener("DOMContentLoaded", desactivarBtn);
  document.addEventListener("DOMContentLoaded", renderCart(cartLS));
  cartOpen.addEventListener("click", closeOnClick);
  productosEnCarrito.addEventListener("click", handleQuantity);
  btnComprar.addEventListener("click", compraRealizada);
  recomendation.addEventListener('click', addProduct)

};

init();
