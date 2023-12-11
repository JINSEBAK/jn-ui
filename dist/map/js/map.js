export let map = null;
export let modalInstance = null;
export let mapCenter = {
  // 위도 (y,lat),경도 (x,lng)
  lat: null,
  lng: null,
};

// 마커 객체를 담아두는 배열
let markers = [];
// 라인 객체를 담아두는 배열
let lines = [];

function mapInit() {
  // id가 _map 인 div를 통해 지도 뷰어를 구성
  map = L.map(map_, {
    continuousWorld: true,
    worldCopyJump: false,
    zoomControl: false,
    zoomAnimation: true,
    fadeAnimation: true,
    inertia: false,
    closePopupOnClick: false,
    attributionControl: true,
  });

  // 지도 초기 위경도 설정
  map.setView([37.5683206, 126.9905207], 10); //지도 좌표 이동
  BaseMapChange(map, L.Dawul.BASEMAP_GEN); // 일반지도
}

export function setMapView(x, y, level = 10) {
  if (!x || !y) return;
  map.setView([x, y], level); //지도 좌표 이동
}

/**
 * 마커에 클릭이벤트 추가하기
 * @param {이벤트를 추가할 마커객체} marker
 * @param {마커객체가 클릭 되었을때 실행될 콜백함수} cb
 */
export function addMarkerEvent(marker, cb) {
  marker._icon.addEventListener("click", (e) => {
    cb();
  });
  // marker.on("click", function (e) {
  //   alert(e.latlng); // e is an event object (MouseEvent in this case)
  // });
}

// 마커에 팝업 인포 추가하기
export function addMarkerPopup(marker, html) {
  marker._icon.addEventListener("click", () => {
    marker
      .bindPopup(html, {
        offset: [0, -30],
      })
      .openPopup();
  });
}

/**
 *  마커 그리기
 * @param {위도} lat
 * @param {경도} lng
 */
export function drawMarker(lat, lng) {
  const marker = new L.Marker(new L.LatLng(lat, lng), {
    icon: new L.Icon({
      iconUrl: `../images/pin_1.png`,
      iconAnchor: [13, 34],
    }),
  }).addTo(map);

  // 마커 객체를 배열에 저장해 놓는다 (추후 삭제를 위해)
  markers.push(marker);
  return marker;
}

export function drawMarkerList(coors) {
  let markers = [];
  coors.forEach((el) => {
    const marker = drawMarker(el.lat, el.lng);
    markers.push(marker);
  });
  return markers;
}

// 마커지우기
export function clearMarkers() {
  markers.forEach((marker) => {
    map.removeLayer(marker);
  });
  markers = [];
}

// 라인지우기
export function clearLines() {
  if (lines.length) {
    lines.forEach((line) => {
      map.removeLayer(line);
    });
    lines = [];
  }
}
/**
 *  라인 그리기
 * @param {path 정보를 담고 있는 배열} coors
 * ex: [{ lat: 37.569006, lng: 126.982845},{ lat: 37.569006, lng: 126.982845}]
 */
export function renderLines(coors) {
  if (!coors.length) return;

  let path = []; // 라인 정보를 담은 path 배열
  coors.forEach((coor) => {
    path.push(new L.LatLng(coor.lat, coor.lng));
  });
  const line = L.polyline(path, {
    color: "#FF6666",
    weight: 4,
    opacity: 1, //투명도
  }).addTo(map);

  // map 위치를 line으로 이동
  map.fitBounds(line.getBounds(), {
    padding: [100, 100],
  });

  lines.push(line);
}

function modalInit() {
  MicroModal.init({
    onShow: (modal) => console.info(`${modal.id} is shown`), // [1]
    onClose: (modal) => console.info(`${modal.id} is hidden`), // [2]
    openTrigger: "data-custom-open", // [3]
    closeTrigger: "data-custom-close", // [4]
    openClass: "is-open", // [5]
    disableScroll: true, // [6]
    disableFocus: false, // [7]
    awaitOpenAnimation: false, // [8]
    awaitCloseAnimation: false, // [9]
    debugMode: true, // [10]-
  });
  modalInstance = MicroModal.init({
    onShow: (modal) => console.info(`${modal.id} is shown`), // [1]
  });
}
$(function () {
  mapInit();
  modalInit();
});
