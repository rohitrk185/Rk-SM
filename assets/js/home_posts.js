{
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
        // if(flash.success && flash.success.length > 0) {
        //     new Noty({
        //         theme: 'sunset',
        //         text: '<%= flash.success %>',
        //         type: 'success',
        //         layout: 'topRight',
        //         timeout: 1500,
        //     }).show();
        // }

        // if(flash.error && flash.error.length > 0) {
        //     new Noty({
        //         theme: 'mint',
        //         text: '<%= flash.error %>',
        //         type: 'error',
        //         layout: 'topRight',
        //         timeout: 2000,
        //     }).show();
        // }


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
                    // console.log($(' .delete-post-btn'));
                    deletePost($(' .delete-post-btn', newPost));
                    console.log(data.flash);
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
          <form action="/comments/create" method="POST">
            <input type="text" name="content" placeholder="Type Here to add comment..."">
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

    //method to  delete a post from DOM
    let deletePost = (deleteLink) => {
        $(deleteLink).click((e) => {
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: (data) => {
                    $(`#post-${data.data.post_id}`).remove();
                    showNoty(data.flash);
                }, error:(err) => {
                    console.log(err.responseText);
                }
            });
        });
    };


    createPost();

    let posts = $(' .delete-post-btn');
    for(post of posts) {
        deletePost(post);
    }
    console.log('done');
}