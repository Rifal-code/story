import IDBHelper from '../../data/idb-helper';

class SavedStoriesPage {
  async render() {
    return `
      <div class="space-y-12 mt-6">
        <div class="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <h1 class="text-4xl font-bold font-mono text-black">Cerita <span class="bg-[#caffbf] px-2 border-2 border-black shadow-[2px_2px_0_0_#000] inline-block -rotate-2">Tersimpan</span></h1>
        </div>
        
        <section>
          <div id="saved-stories-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <!-- Content will be injected here -->
          </div>
        </section>
      </div>
    `;
  }

  async afterRender() {
    this.container = document.querySelector('#saved-stories-container');
    this.savedStories = await IDBHelper.getAllSavedStories();
    
    this._renderStories(this.savedStories);
  }

  _renderStories(stories) {
    this.container.innerHTML = '';
      
    if (stories.length === 0) {
      this.container.innerHTML = `
        <div class="col-span-full text-center py-12 border-2 border-black border-dashed rounded-2xl bg-gray-50">
          <p class="text-gray-500 font-bold text-xl mb-2">Belum ada cerita yang disimpan.</p>
          <a href="#/" class="text-blue-600 underline font-bold">Kembali ke Beranda</a>
        </div>
      `;
      return;
    }

    const colors = ['bg-[#a2d2ff]', 'bg-[#fde047]', 'bg-[#caffbf]', 'bg-[#ffadad]', 'bg-[#bde0fe]'];

    stories.forEach((story, index) => {
      const date = new Date(story.createdAt).toLocaleDateString('id-ID', {
        year: 'numeric', month: 'long', day: 'numeric'
      });

      const colorClass = colors[index % colors.length];

      const card = document.createElement('div');
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
          <button type="button" class="remove-btn w-full bg-red-500 text-white font-bold py-2 px-4 border-2 border-black rounded-xl shadow-[4px_4px_0_0_#000] hover:bg-red-600 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#000] transition-all cursor-pointer">
            Hapus dari Favorit
          </button>
        </div>
      `;

      const removeBtn = card.querySelector('.remove-btn');
      removeBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        await IDBHelper.deleteSavedStory(story.id);
        // Refresh the list locally
        this.savedStories = this.savedStories.filter(s => s.id !== story.id);
        this._renderStories(this.savedStories);
      });

      this.container.appendChild(card);
    });
  }
}

export default SavedStoriesPage;
