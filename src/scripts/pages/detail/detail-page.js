import API from '../../utils/api';
import { parseActivePathname } from '../../routes/url-parser';

class DetailPage {
  async render() {
    return `
      <div class="max-w-3xl mx-auto mt-6 bg-white p-6 md:p-8 border border-gray-100 rounded-2xl shadow-sm">
        <a href="#/" class="inline-block mb-6 text-gray-500 hover:text-yellow-500 transition-colors cursor-pointer font-medium">
          &larr; Kembali
        </a>
        
        <div id="detail-container">
          <!-- Loading skeleton -->
          <div class="animate-pulse flex flex-col gap-4">
            <div class="bg-gray-200 h-8 w-1/2 rounded-md"></div>
            <div class="bg-gray-200 h-64 md:h-96 w-full rounded-2xl"></div>
            <div class="bg-gray-200 h-4 w-3/4 rounded-md"></div>
            <div class="bg-gray-200 h-4 w-1/2 rounded-md"></div>
          </div>
        </div>
      </div>
    `;
  }

  async afterRender() {
    const container = document.getElementById('detail-container');
    const urlSegments = parseActivePathname();
    const storyId = urlSegments.id;

    if (!storyId) {
      container.innerHTML = '<p class="text-red-500">ID Story tidak valid.</p>';
      return;
    }

    try {
      const response = await API.getStoryDetail(storyId);
      
      if (response.error) {
        container.innerHTML = `<p class="text-red-500">${response.message}</p>`;
        return;
      }

      const story = response.story;
      const date = new Date(story.createdAt).toLocaleDateString('id-ID', {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });

      container.innerHTML = `
        <h2 class="text-3xl font-bold mb-2">${story.name}</h2>
        <p class="text-sm text-gray-400 mb-6">${date}</p>
        
        <img src="${story.photoUrl}" alt="Foto dari ${story.name}" class="w-full h-auto max-h-[500px] object-cover rounded-2xl mb-6 shadow-sm">
        
        <div class="prose max-w-none text-gray-800 leading-relaxed">
          <p>${story.description}</p>
        </div>
      `;
    } catch (error) {
      container.innerHTML = '<p class="text-red-500">Gagal memuat detail story. Periksa koneksi Anda.</p>';
    }
  }
}

export default DetailPage;
