document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search');
    const bookList = document.getElementById('book-list');
    const bookDetails = document.getElementById('book-details');
    const favoritesList = document.getElementById('favorites-list');
  
    let favoriteBooks = [];
  
    // Fetch books from API
    const fetchBooks = (query = '') => {
      fetch(`http://localhost:3000/books?q=${query}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          console.log(data); // Log the API response to inspect it
          displayBooks(data);
        })
        .catch(error => console.error('Error fetching books:', error));
    };
  
    // Display books in the list
    const displayBooks = (books) => {
      bookList.innerHTML = '';
      books.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        bookCard.innerHTML = `
          <img src="${book.image}" alt="${book.title}">
          <div>
            <h3>${book.title}</h3>
            <p>${book.author}</p>
          </div>
        `;
        bookList.appendChild(bookCard);
  
        bookCard.addEventListener('click', () => displayBookDetails(book));
      });
    };
  
    // Display book details
    const displayBookDetails = (book) => {
      bookDetails.innerHTML = `
        <h2>${book.title}</h2>
        <img src="${book.image}" alt="${book.title}">
        <p><strong>Author:</strong> ${book.author}</p>
        <p><strong>Published Date:</strong> ${book.published}</p>
        <p><strong>Description:</strong> ${book.description}</p>
        <p><strong>Rating:</strong> ${book.rating || 'N/A'}</p>
        <button id="addToFavorites">Add to Favorites</button>
        <div>
          <label for="rating">Rate this book:</label>
          <input type="number" id="rating" name="rating" min="1" max="5">
          <button id="rate-book">Rate</button>
        </div>
      `;
      updateFavoriteButton(book);
      document.getElementById('addToFavorites').addEventListener('click', () => addToFavorites(book));
      document.getElementById('rate-book').addEventListener('click', () => rateBook(book));
    };
  
    // Update add/remove from favorites buttons based on book's status
    const updateFavoriteButton = (book) => {
      const addToFavoritesBtn = document.getElementById('addToFavorites');
  
      if (favoriteBooks.some(fav => fav.id === book.id)) {
        addToFavoritesBtn.style.display = 'none';
        displayRemoveFromFavoritesButton(book);
      } else {
        addToFavoritesBtn.style.display = 'block';
        hideRemoveFromFavoritesButton();
      }
    };
  

  
    // Hide remove from favorites button
    const hideRemoveFromFavoritesButton = () => {
      const removeFromFavoritesBtn = document.getElementById('removeFromFavorites');
      if (removeFromFavoritesBtn) {
        removeFromFavoritesBtn.remove();
      }
    };
  
    // Add book to favorites
    const addToFavorites = (book) => {
      if (!favoriteBooks.some(fav => fav.id === book.id)) {
        favoriteBooks.push(book);
        updateFavorites();
        displayBookDetails(book); // Update book details to show 'Remove from Favorites' button
      }
    };
  
    // Remove book from favorites
    const removeFromFavorites = (book) => {
      favoriteBooks = favoriteBooks.filter(fav => fav.id !== book.id);
      updateFavorites();
      displayBookDetails(book); // Update book details to hide 'Remove from Favorites' button
    };
  
    // Rate a book
    const rateBook = (book) => {
      const rating = document.getElementById('rating').value;
      book.rating = rating;
      displayBookDetails(book);
    };
  
    // Update favorites list
    const updateFavorites = () => {
      favoritesList.innerHTML = '<h2>Favorite Books</h2>';
      if (favoriteBooks.length === 0) {
        favoritesList.innerHTML += '<p>No favorite books added yet.</p>';
      } else {
        favoriteBooks.forEach(book => {
          const favoriteItem = document.createElement('li');
          favoriteItem.textContent = book.title;
          
          const removeFromFavoritesBtn = document.createElement('button');
          removeFromFavoritesBtn.textContent = 'Remove';
          removeFromFavoritesBtn.addEventListener('click', () => removeFromFavorites(book));
          favoriteItem.appendChild(removeFromFavoritesBtn);
  
          favoritesList.appendChild(favoriteItem);
        });
      }
    };
  
    // Event listener for search input
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.trim();
      fetchBooks(query);
    });
  
    // Initial fetch to display some books
    fetchBooks();
  });
  