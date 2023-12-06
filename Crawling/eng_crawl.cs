using System; // C#의 기본 유형 네임스페이스(String을 사용하기 위함)
using System.IO; // CSV 파일을 만들 때 파일을 만들기 위함
using System.Reflection;
using System.Text.RegularExpressions;
using System.Xml.Linq;
using OpenQA.Selenium; // Selenium 을 사용하기 위함
using OpenQA.Selenium.Chrome; // Selenium의 크롬 드라이버를 사용하기 위함


namespace eng.scraping
{
    public static class Crawler
    {
        public static void Main()
        {
            // 크롤링할 변수들
            string[] titles = new string[100]; // 제목
            string[] categories = new string[100]; // 분야
            string[] contexts = new string[100]; // 본문

            // 조사할 카테고리
            string[] category_names = { "정치", "경제", "선거_사회", "생활", "기술", "세계" };

            // 카테고리별 url 주소
            string[] category_urls = {"news/politics/", "money/", "elections/", "life/", "tech/", "news/world/" };

            // USA Today 뉴스 도메인
            string base_url = "https://usatoday.com/" ;

            int count = 0; // 뉴스들을 저장하기 위해 사용한 변수

            // 드라이버 생성
            IWebDriver driver = new ChromeDriver("C://chromedriver.exe");

            // 각 카테고리별로 url에 접속
            for (int i = 1; i < 6; i++)
            {
                // 카테고리의 url로 접속
                driver.Navigate().GoToUrl(base_url + category_urls[i]);
                System.Threading.Thread.Sleep(10000); // 10초 기다리기

                // 헤드라인에 있는 첫번째 뉴스 정보 가져오기
                IWebElement element_main = driver.FindElement(By.CssSelector(".gnt_m_he"));
                string url_main = element_main.GetAttribute("href"); // 헤드라인 메인 뉴스의 url 가져오기

                // 헤드라인 메인 뉴스 url에 오류가 있을 때를 대비해 다른 헤드라인 뉴스들 가져오기
                IList<IWebElement> elements_surplus = driver.FindElements(By.CssSelector(".gnt_m_flm_a"));

                string[] surplus_url = new string[100]; // 여분 뉴스의 url을 저장할 배열 생성

                int count_surplus = 0; // 여분 뉴스 url을 저장하기 위해 사용할 변수

                //  여분 뉴스에 있는 뉴스들마다 url 가져오기
                foreach (IWebElement e in elements_surplus)
                {
                    System.Threading.Thread.Sleep(1000); //1초 기다리기
                    // href 속성을 사용하여 URL을 가져오기
                    string url = e.GetAttribute("href");

                    // surplus_url 배열에 저장
                    surplus_url[count_surplus] = base_url + url;
                    count_surplus += 1;
                }

                // 메인 뉴스의 url이 잘 안 가져와졌을 때 => 여분 뉴스 url로 접속하기
                if (url_main == null || url_main.Length == 0)
                {
                    foreach (string url in surplus_url)
                    {
                        if (url != null)
                        {
                            // 여분 뉴스 페이지로 이동
                            driver.Navigate().GoToUrl(url);
                            System.Threading.Thread.Sleep(10000); // 10초 기다리기
                            break;
                        }
                    }
                }

                // 메인 뉴스의 url이 잘 가져와졌으면 메인 뉴스 페이지로 이동
                else
                {
                    // 헤드라인 메인 뉴스 페이지로 이동
                    driver.Navigate().GoToUrl(url_main);
                    System.Threading.Thread.Sleep(10000); // 10초 기다리기

                }

                // 뉴스 제목 크롤링
                var titleElement = driver.FindElement(By.CssSelector(".gnt_ar_hl"));

                // 재목 특수문자 처리
                string rawTitle = titleElement.Text;
                string refinedTitle = rawTitle.Replace("\n", " ").Replace("\t", " ").Trim();
                titles[count] = refinedTitle; // 본문 저장
                System.Threading.Thread.Sleep(1000); // 1초 기다리기

                // 본문 가져오기
                IList<IWebElement> textElements= driver.FindElements(By.CssSelector(".gnt_ar_b_p"));

                string context = ""; // 뉴스 본문

                // 본문 요소마다 실행
                foreach (IWebElement textElement in textElements)
                {
                    if (textElement == null)
                        break;

                    string rawText = textElement.Text;

                    // 본문의 알파벳, 숫자, 공백, 밑줄, 마침표를 제외하고 다른 특수문자 제거
                    string refinedText = Regex.Replace(rawText, @"[^\w\s.]", " ");
                    refinedText = rawText.Replace("\n", " ").Replace("\t", " ").Replace(".", ". ").Replace("\xa0", ". ").Trim();
                    System.Threading.Thread.Sleep(1000); // 1초 기다리기

                    // 뉴스 본문 변수에 추가
                    context += refinedText;
                }

                contexts[count] = context; // 본문 저장

                categories[count] = category_names[count]; // 분야 저장

                count += 1;
            }

            driver.Quit(); // 드라이버 닫기

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
                Console.Write($"{categories[i]} ||");
                Console.Write($"{contexts[i]} ||");
                Console.WriteLine("///");

            }

            // txt를 저장할 주소
            string file_path = "C:/jupython/플밍2프로젝트/eng_raw.txt";

            // txt 파일로 크롤링한 데이터 저장
            using (StreamWriter writer = new StreamWriter(file_path))
            {
                // 파일의 헤더 작성
                writer.WriteLine("제목||분야||본문$$");

                for (int i = 0; i < length; i++)
                {
                    // 데이터 작성
                    string line = $"{titles[i]}||{categories[i]}||{contexts[i]}$$";
                    writer.WriteLine(line);
                }
            }

            // txt 파일 잘 저장되었는지 출력
            Console.WriteLine("파일이 잘 저장되었습니다.");
            Console.WriteLine($"파일 저장 위치: {file_path}");

        }

    }

}