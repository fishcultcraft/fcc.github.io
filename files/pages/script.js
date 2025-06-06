
function clicked(){
    //alert("Get trolled")
    document.getElementById("application").innerHTML = "Invite only silly";
    setTimeout(function(){
        document.getElementById("application").innerHTML = "Apply Here";
    }, 1500);
}