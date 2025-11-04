import StoryApi from '../../api/stories';
import AuthHelper from '../../utils/auth-helper';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

class DetailPage {
  async render() {
    return `
      <section class="detail-page container">
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


      const formattedDate = new Date(story.createdAt).toLocaleString('id-ID', {
        dateStyle: 'full',
        timeStyle: 'short',
      });

      storyDetailContainer.innerHTML = `
        <div class="story-detail-card">
          <img src="${story.photoUrl}" alt="${story.name}" class="story-detail-thumb" />


          <div class="story-info">
            <h1>${story.name}</h1>
            <p>${story.description}</p>

            <p><strong>Tanggal:</strong> ${formattedDate}</p>
            ${
              story.lat && story.lon
                ? `<p><strong>Lokasi:</strong> ${story.lat}, ${story.lon}</p>`
                : '<p><em>Lokasi tidak tersedia</em></p>'
            }

            ${
              story.lat && story.lon
                ? `<div id="map-detail" style="height: 250px; margin-top: 1rem; border-radius: 8px;"></div>`
                : ''
            }

            <button id="back-button" class="btn-primary" style="margin-top: 1rem;">← Kembali ke Beranda</button>
          </div>
        </div>
      `;


      if (story.lat && story.lon) {
        const map = L.map('map-detail').setView([story.lat, story.lon], 14);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map);


        const defaultIcon = L.icon({
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        });

        L.marker([story.lat, story.lon], { icon: defaultIcon })
          .addTo(map)
          .bindPopup(`<b>${story.name}</b><br>${story.description}`)
          .openPopup();
      }


      document.querySelector('#back-button').addEventListener('click', () => {
        window.location.hash = '#/';
      });
    } catch (error) {
      storyDetailContainer.innerHTML = `<p class="error">Gagal memuat detail: ${error.message}</p>`;
    }
  }
}

export default DetailPage;
