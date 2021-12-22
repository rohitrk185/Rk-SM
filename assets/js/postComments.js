// {
//     console.log('active-2');
//     let showNoty = (flash) => {
//         if(flash.success && flash.success.length > 0) {
//           new Noty({
//               theme: 'sunset',
//               text: flash.success,
//               type: 'success',
//               layout: 'topRight',
//               timeout: 1500,
//           }).show();
//         }
//         if(flash.error && flash.error.length > 0) {
//           new Noty({
//               theme: 'mint',
//               text: '<%= flash.error %>',
//               type: 'error',
//               layout: 'topRight',
//               timeout: 1500,
//           }).show();
//       }
//     };

//     let createComment = () => {
//         let commentForm = $('#new-comment-form');

//         commentForm.submit((e) => {
//             e.preventDefault();
//             $.ajax({
//                 type: 'post',
//                 url: '/comments/create',
//                 data: commentForm.serialize(),
//                 success: (data) => {
//                     console.log(data.data.comment);
//                     let newComment = newCommentDom(data.data.comment);
//                     $(`#post-comments-${data.data.postId}`).prepend(newComment);
//                     showNoty(data.flash);
//                 }, error: (err) => {
//                     console.log(err.responseText);
//                 }
//             });
//         });
//     };

//     let newCommentDom = (comment) => {
//         return $(`<li>
//             <p>
//                 ${comment[0].content}
//                 <small>
//                     <a href="/comments/delete/${comment[0]._id}">Delete</a>
//                 </small>
//                 <br>
//                 <small>
//                     -${comment[0].user.name}
//                 </small>
//             </p>
//         </li>`);
//     }
//     createComment();

//     console.log('done-2');
// }