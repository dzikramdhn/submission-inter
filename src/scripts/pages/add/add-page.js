import StoryApi from '../../api/stories';
import AuthHelper from '../../utils/auth-helper';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

class AddPage {
  async render() {
    return `
      <section class="container">
        <div class="add-form-container">
          <h1>Tambah Cerita Baru</h1>
          <form id="add-story-form" class="add-form">
            <div>
              <label for="description">Deskripsi Cerita</label>
              <textarea id="description" name="description" placeholder="Tulis ceritamu di sini..." required></textarea>
            </div>

            <div>
              <label for="photo">Pilih Foto</label>
              <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
                <input type="file" id="photo" name="photo" accept="image/*" />
                <button type="button" id="open-camera" class="btn-secondary">📸 Gunakan Kamera</button>
              </div>

              <!-- Preview kamera -->
              <div id="camera-container" style="display:none; margin-top:1rem; text-align:center;">
                <video id="camera-stream" autoplay playsinline style="width:100%; max-height:280px; border-radius:8px; background:#000;"></video>
                <canvas id="camera-capture" style="display:none;"></canvas>
                <div style="margin-top:0.8rem; display:flex; justify-content:center; gap:10px; flex-wrap:wrap;">
                  <button type="button" id="capture-btn" class="btn-primary">Ambil Foto</button>
                  <button type="button" id="close-camera" class="btn-danger">Tutup Kamera</button>
                </div>
              </div>

              <!-- Preview gambar hasil -->
              <div id="photo-preview" style="display:none; margin-top:1rem; text-align:center;">
                <p style="margin-bottom:0.5rem; color:#164863; font-weight:600;">Preview Gambar</p>
                <img id="preview-img" src="" alt="Preview Foto" style="max-width:100%; max-height:300px; border-radius:10px; box-shadow:0 2px 8px rgba(0,0,0,0.1);" />
              </div>
            </div>

            <!-- Peta untuk memilih lokasi -->
            <div style="margin-top:1.5rem;">
              <label for="map-preview">Pilih Lokasi di Peta</label>
              <div id="map-preview" class="map" style="height:300px; border-radius:8px; margin-top:0.5rem;"></div>
            </div>

            <p id="message" class="hidden" style="margin-top:1rem;"></p>
            <button type="submit" class="btn-submit">Kirim Cerita</button>
          </form>
        </div>
      </section>
    `;
  }

  async afterRender() {
    if (!AuthHelper.requireAuth()) return;

    const form = document.querySelector('#add-story-form');
    const msg = document.querySelector('#message');
    const mapContainer = document.querySelector('#map-preview');


    const openCameraBtn = document.querySelector('#open-camera');
    const cameraContainer = document.querySelector('#camera-container');
    const video = document.querySelector('#camera-stream');
    const captureBtn = document.querySelector('#capture-btn');
    const closeCameraBtn = document.querySelector('#close-camera');
    const canvas = document.querySelector('#camera-capture');
    const photoInput = document.querySelector('#photo');

   
    const photoPreview = document.querySelector('#photo-preview');
    const previewImg = document.querySelector('#preview-img');

    let mediaStream = null;

    // Camera
    const showPreview = (src) => {
      previewImg.src = src;
      photoPreview.style.display = 'block';
    };

    const stopCamera = () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
        mediaStream = null;
      }
      video.srcObject = null;
      cameraContainer.style.display = 'none';
    };

    window.addEventListener('hashchange', stopCamera);
    window.addEventListener('beforeunload', stopCamera);

    openCameraBtn.addEventListener('click', async () => {
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = mediaStream;
        cameraContainer.style.display = 'block';
      } catch {
        alert('Tidak dapat mengakses kamera. Pastikan izin kamera diaktifkan.');
      }
    });

    captureBtn.addEventListener('click', () => {
      const ctx = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        photoInput.files = dataTransfer.files;

        const imageUrl = URL.createObjectURL(blob);
        showPreview(imageUrl);
      }, 'image/jpeg', 0.9);

      msg.textContent = 'Foto berhasil diambil dari kamera!';
      msg.classList.remove('hidden', 'error');
      msg.classList.add('success');
    });

    photoInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        showPreview(imageUrl);
      }
    });

    closeCameraBtn.addEventListener('click', stopCamera);

    // Map
    let selectedLocation = { lat: null, lon: null };
    let marker = null;

   
    const map = L.map(mapContainer).setView([-6.2, 106.8], 10); // default Jakarta
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

  
    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      if (marker) marker.remove();

      marker = L.marker([lat, lng], { icon: defaultIcon }).addTo(map)
        .bindPopup(`Lokasi dipilih:<br>${lat.toFixed(4)}, ${lng.toFixed(4)}`)
        .openPopup();

      selectedLocation = { lat, lon: lng };
      msg.textContent = `Lokasi dipilih: (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
      msg.classList.remove('hidden', 'error');
      msg.classList.add('success');
    });

   
    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const description = document.querySelector('#description').value.trim();
      const photo = document.querySelector('#photo').files[0];

      if (!description || !photo) {
        msg.textContent = 'Lengkapi semua data sebelum mengirim!';
        msg.classList.remove('hidden');
        msg.classList.add('error');
        return;
      }

      if (!selectedLocation.lat || !selectedLocation.lon) {
        msg.textContent = 'Klik lokasi di peta terlebih dahulu!';
        msg.classList.remove('hidden');
        msg.classList.add('error');
        return;
      }

      msg.textContent = 'Mengirim cerita...';
      msg.classList.remove('error', 'success', 'hidden');

      try {
        await StoryApi.addStory({
          description,
          photo,
          lat: selectedLocation.lat,
          lon: selectedLocation.lon,
        });

        msg.textContent = 'Cerita berhasil dikirim!';
        msg.classList.add('success');
        stopCamera();
        setTimeout(() => (window.location.hash = '#/'), 1500);
      } catch (error) {
        msg.textContent = `Gagal: ${error.message}`;
        msg.classList.add('error');
      }
    });
  }
}

export default AddPage;
