function fetchImg(q, page) {
  const query = q.trim(" ").split(" ").join("+");
  return fetch(
    `https://pixabay.com/api/?q=${query}&page=${page}&key=23292771-6d1481bed529939f67189ab21&image_type=photo&orientation=horizontal&per_page=12`
  ).then((response) => {
    if (response.ok) {
      return response.json();
    }

    return Promise.reject(
      new Error(`По запросу <<${q}>> изображений не найдено`)
    );
  });
}

const api = {
  fetchImg,
};

export default api;
