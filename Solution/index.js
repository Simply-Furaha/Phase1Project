document.addEventListener('DOMContentLoaded', () => {
    const bookList = document.getElementById('book-list');
    const bookDetails = document.getElementById('book-details');
    const favoritesList = document.getElementById('favorites-list');

    let favoriteBooks = [];

    // Fetch books from url served
    const fetchBooks = (query = '') => {
        fetch(`http://localhost:3000/books?q=${query}`)
            .then(response => response.json())
            .then(data => displayBooks(data))
            .catch(error => console.error('Error fetching books:', error));
    };

    // Fetching favorites from my fav end point
    const fetchFavorites = () => {
        fetch('http://localhost:3000/favorites')
            .then(response => response.json())
            .then(favorites => {
                favoriteBooks = favorites;
                displayFavorites(favorites);
            })
            .catch(error => console.error('Error fetching favorites:', error));
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

    // Displaying book deets
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
        document.getElementById('addToFavorites').addEventListener('click', () => addToFavorites(book));
        document.getElementById('rate-book').addEventListener('click', () => rateBook(book));
    };

    // Addinf book to favs
    const addToFavorites = (book) => {
        if (!favoriteBooks.some(fav => fav.id === book.id)) {
            fetch('http://localhost:3000/favorites', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(book),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to add book to favorites in database');
                }
                return response.json();
            })
            .then(() => fetchFavorites())
            .catch(error => console.error('Error adding book to favorites:', error));
        }
    };

    // Rm from favs both json & UI
    const removeFromFavorites = (book) => {
        fetch(`http://localhost:3000/favorites/${book.id}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to remove book from favorites in database');
            }
            return response.json();
        })
        .then(() => fetchFavorites())
        .catch(error => console.error('Error removing book from favorites:', error));
    };

    // Rating
    const rateBook = (book) => {
        const rating = document.getElementById('rating').value;
        book.rating = rating;

        fetch(`http://localhost:3000/books/${book.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ rating }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update book rating in database');
            }
            return response.json();
        })
        .then(() => displayBookDetails(book))
        .catch(error => console.error('Error updating book rating:', error));
    };

    // List of favs Disp
    const displayFavorites = (favorites) => {
        favoritesList.innerHTML = '<h2>Favorite Books</h2>';
        if (favorites.length === 0) {
            favoritesList.innerHTML += '<p>No favorite books added yet.</p>';
        } else {
            favorites.forEach(book => {
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

    // func calls
    fetchBooks();
    fetchFavorites();
});
