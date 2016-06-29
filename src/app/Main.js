class Main
{
    constructor()
    {
        console.log("hello");
        this.init();
    }

    init()
    {
        var button = document.getElementById("simple_button-js");
        button.addEventListener("click", (event)=>{
            alert("Clicked");
        });
    }




}


// start
new Main();