window.onload = function () {
    // Get slug from URL
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("slug");
  
    if (!slug) {
      document.getElementById("post").innerHTML = "<p>Post not found.</p>";
      return;
    }
  
    // Load post from localStorage
    const postData = localStorage.getItem(`post-${slug}`);
    if (!postData) {
      document.getElementById("post").innerHTML = "<p>Post not found.</p>";
      return;
    }
  
    const post = JSON.parse(postData);
  
    // Fill in post
    document.getElementById("post-title").textContent = post.title;
  
    const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
    console.log(post);
    document.getElementById("post-date").textContent = `Posted on ${formattedDate}`;
    document.getElementById("post-description").innerHTML = marked.parse(post.description);
    document.getElementById("post-content").innerHTML = marked.parse(post.content);
  };
  