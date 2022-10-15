const request = async () => {
    try {
        const response = await fetch("./assets/menu.json");
        const data = await response.json();
        console.log(data)
        return data;  

    } catch {
        console.log("no se recibe nada"); 
    }

}

request()