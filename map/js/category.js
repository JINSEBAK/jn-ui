import { showModal } from "./common.js";
import { courseData } from "./data.js";
import {
  addMarkerEvent,
  addMarkerPopup,
  clearLines,
  clearMarkers,
  drawMarker,
  drawMarkerList,
  map,
  renderLines,
  setMapView,
} from "./map.js";

let categoryListElement = null;

const categories = [
  { name: "골목길 그리기", classname: "course", type: ["marker", "polyline"] },
  { name: "맵센터 마커", classname: "center", type: ["marker"] },
  { name: "토스트", classname: "toast", type: [] },
  { name: "네이버 브라우저창 띄우기", classname: "browswer", type: [] },
  { name: "모달", classname: "modal", type: [] },
  { name: "현재위치", classname: "curLocation", type: [] },
];

function categoryInit() {
  const parentEl = document.querySelector(".map-control");
  parentEl.innerHTML = `
    <div class="category">
        ${categories
          .map((c) => {
            return `
                <p class="${c.classname}">${c.name}</p>
            `;
          })
          .join("")}   
    </div>
  `;

  setCategoryEvents();
}

function setCategoryEvents() {
  const categoryList = document.querySelector(".category");
  categoryListElement = categoryList;
  categoryList.addEventListener("click", toggleCategory);
}

function removeAllActiveClass() {
  const menus = categoryListElement.querySelectorAll("p");
  menus.forEach((el) => {
    el.classList.remove("active");
  });
}

function toggleCategory({ target }) {
  const targetClassName = target.classList[0];
  const isTargetActive = target.classList[1];
  if (
    categories.some((el) => el.classname === targetClassName) &&
    !isTargetActive
  ) {
    removeAllActiveClass();
    clearMarkers();
    clearLines();
    target.classList.add("active");
    drawMapLayer(targetClassName);
  } else {
    target.classList.remove("active");
    clearMarkers();
    clearLines();
  }
}

function drawMapLayer(categoryNm) {
  let iconUrl = "";
  switch (categoryNm) {
    case "toast":
      if (window.flutter_inappwebview) {
        window.flutter_inappwebview.callHandler("showToast", "토스트 메시지");
      }
      break;

    case "modal":
      showModal({ title: "test" });
      break;

    case "course":
      const markers = drawMarkerList(courseData);
      markers.forEach((marker, idx) => {
        addMarkerPopup(marker, `<p>${idx + 1}번째 지점</p>`);
      });
      renderLines(courseData);
      break;

    // 지도센터 위치로 이동
    case "center":
      iconUrl = `../images/pin_1.png`;
      // 마커 생성하기
      const marker = drawMarker(map.getCenter().lat, map.getCenter().lng);
      // 마커에 클릭이벤트 추가하기
      addMarkerEvent(marker, () => {
        showModal({ title: "마커가 클릭되었습니다." });
      });
      break;

    // 새로운 브라우저 열기
    case "browswer":
      if (window.flutter_inappwebview) {
        window.flutter_inappwebview.callHandler(
          "browseWeb",
          "https://www.naver.com"
        );
      }
      break;

    // 유저 현재 위치기 얻기
    case "curLocation":
      iconUrl = `../images/pin_1.png`;
      if (window.flutter_inappwebview) {
        window.flutter_inappwebview.callHandler("getLocation").then((res) => {
          const result = JSON.parse(res);
          if (result.value) {
            setMapView(result.value.x, result.value.y);
          }
        });
      }
      break;
  }
}

export function changeKeyNameOfCoordinates({
  coordinates,
  latNm = "x", //위도
  lngNm = "y", //경도
}) {
  return coordinates.map((el) => {
    return { ...el, lat: el[latNm], lng: el[lngNm] };
  });
}

$(function () {
  categoryInit();
});
