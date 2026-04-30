import API from '../../utils/api';
import L from 'leaflet';

class HomePage {
  async render() {
    return `
      <div class="space-y-12 mt-6">
        <section class="bg-[#ffadad] p-6 rounded-2xl border-2 border-black shadow-[6px_6px_0_0_#000]">
          <h2 class="text-2xl font-bold mb-4 font-mono text-black">Lokasi Stories</h2>
          <div id="map" class="h-64 md:h-96 w-full rounded-xl border-2 border-black z-0 relative"></div>
        </section>

        <section>
          <h2 class="text-3xl font-bold mb-6 font-mono text-black">Terbaru</h2>
          <div id="stories-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <!-- Loading skeleton -->
            <div class="animate-pulse bg-gray-300 border-2 border-black shadow-[4px_4px_0_0_#000] h-64 rounded-2xl"></div>
            <div class="animate-pulse bg-gray-300 border-2 border-black shadow-[4px_4px_0_0_#000] h-64 rounded-2xl"></div>
            <div class="animate-pulse bg-gray-300 border-2 border-black shadow-[4px_4px_0_0_#000] h-64 rounded-2xl"></div>
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
      
      container.innerHTML = '';
      
      if (stories.length === 0) {
        container.innerHTML = '<p class="text-gray-500">Belum ada story.</p>';
        return;
      }

      this._initMap(stories);

      const colors = ['bg-[#a2d2ff]', 'bg-[#fde047]', 'bg-[#caffbf]', 'bg-[#ffadad]', 'bg-[#bde0fe]'];

      stories.forEach((story, index) => {
        const date = new Date(story.createdAt).toLocaleDateString('id-ID', {
          year: 'numeric', month: 'long', day: 'numeric'
        });

        const colorClass = colors[index % colors.length];

        const card = document.createElement('a');
        card.id = `story-card-${index}`;
        card.href = `#/story/${story.id}`;
        card.className = `${colorClass} rounded-2xl overflow-hidden border-2 border-black shadow-[6px_6px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0_0_#000] transition-all flex flex-col cursor-pointer block`;
        card.innerHTML = `
          <img src="${story.photoUrl}" alt="Foto dari ${story.name}" class="w-full h-48 object-cover border-b-2 border-black" loading="lazy">
          <div class="p-5 flex flex-col flex-grow overflow-hidden">
            <h3 class="font-bold text-xl mb-1 font-mono text-black break-words">${story.name}</h3>
            <p class="text-sm font-bold text-gray-700 mb-3">${date}</p>
            <p class="text-black font-medium text-sm line-clamp-3 break-all">${story.description}</p>
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

    const map = L.map('map').setView([-2.548926, 118.0148634], 5);

    const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    });

    const satLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });

    osmLayer.addTo(map);

    L.control.layers({
      "OpenStreetMap": osmLayer,
      "Satellite": satLayer
    }).addTo(map);

    stories.forEach((story, index) => {
      if (story.lat && story.lon) {
        const marker = L.marker([story.lat, story.lon]).addTo(map);
        marker.bindPopup(`
          <div class="text-center">
            <b class="block mb-1">${story.name}</b>
            <img src="${story.photoUrl}" alt="Foto" class="w-16 h-16 object-cover mx-auto rounded-lg mb-1">
          </div>
        `);
        
        // Simpan marker ke DOM card untuk sinkronisasi list dan peta (Kriteria Skilled)
        const card = document.getElementById(`story-card-${index}`);
        if (card) {
          card.addEventListener('mouseenter', () => {
            map.flyTo([story.lat, story.lon], 8, { duration: 0.5 });
            marker.openPopup();
          });
        }
      }
    });
  }
}

export default HomePage;
