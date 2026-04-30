import API from '../../utils/api';
import { parseActivePathname } from '../../routes/url-parser';

class DetailPage {
  async render() {
    return `
      <div class="max-w-3xl mx-auto mt-6 bg-[#bde0fe] p-6 md:p-8 border-2 border-black rounded-2xl shadow-[8px_8px_0_0_#000]">
        <a href="#/" class="inline-block mb-6 bg-white border-2 border-black px-4 py-2 font-bold shadow-[4px_4px_0_0_#000] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0_0_#000] transition-all cursor-pointer text-black">
          &larr; Kembali
        </a>
        
        <div id="detail-container">
          <!-- Loading skeleton -->
          <div class="animate-pulse flex flex-col gap-4">
            <div class="bg-white border-2 border-black h-8 w-1/2 rounded-md"></div>
            <div class="bg-white border-2 border-black h-64 md:h-96 w-full rounded-2xl"></div>
            <div class="bg-white border-2 border-black h-4 w-3/4 rounded-md"></div>
            <div class="bg-white border-2 border-black h-4 w-1/2 rounded-md"></div>
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
        <h1 class="text-4xl font-bold mb-2 font-mono text-black">${story.name}</h1>
        <p class="text-sm font-bold text-gray-800 mb-6 bg-white inline-block px-2 py-1 border-2 border-black rounded">${date}</p>
        
        <img src="${story.photoUrl}" alt="Foto dari ${story.name}" class="w-full h-auto max-h-[500px] object-cover rounded-2xl mb-6 border-2 border-black shadow-[4px_4px_0_0_#000]">
        
        <div class="prose max-w-none text-black font-medium leading-relaxed bg-white p-6 border-2 border-black rounded-xl shadow-[4px_4px_0_0_#000] break-words overflow-hidden">
          <p class="break-all whitespace-pre-wrap">${story.description}</p>
        </div>
      `;
    } catch (error) {
      container.innerHTML = '<p class="text-red-500">Gagal memuat detail story. Periksa koneksi Anda.</p>';
    }
  }
}

export default DetailPage;
