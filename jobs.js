function toggleDropdown() {
    document.getElementById("menuDropdown").classList.toggle("show");
}

// Close dropdown when clicking outside
document.addEventListener("click", function (event) {
    const menuButton = document.querySelector(".menu-button");
    const dropdownMenu = document.getElementById("menuDropdown");
    if (!menuButton.contains(event.target) && dropdownMenu && !dropdownMenu.contains(event.target)) {
        dropdownMenu.classList.remove("show");
    }
});

function filterJobs(filters) {
    const jobCards = document.querySelectorAll(".job-card");

    jobCards.forEach(card => {
        const title = card.querySelector("h3").textContent.toLowerCase();
        const company = card.querySelector(".company").textContent.toLowerCase();
        const requirements = card.querySelector(".requirements").textContent.toLowerCase();
        const location = card.querySelector(".location").textContent.toLowerCase();
        const keywords = card.dataset.keywords.toLowerCase();
        const category = card.dataset.category.toLowerCase();
        const postedDate = card.dataset.postedDate ? new Date(card.dataset.postedDate) : null; // Assuming you might add this

        let matches = true;

        if (filters.keyword) {
            const searchTerm = filters.keyword.toLowerCase();
            if (!title.includes(searchTerm) && !company.includes(searchTerm) && !requirements.includes(searchTerm) && !keywords.includes(searchTerm)) {
                matches = false;
            }
        }

        if (filters.location) {
            const locationTerm = filters.location.toLowerCase();
            if (!location.includes(locationTerm)) {
                matches = false;
            }
        }

        if (filters.category && filters.category !== "") {
            if (category !== filters.category.toLowerCase()) {
                matches = false;
            }
        }

        if (filters.company) {
            const companyTerm = filters.company.toLowerCase();
            if (!company.includes(companyTerm)) {
                matches = false;
            }
        }

        // Implement posted date filtering if you add 'data-posted-date' to job cards
        if (filters.postedDate) {
            const today = new Date();
            let cutoffDate;
            switch (filters.postedDate) {
                case 'last7days':
                    cutoffDate = new Date(today);
                    cutoffDate.setDate(today.getDate() - 7);
                    break;
                case 'last14days':
                    cutoffDate = new Date(today);
                    cutoffDate.setDate(today.getDate() - 14);
                    break;
                case 'last30days':
                    cutoffDate = new Date(today);
                    cutoffDate.setDate(today.getDate() - 30);
                    break;
                default:
                    cutoffDate = null;
            }
            if (cutoffDate && postedDate && postedDate < cutoffDate) {
                matches = false;
            }
        }

        if (matches) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}

function filterByCategory(category) {
    const jobCards = document.querySelectorAll(".job-card");
    const searchInput = document.getElementById("jobSearch");
    const locationSearchInput = document.getElementById("locationSearch");

    searchInput.value = ""; // Clear previous search
    locationSearchInput.value = ""; // Clear previous location

    const filters = { category: category };
    filterJobs(filters);
}

// Check for search term or advanced filters in URL on page load
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get('q');
    const category = urlParams.get('category');
    const advancedFilters = {};

    for (const [key, value] of urlParams) {
        if (key !== 'q' && key !== 'category') {
            advancedFilters[key] = value;
        }
    }

    const basicSearchInput = document.getElementById('jobSearch');
    const basicLocationInput = document.getElementById('locationSearch');

    if (searchTerm) {
        basicSearchInput.value = searchTerm;
        filterJobs({ keyword: searchTerm });
    } else if (category) {
        filterByCategory(category);
    } else if (Object.keys(advancedFilters).length > 0) {
        // Populate basic search if keyword or location are present
        if (advancedFilters.keyword) {
            basicSearchInput.value = advancedFilters.keyword;
        }
        if (advancedFilters.location) {
            basicLocationInput.value = advancedFilters.location;
        }
        filterJobs(advancedFilters);
    } else {
        // Show all jobs on initial load without any filters
        filterJobs({});
    }
});

// Update the basic search to navigate with 'q' parameter
const basicSearchButton = document.querySelector('.jobs-header .search-container button');
const basicSearchInput = document.getElementById('jobSearch');
const basicLocationInput = document.getElementById('locationSearch');

if (basicSearchButton) {
    basicSearchButton.addEventListener('click', function() {
        const searchTerm = basicSearchInput.value.trim();
        const locationTerm = basicLocationInput.value.trim();
        const params = new URLSearchParams();
        if (searchTerm) {
            params.append('keyword', searchTerm);
        }
        if (locationTerm) {
            params.append('location', locationTerm);
        }
        window.location.href = `jobs.html?${params.toString()}`;
    });
}