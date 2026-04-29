import API from '../../utils/api';
import L from 'leaflet';

class HomePage {
  async render() {
    return `
      <div class="space-y-8">
        <section class="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <h2 class="text-xl font-bold mb-4">Lokasi <span class="text-yellow-400">Stories</span></h2>
          <div id="map" class="h-64 md:h-96 w-full rounded-xl z-0 relative"></div>
        </section>

        <section>
          <h2 class="text-2xl font-bold mb-6">Terbaru</h2>
          <div id="stories-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Loading skeleton ala student -->
            <div class="animate-pulse bg-gray-200 h-64 rounded-2xl"></div>
            <div class="animate-pulse bg-gray-200 h-64 rounded-2xl"></div>
            <div class="animate-pulse bg-gray-200 h-64 rounded-2xl"></div>
          </div>
        </section>
      </div>
    `;
  }

  async afterRender() {
    const container = document.querySelector('#stories-container');
    
    try {
      const response = await API.getStories();
      const stories = response.listStory || [];
      
      container.innerHTML = ''; // bersihkan skeleton
      
      if (stories.length === 0) {
        container.innerHTML = '<p class="text-gray-500">Belum ada story.</p>';
        return;
      }

      // Render Map
      this._initMap(stories);

      // Render Cards
      stories.forEach((story) => {
        const date = new Date(story.createdAt).toLocaleDateString('id-ID', {
          year: 'numeric', month: 'long', day: 'numeric'
        });

        const card = document.createElement('a');
        card.href = `#/story/${story.id}`;
        card.className = 'bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col cursor-pointer block';
        card.innerHTML = `
          <img src="${story.photoUrl}" alt="Foto dari ${story.name}" class="w-full h-48 object-cover" loading="lazy">
          <div class="p-5 flex flex-col flex-grow">
            <h3 class="font-bold text-lg mb-1">${story.name}</h3>
            <p class="text-sm text-gray-400 mb-3">${date}</p>
            <p class="text-gray-700 text-sm line-clamp-3">${story.description}</p>
          </div>
        `;
        container.appendChild(card);
      });

    } catch (error) {
      container.innerHTML = '<p class="text-red-500">Gagal memuat data story.</p>';
    }
  }

  _initMap(stories) {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;

    // Default view ke tengah Indonesia
    const map = L.map('map').setView([-2.548926, 118.0148634], 5);

    const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    });

    const satLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });

    // Menambahkan layer OSM sebagai default
    osmLayer.addTo(map);

    // Menambahkan Layer Control (Multiple Tile Layers)
    L.control.layers({
      "OpenStreetMap": osmLayer,
      "Satellite": satLayer
    }).addTo(map);

    stories.forEach(story => {
      if (story.lat && story.lon) {
        const marker = L.marker([story.lat, story.lon]).addTo(map);
        marker.bindPopup(`
          <div class="text-center">
            <b class="block mb-1">${story.name}</b>
            <img src="${story.photoUrl}" alt="Foto" class="w-16 h-16 object-cover mx-auto rounded-lg mb-1">
          </div>
        `);
      }
    });
  }
}

export default HomePage;
