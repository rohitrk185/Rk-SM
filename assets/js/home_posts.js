{
    console.log('active-1');
    // <li id="home-link">
    //     <a href="/"> Home </a> 
    // </li>
    $("#home-link a").removeAttr('href');
    $("#home-link a").removeClass('hover');

    let clickCommBtn = (commBtn) => {
        $(commBtn).click((e)=>{
            console.log('click')
            // console.log(commentBtns[i]);
            // console.log(commentBtns[i].parentNode.children[2].nodeName);
            // commBtn.parentNode.parentNode.children[1].classList.contains("hidden") ? commBtn.parentNode.parentNode.children[1].classList.remove("hidden") : commBtn.parentNode.parentNode.children[1].classList.add("hidden");
            $(commBtn).parent().parent().children(".comments-container").hasClass("hidden") ? $(commBtn).parent().parent().children(".comments-container").removeClass("hidden") : $(commBtn).parent().parent().children(".comments-container").addClass("hidden"); 
        })
    };

    let commBtns = ()=> {
        let commentBtns = $(" .comment-toggle-btn");
        for(let btn of commentBtns) {
            clickCommBtn(btn);
        }   
        // document.
        // console.log(commentBtns);
        // for(let i = 0; i < commentBtns.length; i++){
            // console.log(i);
            // clickCommBtn(commentBtns[i]);
            // commentBtns[i].addEventListener("click", (e)=>{
            //     console.log('click')
            //     // console.log(commentBtns[i]);
            //     // console.log(commentBtns[i].parentNode.children[2].nodeName);
            //     commentBtns[i].parentNode.parentNode.children[1].classList.contains("hidden") ? commentBtns[i].parentNode.parentNode.children[1].classList.remove("hidden") : commentBtns[i].parentNode.parentNode.children[1].classList.add("hidden"); 
            // })
        // }
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
                    // commBtns();
                    clickCommBtn($(" .comment-toggle-btn", newPost));
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
            <small class="post-options">
                <span class="likes-count" style="display: block;">0 likes</span>
                <a href="/likes/toggle/?id=${post[0]._id}&type=Post" class="like-post-btn" style="color: rgb(114, 114, 114)">Like</a>
                <a class="delete-post-btn" href="/posts/delete/${post[0]._id}">Delete</a>
                <button type="button" class="comment-toggle-btn">Comments</button>
            </small>
            <div class="comments-container hidden">
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
    //   let commentForms = $('.comment-form');
    //   for(cForm of commentForms) {
    let createComment = (cForm) => {
        $(cForm).submit((e) => {
            e.preventDefault();
            $.ajax({
                type: 'post',
                url: '/comments/create',
                data: $(cForm).serialize(),
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
      return $(`<li id="comment-${comment._id}">
          <p>
              ${comment.content}
              <small>
                  <a class="comment-del-btn" href="/comments/delete/${comment._id}">Delete</a>
              </small>
              <br>
              <small>
                  -${comment.user.name}
              </small>
          </p>
      </li>`);
  }

    createPost();
	// createComment();

    let posts = $(' .delete-post-btn');
    for(let post of posts) {
        deletePost(post);
    }

    let cForms = $('.comment-form');
    for(cForm of cForms) {
        console.log(cForm);
        createComment(cForm);
    }

    let comments = $(' .comment-del-btn');
    for(let comment of comments) {
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

    let likeComment = (btn) => {
        $(btn).click((e) => {
            e.preventDefault();
            $.ajax({
                type: 'get',
                url:  $(btn).prop('href'),
                success: (data) => {
                    console.log(data.data);
                    let count = parseInt($(btn).parent().prev().text());
                    console.log($(btn).parent().prev().text());
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
                    if(count < 0) {
                        count = 0;
                    }
                    count += count != 1 ? ' likes' : ' like';
                    $(btn).parent().prev().text(count);
                    showNoty(data.flash);
                },
                error: (err) => {
                    console.log("Error while liking Comment: ", err.responseText);
                    showNoty({'error': "Couldn't like Comment!"});
                }
            });
        })
    };

    let likeCommBtns = $(' .like-comment-btn');
    for(likeCommBtn of likeCommBtns){
        likeComment(likeCommBtn);
    }

    console.log('done');
}