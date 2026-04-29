import API from '../../utils/api';

class AddStoryPage {
  async render() {
    return `
      <div class="max-w-2xl mx-auto mt-6 bg-white p-6 md:p-8 border border-gray-100 rounded-2xl shadow-sm">
        <h2 class="text-2xl font-bold mb-6">Tambah <span class="text-yellow-400">Story</span> Baru</h2>
        
        <form id="add-story-form" class="space-y-5">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Pilih atau Ambil Foto</label>
            <div class="flex gap-2 mb-2">
              <input type="file" id="photo" accept="image/*" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-yellow-50 file:text-yellow-700 hover:file:bg-yellow-100 transition-all">
              <button type="button" id="open-camera-btn" class="bg-gray-800 text-white px-4 py-2 rounded-xl text-sm whitespace-nowrap hover:bg-gray-700">Buka Kamera</button>
            </div>
            
            <!-- Camera Stream UI -->
            <div id="camera-container" class="hidden mt-2 border border-gray-300 rounded-xl overflow-hidden relative">
              <video id="camera-video" class="w-full bg-black h-48 object-cover" autoplay playsinline></video>
              <div class="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
                <button type="button" id="capture-btn" class="bg-yellow-400 text-black px-4 py-1 rounded-full font-bold text-sm">Ambil Foto</button>
                <button type="button" id="close-camera-btn" class="bg-red-500 text-white px-4 py-1 rounded-full font-bold text-sm">Tutup</button>
              </div>
            </div>

            <img id="preview-image" src="" alt="" class="hidden mt-3 w-full h-48 object-cover rounded-xl border border-gray-200">
            <canvas id="canvas" class="hidden"></canvas>
          </div>

          <div>
            <label for="description" class="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
            <textarea id="description" rows="4" required class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-yellow-400 focus:border-yellow-400" placeholder="Ceritakan sesuatu..."></textarea>
          </div>

          <div class="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <p class="text-sm font-medium text-gray-700 mb-2">Lokasi (Opsional)</p>
            <p class="text-xs text-gray-500 mb-2">Dapatkan lokasi saat ini untuk menambahkan tag lokasi.</p>
            <button type="button" id="get-location-btn" class="text-sm bg-white border border-gray-300 px-3 py-1 rounded-md hover:bg-gray-50">Dapatkan Lokasi</button>
            <input type="hidden" id="lat">
            <input type="hidden" id="lon">
            <p id="location-status" class="text-xs text-green-600 mt-2 hidden">Lokasi didapatkan!</p>
          </div>

          <p id="alert-msg" class="text-sm hidden"></p>
          
          <button type="submit" id="submit-btn" class="w-full bg-yellow-400 text-black py-3 px-4 rounded-xl font-bold hover:bg-yellow-500 transition-colors flex justify-center items-center">
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

    // Camera Elements
    const openCameraBtn = document.getElementById('open-camera-btn');
    const closeCameraBtn = document.getElementById('close-camera-btn');
    const captureBtn = document.getElementById('capture-btn');
    const cameraContainer = document.getElementById('camera-container');
    const cameraVideo = document.getElementById('camera-video');
    const canvas = document.getElementById('canvas');
    let stream = null;
    let cameraFile = null;

    // Image Preview from File Input
    photoInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        cameraFile = null; // reset camera file
        const reader = new FileReader();
        reader.onload = (e) => {
          previewImage.src = e.target.result;
          previewImage.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
      }
    });

    // Open Camera
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

    // Close Camera Function
    const closeCamera = () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
      }
      cameraVideo.srcObject = null;
      cameraContainer.classList.add('hidden');
    };

    closeCameraBtn.addEventListener('click', closeCamera);

    // Capture Photo
    captureBtn.addEventListener('click', () => {
      if (!stream) return;
      
      canvas.width = cameraVideo.videoWidth;
      canvas.height = cameraVideo.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(cameraVideo, 0, 0, canvas.width, canvas.height);
      
      const dataUrl = canvas.toDataURL('image/jpeg');
      previewImage.src = dataUrl;
      previewImage.classList.remove('hidden');
      
      // Convert to blob for form submission
      canvas.toBlob((blob) => {
        cameraFile = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
        photoInput.value = ''; // clear file input
      }, 'image/jpeg');

      closeCamera();
    });

    // Get Location
    getLocBtn.addEventListener('click', () => {
      if (!navigator.geolocation) {
        alert('Geolocation tidak didukung browser ini.');
        return;
      }
      getLocBtn.textContent = 'Mencari...';
      navigator.geolocation.getCurrentPosition(
        (position) => {
          latInput.value = position.coords.latitude;
          lonInput.value = position.coords.longitude;
          locStatus.classList.remove('hidden');
          getLocBtn.textContent = 'Ubah Lokasi';
        },
        () => {
          alert('Gagal mendapatkan lokasi.');
          getLocBtn.textContent = 'Dapatkan Lokasi';
        }
      );
    });

    // Form Submit
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
