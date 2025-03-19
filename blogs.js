document.addEventListener("DOMContentLoaded", function () {
    function searchBlogs() {
        let searchText = document.getElementById("search").value.toLowerCase();
        let blogs = document.querySelectorAll(".blog");
        
        blogs.forEach(blog => {
            let title = blog.querySelector("h2").innerText.toLowerCase();
            if (title.includes(searchText)) {
                blog.style.display = "block";
            } else {
                blog.style.display = "none";
            }
        });
    }
    
    window.searchBlogs = searchBlogs;
    
    document.querySelectorAll(".blog").forEach(blog => {
        let likeBtn = blog.querySelector(".buttons button:nth-child(1)");
        let dislikeBtn = blog.querySelector(".buttons button:nth-child(2)");
        let commentBox = blog.querySelector(".comment-box textarea");
        let postBtn = blog.querySelector(".comment-box button");
        let commentsContainer = blog.querySelector(".comments");
        let shareBtn = blog.querySelector(".share-btn");

        likeBtn.addEventListener("click", () => {
            likeBtn.innerText = `👍 Like (${parseInt(likeBtn.innerText.match(/\d+/) || 0) + 1})`;
        });

        dislikeBtn.addEventListener("click", () => {
            dislikeBtn.innerText = `👎 Dislike (${parseInt(dislikeBtn.innerText.match(/\d+/) || 0) + 1})`;
        });

        postBtn.addEventListener("click", () => {
            if (commentBox.value.trim() !== "") {
                let commentDiv = document.createElement("div");
                commentDiv.classList.add("comment");
                commentDiv.innerHTML = `<span>${commentBox.value}</span> <button class='delete-btn'>❌</button>`;
                commentsContainer.appendChild(commentDiv);
                commentBox.value = "";

                commentDiv.querySelector(".delete-btn").addEventListener("click", () => {
                    commentDiv.remove();
                });
            }
        });

        shareBtn.addEventListener("click", () => {
            let blogTitle = blog.querySelector("h2").innerText;
            let shareText = `Check out this blog: ${blogTitle} - ${window.location.href}`;
            navigator.clipboard.writeText(shareText).then(() => {
                alert("Blog link copied to clipboard!");
            });
        });
    });
});
