let allProducts = [];
let filteredProducts = [];
let currentIndex = 0;
const itemsPerPage = 10;

fetch('https://fakestoreapi.com/products')
    .then(response => response.json())
    .then(products => {
        allProducts = products;
        filteredProducts = products;
        displayProducts();

        const categories = [...new Set(products.map(product => product.category))];

        const filtersContainer = document.getElementById('category-filters');
        categories.forEach(category => {
            const filterItem = document.createElement('div');

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = category;
            checkbox.id = category;
            checkbox.addEventListener('change', handleCategoryFilter);

            const label = document.createElement('label');
            label.htmlFor = category;
            label.innerText = category;

            filterItem.appendChild(checkbox);
            filterItem.appendChild(label);

            filtersContainer.appendChild(filterItem);
        });
    })
    .catch(error => console.error('Error fetching products:', error));

function displayProducts() {
    const container = document.getElementById('products-container');
    const resultsCount = document.getElementById('results-count');

    const productsToDisplay = filteredProducts.slice(currentIndex, currentIndex + itemsPerPage);
    productsToDisplay.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product-item');
        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.title}" width="100">
            <h4>${product.title}</h4>
            <p>$${product.price}</p>
        `;
        container.appendChild(productDiv);
    });

    currentIndex += itemsPerPage;

    resultsCount.innerText = `${filteredProducts.length} Results`;

    if (currentIndex >= filteredProducts.length) {
        document.getElementById('load-more-button').style.display = 'none';
    }
}

function handleCategoryFilter() {
    const checkedCategories = Array.from(document.querySelectorAll('#category-filters input:checked'))
        .map(checkbox => checkbox.value);

    if (checkedCategories.length > 0) {
        filteredProducts = allProducts.filter(product => checkedCategories.includes(product.category));
    } else {
        filteredProducts = allProducts;
    }

    currentIndex = 0;
    document.getElementById('products-container').innerHTML = '';
    document.getElementById('load-more-button').style.display = 'block';
    displayProducts();
}

document.getElementById('sort-price').addEventListener('change', (event) => {
    const sortOption = event.target.value;

    if (sortOption === 'low-to-high') {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'high-to-low') {
        filteredProducts.sort((a, b) => b.price - a.price);
    }

    currentIndex = 0;
    document.getElementById('products-container').innerHTML = '';
    document.getElementById('load-more-button').style.display = 'block';
    displayProducts();
});

document.getElementById('load-more-button').addEventListener('click', () => {
    displayProducts();
});

document.getElementById('search-input').addEventListener('input', (event) => {
    const searchTerm = event.target.value.toLowerCase();

    filteredProducts = allProducts.filter(product => 
        product.title.toLowerCase().includes(searchTerm)
    );

    currentIndex = 0;
    document.getElementById('products-container').innerHTML = '';
    document.getElementById('load-more-button').style.display = 'block';
    displayProducts();
});
