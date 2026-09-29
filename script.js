console.log("script.js loaded");

const API_URL = const API_URL = "https://lost-found-portal-1-8p14.onrender.com/api";


document.addEventListener("DOMContentLoaded", function () {

    console.log("Page loaded:", window.location.pathname);

    loadTheme();

    loadWelcomeCard();

   loadRecentPosts();

    setupRegister();

    setupLogin();

    setupLostForm();

    setupFoundForm();

    loadProfile();

    loadProfileStatistics();

    loadMyPosts();

    loadStatistics();

    loadAllPosts();

    loadAdminDashboard();

    loadAdminUsers();

    checkProtectedPage();

    const role =
        localStorage.getItem("userRole");

    const adminLink =
        document.getElementById("adminLink");

    if (
        adminLink &&
        role !== "admin"
    ) {
        adminLink.style.display = "none";
    }

});

// ======================================================
// DARK MODE
// ======================================================

function toggleTheme() {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {

        localStorage.setItem("theme", "dark");

    } else {

        localStorage.setItem("theme", "light");

    }

}


function loadTheme() {

    if (localStorage.getItem("theme") === "dark") {

        document.body.classList.add("dark");

    }

}


// ======================================================
// SEARCH
// ======================================================

function searchItems() {

    const searchInput =
        document.getElementById("searchInput");

    if (!searchInput) return;

    const input =
        searchInput.value.toLowerCase();

    const cards =
        document.querySelectorAll(".item-card");

    cards.forEach(function (card) {

        const text =
            card.innerText.toLowerCase();

        if (text.includes(input)) {

            card.style.display = "block";

        } else {

            card.style.display = "none";

        }

    });

}
// ======================================================
// SEARCH & FILTER ITEMS
// ======================================================

function filterItems() {

    const searchInput =
        document.getElementById("searchInput");

    const categoryFilter =
        document.getElementById("categoryFilter");

    const typeFilter =
        document.getElementById("typeFilter");

    const statusFilter =
        document.getElementById("statusFilter");


    const searchText =
        searchInput
            ? searchInput.value.trim().toLowerCase()
            : "";


    const selectedCategory =
        categoryFilter
            ? categoryFilter.value.trim().toLowerCase()
            : "all";


    const selectedType =
        typeFilter
            ? typeFilter.value.trim().toLowerCase()
            : "all";


    const selectedStatus =
        statusFilter
            ? statusFilter.value.trim().toLowerCase()
            : "all";


    const cards =
        document.querySelectorAll(
            "#itemsContainer .item-card"
        );


    console.log("Filtering:", {
        searchText,
        selectedCategory,
        selectedType,
        selectedStatus,
        cardsFound: cards.length
    });


    let visibleCount = 0;


    cards.forEach(function (card) {

        const title =
            (
                card.dataset.title || ""
            ).trim().toLowerCase();


        const category =
            (
                card.dataset.category || ""
            ).trim().toLowerCase();


        const type =
            (
                card.dataset.type || ""
            ).trim().toLowerCase();


        const recovered =
            String(
                card.dataset.recovered
            ).toLowerCase() === "true";


        // Search
        const matchesSearch =
            searchText === "" ||
            title.includes(searchText);


        // Category
        const matchesCategory =
            selectedCategory === "all" ||
            category.includes(
                selectedCategory
            );


        // Lost / Found
        const matchesType =
            selectedType === "all" ||
            type === selectedType;


        // Status
        let matchesStatus = true;


        if (
            selectedStatus === "recovered"
        ) {

            matchesStatus =
                recovered;

        }


        if (
            selectedStatus === "pending"
        ) {

            matchesStatus =
                !recovered;

        }


        const shouldShow =
            matchesSearch &&
            matchesCategory &&
            matchesType &&
            matchesStatus;


        if (shouldShow) {

            card.style.display = "";

            visibleCount++;

        } else {

            card.style.display = "none";

        }

    });


    // ==============================================
    // NO RESULTS MESSAGE
    // ==============================================

    let noResults =
        document.getElementById(
            "noResultsMessage"
        );


    if (!noResults) {

        noResults =
            document.createElement("h3");

        noResults.id =
            "noResultsMessage";

        noResults.style.textAlign =
            "center";

        noResults.style.margin =
            "30px";

        noResults.innerText =
            "No matching items found.";

        const container =
            document.getElementById(
                "itemsContainer"
            );

        if (container) {

            container.appendChild(
                noResults
            );

        }

    }


    if (visibleCount === 0) {

        noResults.style.display =
            "block";

    } else {

        noResults.style.display =
            "none";

    }


    console.log(
        "Visible items:",
        visibleCount
    );

}
// ======================================================
// IMAGE PREVIEW
// ======================================================

function previewImage(event) {

    const preview =
        document.getElementById("preview");

    if (!preview) return;

    if (
        event.target.files &&
        event.target.files[0]
    ) {

        preview.src =
            URL.createObjectURL(
                event.target.files[0]
            );

        preview.style.display = "block";

    }

}


// ======================================================
// CONTACT OWNER
// ======================================================

function contactOwner() {

    alert(
        "Owner Contact Number: +91 9876543210"
    );

}


// ======================================================
// REGISTER
// ======================================================

function setupRegister() {

    const registerForm =
        document.getElementById(
            "registerForm"
        );

    if (!registerForm) return;


    registerForm.addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();

            console.log("Register form submitted");


            const name =
                document.getElementById(
                    "name"
                ).value.trim();


            const email =
                document.getElementById(
                    "email"
                ).value.trim();

            const phone =
                 document.getElementById("phone").value;
            
                 const password =
                document.getElementById(
                    "password"
                ).value;


            try {

                const response =
                    await fetch(
                        `${API_URL}/auth/register`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                name: name,
                                email: email,
                                phone: phone,
                                password: password
                            })
                        }
                    );


                const data =
                    await response.json();


                console.log(
                    "Register response:",
                    data
                );


                if (!response.ok) {

                    alert(
                        data.message ||
                        "Registration Failed"
                    );

                    return;

                }


                alert(
                    "Registration Successful"
                );


                window.location.href =
                    "login.html";


            } catch (error) {

                console.error(
                    "Registration Error:",
                    error
                );

                alert(
                    "Cannot connect to server"
                );

            }

        }
    );

}


// ======================================================
// LOGIN
// ======================================================

function setupLogin() {

    const loginForm =
        document.getElementById(
            "loginForm"
        );

    if (!loginForm) return;


    loginForm.addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();

            console.log("Login form submitted");


            const email =
                document.getElementById(
                    "loginEmail"
                ).value.trim();


            const password =
                document.getElementById(
                    "loginPassword"
                ).value;


            try {

                const response =
                    await fetch(
                        `${API_URL}/auth/login`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                email: email,
                                password: password
                            })
                        }
                    );


                const data =
                    await response.json();


                console.log(
                    "Login response:",
                    data
                );


                if (!response.ok) {

                    alert(
                        data.message ||
                        "Invalid Credentials"
                    );

                    return;

                }


                if (!data.token) {

                    alert(
                        "Login failed: Token not received"
                    );

                    return;

                }


                // Save token
                localStorage.setItem(
                    "token",
                    data.token
                );


                // Save login status
                localStorage.setItem(
                    "isLoggedIn",
                    "true"
                );


                // Save email
                localStorage.setItem(
                    "currentUserEmail",
                    email
                );


                // Try to read role from JWT
                try {

                    const payload =
                        JSON.parse(
                            atob(
                                data.token
                                    .split(".")[1]
                            )
                        );


                    if (
                        payload.user &&
                        payload.user.role
                    ) {

                        localStorage.setItem(
                            "userRole",
                            payload.user.role
                        );

                    }

                } catch (error) {

                    console.log(
                        "Could not read JWT role"
                    );

                }


                console.log(
                    "Token saved successfully"
                );


                alert(
                    "Login Successful"
                );


                window.location.href =
                    "dashboard.html";


            } catch (error) {

                console.error(
                    "Login Error:",
                    error
                );

                alert(
                    "Cannot connect to server"
                );

            }

        }
    );

}

// ======================================================
// PROFILE
// ======================================================

async function loadProfile() {

    const profileName =
        document.getElementById(
            "profileName"
        );

    const profileEmail =
        document.getElementById(
            "profileEmail"
        );


    if (
        !profileName &&
        !profileEmail
    ) {
        return;
    }


    const token =
        localStorage.getItem("token");


    if (!token) {

        alert(
            "Please login first"
        );

        window.location.href =
            "login.html";

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/auth/profile`,
                {

                    method: "GET",

                    headers: {

                        "Authorization":
                            "Bearer " + token

                    }

                }
            );


        const user =
            await response.json();


        console.log(
            "Profile:",
            user
        );


        if (!response.ok) {

            throw new Error(
                user.message ||
                "Profile loading failed"
            );

        }


        if (profileName) {

            profileName.innerHTML =
                "<strong>Name:</strong> " +
                user.name;

        }


        if (profileEmail) {

            profileEmail.innerHTML =
                "<strong>Email:</strong> " +
                user.email;

        }


    } catch (error) {

        console.error(
            "Profile Error:",
            error
        );

        profileName.innerHTML =
            "Unable to load profile.";

    }

}
// ======================================================
// PROFILE STATISTICS
// ======================================================

async function loadProfileStatistics() {

    console.log("Loading Profile Statistics...");
    const totalPosts =
        document.getElementById("totalPosts");

    if (!totalPosts) return;

    const token =
        localStorage.getItem("token");

    try {

        const response =
            await fetch(
                `${API_URL}/posts/my`,
                {
                    headers: {
                        Authorization:
                            "Bearer " + token
                    }
                }
            );

        const items =
            await response.json();

        document.getElementById(
            "totalPosts"
        ).innerText = items.length;

        document.getElementById(
            "lostPosts"
        ).innerText =
            items.filter(
                item =>
                item.type.toLowerCase() === "lost"
            ).length;

        document.getElementById(
            "foundPosts"
        ).innerText =
            items.filter(
                item =>
                item.type.toLowerCase() === "found"
            ).length;

        document.getElementById(
            "recoveredPosts"
        ).innerText =
            items.filter(
                item =>
                item.recovered === true
            ).length;

    } catch (error) {

        console.error(
            "Profile Statistics Error:",
            error
        );

    }

}
// ======================================================
// FOUND ITEM
// ======================================================

function setupFoundForm() {

    const foundForm =
        document.getElementById("foundForm");

    if (!foundForm) return;


    foundForm.addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();


            const token =
                localStorage.getItem("token");


            if (!token) {

                alert("Please login first");

                window.location.href =
                    "login.html";

                return;

            }


            const formData =
                new FormData();


            formData.append(
                "type",
                "Found"
            );


            formData.append(
                "title",
                document.getElementById(
                    "foundTitle"
                ).value.trim()
            );


            formData.append(
                "category",
                document.getElementById(
                    "foundCategory"
                ).value.trim()
            );


            formData.append(
                "location",
                document.getElementById(
                    "foundLocation"
                ).value.trim()
            );


            formData.append(
                "description",
                document.getElementById(
                    "foundDescription"
                ).value.trim()
            );


            // ==========================================
            // IMAGE
            // ==========================================

            const imageInput =
                document.getElementById(
                    "foundImage"
                );


            if (
                imageInput &&
                imageInput.files.length > 0
            ) {

                formData.append(
                    "image",
                    imageInput.files[0]
                );

            }


            try {

                const response =
                    await fetch(
                        `${API_URL}/posts`,
                        {

                            method: "POST",

                            headers: {

                                "Authorization":
                                    "Bearer " + token

                            },

                            body: formData

                        }
                    );


                const data =
                    await response.json();


                console.log(
                    "Found post response:",
                    data
                );


                if (!response.ok) {

                    alert(
                        data.message ||
                        "Error Adding Item"
                    );

                    return;

                }


                alert(
                    "Found Item Added Successfully"
                );


                window.location.href =
                    "myposts.html";


            } catch (error) {

                console.error(
                    "Found Item Error:",
                    error
                );

                alert(
                    "Cannot connect to server"
                );

            }

        }
    );

}

// ======================================================
// LOST ITEM
// ======================================================

function setupLostForm() {

    const lostForm =
        document.getElementById("lostForm");

    if (!lostForm) return;

    lostForm.addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();

            const token =
                localStorage.getItem("token");

            if (!token) {

                alert("Please login first");

                window.location.href =
                    "login.html";

                return;
            }

            const formData =
                new FormData();

            formData.append(
                "type",
                "Lost"
            );

            formData.append(
                "title",
                document.getElementById(
                    "lostTitle"
                ).value.trim()
            );

            formData.append(
                "category",
                document.getElementById(
                    "lostCategory"
                ).value.trim()
            );

            formData.append(
                "location",
                document.getElementById(
                    "lostLocation"
                ).value.trim()
            );

            formData.append(
                "description",
                document.getElementById(
                    "lostDescription"
                ).value.trim()
            );


            // Get image
            const imageInput =
                document.getElementById(
                    "lostImage"
                );


            if (
                imageInput &&
                imageInput.files.length > 0
            ) {

                formData.append(
                    "image",
                    imageInput.files[0]
                );

            }


            try {

                const response =
                    await fetch(
                        `${API_URL}/posts`,
                        {

                            method: "POST",

                            headers: {

                                "Authorization":
                                    "Bearer " + token

                            },

                            body: formData

                        }
                    );


                const data =
                    await response.json();


                console.log(
                    "Lost post response:",
                    data
                );


                if (!response.ok) {

                    alert(
                        data.message ||
                        "Error Adding Item"
                    );

                    return;

                }


                alert(
                    "Lost Item Added Successfully"
                );


                window.location.href =
                    "myposts.html";


            } catch (error) {

                console.error(
                    "Lost Item Error:",
                    error
                );

                alert(
                    "Cannot connect to server"
                );

            }

        }
    );

}

// ======================================================
// MY POSTS
// ======================================================

async function loadMyPosts() {

    const postsContainer =
        document.getElementById(
            "postsContainer"
        );

    if (!postsContainer) return;


    // Get JWT token
    const token =
        localStorage.getItem("token");


    // Check login
    if (!token) {

        postsContainer.innerHTML = `
            <h2 style="text-align:center">
                Please login first
            </h2>
        `;

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/posts/my`,
                {

                    method: "GET",

                    headers: {

                        "Authorization":
                            "Bearer " + token

                    }

                }
            );


        const items =
            await response.json();


        console.log(
            "My Posts:",
            items
        );


        if (!response.ok) {

            throw new Error(
                items.message ||
                "Could not load posts"
            );

        }


        postsContainer.innerHTML = "";


        if (items.length === 0) {

            postsContainer.innerHTML = `
                <h2 style="text-align:center">
                    No Posts Yet
                </h2>
            `;

            return;

        }


        items.forEach(function (item) {

            // Create image URL
            const imageURL =
                item.image
                    ? `${API_URL.replace(
                        "/api",
                        ""
                    )}/uploads/${item.image}`
                    : "";


            postsContainer.innerHTML += `

                <div class="card item-card">

                    ${
                        item.image
                        ? `
                            <img
                                src="${imageURL}"
                                alt="Item Image"
                                style="
                                    width:200px;
                                    height:150px;
                                    object-fit:cover;
                                    border-radius:10px;
                                    display:block;
                                    margin:0 auto 15px;
                                "
                            >
                        `
                        : `
                            <p>
                                <b>No Image Uploaded</b>
                            </p>
                        `
                    }


                    <h2>
                        ${item.title}
                    </h2>


                    <p>
                        <b>Type:</b>
                        ${item.type}
                    </p>


                    <p>
                        <b>Category:</b>
                        ${item.category}
                    </p>


                    <p>
                        <b>Location:</b>
                        ${item.location}
                    </p>


                    <p>
                        ${item.description || ""}
                    </p>


                    <p>
                        <b>Status:</b>
                        ${
                            item.recovered
                            ? "Recovered ✅"
                            : "Pending"
                        }
                    </p>


                    <button
                        onclick="editPost('${item._id}')"
                    >
                        Edit
                    </button>


                    <button
                        onclick="recoverItem('${item._id}')"
                    >
                        Recovered
                    </button>


                    <button
                        onclick="deletePost('${item._id}')"
                    >
                        Delete
                    </button>

                </div>

            `;

        });


    } catch (error) {

        console.error(
            "My Posts Error:",
            error
        );


        postsContainer.innerHTML = `
            <h2 style="text-align:center">
                Error Loading Posts
            </h2>
        `;

    }

}
// ======================================================
// EDIT POST
// ======================================================

async function editPost(id) {

    const newTitle =
        prompt("Edit Item Title");


    if (!newTitle) return;


    const token =
        localStorage.getItem("token");


    if (!token) {

        alert("Please login first");

        window.location.href =
            "login.html";

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/posts/${id}`,
                {

                    method: "PUT",

                    headers: {

                        "Content-Type":
                            "application/json",

                        "Authorization":
                            "Bearer " + token

                    },

                    body:
                        JSON.stringify({
                            title: newTitle
                        })

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Update failed"
            );

            return;

        }


        alert(
            "Post Updated Successfully"
        );


        location.reload();


    } catch (error) {

        console.error(
            "Edit Error:",
            error
        );

        alert(
            "Error Updating Post"
        );

    }

}


// ======================================================
// DELETE POST
// ======================================================

async function deletePost(id) {

    if (
        !confirm(
            "Delete this post?"
        )
    ) {

        return;

    }


    const token =
        localStorage.getItem("token");


    if (!token) {

        alert("Please login first");

        window.location.href =
            "login.html";

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/posts/${id}`,
                {

                    method: "DELETE",

                    headers: {

                        "Authorization":
                            "Bearer " + token

                    }

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Delete failed"
            );

            return;

        }


        alert(
            "Post Deleted Successfully"
        );


        location.reload();


    } catch (error) {

        console.error(
            "Delete Error:",
            error
        );

        alert(
            "Error Deleting Post"
        );

    }

}

// ======================================================
// RECOVER POST
// ======================================================

async function recoverItem(id) {

    const token =
        localStorage.getItem("token");


    if (!token) {

        alert("Please login first");

        window.location.href =
            "login.html";

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/posts/${id}/recover`,
                {

                    method: "PATCH",

                    headers: {

                        "Authorization":
                            "Bearer " + token

                    }

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.message ||
                "Recovery failed"
            );

            return;

        }


        alert(
            "Item Marked As Recovered"
        );


        location.reload();


    } catch (error) {

        console.error(
            "Recovery Error:",
            error
        );

        alert(
            "Error Updating Item"
        );

    }

}
// ======================================================
// LOGOUT
// ======================================================

function logout() {

    localStorage.removeItem(
        "token"
    );

    localStorage.removeItem(
        "isLoggedIn"
    );

    localStorage.removeItem(
        "currentUserEmail"
    );

    localStorage.removeItem(
        "userRole"
    );


    alert(
        "Logged Out Successfully"
    );


    window.location.href =
        "login.html";

}
function contactOwner(name, email) { 
 
    window.location.href = 
        `mailto:${email}?subject=Lost & Found Item`; 
 
} 

// ======================================================
// ROUTE PROTECTION
// ======================================================

function checkProtectedPage() {

    const currentPage =
        window.location.pathname
            .split("/")
            .pop();


    const protectedPages = [
        "profile.html",
        "myposts.html",
        "lost-item.html",
        "found-item.html",
        "dashboard.html"
    ];


    if (
        protectedPages.includes(
            currentPage
        )
    ) {

        const token =
            localStorage.getItem(
                "token"
            );


        const isLoggedIn =
            localStorage.getItem(
                "isLoggedIn"
            );


        if (
            !token ||
            isLoggedIn !== "true"
        ) {

            alert(
                "Please Login First"
            );


            window.location.href =
                "login.html";

        }

    }

}
// ======================================================
// STATISTICS
// ======================================================

async function loadStatistics() {

    const totalLost =
        document.getElementById("totalLost");

    const totalFound =
        document.getElementById("totalFound");

    const totalRecovered =
        document.getElementById("totalRecovered");

    if (
        !totalLost &&
        !totalFound &&
        !totalRecovered
    ) {
        return;
    }

    const token =
        localStorage.getItem("token");

    if (!token) {
        return;
    }

    try {

        console.log(
            "Loading dashboard..."
        );

        const response =
            await fetch(
                `${API_URL}/posts`,
                {
                    headers: {
                        Authorization:
                            "Bearer " + token
                    }
                }
            );

        const items =
            await response.json();

        console.log(
            "Posts received:",
            items
        );

        if (!Array.isArray(items)) {

            console.log(
                "API returned:",
                items
            );

            return;
        }

        const lostCount =
            items.filter(
                item =>
                    String(item.type)
                    .toLowerCase() === "lost"
            ).length;

        const foundCount =
            items.filter(
                item =>
                    String(item.type)
                    .toLowerCase() === "found"
            ).length;

        const recoveredCount =
            items.filter(
                item =>
                    item.recovered === true
            ).length;

        totalLost.innerText =
            lostCount;

        totalFound.innerText =
            foundCount;

        totalRecovered.innerText =
            recoveredCount;

        console.log(
            "Lost:",
            lostCount
        );

        console.log(
            "Found:",
            foundCount
        );

        console.log(
            "Recovered:",
            recoveredCount
        );

        // ==========================================
// CHART
// ==========================================

const canvas =
    document.getElementById(
        "lostFoundChart"
    );

if (canvas) {

    if (window.myChart) {
        window.myChart.destroy();
    }

    window.myChart =
        new Chart(canvas, {

            type: "pie",

            data: {

                labels: [
                    "Lost",
                    "Found"
                ],

                datasets: [{

                    label: "Items",

                    data: [
                        lostCount,
                        foundCount
                    ]

                }]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false

            }

        });

}
    } catch (error) {

        console.error(
            "Statistics Error:",
            error
        );

    }

/// ======================================================
// ADMIN DASHBOARD
// ======================================================

async function loadAdminDashboard() {

    const adminPosts =
        document.getElementById("adminPosts");


    if (!adminPosts) return;


    const token =
        localStorage.getItem("token");


    if (!token) {

        adminPosts.innerHTML = `
            <h2>Please Login First</h2>
        `;

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/posts`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            "Bearer " + token
                    }
                }
            );


        const items =
            await response.json();


        console.log(
            "Admin Posts:",
            items
        );


        if (!response.ok) {

            throw new Error(
                items.message ||
                "Admin API error"
            );

        }


        if (!Array.isArray(items)) {

            throw new Error(
                "Invalid posts data received"
            );

        }
        


        // ==========================================
        // STATISTICS
        // ==========================================

        const totalLost =
            document.getElementById("totalLost");


        const totalFound =
            document.getElementById("totalFound");


        const totalRecovered =
            document.getElementById(
                "totalRecovered"
            );

         const canvas =
    document.getElementById(
        "lostFoundChart"
    );

if (canvas) {

    if (window.myChart) {
        window.myChart.destroy();
    }

    window.myChart =
        new Chart(canvas, {

            type: "pie",

            data: {

                labels: [
                    "Lost",
                    "Found"
                ],

                datasets: [{

                    data: [
                        lost,
                        found
                    ]

                }]

            }

        });

}   


        const lost =
            items.filter(function (item) {

                return String(
                    item.type || ""
                ).toLowerCase() === "lost";

            }).length;


        const found =
            items.filter(function (item) {

                return String(
                    item.type || ""
                ).toLowerCase() === "found";

            }).length;


        const recovered =
            items.filter(function (item) {

                return item.recovered === true;

            }).length;


        if (totalLost) {

            totalLost.innerText =
                lost;

        }


        if (totalFound) {

            totalFound.innerText =
                found;

        }


        if (totalRecovered) {

            totalRecovered.innerText =
                recovered;

        }

        
        


        // ==========================================
        // DISPLAY POSTS
        // ==========================================

        adminPosts.innerHTML = "";


        if (items.length === 0) {

            adminPosts.innerHTML = `
                <h2>No Posts Found</h2>
            `;

            return;

        }


        items.forEach(function (item) {

            const imageURL =
                item.image
                    ? `${API_URL.replace(
                        "/api",
                        ""
                    )}/uploads/${item.image}`
                    : "";


            adminPosts.innerHTML += `

                <div class="card item-card">

                    ${
                        item.image
                        ? `
                            <img
                                src="${imageURL}"
                                alt="Item Image"
                                style="
                                    width:200px;
                                    height:150px;
                                    object-fit:cover;
                                    border-radius:10px;
                                    display:block;
                                    margin:0 auto 15px;
                                "
                            >
                        `
                        : ""
                    }


                    <h3>
                        ${item.title || ""}
                    </h3>


                    <p>
                        <b>Type:</b>
                        ${item.type || ""}
                    </p>


                    <p>
                        <b>Category:</b>
                        ${item.category || ""}
                    </p>


                    <p>
                        <b>Location:</b>
                        ${item.location || ""}
                    </p>
                    <p>
                 <b>Owner:</b>
    ${item.userId?.name || "Unknown"}
</p>

<p>
    <b>Email:</b>
    ${item.userId?.email || "N/A"}
</p>


                    <p>
                        ${item.description || ""}
                    </p>


                    <p>
                        <b>Status:</b>
                        ${
                            item.recovered
                            ? "Recovered ✅"
                            : "Pending"
                        }
                    </p>
                    <button
    class="delete-btn" onclick="deletePostAdmin('${item._id}')">
    Delete Post
</button>

                </div>

            `;

        });


    } catch (error) {

        console.error(
            "Admin Dashboard Error:",
            error
        );


        adminPosts.innerHTML = `
            <h2>
                Error Loading Posts
            </h2>
        `;

    }
}
}
// ======================================================
// LOAD ALL POSTS
// ======================================================

async function loadAllPosts() {

    const postsContainer =
        document.getElementById("itemsContainer");


    if (!postsContainer) {
        return;
    }


    const token =
        localStorage.getItem("token");


    if (!token) {

        postsContainer.innerHTML = `
            <h2 style="text-align:center">
                Please login to view items
            </h2>
        `;

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/posts`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            "Bearer " + token
                    }
                }
            );


        const items =
            await response.json();


        console.log(
            "All Posts:",
            items
        );


        if (!response.ok) {

            throw new Error(
                items.message ||
                "Could not load posts"
            );

        }


        postsContainer.innerHTML = "";


        if (
            !Array.isArray(items) ||
            items.length === 0
        ) {

            postsContainer.innerHTML = `
                <h2 style="text-align:center">
                    No Items Found
                </h2>
            `;

            return;

        }


        // ==========================================
        // CREATE ITEM CARDS
        // ==========================================

        items.forEach(function (item) {

            const card =
                document.createElement("div");


            card.className =
                "card item-card";


            // Data used by Search & Filter
            card.dataset.title =
                String(
                    item.title || ""
                ).toLowerCase();


            card.dataset.category =
                String(
                    item.category || ""
                ).toLowerCase();


            card.dataset.type =
                String(
                    item.type || ""
                ).toLowerCase();


            card.dataset.recovered =
                item.recovered === true
                    ? "true"
                    : "false";


            // ======================================
            // IMAGE
            // ======================================

            if (item.image) {

                const image =
                    document.createElement("img");


                image.src =
                    `${API_URL.replace(
                        "/api",
                        ""
                    )}/uploads/${item.image}`;


                image.alt =
                    item.title ||
                    "Item Image";


                image.style.width =
                    "200px";

                image.style.height =
                    "150px";

                image.style.objectFit =
                    "cover";

                image.style.borderRadius =
                    "10px";

                image.style.display =
                    "block";

                image.style.margin =
                    "0 auto 15px";


                image.onerror =
                    function () {

                        console.log(
                            "Image not found:",
                            image.src
                        );

                        image.style.display =
                            "none";

                    };


                card.appendChild(image);

            }


            // ======================================
            // TITLE
            // ======================================

            const title =
                document.createElement("h2");

            title.innerText =
                item.title ||
                "Untitled Item";

            card.appendChild(title);


            // ======================================
            // TYPE
            // ======================================

            const type =
                document.createElement("p");

            type.innerHTML =
                `<b>Type:</b> ${
                    item.type || ""
                }`;

            card.appendChild(type);


            // ======================================
            // CATEGORY
            // ======================================

            const category =
                document.createElement("p");

            category.innerHTML =
                `<b>Category:</b> ${
                    item.category || ""
                }`;

            card.appendChild(category);


            // ======================================
            // LOCATION
            // ======================================

            const location =
                document.createElement("p");

            location.innerHTML =
                `<b>Location:</b> ${
                    item.location || ""
                }`;

            card.appendChild(location);
const owner =
    document.createElement("p");

owner.innerHTML =
    `<b>Owner:</b> ${
        item.userId?.name || "Unknown"
    }`;
    

card.appendChild(owner);

const email =
    document.createElement("p");

email.innerHTML =
    `<b>Email:</b> ${
        item.userId?.email || "N/A"
    }`;

card.appendChild(email);

            // ======================================
            // DESCRIPTION
            // ======================================

            const description =
                document.createElement("p");

            description.innerText =
                item.description || "";

            card.appendChild(description);


            // ======================================
            // STATUS
            // ======================================

            const status =
                document.createElement("p");

            status.innerHTML =
                `<b>Status:</b> ${
                    item.recovered
                    ? "Recovered ✅"
                    : "Pending"
                }`;

card.appendChild(status);

console.log(JSON.stringify(item.userId, null, 2));

// Contact Owner Button
const contactBtn =
    document.createElement("button");

contactBtn.className =
    "contact-btn";

contactBtn.innerText =
    "📧 Contact Owner";

contactBtn.onclick =
    function () {

        contactOwner(
            item.userId?.name || "",
            item.userId?.email || ""
        );

    };

card.appendChild(contactBtn);
const whatsappBtn =
    document.createElement("button");

whatsappBtn.className =
    "whatsapp-btn";

whatsappBtn.innerText =
    "📱 WhatsApp Owner";

whatsappBtn.onclick =
    function () {

        contactWhatsApp(
            item.userId?.phone || "",
            item.title || ""
        );

    };

card.appendChild(whatsappBtn);

postsContainer.appendChild(card);

        });


        console.log(
            "Cards displayed:",
            postsContainer.querySelectorAll(
                ".item-card"
            ).length
        );


        // Apply filters
        filterItems();


    } catch (error) {

        console.error(
            "Load All Posts Error:",
            error
        );


        postsContainer.innerHTML = `
            <h2 style="text-align:center">
                Error Loading Items
            </h2>
        `;

    }

}

// ======================================================
// ADMIN DASHBOARD
// ======================================================

async function loadAdminDashboard() {

    const adminPosts =
        document.getElementById("adminPosts");


    if (!adminPosts) return;


    const token =
        localStorage.getItem("token");


    if (!token) {

        adminPosts.innerHTML = `
            <h2>Please Login First</h2>
        `;

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/posts`,
                {
                    method: "GET",

                    headers: {
                        "Authorization":
                            "Bearer " + token
                    }
                }
            );


        const items =
            await response.json();


        console.log(
            "Admin Posts:",
            items
        );


        if (!response.ok) {

            throw new Error(
                items.message ||
                "Admin API error"
            );

        }


        if (!Array.isArray(items)) {

            throw new Error(
                "Invalid posts data received"
            );

        }


        // ==========================================
        // STATISTICS
        // ==========================================

        const totalLost =
            document.getElementById("totalLost");


        const totalFound =
            document.getElementById("totalFound");


        const totalRecovered =
            document.getElementById(
                "totalRecovered"
            );


        const lost =
            items.filter(function (item) {

                return String(
                    item.type || ""
                ).toLowerCase() === "lost";

            }).length;


        const found =
            items.filter(function (item) {

                return String(
                    item.type || ""
                ).toLowerCase() === "found";

            }).length;


        const recovered =
            items.filter(function (item) {

                return item.recovered === true;

            }).length;


        if (totalLost) {

            totalLost.innerText =
                lost;

        }


        if (totalFound) {

            totalFound.innerText =
                found;

        }


        if (totalRecovered) {

            totalRecovered.innerText =
                recovered;

        }
        
        // ==========================================
// CHART
// ==========================================

const canvas =
    document.getElementById(
        "lostFoundChart"
    );

if (canvas) {

    if (window.myChart) {
        window.myChart.destroy();
    }

    window.myChart =
        new Chart(canvas, {

            type: "pie",

            data: {

                labels: [
                    "Lost",
                    "Found"
                ],

                datasets: [{

                    label: "Items",

                    data: [
                        lost,
                        found
                    ]

                }]

            }

        });

}


        // ==========================================
        // DISPLAY POSTS
        // ==========================================

        adminPosts.innerHTML = "";


        if (items.length === 0) {

            adminPosts.innerHTML = `
                <h2>No Posts Found</h2>
            `;

            return;

        }


        items.forEach(function (item) {

            const imageURL =
                item.image
                    ? `${API_URL.replace(
                        "/api",
                        ""
                    )}/uploads/${item.image}`
                    : "";


            adminPosts.innerHTML += `

                <div class="card item-card">

                    ${
                        item.image
                        ? `
                            <img
                                src="${imageURL}"
                                alt="Item Image"
                                style="
                                    width:200px;
                                    height:150px;
                                    object-fit:cover;
                                    border-radius:10px;
                                    display:block;
                                    margin:0 auto 15px;
                                "
                            >
                        `
                        : ""
                    }


                    <h3>
                        ${item.title || ""}
                    </h3>


                    <p>
                        <b>Type:</b>
                        ${item.type || ""}
                    </p>


                    <p>
                        <b>Category:</b>
                        ${item.category || ""}
                    </p>


                    <p>
                        <b>Location:</b>
                        ${item.location || ""}
                    </p>
<p>
    <b>Owner:</b>
    ${item.userId?.name || "Unknown"}
</p>

<p>
    <b>Email:</b>
    ${item.userId?.email || "N/A"}
</p>

                    <p>
                        ${item.description || ""}
                    </p>


                    <p>
                        <b>Status:</b>
                        ${
                            item.recovered
                            ? "Recovered ✅"
                            : "Pending"
                        }
                    </p>
                    <button
    class="admin-btn delete-btn" onclick="deletePostAdmin('${item._id}')">
    Delete Post
</button>
<button
    class="contact-btn"
    onclick="contactOwner(
        '${item.userId?.name || ""}',
        '${item.userId?.email || ""}'
    )">
    Contact Owner
</button> 


                </div>

            `;

        });


    } catch (error) {

        console.error(
            "Admin Dashboard Error:",
            error
        );


        adminPosts.innerHTML = `
            <h2>
                Error Loading Posts
            </h2>
        `;

    }

} 
// ======================================================
// ADMIN DELETE POST
// ======================================================

async function deletePostAdmin(postId) {

    const token =
        localStorage.getItem("token");

    const confirmDelete =
        confirm("Delete this post?");

    if (!confirmDelete) {
        return;
    }

    try {

        const response =
            await fetch(
                `${API_URL}/posts/admin/${postId}`,
                {
                    method: "DELETE",

                    headers: {
                        Authorization:
                            "Bearer " + token
                    }
                }
            );

        const data =
            await response.json();

        alert(data.message);

        loadAdminDashboard();

    } catch (error) {

        console.error(error);

        alert("Delete Failed");

    }

}

// ======================================================
// GENERATE REPORT
// ======================================================

async function generateReport() {

    const token =
        localStorage.getItem("token");

    try {

        // Get users
        const usersResponse =
            await fetch(
                `${API_URL}/auth/users`,
                {
                    headers: {
                        Authorization:
                            "Bearer " + token
                    }
                }
            );

        const users =
            await usersResponse.json();

        // Get posts
        const postsResponse =
            await fetch(
                `${API_URL}/posts`,
                {
                    headers: {
                        Authorization:
                            "Bearer " + token
                    }
                }
            );

        const posts =
            await postsResponse.json();

        const totalUsers =
            users.length;

        const totalLost =
            posts.filter(
                post =>
                    post.type &&
                    post.type.toLowerCase() === "lost"
            ).length;

        const totalFound =
            posts.filter(
                post =>
                    post.type &&
                    post.type.toLowerCase() === "found"
            ).length;

        const totalRecovered =
            posts.filter(
                post =>
                    post.recovered === true
            ).length;

        const report = `

LOST & FOUND PORTAL REPORT

================================

Total Users: ${totalUsers}

Total Lost Items: ${totalLost}

Total Found Items: ${totalFound}

Total Recovered Items: ${totalRecovered}

Generated On:
${new Date().toLocaleString()}

================================

`;

        const blob =
            new Blob(
                [report],
                {
                    type: "text/plain"
                }
            );

        const link =
            document.createElement("a");

        link.href =
            URL.createObjectURL(blob);

        link.download =
            "Lost_Found_Report.txt";

        link.click();

    } catch (error) {

        console.error(
            "Report Error:",
            error
        );

        alert(
            "Could not generate report"
        );

    }

}

// ======================================================
// CONTACT OWNER
// ======================================================

function contactOwner(name, email) {

    navigator.clipboard.writeText(email);

    window.location.href =
        `mailto:${email}?subject=Lost & Found Item`;

    
}

function contactWhatsApp(phone, itemTitle) {

    if (!phone) {

        alert(
            "Phone number not available"
        );

        return;

    }

    phone = phone.replace(/\D/g, "");

    if (phone.length === 10) {

        phone = "91" + phone;

    }

    const message =
        `Hello, I am contacting you regarding "${itemTitle}" from the Lost & Found Portal.`;

    window.open(
        `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
        "_blank"
    );

}

async function loadWelcomeCard() {

    const userPosts =
        document.getElementById("userPosts");

    const userRecovered =
        document.getElementById("userRecovered");

    const token =
        localStorage.getItem("token");

    if (!token) return;

    const response =
        await fetch(
            `${API_URL}/posts/my`,
            {
                headers:{
                    Authorization:
                    "Bearer " + token
                }
            }
        );

    const posts =
        await response.json();

    if(userPosts){

        userPosts.innerText =
            posts.length;

    }

    if(userRecovered){

        userRecovered.innerText =
            posts.filter(
                post =>
                post.recovered === true
            ).length;

    }

}
// ======================================================
// ADMIN - LOAD ALL USERS
// ======================================================

async function loadAdminUsers() {

    const adminUsers =
        document.getElementById("adminUsers");

    if (!adminUsers) {
        return;
    }

    const token =
        localStorage.getItem("token");

    if (!token) {

        adminUsers.innerHTML = `
            <h3 style="text-align:center;">
                Please Login First
            </h3>
        `;

        return;
    }

    try {

        const response =
            await fetch(
                `${API_URL}/auth/users`,
                {
                    method: "GET",
                    headers: {
                        "Authorization":
                            "Bearer " + token
                    }
                }
            );

        const users =
            await response.json();

        console.log(
            "Admin Users:",
            users
        );

        if (!response.ok) {

            throw new Error(
                users.message ||
                "Could not load users"
            );

        }

        adminUsers.innerHTML = "";

        users.forEach(function (user) {

            adminUsers.innerHTML += `

                <div class="admin-user-card">

                    <h3>
                        👤 ${user.name || "No Name"}
                    </h3>

                    <p>
                        <b>Email:</b>
                        ${user.email || "N/A"}
                    </p>

                    <p>
                        <b>Role:</b>
                        ${user.role || "user"}
                    </p>

                    <p>
                        <b>Registered:</b>
                        ${
                            user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString()
                            : "Unknown"
                        }
                    </p>

                    <button
                        class="delete-btn"
                        onclick="deleteUser('${user._id}')">
                        Delete User
                    </button>

                </div>

            `;

        });

    } catch (error) {

        console.error(
            "Admin Users Error:",
            error
        );

        adminUsers.innerHTML = `
            <h3 style="text-align:center;">
                Error Loading Users
            </h3>
        `;

    }

} 
// ======================================================
// ADMIN DELETE USER
// ======================================================

async function deleteUser(id) {

    if (!confirm("Delete this user?")) {
        return;
    }

    const token =
        localStorage.getItem("token");

    try {

        const response =
            await fetch(
                `${API_URL}/auth/users/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Authorization":
                            "Bearer " + token
                    }
                }
            );

        const data =
            await response.json();

        if (!response.ok) {

            alert(
                data.message ||
                "Delete Failed"
            );

            return;

        }

        alert(
            "User Deleted Successfully"
        );

        loadAdminUsers();

    } catch (error) {

        console.error(
            "Delete User Error:",
            error
        );

        alert(
            "Server Error"
        );

    }
 
}



async function loadRecentPosts() {

    const recentPosts =
        document.getElementById(
            "recentPosts"
        );

    if (!recentPosts) return;

    try {

        const token =
            localStorage.getItem(
                "token"
            );

        const response =
            await fetch(
                `${API_URL}/posts`,
                {
                    headers:{
                        Authorization:
                        "Bearer " + token
                    }
                }
            );

        const posts =
            await response.json();

        recentPosts.innerHTML = "";

        posts.slice(0,5)
            .forEach(post => {

                recentPosts.innerHTML += `

                <p>
                    📦 ${post.title}
                    (${post.type})
                </p>

                `;

            });

    } catch(error){

        console.log(error);

    }

}


async function showDashboardItems(type) {
    const container =
        document.getElementById(
            "dashboardItemsContainer"
        );

    const title =
        document.getElementById(
            "dashboardItemsTitle"
        );

    const token =
        localStorage.getItem(
            "token"
        );

    const response =
        await fetch(
            `${API_URL}/posts`,
            {
                headers:{
                    Authorization:
                    "Bearer " + token
                }
            }
        );

    const items =
        await response.json();

    let filtered = [];

    if(type === "lost"){

        filtered =
            items.filter(
                item =>
                item.type &&
                item.type.toLowerCase()
                === "lost"
            );

        title.innerText =
            "📦 Lost Items";

    }

    else if(type === "found"){

        filtered =
            items.filter(
                item =>
                item.type &&
                item.type.toLowerCase()
                === "found"
            );

        title.innerText =
            "🔍 Found Items";

    }

    else{

        filtered =
            items.filter(
                item =>
                item.recovered
            );

        title.innerText =
            "✅ Recovered Items";

    }

    container.innerHTML = "";

    filtered.forEach(item => {

        container.innerHTML += `

        <div class="item-card">

            <h3>${item.title}</h3>

            <p>
                ${item.description || ""}
            </p>

            <p>
                <b>Location:</b>
                ${item.location}
            </p>

        </div>

        `;

    });

}
