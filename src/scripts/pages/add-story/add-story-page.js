import API from '../../utils/api';
import L from 'leaflet';


class AddStoryPage {
  async render() {
    return `
      <div class="max-w-2xl mx-auto mt-6 bg-[#ffadad] p-6 md:p-8 border-2 border-black rounded-2xl shadow-[8px_8px_0_0_#000]">
        <h1 class="text-3xl font-bold mb-6 font-mono text-black">Tambah <span class="bg-white px-2 border-2 border-black shadow-[2px_2px_0_0_#000] inline-block -rotate-2">Story</span></h1>
        
        <form id="add-story-form" class="space-y-6">
          <div>
            <label class="block text-sm font-bold text-black mb-2">Pilih atau Ambil Foto</label>
            <div class="flex flex-col sm:flex-row gap-3 mb-2">
              <input type="file" id="photo" accept="image/*" class="block w-full text-sm text-black file:mr-4 file:py-2 file:px-4 file:border-2 file:border-black file:rounded-xl file:text-sm file:font-bold file:bg-[#fde047] file:text-black hover:file:translate-y-[2px] hover:file:translate-x-[2px] file:shadow-[4px_4px_0_0_#000] file:transition-all file:cursor-pointer bg-white px-2 py-1 rounded-xl border-2 border-black shadow-[4px_4px_0_0_#000]">
              <button type="button" id="open-camera-btn" class="bg-[#a2d2ff] text-black border-2 border-black shadow-[4px_4px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#000] px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all cursor-pointer">📸 Buka Kamera</button>
            </div>
            
            <div id="camera-container" class="hidden mt-4 border-2 border-black rounded-xl overflow-hidden relative shadow-[4px_4px_0_0_#000]">
              <video id="camera-video" class="w-full bg-black h-64 object-cover" autoplay playsinline></video>
              <div class="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                <button type="button" id="capture-btn" class="bg-yellow-400 text-black border-2 border-black shadow-[2px_2px_0_0_#000] px-6 py-2 rounded-xl font-bold text-sm cursor-pointer hover:bg-yellow-500">Ambil Foto</button>
                <button type="button" id="close-camera-btn" class="bg-red-500 text-white border-2 border-black shadow-[2px_2px_0_0_#000] px-6 py-2 rounded-xl font-bold text-sm cursor-pointer hover:bg-red-600">Tutup</button>
              </div>
            </div>

            <img id="preview-image" src="" alt="" class="hidden mt-4 w-full h-48 md:h-64 object-cover rounded-xl border-2 border-black shadow-[4px_4px_0_0_#000]">
            <canvas id="canvas" class="hidden"></canvas>
          </div>

          <div>
            <label for="description" class="block text-sm font-bold text-black mb-2">Deskripsi</label>
            <textarea id="description" rows="4" required class="block w-full px-4 py-2 border-2 border-black shadow-[4px_4px_0_0_#000] rounded-xl focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-all bg-white text-black font-medium" placeholder="Ceritakan sesuatu..."></textarea>
          </div>

          <div class="bg-white p-4 rounded-xl border-2 border-black shadow-[4px_4px_0_0_#000]">
            <p class="text-sm font-bold text-black mb-1">Lokasi Peta (Wajib pilih salah satu cara)</p>
            <p class="text-xs text-gray-600 mb-3 font-medium">Klik pada peta untuk memilih lokasi, atau gunakan tombol di bawah.</p>
            
            <div id="add-map" class="h-48 w-full rounded-xl border-2 border-black z-0 relative mb-3"></div>
            
            <button type="button" id="get-location-btn" class="text-sm bg-[#caffbf] font-bold text-black border-2 border-black shadow-[4px_4px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#000] transition-all px-4 py-2 rounded-xl cursor-pointer">📍 Dapatkan Lokasi Saat Ini</button>
            
            <input type="hidden" id="lat">
            <input type="hidden" id="lon">
            <p id="location-status" class="text-sm font-bold text-black bg-green-300 inline-block px-2 border-2 border-black mt-3 hidden">Lokasi dipilih!</p>
          </div>

          <p id="alert-msg" class="text-sm hidden bg-white border-2 border-black shadow-[2px_2px_0_0_#000] px-3 py-1 rounded font-bold"></p>
          
          <button type="submit" id="submit-btn" class="w-full bg-[#fde047] text-black py-3 px-4 border-2 border-black shadow-[6px_6px_0_0_#000] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0_0_#000] rounded-xl font-bold transition-all flex justify-center items-center mt-6 cursor-pointer">
            <span>Kirim Story</span>
          </button>
        </form>
      </div>
    `;
  }

  async afterRender() {
    const photoInput = document.getElementById('photo');
    const previewImage = document.getElementById('preview-image');
    const getLocBtn = document.getElementById('get-location-btn');
    const latInput = document.getElementById('lat');
    const lonInput = document.getElementById('lon');
    const locStatus = document.getElementById('location-status');
    const form = document.getElementById('add-story-form');
    const alertMsg = document.getElementById('alert-msg');
    const submitBtn = document.getElementById('submit-btn');

    const openCameraBtn = document.getElementById('open-camera-btn');
    const closeCameraBtn = document.getElementById('close-camera-btn');
    const captureBtn = document.getElementById('capture-btn');
    const cameraContainer = document.getElementById('camera-container');
    const cameraVideo = document.getElementById('camera-video');
    const canvas = document.getElementById('canvas');
    let stream = null;
    let cameraFile = null;

    photoInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        cameraFile = null;
        const reader = new FileReader();
        reader.onload = (e) => {
          previewImage.src = e.target.result;
          previewImage.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
      }
    });

    openCameraBtn.addEventListener('click', async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        cameraVideo.srcObject = stream;
        cameraContainer.classList.remove('hidden');
        previewImage.classList.add('hidden');
      } catch (err) {
        alert('Gagal mengakses kamera: ' + err.message);
      }
    });

    const closeCamera = () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
      }
      cameraVideo.srcObject = null;
      cameraContainer.classList.add('hidden');
    };

    closeCameraBtn.addEventListener('click', closeCamera);

    captureBtn.addEventListener('click', () => {
      if (!stream) return;
      
      canvas.width = cameraVideo.videoWidth;
      canvas.height = cameraVideo.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(cameraVideo, 0, 0, canvas.width, canvas.height);
      
      const dataUrl = canvas.toDataURL('image/jpeg');
      previewImage.src = dataUrl;
      previewImage.classList.remove('hidden');
      
      canvas.toBlob((blob) => {
        cameraFile = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
        photoInput.value = '';
      }, 'image/jpeg');

      closeCamera();
    });

    // Map Initialization
    let mapMarker = null;
    const mapContainer = document.getElementById('add-map');
    let map = null;

    if (mapContainer) {
      map = L.map('add-map').setView([-2.548926, 118.0148634], 5);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

  
      setTimeout(() => {
        map.invalidateSize();
      }, 500);

      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        latInput.value = lat;
        lonInput.value = lng;
        
        if (mapMarker) {
          map.removeLayer(mapMarker);
        }
        
        mapMarker = L.marker([lat, lng]).addTo(map);
        locStatus.classList.remove('hidden');
        locStatus.textContent = 'Lokasi dipilih via peta!';
      });
    }

    getLocBtn.addEventListener('click', () => {
      if (!navigator.geolocation) {
        alert('Geolocation tidak didukung browser ini.');
        return;
      }
      getLocBtn.textContent = 'Mencari...';
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          latInput.value = lat;
          lonInput.value = lon;
          
          if (map) {
            map.setView([lat, lon], 15);
            if (mapMarker) map.removeLayer(mapMarker);
            mapMarker = L.marker([lat, lon]).addTo(map);
          }
          
          locStatus.classList.remove('hidden');
          locStatus.textContent = 'Lokasi saat ini didapatkan!';
          getLocBtn.textContent = '📍 Perbarui Lokasi Saat Ini';
        },
        () => {
          alert('Gagal mendapatkan lokasi.');
          getLocBtn.textContent = '📍 Dapatkan Lokasi Saat Ini';
        }
      );
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const file = cameraFile || photoInput.files[0];
      if (!file) {
        alert('Silakan pilih atau ambil foto terlebih dahulu.');
        return;
      }

      const desc = document.getElementById('description').value;

      const formData = new FormData();
      formData.append('description', desc);
      formData.append('photo', file);
      
      if (latInput.value && lonInput.value) {
        formData.append('lat', parseFloat(latInput.value));
        formData.append('lon', parseFloat(lonInput.value));
      }

      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Mengirim...';

      try {
        const response = await API.addStory(formData);
        if (response.error) {
          alertMsg.textContent = response.message;
          alertMsg.className = 'text-red-500 text-sm block mt-3';
        } else {
          alertMsg.textContent = 'Story berhasil dikirim!';
          alertMsg.className = 'text-green-500 text-sm font-bold block mt-3';
          setTimeout(() => {
            window.location.hash = '#/';
          }, 1500);
        }
      } catch (error) {
        alertMsg.textContent = 'Gagal mengirim story. Coba lagi.';
        alertMsg.className = 'text-red-500 text-sm block mt-3';
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Kirim Story';
      }
    });
  }
}

export default AddStoryPage;
