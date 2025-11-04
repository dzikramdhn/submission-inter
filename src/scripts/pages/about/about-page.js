class AboutPage {
  async render() {
    return `
      <section class="container about-section">
        <div class="about-card">
          <h1>Tentang Aplikasi StoryApp</h1>
          <p>
            <strong>StoryApp</strong> adalah aplikasi berbasis web yang memungkinkan pengguna untuk membagikan cerita
            mereka melalui foto dan deskripsi singkat. Setiap cerita dapat dilengkapi dengan lokasi GPS agar pengguna lain
            dapat mengetahui dari mana kisah tersebut berasal.
          </p>
          <p>
            Aplikasi ini dibangun menggunakan teknologi modern seperti <strong>JavaScript ES6, Webpack, dan Leaflet.js</strong> 
            untuk peta interaktif. Data pengguna dan cerita dikelola secara aman melalui API yang disediakan oleh platform Dicoding.
          </p>
          <p>
            Dengan StoryApp, kami ingin memberikan ruang bagi setiap orang untuk berbagi pengalaman, inspirasi,
            dan kisah menarik dari berbagai tempat di seluruh dunia.
          </p>
          <div class="about-highlight">
            <p><strong>👨‍💻 Pengembang:</strong> Muhammad Dzikra Ramadhan</p>
            <p><strong>🌐 Teknologi:</strong> JavaScript, Webpack, Leaflet.js, Dicoding API</p>
            <p><strong>📅 Tahun:</strong> 2025</p>
          </div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    // Tidak perlu event tambahan untuk halaman statis
  }
}

export default AboutPage;
