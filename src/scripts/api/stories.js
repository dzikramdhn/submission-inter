import { BASE_URL, getToken } from './config';


class StoryApi {
  async getStories() {
    const response = await fetch(`${BASE_URL}/stories`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data.listStory;
  }


  async addStory({ description, photo, lat, lon }) {
    const formData = new FormData();
    formData.append('description', description);
    if (lat && lon) {
      formData.append('lat', lat);
      formData.append('lon', lon);
    }
    formData.append('photo', photo);

    const response = await fetch(`${BASE_URL}/stories`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  }


  async getStoryDetail(id) {
    const response = await fetch(`${BASE_URL}/stories/${id}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message);
    return data;
  }


async getStoryById(id) {
  const response = await fetch(`${BASE_URL}/stories/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message);
  return data.story;
}

}

export default new StoryApi();
