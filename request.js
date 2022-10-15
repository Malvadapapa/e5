const request = async () => {
    try {
        const response = await fetch("./assets/menu.json");
        const data = await response.json();
        return data;  

    } catch {
        console.log("no se recibe nada"); 
    }

}
