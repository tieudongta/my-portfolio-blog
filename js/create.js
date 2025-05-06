function login() {
    const password = document.getElementById('auth').value;
  
    // Simple password check (you can change this to something secret)
    if (password === "letmein") {
      document.getElementById('auth-section').style.display = "none";
      document.getElementById('post-form').style.display = "block";
    } else {
      alert("Incorrect password. Try again.");
    }
  }
  
  function savePost() {
    const title = document.getElementById('title').value;
    const desc = document.getElementById('desc').value;
    const content = document.getElementById('content').value;
    const slug = title.toLowerCase().replace(/\s+/g, '-');
    const date = new Date().toISOString();
  
    const post = {
      title,
      description: desc,
      content,
      date,
    };
  
    // Save to localStorage for now
    localStorage.setItem(`post-${slug}`, JSON.stringify(post));
    alert("Post saved! Go to blog.html to see it.");
    window.location.href = "blog.html";
  }
  function updatePreview() {
    const content = document.getElementById('content').value;
    const html = marked.parse(content);
    document.getElementById('preview').innerHTML = html;
  }
  