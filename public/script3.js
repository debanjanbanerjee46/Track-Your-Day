document.getElementById("sgu").addEventListener("click",()=>{
    document.querySelector('.login').classList.add("go");
    document.querySelector('.signup').classList.remove("go");
    document.getElementById('lgi').style.backgroundColor="transparent"
    document.getElementById('sgu').style.backgroundColor="aqua"
})
document.getElementById("lgi").addEventListener("click",()=>{
    document.querySelector('.signup').classList.add("go");
    document.querySelector('.login').classList.remove("go");
    document.getElementById('sgu').style.backgroundColor="transparent"
    document.getElementById('lgi').style.backgroundColor="aqua"
})