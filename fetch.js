document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search');
    const searchButton = document.getElementById('go');
    const postContainer = document.getElementById('post');
    const paginationContainer = document.getElementById('pagination');
    let posts = [];
    let filteredPosts = [];
    let currentPage = 1;
    const postsPerPage = 12;

    const displayPosts = (postsToDisplay, page = 1) => {
        postContainer.innerHTML = ''; 

        if (postsToDisplay.length === 0) {
            postContainer.innerHTML = '<p class="no-results">Нет результатов</p>';
            return;
        }

        const startIndex = (page - 1) * postsPerPage;
        const endIndex = startIndex + postsPerPage;
        const postsToShow = postsToDisplay.slice(startIndex, endIndex);

        postsToShow.forEach(post => {
            const postElement = document.createElement('div');
            postElement.classList.add('post');
            postElement.innerHTML = `
                <a href="/${post.link}">
                    <img src="${post.image}" alt="${post.title}">
                    <h3>${post.title}</h3>
                </a>
            `;
            postContainer.appendChild(postElement);
        });

        updatePagination(postsToDisplay.length);
    };

    const updatePagination = (totalPosts) => {
        paginationContainer.innerHTML = '';
        const totalPages = Math.ceil(totalPosts / postsPerPage);

        if (totalPages <= 1) return; // No pagination needed for 1 page

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.textContent = i;
            pageButton.classList.add('page');
            if (i === currentPage) pageButton.classList.add('in');
            pageButton.addEventListener('click', () => {
                currentPage = i;
                displayPosts(filteredPosts, currentPage);
            });
            paginationContainer.appendChild(pageButton);
        }
    };

    const filterPosts = () => {
        const query = searchInput.value.trim().toLowerCase();
        filteredPosts = posts.filter(post =>
            post.title.toLowerCase().includes(query) 
        );
        currentPage = 1;
        displayPosts(filteredPosts, currentPage);

        if (query) {
            addClearButton();
        } else {
            removeClearButton();
        }
    };

    const addClearButton = () => {
        if (!document.querySelector('.clear')) {
            const clearButton = document.createElement('button');
            clearButton.className = 'clear';
            clearButton.textContent = '×';
            document.querySelector('.search').appendChild(clearButton);

            clearButton.addEventListener('click', () => {
                searchInput.value = ''; 
                removeClearButton();
                filteredPosts = posts;
                currentPage = 1; 
                displayPosts(filteredPosts, currentPage);
            });
        }
    };

    const removeClearButton = () => {
        const clearButton = document.querySelector('.clear');
        if (clearButton) {
            clearButton.remove();
        }
    };

    searchButton.addEventListener('click', filterPosts);

    fetch('post.json')
        .then(response => response.json())
        .then(data => {
            posts = data.all;
            filteredPosts = posts;
            displayPosts(filteredPosts); 
        })
        .catch(error => console.error('Ошибка при загрузке данных:', error));
});
