// Create lightbox elements
const lightbox = document.createElement("div");
const lightboxImage = document.createElement("img");
const closeButton = document.createElement("span");

// Add IDs for styling
lightbox.id = "lightbox";
closeButton.id = "close-btn";

// X button content
closeButton.innerHTML = "&times;";

// Build structure
lightbox.appendChild(closeButton);
lightbox.appendChild(lightboxImage);
document.body.appendChild(lightbox);

// Select gallery images
const images = document.querySelectorAll(".gallery img");

// Open image when clicked
images.forEach(image => {
    image.addEventListener("click", () => {
        lightboxImage.src = image.src;
        lightbox.style.display = "flex";
    });
});

// Close when clicking X
closeButton.addEventListener("click", () => {
    lightbox.style.display = "none";
});

// Close when clicking background
lightbox.addEventListener("click", (e) => {
    if (e.target !== lightboxImage) {
        lightbox.style.display = "none";
    }
});
