
/* X COVER GRAPHICS — GALLERY */

document.addEventListener("DOMContentLoaded", () => {

    const gallery = document.getElementById("masonry-gallery");
    const filters = document.getElementById("gallery-filters");
    const count = document.getElementById("gallery-count");
    const empty = document.getElementById("gallery-empty");

    const lightbox = document.getElementById("gallery-lightbox");
    const lightboxImage = document.getElementById("lightbox-image");
    const lightboxTitle = document.getElementById("lightbox-title");
    const closeButton = document.getElementById("lightbox-close");

    const projects = Array.isArray(window.XCOVER_PROJECTS)
        ? window.XCOVER_PROJECTS
        : [];

    const categories = [
        "All Works",
        ...new Set(projects.map(project => project.category))
    ];

    let activeCategory = "All Works";
    let previousFocus = null;

    function openLightbox(project) {
        previousFocus = document.activeElement;

        lightboxImage.src = project.image;
        lightboxImage.alt = project.title;
        lightboxTitle.textContent = project.title;

        lightbox.hidden = false;
        document.body.style.overflow = "hidden";
        closeButton.focus();
    }

    function closeLightbox() {
        lightbox.hidden = true;
        lightboxImage.removeAttribute("src");
        document.body.style.overflow = "";

        if (previousFocus) {
            previousFocus.focus();
        }
    }

    function renderGallery() {
        gallery.replaceChildren();

        const visible = activeCategory === "All Works"
            ? projects
            : projects.filter(
                project => project.category === activeCategory
            );

        visible.forEach(project => {
            const card = document.createElement("button");
            card.className = "gallery-card";
            card.type = "button";
            card.setAttribute(
                "aria-label",
                "View " + project.title
            );

            const image = document.createElement("img");
            image.src = project.image;
            image.alt = project.title;
            image.loading = "lazy";
            image.decoding = "async";

            const caption = document.createElement("span");
            caption.className = "gallery-card-caption";

            const title = document.createElement("span");
            title.className = "gallery-card-title";
            title.textContent = project.title;

            const category = document.createElement("span");
            category.className = "gallery-card-category";
            category.textContent = project.category;

            caption.append(title, category);
            card.append(image, caption);

            card.addEventListener("click", () => {
                openLightbox(project);
            });

            gallery.appendChild(card);
        });

        count.textContent = visible.length +
            (visible.length === 1 ? " Project" : " Projects");

        empty.hidden = visible.length !== 0;
    }

    function renderFilters() {
        filters.replaceChildren();

        categories.forEach(category => {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "gallery-filter";
            button.textContent = category;

            if (category === activeCategory) {
                button.classList.add("active");
            }

            button.addEventListener("click", () => {
                activeCategory = category;
                renderFilters();
                renderGallery();
            });

            filters.appendChild(button);
        });
    }

    closeButton.addEventListener("click", closeLightbox);

    lightbox.addEventListener("click", event => {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });

    document.addEventListener("keydown", event => {
        if (lightbox.hidden) return;

        if (event.key === "Escape") {
            closeLightbox();
        }

        if (event.key === "Tab") {
            event.preventDefault();
            closeButton.focus();
        }
    });

    renderFilters();
    renderGallery();
});
