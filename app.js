/**
 * Green Crops - Interactive Map Application
 * Core JavaScript Logic
 */

// 1. Data Structure for Green Crops Locations in Poland (Default / Fallback)
const DEFAULT_LOCATIONS = [
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
        polygon: [
            { lat: 52.2270, lng: 17.2610 },
            { lat: 52.2260, lng: 17.2910 },
            { lat: 52.2150, lng: 17.2880 },
            { lat: 52.2160, lng: 17.2580 }
        ]
    },
    {
        id: 5,
        type: 'field',
        name: 'Поле № 69 Kucice-Wschód',
        lat: 52.5872,
        lng: 20.2395,
        area: 64.5,
        crop: 'Салат Айсберг (Iceberg)',
        description: 'Специализированный сектор для выращивания хрустящего салата Айсберг с капельным прикорневым орошением.',
        polygon: [
            { lat: 52.5898, lng: 20.2340 },
            { lat: 52.5892, lng: 20.2460 },
            { lat: 52.5845, lng: 20.2445 },
            { lat: 52.5851, lng: 20.2330 }
        ]
    },
    {
        id: 6,
        type: 'field',
        name: 'Поле № 70 Kucice-Południe',
        lat: 52.5768,
        lng: 20.2281,
        area: 82,
        crop: 'Ромэн / Романо (Romaine)',
        description: 'Участок с песчано-суглинистой почвой, идеальной для плотных кочанов салата Романо. Установлены ветрозащитные экраны.',
        polygon: [
            { lat: 52.5795, lng: 20.2220 },
            { lat: 52.5790, lng: 20.2340 },
            { lat: 52.5740, lng: 20.2335 },
            { lat: 52.5745, lng: 20.2215 }
        ]
    },
    {
        id: 7,
        type: 'field',
        name: 'Поле № 71 Baboszewo-Północ',
        lat: 52.6021,
        lng: 20.1985,
        area: 115,
        crop: 'Лолло Росса (Lollo Rossa)',
        description: 'Крупное поле с кудрявым бордовым салатом Лолло Росса. Постоянный мониторинг влажности с помощью IoT-датчиков.',
        polygon: [
            { lat: 52.6055, lng: 20.1910 },
            { lat: 52.6050, lng: 20.2060 },
            { lat: 52.5985, lng: 20.2055 },
            { lat: 52.5990, lng: 20.1905 }
        ]
    },
    {
        id: 8,
        type: 'field',
        name: 'Поле № 72 Baboszewo-Centrum',
        lat: 52.5975,
        lng: 20.2090,
        area: 75,
        crop: 'Руккола (Rucola)',
        description: 'Пряная руккола с ультрабыстрым циклом вегетации. Используются биогумус и биологическая защита растений.',
        polygon: [
            { lat: 52.6002, lng: 20.2030 },
            { lat: 52.5998, lng: 20.2150 },
            { lat: 52.5948, lng: 20.2145 },
            { lat: 52.5952, lng: 20.2025 }
        ]
    },
    {
        id: 9,
        type: 'field',
        name: 'Поле № 73 Dłużniewo',
        lat: 52.6110,
        lng: 20.2410,
        area: 98,
        crop: 'Радиччо (Radicchio)',
        description: 'Северный участок для итальянского цикория Радиччо с насыщенными рубиновыми листьями.',
        polygon: [
            { lat: 52.6140, lng: 20.2340 },
            { lat: 52.6135, lng: 20.2480 },
            { lat: 52.6080, lng: 20.2475 },
            { lat: 52.6085, lng: 20.2335 }
        ]
    },
    {
        id: 10,
        type: 'field',
        name: 'Поле № 74 Kroczewo-Agro',
        lat: 52.5715,
        lng: 20.2450,
        area: 54,
        crop: 'Салат Фризе (Frisée)',
        description: 'Кружевной салат Фризе с мягкой горчинкой. Технология самозатенения сердцевины для достижения золотистого оттенка.',
        polygon: [
            { lat: 52.5740, lng: 20.2390 },
            { lat: 52.5735, lng: 20.2510 },
            { lat: 52.5690, lng: 20.2505 },
            { lat: 52.5695, lng: 20.2385 }
        ]
    },
    {
        id: 11,
        type: 'field',
        name: 'Поле № 75 Sarbiewo',
        lat: 52.5930,
        lng: 20.2620,
        area: 128.5,
        crop: 'Шпинат бэби (Baby Spinach)',
        description: 'Флагманский полигон молодого нежного шпината, автоматизированная уборка комбайнами с лазерным контролем среза.',
        polygon: [
            { lat: 52.5965, lng: 20.2540 },
            { lat: 52.5960, lng: 20.2700 },
            { lat: 52.5895, lng: 20.2690 },
            { lat: 52.5900, lng: 20.2530 }
        ]
    },
    {
        id: 12,
        type: 'field',
        name: 'Поле № 76 Cieszkowo',
        lat: 52.6055,
        lng: 20.2180,
        area: 46,
        crop: 'Лолло Бионда (Lollo Bionda)',
        description: 'Ярко-зеленый кудрявый салат Лолло Бионда. Система точного дозирования микроэлементов через подземные трубки.',
        polygon: [
            { lat: 52.6078, lng: 20.2120 },
            { lat: 52.6074, lng: 20.2240 },
            { lat: 52.6030, lng: 20.2235 },
            { lat: 52.6034, lng: 20.2115 }
        ]
    },
    {
        id: 13,
        type: 'field',
        name: 'Поле № 77 Polesie',
        lat: 52.5780,
        lng: 20.2050,
        area: 70,
        crop: 'Батавия (Batavia)',
        description: 'Стойкий полукочанный салат Батавия. Отличная устойчивость к колебаниям температуры и влажности.',
        polygon: [
            { lat: 52.5805, lng: 20.1980 },
            { lat: 52.5800, lng: 20.2110 },
            { lat: 52.5755, lng: 20.2105 },
            { lat: 52.5760, lng: 20.1975 }
        ]
    },
    {
        id: 14,
        type: 'field',
        name: 'Поле № 78 Galomin',
        lat: 52.5895,
        lng: 20.1870,
        area: 89,
        crop: 'Корн / Маш-салат (Lamb\'s Lettuce)',
        description: 'Ореховый миниатюрный маш-салат (корн). Выращивается под защитным агроволокном для сохранения деликатной текстуры.',
        polygon: [
            { lat: 52.5925, lng: 20.1800 },
            { lat: 52.5920, lng: 20.1940 },
            { lat: 52.5865, lng: 20.1935 },
            { lat: 52.5870, lng: 20.1795 }
        ]
    }
];

// Active locations array (dynamically updated from MySQL REST API if available)
let LOCATIONS = [...DEFAULT_LOCATIONS];

// =========================================================
// Каталог салатов Green Crops
// =========================================================
const SALADS_DATA = [
    {
        id: 'escarole',
        name: 'Эскарола',
        botanicalName: 'Cichorium endivia var. latifolium',
        category: 'chicory',
        categoryLabel: 'Цикорный',
        badgeClass: 'badge-chicory',
        description: 'Плотные розетки с мясистыми гладкими листьями. Визитная карточка полей Kucice. Отличается благородной пикантной горчинкой и высоким содержанием витаминов А и К.',
        flavors: ['Пикантный', 'Легкая горчинка', 'Плотная текстура'],
        season: 'Май — Октябрь',
        method: 'Открытый грунт с капельным поливом',
        fieldId: 3,
        fieldName: 'Поле № 68 Kucice'
    },
    {
        id: 'iceberg',
        name: 'Салат Айсберг',
        botanicalName: 'Lactuca sativa var. capitata',
        category: 'heading',
        categoryLabel: 'Кочанный',
        badgeClass: 'badge-heading',
        description: 'Самый популярный хрустящий кочанный салат. Листья плотные, сочные, с освежающим нейтрально-сладковатым вкусом. Идеален для ресторанных салатов и сэндвичей.',
        flavors: ['Суперхрустящий', 'Сочный', 'Освежающий'],
        season: 'Апрель — Ноябрь',
        method: 'Прикорневое орошение под пленкой',
        fieldId: 5,
        fieldName: 'Поле № 69 Kucice-Wschód'
    },
    {
        id: 'romaine',
        name: 'Ромэн / Романо',
        botanicalName: 'Lactuca sativa var. longifolia',
        category: 'heading',
        categoryLabel: 'Кочанный',
        badgeClass: 'badge-heading',
        description: 'Классический удлиненный салат, основа всемирно известного салата «Цезарь». Плотные упругие листья с хрустящей жилкой и тонким пряно-ореховым послевкусием.',
        flavors: ['Хрустящий', 'Сладковатый', 'Пряный'],
        season: 'Май — Октябрь',
        method: 'Гребневая посадка с ветрозащитой',
        fieldId: 6,
        fieldName: 'Поле № 70 Kucice-Południe'
    },
    {
        id: 'lollo-rossa',
        name: 'Лолло Росса',
        botanicalName: 'Lactuca sativa var. crispa',
        category: 'leafy',
        categoryLabel: 'Листовой',
        badgeClass: 'badge-leafy',
        description: 'Эффектный коралловый кудрявый салат с бордово-рубиновыми кончиками. Листья невероятно нежные, воздушные, с мягким ореховым оттенком.',
        flavors: ['Воздушный', 'Ореховый', 'Нежный'],
        season: 'Май — Сентябрь',
        method: 'Точное дозирование органики',
        fieldId: 7,
        fieldName: 'Поле № 71 Baboszewo-Północ'
    },
    {
        id: 'rucola',
        name: 'Руккола дикая',
        botanicalName: 'Diplotaxis tenuifolia',
        category: 'baby',
        categoryLabel: 'Baby-leaf',
        badgeClass: 'badge-baby',
        description: 'Молодые резные листья с выраженным горчично-ореховым и островатым вкусом. Богата эфирными маслами, витамином С и йодом. Сбор производится ранним утром.',
        flavors: ['Острый', 'Горчичный', 'Пряный'],
        season: 'Круглогодично (парники + открытый грунт)',
        method: 'Автоматический срез micro-leaf',
        fieldId: 8,
        fieldName: 'Поле № 72 Baboszewo-Centrum'
    },
    {
        id: 'radicchio',
        name: 'Радиччо Россо',
        botanicalName: 'Cichorium intybus var. foliosum',
        category: 'chicory',
        categoryLabel: 'Цикорный',
        badgeClass: 'badge-chicory',
        description: 'Итальянский цикорий с плотными винно-рубиновыми кочанами и белыми прожилками. Изысканная горчинка великолепно раскрывается как свежей, так и на гриле.',
        flavors: ['Изысканная горчинка', 'Хрустящий', 'Плотный'],
        season: 'Июль — Ноябрь',
        method: 'Защищенный северный грунт',
        fieldId: 9,
        fieldName: 'Поле № 73 Dłużniewo'
    },
    {
        id: 'frisee',
        name: 'Салат Фризе',
        botanicalName: 'Cichorium endivia var. crispum',
        category: 'chicory',
        categoryLabel: 'Цикорный',
        badgeClass: 'badge-chicory',
        description: 'Изящный сильнорассеченный кружевной салат. Внутренняя золотистая сердцевина формируется путем естественного самозатенения, давая нежнейший вкус с легкой терпкостью.',
        flavors: ['Кружевной', 'Тонкая горчинка', 'Упругий'],
        season: 'Июнь — Октябрь',
        method: 'Технология высветления сердцевины',
        fieldId: 10,
        fieldName: 'Поле № 74 Kroczewo-Agro'
    },
    {
        id: 'spinach',
        name: 'Шпинат бэби',
        botanicalName: 'Spinacia oleracea',
        category: 'baby',
        categoryLabel: 'Baby-leaf',
        badgeClass: 'badge-baby',
        description: 'Молодые шелковистые листья шпината первого сбора. Мясистые, сочные, с нейтрально-свежим вкусом. Рекордсмен по содержанию растительного белка и железа.',
        flavors: ['Шелковистый', 'Свежий', 'Питательный'],
        season: 'Апрель — Октябрь',
        method: 'Лазерный контроль высоты среза',
        fieldId: 11,
        fieldName: 'Поле № 75 Sarbiewo'
    },
    {
        id: 'lollo-bionda',
        name: 'Лолло Бионда',
        botanicalName: 'Lactuca sativa var. crispa',
        category: 'leafy',
        categoryLabel: 'Листовой',
        badgeClass: 'badge-leafy',
        description: 'Изумрудно-зеленый собрат Лолло Росса. Очень пышная объемная розетка, нежные сочные листья без намека на горечь. Прекрасно держит объем в готовых блюдах.',
        flavors: ['Свежий', 'Мягкий', 'Хрустящий'],
        season: 'Май — Октябрь',
        method: 'Фертигация через микротрубки',
        fieldId: 12,
        fieldName: 'Поле № 76 Cieszkowo'
    },
    {
        id: 'batavia',
        name: 'Салат Батавия',
        botanicalName: 'Lactuca sativa var. capitata',
        category: 'heading',
        categoryLabel: 'Кочанный',
        badgeClass: 'badge-heading',
        description: 'Французский полукочанный салат с волнистыми фестончатыми листьями. Сочетает мягкость листовых салатов и сочную хрусткость кочанных.',
        flavors: ['Сладковатый', 'Сочный', 'Волнистый'],
        season: 'Май — Октябрь',
        method: 'Термостабильные гряды',
        fieldId: 13,
        fieldName: 'Поле № 77 Polesie'
    },
    {
        id: 'mache',
        name: 'Корн / Маш-салат',
        botanicalName: 'Valerianella locusta',
        category: 'baby',
        categoryLabel: 'Baby-leaf',
        badgeClass: 'badge-baby',
        description: 'Крошечные округлые темно-зеленые листочки, собранные в розетки. Обладает выраженным сладковато-ореховым вкусом и легким маслянистым ощущением.',
        flavors: ['Ореховый', 'Маслянистый', 'Деликатный'],
        season: 'Сентябрь — Апрель (холодостойкий)',
        method: 'Культивация под агроволокном',
        fieldId: 14,
        fieldName: 'Поле № 78 Galomin'
    },
    {
        id: 'rapeseed',
        name: 'Рапс яровой',
        botanicalName: 'Brassica napus',
        category: 'leafy',
        categoryLabel: 'Агрокультура',
        badgeClass: 'badge-leafy',
        description: 'Масличная и кормовая высокотехнологичная культура. На полях Великопольши выращивается с использованием беспилотного мониторинга вегетации NDVI.',
        flavors: ['Масличный', 'Медоносный', 'Технический'],
        season: 'Апрель — Август',
        method: 'Дроны и точечное внесение микроэлементов',
        fieldId: 4,
        fieldName: 'Великопольское поле B-05'
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

    // Fetch dynamic data from MySQL REST API if available
    fetchLocationsFromAPI();

    // Handle map clicks to close active InfoWindow and reset card highlights
    map.addListener('click', () => {
        closeActiveInfoWindow();
        clearCardSelection();
    });
}

// Clear all markers and polygons from the map
function clearMapObjects() {
    markers.forEach(m => {
        if (m.markerInstance) m.markerInstance.setMap(null);
    });
    markers = [];

    mapPolygons.forEach(p => {
        if (p.polygonInstance) p.polygonInstance.setMap(null);
    });
    mapPolygons = [];
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

    // 9.4 Set stats in sidebar and fetch from MySQL API
    updateSidebarStats();
    fetchLocationsFromAPI();

    // 9.5 Initialize Salads Catalog modal events
    initSaladsModalEvents();

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

// 10. Update sidebar statistics
function updateSidebarStats() {
    const officesCount = LOCATIONS.filter(l => l.type === 'office').length;
    const fieldsCount = LOCATIONS.filter(l => l.type === 'field').length;
    const totalArea = LOCATIONS.filter(l => l.type === 'field').reduce((sum, l) => sum + (parseFloat(l.area) || 0), 0);

    const officesEl = document.getElementById('stat-offices');
    const fieldsEl = document.getElementById('stat-fields');
    const areaEl = document.getElementById('stat-area');

    if (officesEl) officesEl.textContent = officesCount;
    if (fieldsEl) fieldsEl.textContent = fieldsCount;
    if (areaEl) areaEl.textContent = `${Math.round(totalArea * 100) / 100} га`;
}

// 11. Fetch objects dynamically from backend MySQL REST API
let isFetchingAPI = false;
async function fetchLocationsFromAPI() {
    if (isFetchingAPI) return;
    isFetchingAPI = true;

    // Check potential API endpoints (relative or localhost:3000)
    const apiEndpoints = [
        '/api/locations',
        'http://localhost:3000/api/locations'
    ];

    for (const url of apiEndpoints) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 2000);
            const response = await fetch(url, { signal: controller.signal });
            clearTimeout(timeoutId);

            if (response.ok) {
                const data = await response.json();
                if (Array.isArray(data) && data.length > 0) {
                    console.log(`✅ [Green Crops] Загружено ${data.length} объектов из базы данных MySQL (${url})`);
                    LOCATIONS = data;
                    updateSidebarStats();

                    // If map is already initialized, refresh markers and bounds
                    if (mapInitialized && map) {
                        clearMapObjects();
                        createMapObjects();
                        updateMapVisibility();
                        resetMapBounds();
                    }

                    renderList();
                    isFetchingAPI = false;
                    return true;
                }
            }
        } catch (err) {
            // Silently try next endpoint or fallback
        }
    }

    console.info('ℹ️ [Green Crops] MySQL REST API не ответил (сервер выключен или недоступен). Используются встроенные локальные данные.');
    updateSidebarStats();
    isFetchingAPI = false;
    return false;
}

// =========================================================
// 12. Salads Catalog Modal Controller
// =========================================================
let currentSaladCategory = 'all';
let currentSaladSearch = '';

function openSaladsModal() {
    const modal = document.getElementById('salads-modal');
    if (!modal) return;

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    // Render cards
    renderSaladsCatalog();

    // Focus search input
    setTimeout(() => {
        const searchInput = document.getElementById('salad-search-input');
        if (searchInput) searchInput.focus();
    }, 150);
}

function closeSaladsModal() {
    const modal = document.getElementById('salads-modal');
    if (!modal) return;

    modal.classList.add('hidden');
    document.body.style.overflow = '';
}

function renderSaladsCatalog() {
    const grid = document.getElementById('salads-catalog-grid');
    if (!grid) return;

    grid.innerHTML = '';

    const query = currentSaladSearch.toLowerCase().trim();

    const filtered = SALADS_DATA.filter(salad => {
        // Category filter
        const matchCategory = currentSaladCategory === 'all' || salad.category === currentSaladCategory;

        // Search query filter
        let matchQuery = true;
        if (query) {
            const inName = salad.name.toLowerCase().includes(query);
            const inBotanical = salad.botanicalName.toLowerCase().includes(query);
            const inDesc = salad.description.toLowerCase().includes(query);
            const inFlavors = salad.flavors.some(f => f.toLowerCase().includes(query));
            const inField = salad.fieldName.toLowerCase().includes(query);
            matchQuery = inName || inBotanical || inDesc || inFlavors || inField;
        }

        return matchCategory && matchQuery;
    });

    if (filtered.length === 0) {
        grid.innerHTML = `
            <div class="empty-placeholder" style="grid-column: 1 / -1; padding: 50px 20px;">
                <i class="fa-solid fa-leaf" style="font-size: 32px; color: var(--accent-color); margin-bottom: 12px;"></i>
                <p style="font-size: 15px; color: #ffffff; margin-bottom: 6px;">Сорта салатов не найдены</p>
                <p style="font-size: 13px; color: var(--text-muted);">Попробуйте изменить запрос или сбросить категорию.</p>
            </div>
        `;
        return;
    }

    filtered.forEach(salad => {
        const card = document.createElement('div');
        card.className = 'salad-card';

        const flavorPills = salad.flavors.map(f => `<span class="flavor-tag"><i class="fa-solid fa-check"></i>${f}</span>`).join('');

        card.innerHTML = `
            <div class="salad-card-top">
                <div class="salad-card-header">
                    <div class="salad-name-group">
                        <h3>${salad.name}</h3>
                        <span class="salad-botanical">${salad.botanicalName}</span>
                    </div>
                    <span class="salad-type-badge ${salad.badgeClass}">${salad.categoryLabel}</span>
                </div>
                <p class="salad-desc">${salad.description}</p>
                <div class="salad-flavors">${flavorPills}</div>
            </div>
            <div class="salad-card-bottom">
                <div class="salad-field-info">
                    <span><i class="fa-solid fa-sun" style="color: #eab308; margin-right: 4px;"></i>Сезон: <strong>${salad.season}</strong></span>
                    <span><i class="fa-solid fa-location-dot" style="color: var(--accent-color); margin-right: 4px;"></i><strong>${salad.fieldName}</strong></span>
                </div>
                <button class="btn-goto-field" type="button" data-field-id="${salad.fieldId}">
                    <i class="fa-solid fa-map-location-dot"></i> На поле на карте
                </button>
            </div>
        `;

        // Click on "На поле на карте"
        const gotoBtn = card.querySelector('.btn-goto-field');
        if (gotoBtn) {
            gotoBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                closeSaladsModal();

                // Select and zoom on field
                if (typeof window.focusOnLocation === 'function') {
                    window.focusOnLocation(salad.fieldId);
                }
            });
        }

        grid.appendChild(card);
    });
}

// Bind modal events
function initSaladsModalEvents() {
    // Open buttons
    const btnOpenSidebar = document.getElementById('btn-open-catalog');
    if (btnOpenSidebar) {
        btnOpenSidebar.addEventListener('click', openSaladsModal);
    }

    const btnOpenFloating = document.getElementById('btn-open-catalog-floating');
    if (btnOpenFloating) {
        btnOpenFloating.addEventListener('click', openSaladsModal);
    }

    // Close buttons
    const btnClose = document.getElementById('btn-close-catalog');
    if (btnClose) {
        btnClose.addEventListener('click', closeSaladsModal);
    }

    const btnCloseBottom = document.getElementById('btn-close-catalog-bottom');
    if (btnCloseBottom) {
        btnCloseBottom.addEventListener('click', closeSaladsModal);
    }

    // Close on backdrop click
    const modal = document.getElementById('salads-modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeSaladsModal();
            }
        });
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
            closeSaladsModal();
        }
    });

    // Category pills filter
    const catPills = document.querySelectorAll('.cat-pill');
    catPills.forEach(pill => {
        pill.addEventListener('click', () => {
            catPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            currentSaladCategory = pill.getAttribute('data-category') || 'all';
            renderSaladsCatalog();
        });
    });

    // Search input
    const searchInput = document.getElementById('salad-search-input');
    const clearSearchBtn = document.getElementById('clear-salad-search');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSaladSearch = e.target.value;
            if (clearSearchBtn) {
                clearSearchBtn.style.display = currentSaladSearch ? 'block' : 'none';
            }
            renderSaladsCatalog();
        });
    }

    if (clearSearchBtn) {
        clearSearchBtn.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            currentSaladSearch = '';
            clearSearchBtn.style.display = 'none';
            renderSaladsCatalog();
            if (searchInput) searchInput.focus();
        });
    }
}

// Expose openSaladsModal globally
window.openSaladsModal = openSaladsModal;
window.closeSaladsModal = closeSaladsModal;


