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

// --- Support button + persistent progress bar ---
(() => {
    const supportBtn = document.getElementById('support-btn');
    const progressFill = document.getElementById('progress-fill');
    const progressValue = document.getElementById('progress-value');
    const STORAGE_KEY = 'photoSupportClicks';
    const CLICKED_KEY = 'photoSupportClicked';
    const GOAL_KEY = 'photoSupportGoal';

    if (!supportBtn || !progressFill || !progressValue) return;

    // clicks is stored locally as a simple counter (no server) — to have a global
    // shared count across devices you'd need a backend service. Admin can change
    // the goal which is saved in localStorage under GOAL_KEY.
    let clicks = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
    if (isNaN(clicks)) clicks = 0;

    let hasClicked = localStorage.getItem(CLICKED_KEY) === '1';

    function getGoal() {
        const g = parseInt(localStorage.getItem(GOAL_KEY) || '100', 10);
        if (!g || isNaN(g) || g < 1) return 100;
        return g;
    }

    function isUnlocked() {
        return localStorage.getItem('photoSupportUnlocked') === '1';
    }

    function updateUI() {
        const goal = getGoal();
        const pctRaw = goal > 0 ? (clicks / goal) * 100 : 0;
        const pct = Math.min(100, Math.round(pctRaw));
        progressFill.style.width = pct + '%';
        progressFill.setAttribute('aria-valuenow', pct);
        progressValue.textContent = clicks + ' / ' + goal;
        // disable button only if device has clicked AND voting is not unlocked
        if (hasClicked && !isUnlocked()) {
            supportBtn.setAttribute('disabled', 'disabled');
        } else {
            supportBtn.removeAttribute('disabled');
        }
    }

    supportBtn.addEventListener('click', () => {
        // one click per device unless unlocked by admin
        const unlocked = isUnlocked();
        if (!unlocked && hasClicked) return;
        const goal = getGoal();
        if (clicks >= Number.MAX_SAFE_INTEGER) return; // safety
        clicks += 1;
        // mark this device as having clicked (still useful when toggling lock back)
        hasClicked = true;
        localStorage.setItem(STORAGE_KEY, String(clicks));
        localStorage.setItem(CLICKED_KEY, '1');
        updateUI();
    });

    // initialize UI on load
    updateUI();
})();
