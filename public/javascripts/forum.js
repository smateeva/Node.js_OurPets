// public/js/forum.js
const ws = new WebSocket('ws://localhost:3000'); // Adjust the URL/port as needed

ws.onopen = () => {
  console.log('Connected to the server');
};

ws.onmessage = (event) => {
    const { type, posts, post } = JSON.parse(event.data);
  
    switch (type) {
      case 'existingPosts':
        posts.forEach((post) => displayPost(post));
        break;
      case 'newPost':
        displayPost(post);
        break;
      default:
        console.log('Unknown message type:', type);
    }
  };
  
  function displayPost(post) {
    const postsContainer = document.getElementById('postsContainer');
    const postElement = document.createElement('div');
    postElement.textContent = post.content; // Consider more complex formatting
    postsContainer.prepend(postElement);
  }
  
  function sendPost(content) {
    ws.send(JSON.stringify({ content }));
  }
  