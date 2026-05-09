import API from '../../utils/api';
import L from 'leaflet';
import IDBHelper from '../../data/idb-helper';

class HomePage {
  async render() {
    return `
      <div class="space-y-12 mt-6">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 class="text-4xl font-bold font-mono text-black">Beranda</h1>
          <div class="flex gap-4 w-full md:w-auto">
            <label for="search-input" class="sr-only">Cari story</label>
            <input type="text" id="search-input" placeholder="Cari story..." class="px-4 py-2 border-2 border-black rounded-xl shadow-[4px_4px_0_0_#000] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-transform w-full md:w-64 font-bold">
            <label for="sort-select" class="sr-only">Urutkan story</label>
            <select id="sort-select" class="px-4 py-2 border-2 border-black rounded-xl shadow-[4px_4px_0_0_#000] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-transform font-bold cursor-pointer">
              <option value="newest">Terbaru</option>
              <option value="oldest">Terlama</option>
            </select>
          </div>
        </div>
        
        <section class="bg-[#ffadad] p-6 rounded-2xl border-2 border-black shadow-[6px_6px_0_0_#000]">
          <h2 class="text-2xl font-bold mb-4 font-mono text-black">Lokasi Stories</h2>
          <div id="map" class="h-64 md:h-96 w-full rounded-xl border-2 border-black z-0 relative"></div>
        </section>

        <section>
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-3xl font-bold font-mono text-black">Daftar Story</h2>
          </div>
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
    this.container = document.querySelector('#stories-container');
    this.searchInput = document.querySelector('#search-input');
    this.sortSelect = document.querySelector('#sort-select');
    this.allStories = [];
    
    try {
      const response = await API.getStories();
      this.allStories = response.listStory || [];
      
      // Save to IDB for offline use
      await IDBHelper.clearStories();
      for (const story of this.allStories) {
        await IDBHelper.putStory(story);
      }
    } catch (error) {
      console.warn('Network failed, falling back to IDB');
      this.allStories = await IDBHelper.getAllStories();
    }
    
    this._renderStories(this.allStories);

    this.searchInput.addEventListener('input', () => this._handleFilterAndSort());
    this.sortSelect.addEventListener('change', () => this._handleFilterAndSort());
  }

  _handleFilterAndSort() {
    const keyword = this.searchInput.value.toLowerCase();
    const sortVal = this.sortSelect.value;
    
    let filtered = this.allStories.filter(story => 
      story.name.toLowerCase().includes(keyword)
    );

    if (sortVal === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }
    
    this._renderStories(filtered);
  }

  _renderStories(stories) {
    this.container.innerHTML = '';
      
    if (stories.length === 0) {
      this.container.innerHTML = '<p class="text-gray-500 font-bold">Story tidak ditemukan.</p>';
      return;
    }

    this._initMap(stories);

    const colors = ['bg-[#a2d2ff]', 'bg-[#fde047]', 'bg-[#caffbf]', 'bg-[#ffadad]', 'bg-[#bde0fe]'];

    stories.forEach((story, index) => {
      const date = new Date(story.createdAt).toLocaleDateString('id-ID', {
        year: 'numeric', month: 'long', day: 'numeric'
      });

      const colorClass = colors[index % colors.length];

      const card = document.createElement('div');
      card.id = `story-card-${index}`;
      card.className = `${colorClass} rounded-2xl overflow-hidden border-2 border-black shadow-[6px_6px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0_0_#000] transition-all flex flex-col`;
      card.innerHTML = `
        <a href="#/story/${story.id}" class="block cursor-pointer">
          <img src="${story.photoUrl}" alt="Foto dari ${story.name}" class="w-full h-48 object-cover border-b-2 border-black" loading="lazy">
          <div class="p-5 flex flex-col flex-grow overflow-hidden">
            <h3 class="font-bold text-xl mb-1 font-mono text-black break-words">${story.name}</h3>
            <p class="text-sm font-bold text-gray-700 mb-3">${date}</p>
            <p class="text-black font-medium text-sm line-clamp-3 break-all mb-4">${story.description}</p>
          </div>
        </a>
        <div class="px-5 pb-5 mt-auto">
          <button type="button" class="save-btn w-full bg-white text-black font-bold py-2 px-4 border-2 border-black rounded-xl shadow-[4px_4px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#000] transition-all cursor-pointer">
            ⭐ Simpan
          </button>
        </div>
      `;

      const saveBtn = card.querySelector('.save-btn');
      // Check if already saved
      IDBHelper.getSavedStory(story.id).then(saved => {
        if (saved) {
          saveBtn.innerHTML = '✅ Tersimpan';
          saveBtn.classList.replace('bg-white', 'bg-green-300');
        }
      });

      saveBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const isSaved = await IDBHelper.getSavedStory(story.id);
        if (isSaved) {
          await IDBHelper.deleteSavedStory(story.id);
          saveBtn.innerHTML = '⭐ Simpan';
          saveBtn.classList.replace('bg-green-300', 'bg-white');
        } else {
          await IDBHelper.putSavedStory(story);
          saveBtn.innerHTML = '✅ Tersimpan';
          saveBtn.classList.replace('bg-white', 'bg-green-300');
        }
      });

      this.container.appendChild(card);
    });
  }

  _initMap(stories) {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;

    if (this.map) {
      this.map.remove();
    }

    this.map = L.map('map').setView([-2.548926, 118.0148634], 5);

    const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    });

    const satLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });

    osmLayer.addTo(this.map);

    L.control.layers({
      "OpenStreetMap": osmLayer,
      "Satellite": satLayer
    }).addTo(this.map);

    stories.forEach((story, index) => {
      if (story.lat && story.lon) {
        const marker = L.marker([story.lat, story.lon]).addTo(this.map);
        marker.bindPopup(`
          <div class="text-center">
            <b class="block mb-1">${story.name}</b>
            <img src="${story.photoUrl}" alt="Foto" class="w-16 h-16 object-cover mx-auto rounded-lg mb-1">
          </div>
        `);
        
        const card = document.getElementById(`story-card-${index}`);
        if (card) {
          card.addEventListener('mouseenter', () => {
            this.map.flyTo([story.lat, story.lon], 8, { duration: 0.5 });
            marker.openPopup();
          });
        }
      }
    });
  }
}

export default HomePage;
