// $(document).ready( () => {
//     $("#login_form").on("submit", function(){
//         let form = $(this);

//         $.post(form.attr("action"), $(form).serialize(), (data) => {
//             window.location = "/wall"
//         }, "json");

//         return false;
//     });

//     $("#registration_form").on("submit", function(){
//         let form = $(this);

//         $.post(form.attr("action"), $(form).serialize(), (data) => {
//             if(data.status){
//                 location.reload();
//             }
//             else{
//                 alert(data.error);
//             }
//         }, "json");

//         return false;
//     });
// });