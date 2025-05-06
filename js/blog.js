window.onload = function () {
    // Show Create or Login button based on auth
    // Show Create or Login button based on auth
const actionButton = document.getElementById('action-button');
actionButton.innerHTML = ""; // clear first

if (localStorage.getItem('loggedIn') === 'true') {
  // Create Post Link
  const createLink = document.createElement('a');
  createLink.href = "create.html";
  createLink.textContent = "➕ New Post";
  //createLink.className = "button"; // optional styling
  actionButton.appendChild(createLink);

  // Spacer
  actionButton.appendChild(document.createTextNode(" "));

  // Logout Link
  const logoutLink = document.createElement('a');
  logoutLink.href = "#";
  logoutLink.textContent = "🚪 Logout";
  //logoutLink.className = "button"; // optional styling
  logoutLink.onclick = () => {
    localStorage.removeItem('loggedIn');
    location.reload();
  };
  actionButton.appendChild(logoutLink);
} else {
  // Show Login Link
  const loginLink = document.createElement('a');
  loginLink.href = "login.html";
  loginLink.textContent = "🔐 Author login";
  //loginLink.className = "button";
  actionButton.appendChild(loginLink);
}

    const postList = document.getElementById('post-list');
    const posts = [];
  
    // Loop through localStorage to get saved posts
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith("post-")) {
        const post = JSON.parse(localStorage.getItem(key));
        const slug = key.replace("post-", "");
        post.slug = slug;
        posts.push(post);
      }
    }
  
    // Sort posts by date (most recent first)
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));
  
    // Render posts
    const deletedPosts = JSON.parse(localStorage.getItem('deletedPosts') || '[]');

posts.forEach(post => {
  if (deletedPosts.includes(post.slug)) return; // Skip deleted posts

  const postCard = document.createElement("article");
  postCard.className = "blog-post";
  postCard.innerHTML = `
    <h3><a href="post.html?slug=${post.slug}">${post.title}</a></h3>
    <p class="date">Posted on ${new Date(post.date).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    })}</p>
    <p>${post.description}</p>
    <a href="post.html?slug=${post.slug}" class="button">Read more</a>
  `;

  // Optional: Add delete button if logged in
  if (localStorage.getItem('loggedIn') === 'true') {
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = "🗑️ Delete";
    deleteBtn.onclick = () => {
      if (confirm(`Delete "${post.title}"?`)) {
        deletedPosts.push(post.slug);
        localStorage.setItem('deletedPosts', JSON.stringify(deletedPosts));
        location.reload(); // Refresh the list
      }
    };
    postCard.appendChild(deleteBtn);
  }

  postList.appendChild(postCard);
});

    // Render posts
//     posts.forEach(post => {
//     const postCard = document.createElement("article");
//     postCard.className = "blog-post";
//     const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
//         year: "numeric",
//         month: "long",
//         day: "numeric"
//       });
//     postCard.innerHTML = `
//       <h3><a href="post.html?slug=${post.slug}">${post.title}</a></h3>
//       <p class="date">Posted on ${formattedDate}</p>
//       <p>${post.description}</p>
//       <a class="button" href="post.html?slug=${post.slug}">Read more</a>
//     `;
  
//     postList.appendChild(postCard);
//   });
  
  };
  