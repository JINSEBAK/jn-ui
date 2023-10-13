import { closeModal, showModal } from "./common.js";
import {
  addMarkerPopup,
  clearMarkers,
  drawMarker,
  mapCenter,
  setMapView,
} from "./map.js";

const searchBtn = document.querySelector(".searchBtn");
const searchInput = document.querySelector(".search-box input");
const searchParams = {
  pageNo: 1,
  pageSize: 15,
  keyword: "",
};

let resultLocations = []; // api 결과값을 담은 배열
let listEl = null; // 장소결과 목록을 담을 ul html
let hasNext = false; // 다음 페이지 존재 유무
let lastItem = null; // 현재 목록에서 가장 마지막 요소
let observer = null;
let loading = false;

const submitSearch = () => {
  if (!searchParams.keyword) return;
  const { lat, lng } = mapCenter;
  loading = true;
  if ($("#loading")) {
    $("#loading").show();
  }
  if (lastItem) {
    observer.unobserve(lastItem);
  }
  $.ajax({
    type: "GET",
    url: `https://map.seoul.go.kr/smgis/apps/poi.do?cmd=getNaverPoiList&key=3b9579ca0f9c42929e6a9bf68ac4e267&name=${searchParams.keyword}&coord_x=${lng}&coord_y=${lat}&req_lang=KOR&res_lang=KOR&page_size=${searchParams.pageSize}&page_no=${searchParams.pageNo}`,
    dataType: "json",
    error: function () {
      console.log("통신실패!!");
    },
    success: function (data) {
      const curTotalLength =
        (searchParams.pageNo - 1) * searchParams.pageSize + data.head.display;

      hasNext = curTotalLength < parseInt(data.head.total);
      resultLocations =
        searchParams.pageNo > 1
          ? [...data.body, ...resultLocations]
          : data.body;

      const html = data.body
        .map((el) => {
          return `
          <li class="result-item" id=${el.mapx}>
            <p>${el.title}</p>
            <p>${el.address}</p>
          </li>
          `;
        })
        .join("");

      if (searchParams.pageNo > 1) {
        listEl.insertAdjacentHTML("beforeend", html);
      } else {
        showModal({ title: "검색결과" });
        listEl = document.querySelector(".result-list");
        listEl.innerHTML = html;
      }

      listEl.addEventListener("click", onLocSelect);
      setObserver();

      loading = false;

      if ($("#loading")) {
        $("#loading").hide();
      }
    },
  });

  loading = false;
};

const onLocSelect = (e) => {
  clearMarkers();

  const id = e.target.parentNode.id;
  if (id) {
    const foundedLoc = resultLocations.find((el) => el.mapx === id);
    closeModal();
    const mk = drawMarker(foundedLoc.mapy, foundedLoc.mapx);
    addMarkerPopup(mk, `<p>${foundedLoc.title}</p>`);
    setMapView(foundedLoc.mapy, foundedLoc.mapx);
  }
  e.stopPropagation();
};

const searchInit = () => {
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      searchParams.pageNo = 1;
      submitSearch();
    }
  });
  searchInput.addEventListener("input", (e) => {
    searchParams.keyword = e.target.value;
  });

  searchBtn.addEventListener("click", () => {
    searchParams.pageNo = 1;
    submitSearch();
  });
};

function setObserver() {
  const list = document.querySelectorAll(".result-item");
  lastItem = list[list.length - 1];

  let options = {
    rootMargin: "0px",
    threshold: 1.0,
  };

  observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      // 마지막 요소가 observe 되면 page 1추가하여 무한스크롤 구현
      if (!loading && entry.isIntersecting && hasNext) {
        searchParams.pageNo = searchParams.pageNo + 1;
        submitSearch();
      }
    });
  }, options);

  // 결과 목록의 마지막 요소를 observe
  observer.observe(lastItem);
}

$(function () {
  searchInit();
});
