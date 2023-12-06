// 명언 배열 선언
const quotes = [
    {
        quote: "자기 자신을 믿으면 틀림없이, 살 길이 보인다 - ",
        author: "요한 볼프강 폰 쾨테",
    },
    {
        quote: "나무에게 가장 중요한 것이 무엇이냐고 물으면 그것은 과실이라고 누구나 대답할 것이다. 그러나 실제로는 씨다 - ",
        author: "프리드리히 니체",
    },
    {
        quote: "우리 개개인이 항해하고 있는 이 인생의 광막한 대양 속에서 이성은 나침반, 열정은 질풍 - ",
        author: "알렉산더 포프",
    },
    {
        quote: "인생에서 가장 중요한 것은 휴식 시간에 득점하는 것이다 -",
        author: "나폴레옹 보나파르트",
    },
    {
        quote: "제비 한 마리가 와도 여름이 되지 않고 하루아침에 여름이 될 수도 없다. 이처럼 하루 또는 짧은 시간에 행복도 행운도 오지 않는다 - ",
        author: "아리스토텔레스",
    },
    {
        quote: "인생은 위험으로 가득 찬 모엄이거나 아무것도 없는 것 중 하나다 -",
        author: "헬렌 켈러",
    },
    {
        quote: "죽음을 앞두고 처참하게 인생을 되돌아봐야 할 때, 불미스러운 일이나, 놓친 기회, 그리고 후회하는 일들만 떠오른다면 그건 너무 불행한 일이다 - ",
        author: "오드리 헵번",
    },
    {
        quote: "시간은 상대적이다 - ",
        author: "알베르트 아인슈타인",
    },
    {
        quote: "내일 죽을 것처럼 살아라, 영원히 사는 것처럼 배워라 - ",
        author: "마하트마 간디",
    },
    {
        quote: "시간이 사람을 바꾼다고 하지만 사실은 스스로 바꿔야 한다 - ",
        author: "앤디 워홀",
    },
    {
        quote: "성찰하지 않는 인생은 살 가치가 없다 - ",
        author: "소크라테스",
    },
    {
        quote: "오늘 할 수 있는 일을 내일로 미루지마라 - ",
        author: "벤자민 프랭클린",
    },
    {
        quote: "모든 사람들로부터 사랑받지 않아도 된다 - ",
        author: "프리드리히 니체",
    },
    {
        quote: "내 비장의 무기는 아직 내 손안에 있다 - ",
        author: "나폴레옹 보나파르트",
    },
    {
        quote: "꿈을 꾸기에 인생은 빛난다 - ",
        author: "볼프강 아마데우스 모차르트",
    },
    {
        quote: "꿈을 꿀 수 있다면, 그 꿈을 실현할 수 있다 - ",
        author: "윌트 디즈니",
    },
    {
        quote: "자세히 보아야 예쁘다, 오래보아야 사랑스럽다, 너도 그렇다 - ",
        author: "나태주",
    },
    {
        quote: "수고했어, 오늘도 - ",
        author: "OneShotNews",
    },
];

// HTML 문서에서 명언을 표시할 요소 선택
const quoteElement = document.querySelector("#quote span:first-child");
const authorElement = document.querySelector("#quote span:last-child");

// 오늘의 명언 선택
const todaysQuote = quotes[Math.floor(Math.random() * quotes.length)];

// HTML에 명언 삽입
quoteElement.innerText = todaysQuote.quote;
authorElement.innerText = todaysQuote.author;