// Constants
const blogList = document.getElementById("blogList"); // Reference to the blog list container
const blogDetails = document.getElementById("blogDetails"); // Reference to the blog details container
const createBtn = document.getElementById("createBtn"); // Reference to the "Create Blog" button


let blogs = []; // Define the blogs array to store blog data

// Fetch blogs from JSON file using XMLHttpRequest
const xhr = new XMLHttpRequest();
xhr.open("GET", "blogs.json", true);
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
        if (xhr.status === 200) {
            blogs = JSON.parse(xhr.responseText); // Update the blogs array with fetched data
            displayBlogs(blogs); // Call the function to display blogs
        } else {
            console.error("Error fetching blogs: " + xhr.status); // Log an error message if fetching failes
        }
    }
};
xhr.send();

// Function to display blogs on click
function displayBlogs(blogs) {
    blogList.innerHTML = "";
    blogs.forEach((blog, index) => {
        const blogCard = document.createElement("div");
        blogCard.classList.add("blog-card");
        blogCard.innerHTML = `
            <h2>${blog.title}</h2>
            <p>Author: ${blog.author}</p>
            <p>Created: ${blog.created}</p>
            <p class="blog-content">${truncateText(blog.content, 100)}</p>
            <button class="read-more-btn" onclick="expandBlog(${index})">Read More</button>
            <span class="update-icon" onclick="editBlog(${index})">&#9998;</span>
        `;
        blogCard.addEventListener("click", () => expandBlog(blog)); // Add click event to expand the blog
        blogList.appendChild(blogCard);
    });
}

function truncateText(text, maxLength) {
    if (text.length > maxLength) {
        return text.slice(0, maxLength) + '...';
    }
    return text;
}


// Event listener for "Create Blog" button click
createBtn.addEventListener("click", () => {
    // Display the form for creating a new blog
    blogDetails.innerHTML = `
        <input type="text" id="newTitle" class="editable" placeholder="Title">
        <textarea id="newContent" class="editable" placeholder="What's on your mind"></textarea>
        <input type="text" id="newAuthor" class="editable" placeholder="Author">
        <button id="save" onclick="saveNewBlog()">Save</button>
    `;
    blogDetails.style.display = "grid"; // Display the form as a grid
});

// Function to save a new blog
function saveNewBlog() {
    const newTitle = document.getElementById("newTitle").value;
    const newContent = document.getElementById("newContent").value;
    const newAuthor = document.getElementById("newAuthor").value;
    const created = new Date().toLocaleString();

    const newBlog = {
        title: newTitle,
        content: newContent,
        author: newAuthor,
        created: created,
    };

    // Display the new blog card
    const blogCard = document.createElement("div");
    blogCard.classList.add("blog-card"); // Add CSS class for styling
    blogCard.innerHTML = `
        <h2>${newTitle}</h2>
        <p>${newContent}</p>
        <p>Author: ${newAuthor}</p>
        <p>Created: ${created}</p>
        <span class="update-icon" onclick="editBlog(${blogs.length})">&#9998;</span>
    `;
    blogCard.addEventListener("click", () => expandBlog(newBlog)); // Add click event to expand the new blog
    blogList.appendChild(blogCard); // Append the new blog card to the list
    
    // Clear the form
    blogDetails.style.display = "none";

    // Add the new blog to the blogs array
    blogs.push(newBlog);
}

function expandBlog(index) {
    const blogCard = blogList.children[index];
    const blog = blogs[index];
    blogCard.querySelector(".blog-content").textContent = blog.content;
    document.getElementById('read-more-btn');
}


/**
 * Function to edit a blog entry and display it for editing.
 *
 * @param {number} index - The index of the blog entry to edit.
 */
function editBlog(index) {
    // Get the blog entry at the specified index from the 'blogs' array.
    const blog = blogs[index];

    // Update the content of the 'blogDetails' element to display the editing interface.
    blogDetails.innerHTML = `
        <h2>${blog.title}</h2>
        <p><span class="editable" contenteditable="true" id="editContent">${blog.content}</span></p>
        <p><span class="editable" contenteditable="true" id="editAuthor">${blog.author}</span></p>
        <button onclick="saveEditedBlog(${index})">Save</button>
    `;

    // Make the 'blogDetails' element visible for editing.
    blogDetails.style.display = "block";
}

/**
 * Function to save the changes made to a blog entry.
 *
 * @param {number} index - The index of the blog entry to save.
 */
function saveEditedBlog(index) {
    // Get the edited content and author from the HTML elements.
    const editContent = document.getElementById("editContent").textContent;
    const editAuthor = document.getElementById("editAuthor").textContent;

    // Get the blog entry at the specified index from the 'blogs' array.
    const blog = blogs[index];

    // Update the content and author of the blog entry with the edited values.
    blog.content = editContent;
    blog.author = editAuthor.replace("Author: ", "");

    // Display the updated list of blogs.
    displayBlogs(blogs);

    // Hide the 'blogDetails' element after saving the changes.
    blogDetails.style.display = "none";
}
