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
//LocalStorage
let cartLS = JSON.parse(localStorage.getItem("cartLS")) || [];
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

const saveLocalStorage = (carrito) => {
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
                <button id="cartCardBtnRemove" data-id="${id}">-</button>
                <h3>${cantidad}</h3>
                <button id="cartCardBtnAdd" data-id="${id}">+</button>
              </div>
            </div>
  `;
};
//QUE MOSTRAR EN CARRITO
const renderCart = (product) => {
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
      <p>$${Precio}</p>
      <button class="addProduct" data-id="${id}"
      data-nombre="${Nombre}"
      data-precio="${Precio}"
      data-descripcion="${Descripcion}"
      data-img="${img}">Agregar</button>
      </div>
    `;
};

// // CONSEGUIR TOTAL
// const cartTotal = (e) => {
//   console.log(e.precio)
//   return cartLS.reduce((acc, cur) => acc + Number(cur.precio) * Number(cur.cantidad), 0);

// }

// //RENDERIZAR TOTAL
// const renderTotal = (e) => {
//   if(!cartLS) return
//   total.innerHTML = `$ ${cartTotal(e)}`
// }

//DESHABILITAR BOTON COMPRAR
const desactivarBtn = () => {
  if (!cartLS.length) {
    btnComprar.classList.add("disabled");
    btnComprar.style.background = "#4d4d4d";
    btnComprar.disabled = false;
    return;
  }
  btnComprar.classList.remove("disabled");
  btnComprar.disabled = true;
};

//Armado de producto para subir
const productData = (id, nombre, precio, img, descripcion) => {
  return { id, nombre, precio, img, descripcion };
};
// Verificar si el producto existe
const existingCartProduct = (product) => {
  const result = cartLS.find((item) => item.id === product.id);
};

//Agregar una unidad de producto
const addUnitProduct = (product) => {
  //console.log(product);
  cartLS = cartLS.map((cartProduct) => {
    return cartProduct.id === product.id
      ? { ...cartProduct, cantidad: cartProduct.cantidad + 1 }
      : cartProduct;
  });
};

//Crear producto para subir
const createCartProduct = (product) => {
  //console.log("llegue aca", product);
  cartLS = [...cartLS, { ...product, cantidad: 1 }];
  //console.log(cartLS);
};

//AGREGAR AL CARRITO Y AL LS LOS PRODUCTOS
const addProduct = (e) => {
  if (!e.target.classList.contains("addProduct")) return;
  const { id, nombre, precio, img, descripcion } = e.target.dataset;
  const product = productData(id, nombre, precio, img, descripcion);
  if (existingCartProduct(product)) {
    // console.log("llega");
    addUnitProduct(product);
  } else {
    createCartProduct(product);
  }
  //console.log(product);
  saveLocalStorage(product);
  renderCart(product);
  // renderTotal(product)
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

////FUNCION ABRIR Y CERRAR CARRITO *FALTA QUE SE CIERRE CUANDO CLICKEAS AFUERA
cart.addEventListener("click", () => {
  cartOpen.style.display = "flex";
});

cartClose.addEventListener("click", () => {
  cartOpen.style.display = "none";
});
////FIN ABRIR Y CERRAR

//FUNCION PARA MOSTRAR ALEATORIAMENTE PRODUCTOS RECOMENDADOS CON CADA CARGA DE PAGINA
const renderMenuToday = () => {
  window.addEventListener("DOMContentLoaded", async () => {
    const menuToday = await request();
    for (let i = 0; i < 3; i++) {
      let randomMenu = [Math.floor(Math.random() * menuToday.length)];
      const { Nombre, Descripcion, Precio, img } = menuToday[randomMenu];

      recomendation.innerHTML += `
      <div class="recomendationsCard">
      <img src=${img} alt="" />
      <div class="recomendationsItems">
      <h3>${Nombre} </h3>
      <p>${Descripcion} </p>
      <h4>$ ${Precio}</h4>
      </div>
      <button class="btnCart" id="recomendationsCardBtn">Agregar</button>
      </div>
      `;
      ////BOTONES AGREGAR DE "HOY TE RECOMENDAMOS"
      const addButton = document.querySelectorAll("#recomendationsCardBtn");
      for (let i = 0; i < addButton.length; i++) {
        addButton[i].addEventListener("click", () => {
          alert("traerdelLocal");
        });
      }
    }
    ////FIN BOTONES AGREGAR
  });
};

const init = () => {
  categoryBtn.addEventListener("click", applyFilter);
  renderMenuToday();
  renderFilter("populares");
  productContainer.addEventListener("click", addProduct);
  document.addEventListener("DOMContentLoaded", renderCartProduct);
  // document.addEventListener("DOMContentLoaded", renderTotal);
  document.addEventListener("DOMContentLoaded", desactivarBtn);
};

init();
