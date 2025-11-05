import Database from '../../data/database';

class BookmarkPage {
  async render() {
    return `
      <section class="container bookmark-page">
        <h2>Daftar Cerita Tersimpan</h2>
        <div id="saved-stories" class="story-list">Memuat cerita...</div>
      </section>
    `;
  }

  async afterRender() {
    const container = document.querySelector('#saved-stories');
    try {
      const stories = await Database.getAllStories();

      if (!stories.length) {
        container.innerHTML = `<p class="empty-message">📭 Belum ada cerita disimpan.</p>`;
        return;
      }

      container.innerHTML = stories.map((story) => `
        <article class="story-item">
          <img src="${story.photoUrl}" alt="${story.name}" class="story-thumb" />
          <div class="story-info">
            <h3>${story.name}</h3>
            <p>${story.description}</p>
            <button class="btn-detail" data-id="${story.id}">Lihat Detail</button>
          </div>
        </article>
      `).join('');


      document.querySelectorAll('.btn-detail').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          const id = e.target.dataset.id;
          window.location.hash = `#/detail/${id}`;
        });
      });
    } catch (err) {
      container.innerHTML = `<p class="error">Gagal memuat cerita offline</p>`;
    }
  }
}

export default BookmarkPage;
