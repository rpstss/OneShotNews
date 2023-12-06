//connectorToDB
#include <iostream>
#include <string>
#include <vector>
#include <filesystem>
#include "mysql/mysql.h"
#include "opencv4/opencv2/opencv.hpp"


using namespace std;
using namespace cv;
namespace fs=std::filesystem;


MYSQL *conn_ptr; // 연결자 선언

MYSQL_RES *res_ptr; // 쿼리문 결과 선언

MYSQL_ROW row_ptr; // 쿼리문 결과를 저장한 열 선언

int insertText(fs::path p,char query[]) //입력한 경로의 txt파일을 매개변수로 받은 쿼리문을 이용해서 db에 삽입
{
    if(mysql_query(conn_ptr,query)!=0) //쿼리문 오류시
    { 
        std::cout<<"오류! insertText부분"<<endl;
        std::cout<<"LOAD DATA LOCAL INFILE ...."<<endl;
        std::cout<<"쿼리문 오류:"<<mysql_error(conn_ptr)<<endl;
        return -1;
    }

    mysql_commit(conn_ptr); //쿼리문 결과 저장 
    std::cout<<"txt파일 삽입 성공!"<<endl;

    return 0;

}

int insertImage(fs::path p,char query[]) //입력한 경로의 이미지 파일을 매개변수로 받은 쿼리문을 이용해서 db에 삽입
{
    if(mysql_query(conn_ptr,query)!=0) //쿼리문 오류시 
    {
        std::cout<<"오류! insertImage부분"<<endl;
        std::cout<<"SELECT imageID FROM practice.newsdb where selectResult=1"<<endl;
        std::cout<<"쿼리문 오류:"<<mysql_error(conn_ptr)<<endl;

        return -1;
    }

    res_ptr=mysql_store_result(conn_ptr); //쿼리문 결과 초기화

    int num_rows=mysql_num_rows(res_ptr); //쿼리문 결과로 받은 열 초기화
    std::cout<<"보여줄 뉴스의 개수:"<<num_rows<<endl;

    int j=0;
    if(fs::exists(p.parent_path()/"image")) //경로에 image 이름의 폴더가 있을시
    {
        while((row_ptr=mysql_fetch_row(res_ptr))!=NULL)
        {
            std::cout<<j+1<<"번째 이미지 검색중.."<<endl;
            std::cout<<"이미지 id:"<<row_ptr[0]<<endl;

            std::string imageName=row_ptr[0];


            if(fs::exists(p.parent_path()/"image"/(imageName+".png"))) //png와 jpeg 포멧 2개만 인식함 
            {
                imageName+=".png";
            }

            else if(fs::exists(p.parent_path()/"image"/(imageName+".jpeg")))
            {
                imageName+=".jpeg";
            }

            else
            {
                cout<<"오류! 알맞는 이미지 포맷 존재x"<<endl;
                return -1;
            }


            fs::path imagePath(p.parent_path()/"image"/imageName);

            if(fs::exists(imagePath)) //db에 저장된 이미지 파일의 이름의 경로가 로컬파일에 존재시
            {
                int size = fs::file_size(imagePath); //filesystem를 이용해서 이미지 파일의 size를 구함
                std::cout<<"이미지 size(bytes):"<<size<<endl;

                Mat img=imread(imagePath);

                int Image_width_int=img.cols; //opencv 라이브러리를 이용해서 이미지 파일의 가로,세로 길이를 구함 
                int Image_height_int=img.rows;

                img.release();

                cout<<"이미지 가로크기:"<<Image_width_int<<endl;
                cout<<"이미지 세로크기:"<<Image_height_int<<endl;


                char *data=new char[size];
                char *chunk=new char[2*size+1];


                FILE *fp;

                fp=fopen(imagePath.c_str(),"rb"); //경로에 해당하는 파일 열기
                size = fread(data,1,size,fp); //파일 읽기

                fclose(fp); //파일 닫기
                mysql_real_escape_string(conn_ptr,chunk,data,size);
                char *query5=new char[size*5];

                char* query6="INSERT INTO practice.imagedb(imageID,image_width,image_height,image_size,image_data) VALUES('%s','%d','%d','%d','%s')";
                                

                int len=sprintf(query5,query6,row_ptr[0],Image_width_int,Image_height_int,size,chunk);
                                

                if(mysql_real_query(conn_ptr,query5,len)!=0) //쿼리문 오류시 
                {
                    std::cout<<"오류! insertImage 부분"<<endl;
                    std::cout<<"INSERT INTO practice.imagedb(imageID,image_width,image_height,image_data)"<<endl;
                    std::cout<<"SQL문 실행오류:"<<mysql_error(conn_ptr)<<endl;
                    return -1;
                }


                mysql_commit(conn_ptr); //쿼리문 결과 확정 
                std::cout<<imagePath<<"삽입 성공"<<endl;

                delete[] data; //동적할당 메모리 해제 
                delete[] chunk;
                delete[] query5;

                j+=1;

            }

            else
            {
                std::cout<<imagePath<<"이름의 이미지 파일 발견x"<<endl;
                continue;
            }
        }
    }

    else
    {
        std::cout<<"image 폴더 존재x"<<endl;
        return -1;
    }
    
}

int main()
{
    char* host="practice.c8v0cx6vnmfk.us-east-2.rds.amazonaws.com"; //db 호스트
    char* user="********"; //db user
    char* pwd="********"; //db pwd
    char* db="practice"; //db schema
    
    conn_ptr = mysql_init(NULL);
    if(!conn_ptr) { //연결 안되면

        printf("error");

        exit(0);

    }

    else 
    {

        printf("MYSQL 접속 시도....\n");

    }

    bool opt=true;
    mysql_options(conn_ptr,MYSQL_OPT_LOCAL_INFILE,&opt);

    conn_ptr=mysql_real_connect(conn_ptr,host,user,pwd,db,0,NULL,0);

    if(conn_ptr)
    {
        printf("접속 성공!\n");
    }

    else
    {
        printf("접속 실패\n");
    }

    std::string s1;
    cout<<"kor_scraping.txt 로컬 파일 경로위치:";
    cin>>s1;
    fs::path kor_txt_path(s1);
    char kor_text_query[128];
    strcpy(kor_text_query, "LOAD DATA LOCAL INFILE '");
    strcat(kor_text_query,kor_txt_path.c_str());
    strcat(kor_text_query,"' INTO TABLE practice.kor_newsdb FIELDS TERMINATED BY '||' LINES TERMINATED BY '&&'");

    char kor_image_query[128];
    strcpy(kor_image_query,"SELECT imageID FROM practice.kor_newsdb where selectResult=1");

    cout<<"kor_scraping.txt 삽입 시도..."<<endl;
    if(insertText(kor_txt_path,kor_text_query)==0)
    {
        insertImage(kor_txt_path,kor_image_query);
    }


    std::string s2;
    cout<<"eng_scraping.txt 로컬 파일 경로 위치:";
    cin>>s2;
    fs::path eng_text_path(s2);
    char eng_text_query[128];
    strcpy(eng_text_query,"LOAD DATA LOCAL INFILE '");
    strcat(eng_text_query,eng_text_path.c_str());
    strcat(eng_text_query,"' INTO TABLE practice.eng_newsdb FIELDS TERMINATED BY '||' LINES TERMINATED BY '&&'");

    char eng_image_query[128];
    strcpy(eng_image_query,"SELECT imageID FROM practice.eng_newsdb");

    cout<<"eng_scraping.txt 삽입 시도..."<<endl;
    if(insertText(eng_text_path,eng_text_query)==0)
    {
        insertImage(eng_text_path,eng_image_query);
    }

    return 0;

}

