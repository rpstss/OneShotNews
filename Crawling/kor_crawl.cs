using System; // C#의 기본 유형 네임스페이스(String을 사용하기 위함)
using System.IO; // CSV 파일을 만들 때 파일을 만들기 위함
using System.Reflection;
using System.Text.RegularExpressions;
using OpenQA.Selenium; // Selenium 을 사용하기 위함
using OpenQA.Selenium.Chrome; // Selenium의 크롬 드라이버를 사용하기 위함
using OpenQA.Selenium.Support.UI; // try 문을 사용하기 위함

namespace kor.scraping
{
    public static class Crawler
    {
        public static void Main()
        {
            // 크롤링할 변수들
            string[] reviews = new string[100]; // 댓글 수 개수
            string[] titles = new string[100]; // 뉴스 제목
            string[] contexts = new string[100]; // 본문 내용
            string[] dates = new string[100]; // 뉴스의 날짜
            string[] relateds = new string[100]; // 관련 뉴스 개수
            string[] categories = new string[100]; // 카테고리
            string[] urls = new string[100]; // url
            string[] companies = new string[100]; // 언론사

            // 조사할 카테고리
            string[] category_names = { "정치", "경제", "사회", "생활_문화", "IT_과학", "세계" };
            int[] category_urls = { 100, 101, 102, 103, 105, 104 }; // 카테고리별 url 주소

            // 드라이버 생성
            IWebDriver driver = new ChromeDriver("C://chromedriver.exe"); 

            int count = 0; // 뉴스를 들어가기 위해 사용하는 count
            int count_related = 0; // 관련 뉴스 개수를 얻기 위해 사용하는 count
            int count_category = 0; // 카테고리 무엇인지 알기 위해 사용하는 count
            int count_url = 0; // url을 가져오기 위해 사용하는 count
            int count_company = 0; // 언론사를 가져오기 위해 사용하는 count

            // 카테고리별로 실행(6개의 카테고리)
            for (int i = 0; i < 6; i++) 
            {
                // 각 카테고리별 뉴스 사이트로 이동
                driver.Navigate().GoToUrl($"https://news.naver.com/main/main.naver?mode=LSD&mid=shm&sid1={category_urls[i]}");
                System.Threading.Thread.Sleep(5000); // 5초 기다리기

                // 더보기 클릭창이 있을 경우 클릭하기
                try
                {
                    IWebElement plus = driver.FindElement(By.CssSelector(".cluster_more"));
                    plus.Click();
                    System.Threading.Thread.Sleep(3000); // 3초 기다리기
                }
                catch (NoSuchElementException)
                {
                    // .cluster_more 엘리먼트를 찾지 못한 경우 아무 작업도 수행하지 않음
                }

                // 본문 정보 가져오기
                IWebElement element = driver.FindElement(By.TagName("div"));

                // 헤드라인에 있는 모든 뉴스들 정보 가져오기
                IList<IWebElement> elements = element.FindElements(By.CssSelector(".sh_text"));

                //  헤드라인에 있는 뉴스들마다 크롤링
                foreach (IWebElement e in elements)
                {
                    // href 속성을 사용하여 URL을 가져오기
                    IWebElement linkElement = e.FindElement(By.CssSelector("a"));
                    string url = linkElement.GetAttribute("href");

                    // url 변수에 저장
                    urls[count_url] = url;
                    count_url += 1;
                }

                count_url = 0; // url 수 0으로 재선언

                // 관련 뉴스 개수 가져오기
                IList<IWebElement> elements_related = element.FindElements(By.CssSelector(".sh_head_more_icon_num"));

                // 관련 뉴스 요소마다 실행
                foreach (IWebElement e in elements_related)
                {
                    if (e == null)
                        break;

                    relateds[count_related] = e.Text; // 관련 뉴스 개수 저장
                    categories[count_related] = category_names[count_category]; // 카테고리가 무엇인지 저장
                    count_related += 1;
                }

                // 언론사 가져오기
                IList<IWebElement> elements_company = element.FindElements(By.CssSelector(".sh_text_press"));

                // 언론사 요소마다 실행
                foreach (IWebElement e in elements_company)
                {
                    if (e == null)
                        break;

                    companies[count_company] = e.Text; // 언론사
                    count_company += 1;
                }

                // 각 헤드라인 뉴스에 들어가서 크롤링함
                foreach (string k in urls)
                {

                    if (k == null)
                        break;

                    driver.Navigate().GoToUrl(k); // url 뉴스로 가기
                    System.Threading.Thread.Sleep(5000); // 5초 기다리기

                    // 댓글 수 가져오기
                    var review = driver.FindElement(By.CssSelector(".media_end_head_cmtcount_button._COMMENT_COUNT_VIEW"));

                    // 댓글 수가 없을 경우를 위해 if문 사용
                    if (review.Text == "댓글")
                        reviews[count] = "0";
                    else
                        reviews[count] = review.Text; // 댓글 수 저장
                    System.Threading.Thread.Sleep(1000); // 1초 기다리기

                    // 제목 가져오기
                    var titleElement = driver.FindElement(By.CssSelector(".media_end_head_headline"));

                    // 재목 특수문자 처리
                    string rawTitle = titleElement.Text;
                    string refinedTitle = rawTitle.Replace("\n", " ").Replace("\t", " ").Trim(); 
                    titles[count] = refinedTitle; // 본문 저장
                    System.Threading.Thread.Sleep(1000); // 1초 기다리기

                    // 본문 가져오기
                    var textElement = driver.FindElement(By.CssSelector("#newsct_article"));
                    string rawText = textElement.Text;

                    // 본문의 알파벳, 숫자, 공백, 밑줄, 마침표를 제외하고 다른 특수문자 제거
                    string refinedText = Regex.Replace(rawText, @"[^\w\s.]", " "); 
                    refinedText = rawText.Replace("\n", " ").Replace("\t", " ").Replace(".", ". ").Replace("\xa0", ". ").Trim();
                    contexts[count] = refinedText; // 본문 저장
                    System.Threading.Thread.Sleep(1000); // 1초 기다리기

                    // 뉴스 작성 날짜 가져오기
                    var date = driver.FindElement(By.CssSelector(".media_end_head_info_datestamp_time"));
                    dates[count] = date.Text; // 날짜 저장
                    System.Threading.Thread.Sleep(5000); // 5초 기다리기

                    count += 1; // 다음 뉴스로 진행
                }

                count_category += 1; // 다음 카테고리 뉴스들로 감   
                urls = new string[100]; // url 배열 초기화
            }

            driver.Quit(); // 드라이브 닫기

            int length = 0; // 배열의 수

            //  배열에 들어있는 요소의 수를 얻기
            foreach (string title in titles)
            {
                if (!string.IsNullOrEmpty(title))
                {
                    length++;
                }
            }

            // 잘 크롤링 되었는지  확인하기 위해 5개의 행만 출력
            for (int i = 0; i < 5; i++)
            {

                Console.Write($"{i} ||");
                Console.Write($"{titles[i]} ||");
                Console.Write($"{reviews[i]} ||");
                Console.Write($"{dates[i]} ||");
                Console.Write($"{relateds[i]} ||");
                Console.Write($"{categories[i]} ||");
                Console.Write($"{companies[i]} ||");
                Console.Write($"{contexts[i]} ||");
                Console.WriteLine("///");

            }

            // txt를 저장할 주소
            string file_path = "C:/jupython/플밍2프로젝트/kor_raw.txt"; 

            // txt 파일로 크롤링한 데이터 저장
            using (StreamWriter writer = new StreamWriter(file_path))
            {
                // 파일의 헤더 작성
                writer.WriteLine("제목||분야||본문||일자||언론사||댓글수||관련뉴스개수$$");

                for (int i = 0; i < length; i++)
                {
                    // 데이터 작성
                    string line = $"{titles[i]}||{categories[i]}||{contexts[i]}||{dates[i]}||{companies[i]}||{reviews[i]}||{relateds[i]}$$";
                    writer.WriteLine(line);
                }
            }

            // txt 파일 잘 저장되었는지 출력
            Console.WriteLine("파일이 잘 저장되었습니다."); 
            Console.WriteLine($"파일 저장 위치: {file_path}");
        }

    }
    
}