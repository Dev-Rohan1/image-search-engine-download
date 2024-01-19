const imageWrapper = document.querySelector(".image-wrapper");
const loadMoreBtn = document.querySelector(".load-more-btn");
const searchInput = document.querySelector(".search-input");
const apiKey = "SQycs9DHCCDThQ98UoivYMqdglCWjLV9ZYA4ORQ75FxKyiCg8a3cSomj";
let perPage = 12;
let currentPage = 1;
let searchItem = null;

console.log(loadMoreBtn);

const downloadImg = (imgUrl) => {
  fetch(imgUrl)
    .then((res) => res.blob())
    .then((file) => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(file);
      a.download = new Date().getTime();
      a.click();
    })
    .catch(() => alert("failed image download"));
};

const generateHtml = (images) => {
  imageWrapper.innerHTML += images
    .map((img) => {
      return `<div class="image-box">
    <div class="image"><img src="${img.src.large2x}" alt="image" /></div>
    <div class="image-contant">
      <div class="photographer">
        <i class="fa fa-camera" aria-hidden="true"></i>
        <span>${img.photographer}</span>
      </div>
      <button class="download-btn" onclick="downloadImg('${img.src.large2x}')">
        <i class="fa fa-download" aria-hidden="true"></i>
      </button>
    </div>
  </div>`;
    })
    .join("");
};

const getImage = (apiUrl) => {
  loadMoreBtn.innerText = "Loadding...";
  loadMoreBtn.classList.add("disabled");
  fetch(apiUrl, {
    headers: { Authorization: apiKey },
  })
    .then((res) => res.json())
    .then((data) => {
      generateHtml(data.photos);
      loadMoreBtn.innerText = "Load more";
      loadMoreBtn.classList.remove("disabled");
      console.log(data.photos);
    })
    .catch(() => alert("failed image loading"));
};

const loadimages = () => {
  currentPage++;
  let apiUrl = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
  apiUrl = searchItem
    ? `https://api.pexels.com/v1/search?query=${searchItem}&page=${currentPage}&per_page=${perPage}`
    : apiUrl;
  getImage(apiUrl);
};

const searchImages = (event) => {
  if (event.target.value === "") return (searchItem = null);
  if (event.key === "Enter") {
    currentPage = 1;
    searchItem = event.target.value;
    imageWrapper.innerHTML = "";
    getImage(
      `https://api.pexels.com/v1/search?query=${searchItem}&page=${currentPage}&per_page=${perPage}`
    );
  }
};

getImage(
  `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`
);

loadMoreBtn.addEventListener("click", loadimages);
searchInput.addEventListener("keyup", searchImages);
