// 시계 요소를 가져옴
const clock = document.getElementById("clock");

// 현재 시간을 표시하는 함수
function getClock() {
    // 현재 날짜 객체 생성
    const date = new Date();

    // 현재 시간, 분, 초를 가져와서 두 자리수로 표현
    const hour = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    // 시계 요소에 현재 시간 삽입
    clock.innerText = `${hour}:${minutes}:${seconds}`;
}

// 페이지 로딩 시 한 번 호출하여 초기 시간을 설정
getClock();

// 1초마다 getClock 함수를 호출하여 실시간으로 시간을 갱신
setInterval(getClock, 1000);