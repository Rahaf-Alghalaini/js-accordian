const btnAnswer=document.querySelectorAll(".btn-answer");
let answer=document.getElementById(".answer-question");
btnAnswer.forEach((btnAnswer)=>{
btnAnswer.addEventListener("click",()=>{
     answer=btnAnswer.nextElementSibling;
    answer.hidden=!answer.hidden;
    btnAnswer.setAttribute('aria-expanded',String(!answer.hidden));
    btnAnswer.textContent=answer.hidden ?"+":"-";
});

});
