// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded');

    // Find our date picker inputs on the page
    const startInput = document.getElementById('startDate');
    const endInput = document.getElementById('endDate');

    // Call the setupDateInputs function from dateRange.js
    // This sets up the date pickers to:
    // - Default to a range of 9 days (from 9 days ago to today)
    // - Restrict dates to NASA's image archive (starting from 1995)
    setupDateInputs(startInput, endInput);

    // Hardcoded NASA API key
    const NASA_API_KEY = 'JD7ahcCFsyuYnofPjGA5fgHtLvAibfgKTM16H9Wa'; // <-- Replace with your actual API key

    // Use the existing "Get Space Images" button
    const getImagesBtn = document.getElementById('getImagesBtn');
    console.log('Button found:', getImagesBtn);
    
    if (!getImagesBtn) {
        console.error('Button not found!');
        alert('Error: No button with id="getImagesBtn" found in the HTML.');
        return;
    }

    // Ensure gallery container exists
    let galleryDiv = document.getElementById('gallery');
    console.log('Gallery found:', galleryDiv);

    // Helper to format date as YYYY-MM-DD
    function formatDate(date) {
        return date.toISOString().split('T')[0];
    }

    // When "Get Space Images" is clicked, fetch and display images from NASA APOD API
    getImagesBtn.addEventListener('click', async (e) => {
        console.log('Button clicked!');
        e.preventDefault();
        
        const apiKey = NASA_API_KEY;
        const startDate = startInput.value;
        const endDate = endInput.value;

        console.log('Dates:', startDate, endDate);

        if (!apiKey) {
            alert('NASA API key is missing in the code.');
            return;
        }
        if (!startDate || !endDate) {
            alert('Please select a valid date range.');
            return;
        }

        // Add active class to header and show gallery
        const siteHeader = document.querySelector('.site-header');
        siteHeader.classList.add('gallery-active');
        galleryDiv.classList.add('active');

        galleryDiv.innerHTML = '<div style="color: white; padding: 40px; text-align: center; font-size: 1.2rem;"><div style="margin-bottom: 15px;">🔄</div>Loading space photos…</div>';

        try {
            const url = `https://api.nasa.gov/planetary/apod?api_key=${encodeURIComponent(apiKey)}&start_date=${startDate}&end_date=${endDate}`;
            console.log('Fetching:', url);
            
            const res = await fetch(url);
            if (!res.ok) throw new Error(`API error: ${res.status}`);
            const data = await res.json();

            console.log('Data received:', data);

            // Ensure data is an array
            const images = Array.isArray(data) ? data : [data];

            // Filter only images
            const imageItems = images.filter(item => item.media_type === 'image');

            if (imageItems.length === 0) {
                galleryDiv.innerHTML = 'No images found for this date range.';
                return;
            }

            galleryDiv.innerHTML = '';
            imageItems.forEach((item, idx) => {
                // Bootstrap card
                const card = document.createElement('div');
                card.className = 'gallery-item card mb-4 shadow-sm';
                card.style.cursor = 'pointer';
                card.style.position = 'relative';
                // Remove data-bs-toggle and data-bs-target attributes

                const img = document.createElement('img');
                img.src = item.url;
                img.alt = item.title;
                img.className = 'card-img-top';

                const cardBody = document.createElement('div');
                cardBody.className = 'card-body';

                const title = document.createElement('h5');
                title.className = 'card-title';
                title.textContent = item.title;

                const date = document.createElement('p');
                date.className = 'card-text fw-bold mb-2';
                date.textContent = item.date;

                cardBody.appendChild(title);
                cardBody.appendChild(date);

                card.appendChild(img);
                card.appendChild(cardBody);

                // Store data for modal
                card.dataset.title = item.title;
                card.dataset.date = item.date;
                card.dataset.explanation = item.explanation;
                card.dataset.url = item.url;

                galleryDiv.appendChild(card);
            });

            // Modal event delegation using Bootstrap JS API
            galleryDiv.querySelectorAll('.gallery-item').forEach(card => {
                card.addEventListener('click', function (e) {
                    e.stopPropagation();
                    const modalTitle = document.getElementById('apodModalLabel');
                    const modalImg = document.getElementById('apodModalImg');
                    const modalDate = document.getElementById('apodModalDate');
                    const modalExplanation = document.getElementById('apodModalExplanation');

                    modalTitle.textContent = this.dataset.title;
                    modalImg.src = this.dataset.url;
                    modalImg.alt = this.dataset.title;
                    modalDate.textContent = this.dataset.date;
                    modalExplanation.textContent = this.dataset.explanation;

                    // Show the modal using Bootstrap JS API
                    const modal = new bootstrap.Modal(document.getElementById('apodModal'));
                    modal.show();
                });
            });

        } catch (err) {
            console.error('Error:', err);
            galleryDiv.innerHTML = `<div style="color: white; padding: 20px; text-align: center;">Failed to fetch APOD data: ${err.message}</div>`;
        }
    });

    // Add functionality to reset view when clicking NASA logo or title
    const logo = document.querySelector('.logo');
    const title = document.querySelector('h1');
    
    [logo, title].forEach(element => {
        element.addEventListener('click', () => {
            const siteHeader = document.querySelector('.site-header');
            siteHeader.classList.remove('gallery-active');
            galleryDiv.classList.remove('active');
        });
        element.style.cursor = 'pointer';
    });

    console.log('Script setup complete');
});

//# sourceMappingURL=script.js.map

//# sourceMappingURL=script.js.map
