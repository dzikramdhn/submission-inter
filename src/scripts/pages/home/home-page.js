import StoryApi from '../../api/stories';
import AuthHelper from '../../utils/auth-helper';

class HomePage {
  async render() {
    return `
      <section class="home-page container">
        <h1>Daftar Cerita</h1>
        <div id="loading" class="loading-spinner"></div>
        <div id="story-list" class="story-list"></div>
        <div id="error-message" class="error"></div>
      </section>
    `;
  }

  async afterRender() {
    if (!AuthHelper.requireAuth()) return;

    const storyList = document.querySelector('#story-list');
    const loading = document.querySelector('#loading');
    const errorMessage = document.querySelector('#error-message');

    try {
      loading.style.display = 'block';
      errorMessage.textContent = '';

      const stories = await StoryApi.getStories();

      loading.style.display = 'none';

      if (!stories || stories.length === 0) {
        storyList.innerHTML = '<p>Tidak ada cerita yang tersedia.</p>';
        return;
      }


      storyList.innerHTML = stories
        .map(
          (story) => `
            <article class="story-item">
              <img src="${story.photoUrl}" alt="Foto dari ${story.name}" class="story-thumb" />
              <div class="story-info">
                <h2>${story.name}</h2>
                <p>${story.description}</p>
                <button class="btn-detail" data-id="${story.id}">Lihat Detail</button>
                <div id="detail-${story.id}" class="story-extra hidden"></div>
              </div>
            </article>
          `
        )
        .join('');

      document.querySelectorAll('.btn-detail').forEach((button) => {
        button.addEventListener('click', async (e) => {
          const storyId = e.target.dataset.id;
          const detailContainer = document.querySelector(`#detail-${storyId}`);

   
          if (!detailContainer.classList.contains('hidden')) {
            detailContainer.innerHTML = '';
            detailContainer.classList.add('hidden');
            e.target.textContent = 'Lihat Detail';
            return;
          }

 
          detailContainer.innerHTML = '<p>Sedang memuat detail...</p>';
          detailContainer.classList.remove('hidden');

          try {
            const response = await StoryApi.getStoryDetail(storyId);
            const story = response.story;

            detailContainer.innerHTML = `
              <div class="story-detail-inline">
                <p><b>Tanggal:</b> ${new Date(story.createdAt).toLocaleString()}</p>
                ${
                  story.lat && story.lon
                    ? `<p><b>Lokasi:</b> ${story.lat}, ${story.lon}</p>`
                    : '<p><i>Lokasi tidak tersedia</i></p>'
                }
                <a href="#/detail/${story.id}" class="link-page-detail">Buka Halaman Detail</a>
              </div>
            `;
            e.target.textContent = 'Sembunyikan Detail';
          } catch (error) {
            detailContainer.innerHTML = `<p class="error">Gagal memuat detail: ${error.message}</p>`;
          }
        });
      });
    } catch (error) {
      loading.style.display = 'none';
      errorMessage.textContent = `Gagal memuat cerita: ${error.message}`;
    }
  }
}

export default HomePage;
