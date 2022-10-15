const productContainer = document.getElementById("products");

const titulo = document.querySelector(".populares");

const categoryBtn = document.querySelector(".categoriesContainer");
const BtnCategory = document.querySelectorAll(".categoriesCard")
const categoriesList = document.querySelectorAll(".category");
// let cart = JSON.parse(localStorage.getItem('cart') || []);

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
      <button id="productCardBtn"
      data-id="${id}"
      data-nombre="${Nombre}"
      data-precio="${Precio}"
      data-img="${img}">Agregar</button>
    </div>
    `;
};

const categoryState = (selectedCategory) => {
  const categories = selectedCategory;

  // categories.forEach((e) => {

  //   if (e.Categoria !== selectedCategory[0].Categoria) {
  //     console.log(BtnCategory.dataset.category)
  //     BtnCategory.dataset.category.classList.remove("active");
  //     return;
  //   }
    
  //   BtnCategory.classList.add("active");
  // });
};

// const changeFilter = (e) => {
//   const selectedCategory = e.target.dataset.category;
//   console.log(e.dataset.category);
//   categoryState(selectedCategory);
// };



const renderFilter = async (category) => {
  const menu = await request();
  const productsList = menu.filter(
    (product) => product.Categoria.toUpperCase() === category.toUpperCase()
  );
  categoryState(productsList)
  productContainer.innerHTML = "";

  productsList.map(renderProducts).join("");

};

const applyFilter = (e) => {
  renderFilter(e.target.dataset.category);
  if (
    !e.target.matches(".categoriesCard") &&
    !e.target.matches(".categoriesCard img") &&
    !e.target.matches(".categoriesCard hr")
  )
    return;

  categoryState(e.target.dataset.category);
  if (!e.target.dataset.category) {
    productContainer.innerHTML = "";
    renderFilter();
  } else {
    renderFilter(e.target.dataset.category);
  }
};

const init = () => {
  categoryBtn.addEventListener("click", applyFilter);
  renderFilter('populares')
};

init();
