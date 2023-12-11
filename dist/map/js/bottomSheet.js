// import { showToastMessage } from "../common/common.js";
// import { setMapView } from "./main.js";
// import { drawSingleMarker } from "./marker.js";

// Select DOM elements
const bottomSheet = document.querySelector(".bottom-sheet");
const sheetContent = bottomSheet.querySelector(".content");
const dragIcon = bottomSheet.querySelector(".drag-icon");
const curLocationBtn = bottomSheet.querySelector(".cur-location");
// Global variables for tracking drag events
let isDragging = false,
  startY,
  startHeight;

export const updateSheetHeight = (height) => {
  sheetContent.style.height = `${height}vh`; //updates the height of the sheet content
  // Toggles the fullscreen class to bottomSheet if the height is equal to 100
  bottomSheet.classList.toggle("fullscreen", height === 100);
};
// Sets initial drag position, sheetContent height and add dragging class to the bottom sheet
const dragStart = (e) => {
  isDragging = true;
  startY = e.pageY || e.touches?.[0].pageY;
  startHeight = parseInt(sheetContent.style.height);
  bottomSheet.classList.add("dragging");
};
// Calculates the new height for the sheet content and call the updateSheetHeight function
const dragging = (e) => {
  if (!isDragging) return;
  const delta = startY - (e.pageY || e.touches?.[0].pageY);
  const newHeight = startHeight + (delta / window.innerHeight) * 100;
  updateSheetHeight(newHeight);
};
// Determines whether to hide, set to fullscreen, or set to default
// height based on the current height of the sheet content
const dragStop = () => {
  isDragging = false;
  bottomSheet.classList.remove("dragging");
  const sheetHeight = parseInt(sheetContent.style.height);
  // console.log("dragStop", sheetHeight);
  if (isNaN(sheetHeight)) {
    updateSheetHeight(15);
    return;
  }
  sheetHeight < 25
    ? // ? hideBottomSheet()
      updateSheetHeight(15)
    : sheetHeight > 70
    ? updateSheetHeight(80)
    : updateSheetHeight(50);
};

// function moveCurLocation() {
//   if (window.flutter_inappwebview) {
//     getUserLocation().then((res) => {
//       showToastMessage(`위도: ${res.value.x} 경도: ${res.value.y}`);
//       setMapView(res.value.x, res.value.y);
//       drawSingleMarker(res.value.x, res.value.y);
//     });
//   }
// }

$(function () {
  dragIcon.addEventListener("mousedown", dragStart);
  dragIcon.addEventListener("mousemove", dragging);
  dragIcon.addEventListener("mouseup", dragStop);
  dragIcon.addEventListener("touchstart", dragStart);
  dragIcon.addEventListener("touchmove", dragging);
  dragIcon.addEventListener("touchend", dragStop);
  updateSheetHeight(15);
});

// curLocationBtn.addEventListener("click", moveCurLocation);
