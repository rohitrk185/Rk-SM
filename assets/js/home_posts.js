{
    console.log('active-1');

    let commBtns = ()=> {
        let commentBtns = document.querySelectorAll(".comment-toggle-btn");
        // document.
        // console.log(commentBtns);
        for(let i = 0; i < commentBtns.length; i++){
            console.log(i);
            commentBtns[i].addEventListener("click", (e)=>{
                // console.log(commentBtns[i]);
                // console.log(commentBtns[i].parentNode.children[2].nodeName);
                commentBtns[i].parentNode.children[2].classList.contains("hidden") ? commentBtns[i].parentNode.children[2].classList.remove("hidden") : commentBtns[i].parentNode.children[2].classList.add("hidden"); 
            })
        }
    };
    commBtns();

    let showNoty = (flash) => {
        if(flash.success && flash.success.length > 0) {
          new Noty({
              theme: 'sunset',
              text: flash.success,
              type: 'success',
              layout: 'topRight',
              timeout: 1500,
          }).show();
        }
        if(flash.error && flash.error.length > 0) {
          new Noty({
              theme: 'mint',
              text: '<%= flash.error %>',
              type: 'error',
              layout: 'topRight',
              timeout: 1500,
          }).show();
      }
    };


    let createPost = function() {
        let newPostForm = $('#new-post-form');
        
        newPostForm.submit(function(e) {
            e.preventDefault();
            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: newPostForm.serialize(),
                success: function(data) {
                $('#new-post-form textarea').val('');
                    let newPost = newPostDom(data.data.post);
                    $('#posts-list-container > ul').prepend(newPost);
                    deletePost($(' .delete-post-btn', newPost));
                    createComment($(' .comment-form', newPost));
                    showNoty(data.flash);
                    likePost($(' .like-post-btn', newPost));
                    commBtns();
                }, error: function(err) {
                    console.log(err.responseText);
                }
            });
        });        
    };

    //method to create a post in dom
    let newPostDom = (post) => {
        return $(`<li style="text-align: left;" id="post-${post[0]._id}">
        <p> 
          ${post[0].content}
          <br>
          <small style="font-size: 0.7em; color:rgb(20, 20, 20)"> Posted By ${post[0].user.name} </small> 
        </p> 
        <div class="post-comments">
            <small>
                <a href="/likes/toggle/?id=${post[0]._id}&type=Post" class="like-post-btn">Like</a>
                <a class="delete-post-btn" href="/posts/delete/${post[0]._id}">Delete</a>
            </small>

            <button type="button" class="comment-toggle-btn">Comments</button>
          <form action="/comments/create" method="POST" class="comment-form">
            <input type="text" name="content" placeholder="Type Here to add comment..." required>
            <input type="hidden" ,m name="post" value="${post[0]._id}">
            <input type="submit" value="Add Comment">
          </form>
    
          <div class="post-comments-list">
            <ul id="post-comments-${post[0]._id}">
              
            </ul>
          </div>
        </div>
      </li>`);
    }

    let deletePost = (deleteLink) => {
        $(deleteLink).click((e) => {
            e.preventDefault();
            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: (data) => {
                    $(`#post-${data.data.post_id}`).remove();
                    showNoty(data.flash);
                }, error: (err) => {
                    console.log(err.responseText);
                }
            });
        });
    }

    let deleteComment = (deleteLink) => {
        $(deleteLink).click((e) => {
            e.preventDefault();
            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: (data) => {
                    $(`#comment-${data.data.commentId}`).remove();
                    showNoty(data.flash);
                }, error: (err) => {
                    console.log(err.responseText);
                }
            });
        });
    }

	//method to create comment by ajax
    let createComment = (cForm) => {
    //   let commentForms = $('.comment-form');
    //   for(cForm of commentForms) {
        cForm.submit((e) => {
            e.preventDefault();
            $.ajax({
                type: 'post',
                url: '/comments/create',
                data: cForm.serialize(),
                success: (data) => {
                    let newComment = newCommentDom(data.data.comment);
                    $(`#post-comments-${data.data.postId}`).prepend(newComment);
                    deleteComment($(' .comment-del-btn', newComment));
                    showNoty(data.flash);
                }, error: (err) => {
                    console.log(err.responseText);
                }
            });
        });
    };

  let newCommentDom = (comment) => {
      return $(`<li id="comment-${comment[0]._id}">
          <p>
              ${comment[0].content}
              <small>
                  <a class="comment-del-btn" href="/comments/delete/${comment[0]._id}">Delete</a>
              </small>
              <br>
              <small>
                  -${comment[0].user.name}
              </small>
          </p>
      </li>`);
  }

    createPost();
	// createComment();

    let posts = $(' .delete-post-btn');
    for(post of posts) {
        deletePost(post);
    }

    let cForms = $('.comment-form');
    for(cForm of cForms) {
        createComment(cForm);
    }

    let comments = $(' .comment-del-btn');
    for(comment of comments) {
        deleteComment(comment);
    }

    // console.log(commentBtns);
    // const likeBtn = (btn) => {
    //     btn.parentNode.children[2].classList.contains("hidden") ? btn.parentNode.children[2].classList.remove("hidden") : btn.parentNode.children[2].classList.add("hidden"); 
    // }

    
    


    let likePost = (btn) => {
        $(btn).click((e) => {
            e.preventDefault();
            $.ajax({
                type: 'get',
                url:  $(btn).prop('href'),
                success: (data) => {
                    console.log(data.data);
                    let count = parseInt($(btn).prev().text());
                    console.log(count);
                    if(data.data.deleted == true){
                        $(btn).text("Like?")
                        $(btn).css('color','grey');
                        count--;
                    }else{
                        $(btn).text("Liked!")
                        $(btn).css('color','green');
                        count++;
                    }
                    count += count != 1 ? ' likes' : ' like'
                    $(btn).prev().text(count);
                    // window.alert(data.flash.success);
                    // data.deleted ? $(btn).text("Like?") : $(btn).text("Liked!");
                    showNoty(data.flash);
                },
                error: (err) => {
                    console.log("Error while liking post: ", err.responseText);
                    showNoty({'error': "Couldn't like Post!"});
                }
            });
        })
    };

    let likePostBtns = $(' .like-post-btn');
    for(likePostBtn of likePostBtns) {
        likePost(likePostBtn);
    }

    console.log('done');
}