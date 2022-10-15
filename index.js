const request = async () => {
    try {
        const response = await fetch("./assets/menu.json");
        const data = await response.json();
        console.log(data)
        console.log(data[5].Categoria, data[5].id, data[5].Nombre,data[5].Descripcion, data[5].Precio )
        return data;  

    } catch {
        console.log("no se recibe nada"); 
    }

}

request()