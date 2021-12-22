{
    console.log('active-1');
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
                    let newPost = newPostDom(data.data.post);
                    $('#posts-list-container > ul').prepend(newPost);
                    deletePost($(' .delete-post-btn', newPost));
                    createComment($(' .comment-form', newPost));
                    showNoty(data.flash);
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
    
          <small>
            <a class="delete-post-btn" href="/posts/delete/${post[0]._id}">Delete</a>
          </small>
          
          <br>
          <small style="font-size: 0.7em; color:rgb(20, 20, 20)"> Posted By ${post[0].user.name} </small> 
        </p> 
        <div class="post-comments">
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

    console.log('done-1');
}