/**
 * Green Crops - Interactive Map Application
 * Core JavaScript Logic
 */

// 1. Data Structure for Green Crops Locations in Poland
const LOCATIONS = [
    {
        id: 1,
        type: 'office',
        name: 'Главный офис Green Crops (Варшава)',
        lat: 52.2297,
        lng: 21.0122,
        address: 'Al. Jerozolimskie 50, 00-024 Warszawa',
        phone: '+48 22 123 45 67',
        email: 'info@greencrops.pl',
        description: 'Центральный офис по развитию инновационных агротехнологий, стратегическому планированию и работе с ключевыми инвесторами в Восточной Европе.',
        polygon: null
    },
    {
        id: 2,
        type: 'office',
        name: 'Филиал Green Crops (Познань)',
        lat: 52.4064,
        lng: 16.9252,
        address: 'ul. Półwiejska 42, 61-888 Poznań',
        phone: '+48 61 765 43 21',
        email: 'poznan@greencrops.pl',
        description: 'Региональный офис, курирующий исследования почв, дистрибуцию экологических семян и логистику в западных воеводствах Польши.',
        polygon: null
    },
    {
        id: 3,
        type: 'field',
        name: 'Поле № 68 Kucice',
        lat: 52.584352,
        lng: 20.224363,
        area: 120, // in hectares
        crop: 'Эскарола',
        description: 'Экспериментальное поле с интегрированной системой датчиков влажности почвы, автоматическими метеостанциями и контролем орошения.',
        // Boundary polygon coordinates for Lublin field (Poniatowa area)
        polygon: [
            { lat: 52.58301792987952, lng: 20.220983043476583 },
            { lat: 52.58508504282435, lng: 20.22906596399158 },
            { lat: 52.58183242671485,  lng: 20.22658546411128 },
            { lat: 52.58610962649472,  lng: 20.22333042060592 }
        ]
    },
    {
        id: 4,
        type: 'field',
        name: 'Великопольское поле B-05',
        lat: 52.2215,
        lng: 17.2763,
        area: 85, // in hectares
        crop: 'Рапс (Rapeseed)',
        description: 'Поле для выращивания рапса с использованием беспилотных дронов для мультиспектрального картирования и вегетационного анализа (NDVI).',
        // Boundary polygon coordinates for Wielkopolska field (near Sroda Wielkopolska)
        polygon: [
            { lat: 52.2270, lng: 17.2610 },
            { lat: 52.2260, lng: 17.2910 },
            { lat: 52.2150, lng: 17.2880 },
            { lat: 52.2160, lng: 17.2580 }
        ]
    }
];

// 2. Global State Variables
let map = null;
let markers = [];
let mapPolygons = [];
let activeInfoWindow = null;
let activeLocationId = null;
let currentFilter = 'all';
let searchQuery = '';
let mapInitialized = false;

// 3. Initialize Google Map
function initMap() {
    mapInitialized = true;
    
    // Default Map Settings
    const mapOptions = {
        zoom: 6,
        center: { lat: 52.1, lng: 19.4 }, // Center of Poland
        mapTypeId: 'terrain', // Great fit for agro projects
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true,
        styles: [
            {
                "featureType": "administrative",
                "elementType": "labels.text.fill",
                "stylers": [{ "color": "#2c3e2e" }]
            },
            {
                "featureType": "landscape",
                "elementType": "all",
                "stylers": [{ "color": "#f2f4f2" }]
            },
            {
                "featureType": "water",
                "elementType": "all",
                "stylers": [{ "color": "#c5d9e8" }]
            },
            {
                "featureType": "poi.park",
                "elementType": "geometry",
                "stylers": [{ "color": "#e2eedf" }]
            }
        ]
    };

    // Create the Map Instance
    const mapElement = document.getElementById('map');
    if (!mapElement) return;
    map = new google.maps.Map(mapElement, mapOptions);

    // Hide fallback warnings if script loaded successfully
    const fallback = document.getElementById('map-fallback');
    if (fallback) fallback.classList.add('hidden');

    // Setup Markers and Polygons
    createMapObjects();

    // Set initial bounds to fit all locations
    resetMapBounds();

    // Render list cards in the sidebar
    renderList();

    // Handle map clicks to close active InfoWindow and reset card highlights
    map.addListener('click', () => {
        closeActiveInfoWindow();
        clearCardSelection();
    });
}

// 4. Create Markers and Polygons on the Map
function createMapObjects() {
    // Custom SVG path for Google Maps Markers (Pin icon)
    const pinSvgPath = "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z";

    LOCATIONS.forEach(loc => {
        // SVG styling based on type
        const isOffice = loc.type === 'office';
        const markerColor = isOffice ? '#0ea5e9' : '#10b981'; // Cyan / Green

        const markerIcon = {
            path: pinSvgPath,
            fillColor: markerColor,
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 1.5,
            scale: 1.6,
            anchor: new google.maps.Point(12, 22),
            labelOrigin: new google.maps.Point(12, 9)
        };

        // Create Marker
        const marker = new google.maps.Marker({
            position: { lat: loc.lat, lng: loc.lng },
            map: map,
            title: loc.name,
            icon: markerIcon,
            animation: google.maps.Animation.DROP
        });

        // Save marker reference
        markers.push({
            id: loc.id,
            type: loc.type,
            markerInstance: marker
        });

        // Create Boundary Polygon for fields if coords exist
        let polygonInstance = null;
        if (loc.type === 'field' && loc.polygon) {
            polygonInstance = new google.maps.Polygon({
                paths: loc.polygon,
                strokeColor: '#10b981',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#10b981',
                fillOpacity: 0.2,
                map: map
            });

            // Save polygon reference
            mapPolygons.push({
                id: loc.id,
                polygonInstance: polygonInstance
            });

            // Bind click event to Polygon to open InfoWindow too
            polygonInstance.addListener('click', (event) => {
                selectLocation(loc.id, true);
            });

            // Interactive hover styling for polygons
            polygonInstance.addListener('mouseover', () => {
                polygonInstance.setOptions({ fillOpacity: 0.35, strokeWeight: 3 });
            });
            polygonInstance.addListener('mouseout', () => {
                polygonInstance.setOptions({ fillOpacity: 0.2, strokeWeight: 2 });
            });
        }

        // Add Click listener to Marker
        marker.addListener('click', () => {
            selectLocation(loc.id, true); // true = center map
        });
    });
}

// 5. Build Custom InfoWindow Content
function getInfoWindowHTML(loc) {
    const isOffice = loc.type === 'office';
    const typeLabel = isOffice ? 'Офис' : 'Поле';
    const badgeClass = isOffice ? 'office' : 'field';

    let specificContent = '';
    if (isOffice) {
        specificContent = `
            <div class="iw-body-row">
                <i class="fa-solid fa-location-dot"></i>
                <span>${loc.address}</span>
            </div>
            <div class="iw-body-row">
                <i class="fa-solid fa-phone"></i>
                <span>${loc.phone}</span>
            </div>
            <div class="iw-body-row">
                <i class="fa-solid fa-envelope"></i>
                <span>${loc.email}</span>
            </div>
        `;
    } else {
        specificContent = `
            <div class="iw-body-row">
                <i class="fa-solid fa-chart-area"></i>
                <span>Площадь: <strong>${loc.area} га</strong></span>
            </div>
            <div class="iw-body-row">
                <i class="fa-solid fa-wheat-awn"></i>
                <span>Культура: <strong>${loc.crop}</strong></span>
            </div>
        `;
    }

    // Google Directions URL
    const directionUrl = `https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}`;

    return `
        <div class="iw-container">
            <header class="iw-header">
                <span class="iw-title">${loc.name}</span>
                <span class="iw-badge ${badgeClass}">${typeLabel}</span>
            </header>
            <div class="iw-body">
                <p style="margin-bottom: 8px; font-style: italic;">${loc.description}</p>
                ${specificContent}
            </div>
            <a href="${directionUrl}" target="_blank" class="iw-route-btn">
                <i class="fa-solid fa-diamond-turn-right"></i> Проложить маршрут
            </a>
        </div>
    `;
}

// 6. Focus Map on Selected Object
function selectLocation(id, shouldCenter = true) {
    const loc = LOCATIONS.find(l => l.id === id);
    if (!loc) return;

    activeLocationId = id;

    // Highlight sidebar card
    highlightCard(id);

    // Close any open InfoWindow
    closeActiveInfoWindow();

    // Find marker instance
    const markerObj = markers.find(m => m.id === id);
    if (markerObj && map) {
        const marker = markerObj.markerInstance;

        // Open InfoWindow
        activeInfoWindow = new google.maps.InfoWindow({
            content: getInfoWindowHTML(loc)
        });

        activeInfoWindow.open(map, marker);

        // Listen for close click on InfoWindow
        activeInfoWindow.addListener('closeclick', () => {
            clearCardSelection();
            activeLocationId = null;
        });

        // Center and Zoom map smoothly if requested
        if (shouldCenter) {
            const zoomLevel = loc.type === 'office' ? 14 : 13;
            map.panTo({ lat: loc.lat, lng: loc.lng });
            
            // Add a little delay to feel smooth after panning
            setTimeout(() => {
                map.setZoom(zoomLevel);
            }, 300);
        }
    }
}

// Helper to open/pan to object from Card click
window.focusOnLocation = function(id) {
    selectLocation(id, true);
    
    // On mobile, close sidebar automatically after selecting an item
    if (window.innerWidth <= 768) {
        toggleSidebar(false);
    }
};

// 7. Render dynamic sidebar items
function renderList() {
    const listContainer = document.getElementById('objects-list');
    const itemsCountEl = document.getElementById('items-count');
    
    if (!listContainer) return;
    listContainer.innerHTML = '';

    // Filter locations array based on global state filters
    const filteredLocations = LOCATIONS.filter(loc => {
        // Type filter
        const matchesFilter = currentFilter === 'all' || loc.type === currentFilter;

        // Text search filter
        const text = searchQuery.toLowerCase();
        let matchesSearch = false;
        
        if (text === '') {
            matchesSearch = true;
        } else {
            const nameMatch = loc.name.toLowerCase().includes(text);
            const descMatch = loc.description.toLowerCase().includes(text);
            let specificMatch = false;
            
            if (loc.type === 'office') {
                specificMatch = loc.address.toLowerCase().includes(text) || loc.email.toLowerCase().includes(text);
            } else {
                specificMatch = loc.crop.toLowerCase().includes(text) || String(loc.area).includes(text);
            }
            matchesSearch = nameMatch || descMatch || specificMatch;
        }

        return matchesFilter && matchesSearch;
    });

    // Update statistics counter
    itemsCountEl.textContent = filteredLocations.length;

    // Show empty state if no locations match filters
    if (filteredLocations.length === 0) {
        listContainer.innerHTML = `
            <div class="empty-placeholder">
                <i class="fa-solid fa-circle-question"></i>
                <p>Объекты не найдены.<br>Попробуйте изменить запрос.</p>
            </div>
        `;
        return;
    }

    // Build card HTML templates
    filteredLocations.forEach(loc => {
        const card = document.createElement('div');
        const isActive = loc.id === activeLocationId;
        card.className = `object-card type-${loc.type} ${isActive ? 'active' : ''}`;
        card.id = `card-${loc.id}`;
        card.setAttribute('onclick', `focusOnLocation(${loc.id})`);

        const isOffice = loc.type === 'office';
        const badgeLabel = isOffice ? 'Офис' : 'Поле';
        
        let detailsHtml = '';
        if (isOffice) {
            detailsHtml = `
                <div class="card-info-item">
                    <i class="fa-solid fa-location-dot"></i>
                    <span>${loc.address}</span>
                </div>
                <div class="card-info-item">
                    <i class="fa-solid fa-phone"></i>
                    <span>${loc.phone}</span>
                </div>
            `;
        } else {
            detailsHtml = `
                <div class="card-info-item">
                    <i class="fa-solid fa-wheat-awn"></i>
                    <span>Культура: <strong>${loc.crop}</strong></span>
                </div>
                <div class="card-detail-pill">
                    <i class="fa-solid fa-chart-area"></i>
                    <span>Площадь: ${loc.area} га</span>
                </div>
            `;
        }

        card.innerHTML = `
            <div class="card-header">
                <h3 class="card-title">${loc.name}</h3>
                <span class="badge ${loc.type}">${badgeLabel}</span>
            </div>
            <div class="card-body">
                ${detailsHtml}
            </div>
        `;

        listContainer.appendChild(card);
    });
}

// 8. Card Highlights and Map Helpers
function highlightCard(id) {
    clearCardSelection();
    const activeCard = document.getElementById(`card-${id}`);
    if (activeCard) {
        activeCard.classList.add('active');
        // Scroll card into view inside sidebar smooth
        activeCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

function clearCardSelection() {
    const cards = document.querySelectorAll('.object-card');
    cards.forEach(card => card.classList.remove('active'));
}

function closeActiveInfoWindow() {
    if (activeInfoWindow) {
        activeInfoWindow.close();
        activeInfoWindow = null;
    }
}

// Fit map viewport to see all matching coordinates
function resetMapBounds() {
    if (!map || markers.length === 0) return;

    const bounds = new google.maps.LatLngBounds();
    let hasVisibleMarkers = false;

    markers.forEach(m => {
        // Only include markers that are currently visible
        if (m.markerInstance.getVisible()) {
            bounds.extend(m.markerInstance.getPosition());
            hasVisibleMarkers = true;
        }
    });

    if (hasVisibleMarkers) {
        map.fitBounds(bounds);
        
        // Prevent map from zooming too close if only 1 location is showing
        const listener = google.maps.event.addListener(map, 'idle', () => {
            if (map.getZoom() > 14) {
                map.setZoom(10);
            }
            google.maps.event.removeListener(listener);
        });
    } else {
        // Fallback to center of Poland
        map.setCenter({ lat: 52.1, lng: 19.4 });
        map.setZoom(6);
    }
}

// Update Map markers visibility when filters change
function updateMapVisibility() {
    markers.forEach(m => {
        const matchesFilter = currentFilter === 'all' || m.type === currentFilter;
        
        // Check if matching search query too
        const loc = LOCATIONS.find(l => l.id === m.id);
        const text = searchQuery.toLowerCase();
        let matchesSearch = false;
        
        if (text === '') {
            matchesSearch = true;
        } else {
            const nameMatch = loc.name.toLowerCase().includes(text);
            const descMatch = loc.description.toLowerCase().includes(text);
            let specificMatch = false;
            if (loc.type === 'office') {
                specificMatch = loc.address.toLowerCase().includes(text) || loc.email.toLowerCase().includes(text);
            } else {
                specificMatch = loc.crop.toLowerCase().includes(text) || String(loc.area).includes(text);
            }
            matchesSearch = nameMatch || descMatch || specificMatch;
        }

        const isVisible = matchesFilter && matchesSearch;
        m.markerInstance.setVisible(isVisible);

        // Hide/Show polygon as well
        const polyObj = mapPolygons.find(p => p.id === m.id);
        if (polyObj) {
            polyObj.polygonInstance.setMap(isVisible ? map : null);
        }
    });

    // Close open windows since the object might be hidden
    closeActiveInfoWindow();
    activeLocationId = null;
    clearCardSelection();
}

// 9. Document Events & Controllers
document.addEventListener('DOMContentLoaded', () => {
    // 9.1 Filter buttons event handling
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Remove active style from all, add to clicked
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Apply filter value
            currentFilter = btn.getAttribute('data-filter');
            
            // Sync Map and Sidebar List
            if (mapInitialized) {
                updateMapVisibility();
                resetMapBounds();
            }
            renderList();
        });
    });

    // 9.2 Search logic with clear button
    const searchInput = document.getElementById('search-input');
    const searchBox = searchInput.parentElement;
    const clearBtn = document.getElementById('clear-search');

    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.trim();
        
        if (searchQuery.length > 0) {
            searchBox.classList.add('has-text');
        } else {
            searchBox.classList.remove('has-text');
        }

        // Apply dynamic search filters
        if (mapInitialized) {
            updateMapVisibility();
            // Automatically fit bounds of remaining search results
            resetMapBounds();
        }
        renderList();
    });

    clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchQuery = '';
        searchBox.classList.remove('has-text');
        
        if (mapInitialized) {
            updateMapVisibility();
            resetMapBounds();
        }
        renderList();
        searchInput.focus();
    });

    // 9.3 Sidebar Toggle on Mobile
    const toggleBtn = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar-panel');
    
    // Create overlay backdrop if it doesn't exist
    let overlay = document.querySelector('.sidebar-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        document.body.appendChild(overlay);
    }

    function toggleSidebar(forceState) {
        const isOpen = typeof forceState === 'boolean' ? forceState : !sidebar.classList.contains('open');
        
        if (isOpen) {
            sidebar.classList.add('open');
            overlay.classList.add('active');
            toggleBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        } else {
            sidebar.classList.remove('open');
            overlay.classList.remove('active');
            toggleBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
        }
    }

    toggleBtn.addEventListener('click', () => toggleSidebar());
    overlay.addEventListener('click', () => toggleSidebar(false));

    // Expose overlay toggle function
    window.toggleSidebar = toggleSidebar;

    // 9.4 Set stats in sidebar from our array
    const officesCount = LOCATIONS.filter(l => l.type === 'office').length;
    const fieldsCount = LOCATIONS.filter(l => l.type === 'field').length;
    const totalArea = LOCATIONS.filter(l => l.type === 'field').reduce((sum, l) => sum + l.area, 0);

    document.getElementById('stat-offices').textContent = officesCount;
    document.getElementById('stat-fields').textContent = fieldsCount;
    document.getElementById('stat-area').textContent = `${totalArea} га`;

    // 9.5 Fail-safe checks for Google Maps script load
    // If the map isn't loaded after 4 seconds (e.g. no internet or key wasn't replaced), show instruction overlay
    setTimeout(() => {
        if (!mapInitialized) {
            const fallback = document.getElementById('map-fallback');
            if (fallback) {
                fallback.classList.remove('hidden');
            }
            // Populate list anyway so user can see it works
            renderListingsFallback();
        }
    }, 4000);
});

// Rendering list cards even if Google Maps fails to initialize
function renderListingsFallback() {
    renderList();
    // Modify onclick function of cards since focusOnLocation depends on Maps api
    const cards = document.querySelectorAll('.object-card');
    cards.forEach(card => {
        const locId = parseInt(card.id.split('-')[1]);
        card.removeAttribute('onclick');
        card.addEventListener('click', () => {
            highlightCard(locId);
            activeLocationId = locId;
            renderListingsFallback();
        });
    });
}
