/**
 * author: PSJ
 * ui 개발용 스크립트, 필요한 부분만 발췌하여 사용
 */

$(document).ready(function () {
  // input delete button toggle
  $('input[type="text"]').on("change paste input", function () {
    const len = $(this).val().length;
    if (len > 0) {
      $(this).next(".btn").addClass("active");
    } else {
      $(this).next(".btn").removeClass("active");
    }
  });
  // input clear
  $(".input")
    .find(".btn-delete")
    .on("click", function () {
      $(this).removeClass("active");
      $(this).prev('input[type="text"]').val("");
    });

  // textarea
  $("textarea").on("change paste input", function () {
    const len = $(this).val().length;
    $(this).prev(".counter").find(".current").text(len);
  });

  // bottom-sheet 호출
  $(".btn-select, .btn-popup").on("click", function () {
    const target = $(this).data("target");
    $("#" + target)
      .addClass("show")
      .parent(".popup-bg")
      .addClass("on");

    bodyScrollHidden();
  });

  // popup - dimmed area click
  $(".popup-closable").on("click", function (e) {
    if ($(this).has(e.target).length === 0) {
      $(this).removeClass("on");
      $(this).children("div").removeClass("show");
      bodyScrollHidden();
    }
  });

  // select options 선택 시 팝업 닫기
  $(".select-options .select-options_item").on("click", function () {
    popupClose(this);
  });

  // bottom sheet 닫기
  $(".btm-sheet_head .close").on("click", function () {
    popupClose(this);
  });

  // alert, confirm 내 버튼 클릭
  $(".msg-btns button").on("click", function () {
    popupClose(this);
  });

  // 중앙 select filter 닫기 버튼 클릭
  $(".filter-close")
    .find(".btn.close")
    .on("click", function () {
      popupClose(this);
    });

  // 파일첨부 - 파일명
  $("#file1").on("change", function (e) {
    attachFilesName(e);
  });

  // 파일첨부 - 미리보기
  $("#file2").on("change", function (e) {
    attachFilesPreview(e);
  });

  // tab 이벤트
  $(".tab-button").on("click", function () {
    // 보여줄 tab-content id 가져오기
    const target = $(this).attr("aria-controls");

    // 탭 활성화 처리
    $(".tab-item").removeClass("active");
    $(this).parent(".tab-item").addClass("active");

    // 다른 탭은 키보드 탭으로 접근하지 않게 해줌 (tabindex=-1)
    $(".tab-button").attr("tabindex", -1);
    $(this).removeAttr("tabindex");

    $(".tab-content").attr("hidden", true);
    $("#" + target).removeAttr("hidden");
  });

  // slide-down content
  $(".qa-list > li").on("click", function () {
    if ($(this).hasClass("open")) {
      $(this).removeClass("open");
    } else {
      $(".qa-list > li").removeClass("open");
      $(this).addClass("open");
    }
  });

  // 검색어 입력창 처리
  $(".input-keyword").on("input change paste", function () {
    console.log("123");
    const len = $(this).val().length;
    if (len > 0) {
      $(this).siblings(".btn-delete").fadeIn();
      $(this).siblings(".btn-search").hide();
    } else {
      $(this).siblings(".btn-delete").hide();
      $(this).siblings(".btn-search").fadeIn();
    }
  });

  $(".search-keyword")
    .find(".btn-delete")
    .on("click", function () {
      $(this).siblings(".input-keyword").val("");
      $(this).hide();
      $(this).siblings(".btn-search").fadeIn();
    });
});

/**
 * 팝업 닫기
 * obj: 이벤트 주체 (this)
 */
function popupClose(obj) {
  $(obj).parents("aside").removeClass("on");
  $(obj).parents("div").removeClass("show");
  bodyScrollHidden();
}

/**
 * body scroll control
 */
function bodyScrollHidden() {
  const opened = $("#aside").hasClass("on");
  if (opened) {
    $("body").css({ "overflow-y": "hidden" });
  } else {
    $("body").css({ "overflow-y": "auto" });
  }
}

/**
 * 첨부파일 미리보기
 */
function attachFilesPreview(e) {
  const len = $(".preview").find(".preview-item").length;
  if (len === 3) {
    alert("최대 3개까지만 등록 가능합니다.");
    return;
  }

  const file = e.target.files[0];
  let imgUrl = "";

  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = function () {
    imgUrl = reader.result;
    // 미리보기용 dom 생성
    const item =
      '<div class="preview-item">' +
      '<img src="' +
      imgUrl +
      '" alt="미리보기 이미지">' +
      '<button type="button" class="btn btn-delete">' +
      '<span class="sr-only">미리보기 삭제</span>' +
      "</button>" +
      "</div>";

    $(".preview").append(item);
    $(".preview-item")
      .find(".btn-delete")
      .on("click", function () {
        $(this).parents(".preview-item").remove();
      });
  };
}

/**
 * 첨부파일 파일명 처리
 */
function attachFilesName(e) {
  const file = e.target.files[0];
  const _html =
    '<li class="file-list_item">' +
    "<span>" +
    file.name +
    "</span>" +
    '<button type="button" class="btn btn-delete">' +
    '<span class="sr-only">첨부파일 삭제</span>' +
    "</button>" +
    "</li>";
  $(".file-list").append(_html);
  $(".file-list_item")
    .find(".btn-delete")
    .on("click", function () {
      $(this).parent(".file-list_item").remove();
    });
}

/**
 * 숫자 세자리 콤마 적용
 */
function comma(value) {
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * item.target: 동적dom 추가될 부모 dom의 아이디
 * item.message: 표현 메시지
 */
function emptyMessage(item) {
  if (!item.target) return;
  const _target = document.getElementById(item.target);
  let _container = document.createElement("div");
  let _text = document.createTextNode(item.message);

  _container.classList.add("not-found");
  _container.appendChild(_text);

  _target.appendChild(_container);
}

/**
 * 날짜객체 단축형으로 변경
 * @param {*} value : date obejct
 */
function dateToShortFormat(value) {
  let _new = new Date(value);
  const _m = _new.getMonth();
  const _d = _new.getDate();
  _new = `${_m}.${_d}`;

  return _new;
}

/**
 * 셀렉트 필터 UI 동적 생성하기
 * options: 선택 옵션 (key, text, value)
 * cb: 옵션 선택 시 실행할 콜백함수
 */

function getFilterOptions(options, cb) {
  console.log(options);
  if (options.length === 0) return;

  // dom structure
  const _html = `
    <aside class="popup-bg popup-closable">
      <div class="popup popup-cnt popup-filter" id="selectFilter">
          <div class="filter-close">
              <button type="button" class="btn btn-icon icon close">
                  <span class="sr-only">팝업 닫기</span>
              </button>
          </div>
          <ul class="select-options"></ul>
      </div>
    </aside>
  `;

  const dom = new DOMParser().parseFromString(_html, "text/html");
  const _popup = dom.querySelector("aside");
  const _select = dom.querySelector(".select-options");

  // dynamic filter option
  document.body.appendChild(_popup);

  options.forEach((option) => {
    const _li = document.createElement("li");
    const _btn = document.createElement("button");

    // dynamic button 처리
    _btn.setAttribute("type", "button");
    _btn.setAttribute("data-value", option.value);
    _btn.innerText = option.text;
    _btn.onclick = function (e) {
      const _value = e.target.dataset.value;
      cb({ value: _value, text: option.text });

      // 팝업 닫기
      _popup.classList.remove("on");
      _popup.childNodes(".popup-filter").classList.remove("show");
    };

    _li.classList.add("select-options_item");
    _li.appendChild(_btn);

    _select.appendChild(_li);
  });

  _popup.querySelector(".btn.close").addEventListener("click", function () {
    document.body.removeChild(_popup);
  });
}
