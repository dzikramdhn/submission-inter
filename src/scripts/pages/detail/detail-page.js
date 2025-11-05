import StoryApi from '../../api/stories';
import AuthHelper from '../../utils/auth-helper';
import Database from '../../data/database';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

class DetailPage {
  async render() {
    return `
      <section class="container">
        <div id="story-detail" class="story-detail">Memuat detail cerita...</div>
      </section>
    `;
  }

  async afterRender() {
    if (!AuthHelper.requireAuth()) return;
    const storyDetailContainer = document.querySelector('#story-detail');
    const id = window.location.hash.split('/')[2];

    try {
      const story = await StoryApi.getStoryById(id);

      storyDetailContainer.innerHTML = `
        <div class="story-detail-card">
          <img src="${story.photoUrl}" alt="${story.name}" class="story-detail-thumb" />
          <div class="story-detail-info">
            <h3>${story.name}</h3>
            <p>${story.description}</p>
            ${
              story.lat && story.lon
                ? `<div id="map-detail" class="detail-map"></div>`
                : '<em>Lokasi tidak tersedia</em>'
            }

            <div class="detail-actions">
              <button id="save-offline" class="btn-primary">💾 Simpan Offline</button>
              <button id="delete-offline" class="btn-danger">🗑 Hapus</button>
              <button id="back-button" class="btn-back">← Kembali</button>
            </div>
          </div>
        </div>
      `;

      const defaultIcon = L.icon({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });


      const existing = await Database.getStoryById(story.id);
      const saveBtn = document.getElementById('save-offline');
      if (existing) {
        saveBtn.disabled = true;
        saveBtn.innerText = '✅ Tersimpan Offline';
      }


      saveBtn.addEventListener('click', async () => {
        await Database.putStory(story);
        alert('Story berhasil disimpan offline!');
        saveBtn.disabled = true;
        saveBtn.innerText = '✅ Tersimpan Offline';
      });


      const deleteBtn = document.getElementById('delete-offline');
      deleteBtn.addEventListener('click', async () => {
        await Database.deleteStory(story.id);
        alert('Story berhasil dihapus dari penyimpanan offline!');
        saveBtn.disabled = false;
        saveBtn.innerText = '💾 Simpan Offline';
      });


      document.getElementById('back-button').addEventListener('click', () => {
        window.location.hash = '#/';
      });


      if (story.lat && story.lon) {
        const map = L.map('map-detail').setView([story.lat, story.lon], 14);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map);

        L.marker([story.lat, story.lon], { icon: defaultIcon })
          .addTo(map)
          .bindPopup(`<b>${story.name}</b>`)
          .openPopup();
      }
    } catch (error) {
      storyDetailContainer.innerHTML = `<p class="error">Gagal memuat detail: ${error.message}</p>`;
    }
  }
}

export default DetailPage;
