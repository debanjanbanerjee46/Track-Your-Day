document.querySelector('.addtsk').addEventListener("click", () => {
    document.querySelector('.date3').style.display='flex';
    
    });
    document.querySelector('.addtsk').addEventListener("click", () => {
        document.querySelector('.date4').style.display='flex';
        
        });
        document.querySelector('.bgh').addEventListener("mouseout", () => {
          document.querySelector('.date4').style.display='none';
          
          });
          document.querySelector('.bgh').addEventListener("mouseout", () => {
            document.querySelector('.date3').style.display='none';
            
            });
        let icon=document.getElementById("ham3");

        icon.addEventListener("click",()=>{
            if(document.querySelector('.taskbar').classList.contains('taskbargo')){
             document.querySelector('.taskbar').classList.remove('taskbargo');
             console.log("321");
            }
            else{
             document.querySelector('.taskbar').classList.add('taskbargo');
             console.log("123");
            }
        })
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
        