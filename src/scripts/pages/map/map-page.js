import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import StoryApi from '../../api/stories';
import AuthHelper from '../../utils/auth-helper';

class MapPage {
  async render() {
    return `
      <section class="map-page container">
        <h1>Halaman Peta</h1>
        <p>Peta menampilkan lokasi semua cerita pengguna yang menyertakan GPS.</p>
        <div id="stories-map" style="height: 480px; border-radius: 10px; margin-top: 1rem;"></div>
      </section>
    `;
  }

  async afterRender() {
    if (!AuthHelper.requireAuth()) return;

    const mapContainer = document.getElementById('stories-map');


    const map = L.map(mapContainer).setView([-2.5, 118], 5);

  
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

    try {
  
      const stories = await StoryApi.getStories();

      const markers = [];

    
      stories
        .filter((story) => story.lat && story.lon)
        .forEach((story) => {
          const marker = L.marker([story.lat, story.lon], { icon: defaultIcon }).addTo(map);

          marker.bindPopup(`
            <div style="min-width:160px">
              <strong>${story.name}</strong><br>
              ${story.description}<br>
              <small><em>${new Date(story.createdAt).toLocaleDateString('id-ID')}</em></small><br>
              <a href="#/detail/${story.id}" style="color:#2b6cb0;text-decoration:none;font-weight:600;">Lihat Detail</a>
            </div>
          `);

          markers.push(marker);
        });


      if (markers.length > 0) {
        const group = L.featureGroup(markers);
        map.fitBounds(group.getBounds().pad(0.2));
      } else {
        mapContainer.innerHTML = `<p class="error">Belum ada cerita dengan lokasi GPS.</p>`;
      }
    } catch (error) {
      mapContainer.innerHTML = `<p class="error">Gagal memuat peta: ${error.message}</p>`;
    }
  }
}

export default MapPage;
