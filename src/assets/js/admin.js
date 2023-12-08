const MENUS = [
    { "title": "관리자 관리", subs: [ { "title": "관리자 설정" }, { "title": "권한 그룹"} ]},
    { "title": "회원 관리", subs: [ { "title": "건강이랑 신청 관리" } ]},
    { "title": "메뉴 관리", subs: [ {"title": "전체 메뉴 관리"}, {"title": "종로맵 메뉴"}, {"title": "페이지 관리"}, {"title": "외부 연동 메뉴"}]},
    { "title": "스마트 제설함 관리 ", subs: [ {"title": "제설함 관리"}, {"title": "민원 관리"}]},
    { "title": "콘텐츠 관리", subs: [ {"title": "탐방 코스"}, {"title": "코스 거점"}, {"title": "검색어"}, {"title": "배너"}]},
    { "title": "시스템 관리", subs: [ {"title": "공통코드 관리"}, {"title": "앱버전 관리"}, {"title": "공공데이터 관리"}]},
    { "title": "서비스 관리", subs: [ {"title": "공지사항 관리"}, {"title": "1:1 문의"}, {"title": "FAQ"}, {"title": "알림 메시지"}]},
    { "title": "운영 관리", subs: [ {"title": "약관 관리"}, {"title": "사용이력 및 통계 관리"}, {"title": "청소 업체 관리"}]},
    { "title": "설문조사 관리", subs: []},
]
const container = document.getElementById('gnb');


window.onload = function() {

    // gnb 메뉴 동적 생성
    let _html = '';
    MENUS.forEach((menu) => {
        _html += '<li class="' + (menu.subs.length > 0 ? 'has-child' : '')+ '">'
            +       '<a href="#">' + menu.title + '</a>';

        if (menu.subs.length > 0) {
            _html += '<ul class="sub">'
                menu.subs.forEach((m) => {
                    _html += '<li>'
                        +       '<a href="#">' + m.title + '</a>'
                        +   '</li>'
                });
            _html += '</ul>'
        }
        _html +=  '</li>'
    })
    if (container) {
        container.innerHTML = _html;
        
        container.addEventListener('click', function(e) {
            const _target = e.target;
            const _parent = e.target.parentNode;
            
            if (_target.tagName === "A") {
                if (_parent.classList.contains('open')) {
                    _parent.classList.remove('open')
                    _target.nextSibling.classList.remove('visible')
                } else {
                    _parent.classList.add('open')
                    _target.nextSibling.classList.add('visible')
                }
            }
        })
    }
}

// 알람리스트 드롭다운
const btnAlarm = document.querySelector('.icon.alarm')
if (btnAlarm) {
    btnAlarm.addEventListener('click', function() {
        btnAlarm.nextElementSibling.classList.add('open')
    })
}


// 팝업 샘플 
const btnPopups = document.querySelectorAll('.btn-popup');
if (btnPopups.length > 0) {
    btnPopups.forEach((btn) => {
        btn.addEventListener('click', function(e) {
            console.log(e.target.dataset.target)
            message.alert({
                title: '팝업 샘플입니다.',
                message: '요것은 alert입니다.'
            }, e.target.dataset.target)
        })
    })
}

const message = {
    alert: function(msg, type = "alert", cb) {
        const _container = document.createElement('aside');
		_container.setAttribute('class', 'popup-bg popup-closable on')
		
		let _html = '';
		_html += '<div class="msg-popup ' + type + ' show">'
			+		'<div class="message">';
			
		if (msg.hasOwnProperty("title") && msg.title) {
			_html +=	'<h3 class="title">' + msg.title +'</h3>';
		}
		
		_html +=		'<p>' + msg.message + '</p>'
			+		'</div>'
			+		'<div class="msg-btns">';
			
		if (type === "confirm") {
			// 취소버튼 추가 
			_html += 	'<button type="button" class="cancel">취소</button>';
		}
		_html +=		'<button type="button" class="confirm">확인</button>'
			+		'</div>'
			+	'</div>';
		
		_container.innerHTML = _html;
		
		document.body.append(_container);
		document.body.style.overflowY = 'hidden';
		
		const btns = _container.querySelector('.msg-btns');
		btns.addEventListener('click', function(e) {
			if (e.target.tagName === "BUTTON") {
				if (e.target.classList.contains('confirm') && cb) {
					cb();
				} 
				// 팝업 닫기(삭제)
				_container.remove();
				document.body.style.overflowY = 'auto'
			}
		})
    }
}

const modal = {
    open: function(target) {
        if (!target) return
        const container = document.querySelector('#' + target);
        container.classList.add('show')
        container.closest('.popup-bg').classList.add('on')
        document.body.style.overflowY = 'hidden'
    },
    close: function(e) {
        e.target.closest('.popup').classList.remove('show')
        e.target.closest('.popup-bg').classList.remove('on')
        document.body.style.overflowY = 'auto'
    }
}

const closeBtns = document.querySelectorAll('.btn-popup-close')
if (closeBtns.length > 0) {
    closeBtns.forEach((btn) => {
        btn.addEventListener('click', function(e) {
            modal.close(e)
        })
    })
}


const tooltips = document.querySelectorAll('[data-role=tooltip]')
if (tooltips.length > 0) {
    tooltips.forEach((tooltip) => {
        tooltip.addEventListener('click', function(e) {
            if (e.target.nextElementSibling) {
                e.target.nextElementSibling.classList.add('show')
            }
        })
    })
}

window.addEventListener('click', function(e) {

    // 툴팁 밖 클릭 시 열려있는 툴팁 닫기
    if (e.target.dataset.role !== 'tooltip') {
        const _tips = document.querySelectorAll('.tips')
        if (_tips.length > 0) {
            _tips.forEach((tip) => {
                tip.classList.remove('show')
            })
        }
    }
})


const popups = document.querySelectorAll('[data-role="popup"]');
if (popups.length > 0) {
    popups.forEach((popup) => {
        popup.addEventListener('click', function(e) {
            const target = e.target.dataset.target;
            modal.open(target);
        })
    })
}


$(function() {
    // tab 이벤트
    $(".tab").on("click", function () {
        // 보여줄 tab-content id 가져오기
        const target = $(this).attr("aria-controls");

        // 탭 활성화 처리
        $(".tab").removeClass("active");
        $(this).addClass("active");

        // 다른 탭은 키보드 탭으로 접근하지 않게 해줌 (tabindex=-1)
        $(".tab").attr("tabindex", -1);
        $(this).removeAttr("tabindex");

        $(".tab-content").attr("hidden", true);
        $("#" + target).removeAttr("hidden");
    });

    $('.dropdown-search').find('input[type="text"]').on('input', function() {
        if ($(this).val().length > 0) {
            $(this).next('.d-search').show();
        } else {
            $(this).next('.d-search').hide();
        }
    })

    $('.d-search_item').find('button').on('click', function() {
        $('.d-search').hide();
    })

    // All check
    $('.all-check').on('click', function(e) {
        console.log(e.target);
        if (e.target.checked) {
            $('tbody').find('input[type="checkbox"]').prop('checked', true)
        } else {
            $('tbody').find('input[type="checkbox"]').prop('checked', false)
        }
    })
})