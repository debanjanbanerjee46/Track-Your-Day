

let today= document.getElementById("content");
let all= document.getElementById("all");
let complete= document.getElementById("cmp");



    
        let icon=document.getElementById("ham3");

       
        icon.addEventListener("click",()=>{
           if(document.querySelector('.taskbar').classList.contains('taskbargo')){
            document.querySelector('.taskbar').classList.remove('taskbargo');
            document.querySelector('.ham').classList.remove('hamgo');
           }
           else{
            document.querySelector('.taskbar').classList.add('taskbargo');
            document.querySelector('.ham').classList.add('hamgo');
            
           }
        })
        let dt=new Date();
document.getElementById("whole").innerHTML=dt.toDateString();
document.querySelector('.addtsk').addEventListener("click", () => {
    document.querySelector('.date2').style.display='flex';
    
    });
    document.querySelector('.bgh').addEventListener("mouseout", () => {
      document.querySelector('.date2').style.display='none';
      
      });
    
       
        
        
      function hide(id){
        document.getElementById(id).style.display='none';
        document.getElementById(id+1).style.display='flex';
        
        
      }
      function show(id){
        document.getElementById(id).style.display='none';
        let id2=id.substring(0,id.length-1);
        console.log(id2);
        document.getElementById(id2).style.display='flex';
        
      }
    
    
   