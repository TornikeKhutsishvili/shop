class Product {
    constructor(productname, description, price, relasedate, duration, category) {
        this.productname = productname
        this.description = description
        this.price = parseFloat(price)
        this.relasedate = relasedate
        this.duration = duration
        this.category = category
    }
}

const pname = document.querySelector(".pname")
const description = document.querySelector(".description")
const price = document.querySelector(".price")
const relasedate = document.querySelector(".rdate")
const duration = document.querySelector(".duration")
const category = document.querySelector(".category")
const save = document.querySelector(".save")
const tb = document.querySelector(".tb")
const filterCategory = document.querySelector(".filtercategory")
const filterSelect = document.querySelector(".filterselect")

let allProducts = []
let foods = []
let drinks = []
let editIndex = null

// Retrieve from localStorage
window.addEventListener('DOMContentLoaded', function () {
    const storedProducts = JSON.parse(localStorage.getItem('products')) || []

    allProducts = storedProducts.map(prod => new Product(
        prod.productname, prod.description, prod.price,
        prod.relasedate, prod.duration, prod.category
    ))

    categorizeProducts()
    renderTable(allProducts)
})

// Add a new product or update an existing one
save.addEventListener("click", function () {
    if (
        pname.value.trim() === "" || description.value.trim() === "" ||
        price.value.trim() === "" || category.value === ""
    ) {
        alert("Please fill all the required fields!")
        return
    }

    if (editIndex === null) {
        let obj = new Product(
            pname.value, description.value, price.value,
            relasedate.value, duration.value, category.value
        )
        allProducts.push(obj)
    } else {
        allProducts[editIndex] = new Product(
            pname.value, description.value, price.value,
            relasedate.value, duration.value, category.value
        )
        editIndex = null
        save.innerText = "Save Product"
    }

    clearForm()
    saveToLocalStorage()
    categorizeProducts()
    renderTable(allProducts)
})

// Category filter
filterCategory.addEventListener("change", () => filterAndSort())
// Sorting
filterSelect.addEventListener("change", () => filterAndSort())

// Edit Product
function editProduct(index) {
    let prod = allProducts[index]

    pname.value = prod.productname
    description.value = prod.description
    price.value = prod.price
    relasedate.value = prod.relasedate
    duration.value = prod.duration
    category.value = prod.category

    editIndex = index
    save.innerText = "Update Product"
}

// Delete Product
function deleteProduct(index) {
    if (confirm("Are you sure you want to delete this product?")) {
        allProducts.splice(index, 1)
        saveToLocalStorage()
        categorizeProducts()
        renderTable(allProducts)
    }
}

// Render Table
function renderTable(products) {
    tb.innerHTML = ""

    for (let [index, i] of products.entries()) {
        tb.innerHTML += `
            <tr>
                <td>${i.productname}</td>
                <td>${i.description}</td>
                <td>${i.price} Gel</td>
                <td>${i.relasedate}</td>
                <td>${i.duration}</td>
                <td>${i.category}</td>
                <td>
                    <button class="btn btn-primary btn-sm me-2" onclick="editProduct(${index})">
                        Edit
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="deleteProduct(${index})">
                        Delete
                    </button>
                </td>
            </tr>
        `
    }
}

// Categorization
function categorizeProducts() {
    foods = allProducts.filter(p => p.category === "food")
    drinks = allProducts.filter(p => p.category === "drink")
}

// Save to localStorage
function saveToLocalStorage() {
    localStorage.setItem('products', JSON.stringify(allProducts))
}

// Clear the form
function clearForm() {
    pname.value = ""
    description.value = ""
    price.value = ""
    relasedate.value = ""
    duration.value = ""
    category.value = ""
}

// Filter + Sort together
function filterAndSort() {
    let selectedCategory = filterCategory.value
    let filteredArray = selectedCategory === "drink"
        ? drinks : selectedCategory === "food"
        ? foods : [...allProducts]
    let sortType = filterSelect.value

    if (sortType === "price" || sortType === "MinPrice") {
        filteredArray.sort((a, b) => a.price - b.price)
    } else if (sortType === "MaxPrice") {
        filteredArray.sort((a, b) => b.price - a.price)
    } else if (sortType === "release") {
        filteredArray.sort((a, b) => new Date(a.relasedate) - new Date(b.relasedate))
    } else if (sortType === "end") {
        filteredArray.sort((a, b) => new Date(a.duration) - new Date(b.duration))
    }

    renderTable(filteredArray)
}
