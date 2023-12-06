#include <iostream>
#include <fstream>
#include <string>

#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <netdb.h>
#include <stdexcept>
#include <openssl/ssl.h>
#include <openssl/err.h>

#include "mysql/mysql.h"

MYSQL *conn_ptr; //MYSQL 객체 선언

MYSQL_RES *res_ptr;

MYSQL_ROW row_ptr; 

int socket_fd; //소켓 선언 

SSL_CTX* InitCTX(void) //SSL 암호화를 위한 함수
{   
    SSL_CTX* ctx;

    SSL_library_init();
    OpenSSL_add_all_algorithms();  /* Load cryptos, et.al. */
    SSL_load_error_strings();   /* Bring in and register error messages */
    const SSL_METHOD* method = SSLv23_client_method(); /* Create new client-method instance */
    ctx = SSL_CTX_new(method);   /* Create new context */

    if (ctx == NULL) {
        ERR_print_errors_fp(stderr);
        throw std::runtime_error("SSL_CTX_new");
    }

    return ctx;
}

std::string base64_encode(const std::string &input) //메일 내용중 개인정보를 base64로 인코딩한후 전달하기 위한 인코딩함수 
{
    const std::string base64_chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

    std::string encoded;
    size_t input_length = input.length();

    for (size_t i = 0; i < input_length;) {
        // 3 바이트씩 처리
        uint32_t octet_a = i < input_length ? static_cast<uint8_t>(input[i++]) : 0;
        uint32_t octet_b = i < input_length ? static_cast<uint8_t>(input[i++]) : 0;
        uint32_t octet_c = i < input_length ? static_cast<uint8_t>(input[i++]) : 0;

        // 3 바이트를 4개의 6비트 문자로 변환
        uint32_t triple = (octet_a << 0x10) + (octet_b << 0x08) + octet_c;
        encoded += base64_chars[(triple >> 3 * 6) & 0x3F];
        encoded += base64_chars[(triple >> 2 * 6) & 0x3F];
        encoded += base64_chars[(triple >> 1 * 6) & 0x3F];
        encoded += base64_chars[(triple >> 0 * 6) & 0x3F];
    }

    // 남은 문자열 처리
    size_t mod = input_length % 3;
    if (mod) {
        encoded[encoded.length() - 1] = '=';
        if (mod == 1) {
            encoded[encoded.length() - 2] = '=';
        }
    }

    return encoded;
}

using namespace std;
class SMTPClient{ //메일전송에 필요한 클래스 선언 
    public:
        SMTPClient();

        int serverPort;
        string smtpServer,dnsAddress,emailTo,emailFrom,subject,message,url,username, password;;

        void Transport();

        SSL* Connect();

        void Close(int socket);

};

SMTPClient::SMTPClient() {
}

void SMTPClient::Transport()
{
    ofstream report;
    char recvBuffer[0x200],sendBuffer[0x200];
    
    SSL* ssl;
    int recvBytes;

    report.open("/Users/jeongjunho/Desktop/University/2023-2/programming2/Project/DBconnector/ForCompile/SMTP.txt");
    if(report.fail())
    {
        throw runtime_error("SMTP.txt 열기 실패");
    }
    if (!report.is_open()) 
    { throw runtime_error("SMTP.txt can not open the file."); }

    ssl=Connect();

    cout<<"ehlo"<<endl; //SMTP프로토콜에서 ehlo부분

    recvBytes=SSL_read(ssl,recvBuffer,sizeof(recvBuffer));
    recvBuffer[recvBytes]='\0';
    report<<recvBuffer;
    sprintf(sendBuffer, "ehlo %s\r\n", dnsAddress.c_str());
	report << sendBuffer;
	SSL_write(ssl, sendBuffer, (int)strlen(sendBuffer));

    cout<<"auth login"<<endl; //네이버는 auth login를 요구하기에 auth login
    sprintf(sendBuffer, "auth login\r\n");
    report << sendBuffer;
    SSL_write(ssl, sendBuffer, (int)strlen(sendBuffer));

    recvBytes = SSL_read(ssl, recvBuffer, sizeof(recvBuffer));
    recvBuffer[recvBytes] = '\0';
    report << recvBuffer;

    cout<<"username 전달"<<endl;
    // Gmail 계정 인증
    sprintf(sendBuffer, "%s\r\n", base64_encode(username).c_str());
    report << sendBuffer;
    SSL_write(ssl, sendBuffer, (int)strlen(sendBuffer));

    recvBytes = SSL_read(ssl, recvBuffer, sizeof(recvBuffer));
    recvBuffer[recvBytes] = '\0';
    report << recvBuffer;

    cout<<"user pwd 전달"<<endl;
    sprintf(sendBuffer, "%s\r\n", base64_encode(password).c_str());
    report << sendBuffer;
    ssize_t bytesSent = SSL_write(ssl, sendBuffer, strlen(sendBuffer));

    recvBytes = SSL_read(ssl, recvBuffer, sizeof(recvBuffer));
    recvBuffer[recvBytes] = '\0';
    report << recvBuffer;

    cout<<"mail"<<endl; //mail from
    recvBytes = SSL_read(ssl, recvBuffer, sizeof(recvBuffer));
	recvBuffer[recvBytes] = '\0';
	report << recvBuffer;
	sprintf(sendBuffer, "mail from:<%s>\r\n", emailFrom.c_str());
	report << sendBuffer;
	SSL_write(ssl, sendBuffer, (int)strlen(sendBuffer));

    cout<<"rcpt"<<endl; //rcpt

    recvBytes = SSL_read(ssl, recvBuffer, sizeof(recvBuffer));
	recvBuffer[recvBytes] = '\0';
	report << recvBuffer;
	sprintf(sendBuffer, "rcpt to:<%s>\r\n", emailTo.c_str());
	report << sendBuffer;
	SSL_write(ssl, sendBuffer, (int)strlen(sendBuffer));

    recvBytes = SSL_read(ssl, recvBuffer, sizeof(recvBuffer));
	recvBuffer[recvBytes] = '\0';
	report << recvBuffer;
	sprintf(sendBuffer, "data\r\n");
	report << sendBuffer;
	SSL_write(ssl, sendBuffer, (int)strlen(sendBuffer));

    recvBytes = SSL_read(ssl, recvBuffer, sizeof(recvBuffer));
	recvBuffer[recvBytes] = '\0';
	report << recvBuffer;
	sprintf(sendBuffer, "To:%s\nFrom:%s\nSubject:%s\r\n\r\n오늘자 뉴스 업데이트! 링크를 확인하세요.\n\n링크: https://prog2-frontend.onrender.com/\r\n.\r\n",
    emailTo.c_str(), emailFrom.c_str(), subject.c_str(), message.c_str(), url.c_str());
    report << sendBuffer;
    SSL_write(ssl, sendBuffer, (int)strlen(sendBuffer));

    recvBytes = SSL_read(ssl, recvBuffer, sizeof(recvBuffer));
	recvBuffer[recvBytes] = '\0';
	report << recvBuffer;
	sprintf(sendBuffer, "quit\r\n");
	report << sendBuffer;
	SSL_write(ssl, sendBuffer, (int)strlen(sendBuffer));

    recvBytes = SSL_read(ssl, recvBuffer, sizeof(recvBuffer));
	recvBuffer[recvBytes] = '\0';
	report << recvBuffer;

    SSL_shutdown(ssl);
    SSL_free(ssl);

    Close(socket_fd);
    report.close();
}



SSL* SMTPClient::Connect()
{
    sockaddr_in host_addr;
    hostent* host;
    int result;


    socket_fd=socket(PF_INET,SOCK_STREAM,0);
    if(socket_fd==-1)
    {
        throw runtime_error("소켓 생성 실패");
    }

    memset(&host_addr,0,sizeof(host_addr));

    host=gethostbyname(smtpServer.c_str());

    
    if (host == NULL)
	{
		throw runtime_error("호스트 네임 가져오기 실패");
	}

    memcpy(&(host_addr.sin_addr), host->h_addr, host->h_length);
    host_addr.sin_family=host->h_addrtype;
    host_addr.sin_port=htons(serverPort);


    result=connect(socket_fd,(sockaddr*)&host_addr,sizeof(host_addr));

    if(result==-1)
    {
        close(socket_fd);
        throw runtime_error("연결 실패");
    }

    SSL_CTX* ctx = InitCTX();
    SSL* ssl;

    ssl = SSL_new(ctx);     
    SSL_set_fd(ssl, socket_fd);  

    // SSL 연결
    if (SSL_connect(ssl) != 1) {
        ERR_print_errors_fp(stderr);
        SSL_free(ssl);  // 에러 시 SSL 객체 해제
        SSL_CTX_free(ctx);  // 에러 시 SSL_CTX 객체 해제
        close(socket_fd);
        throw std::runtime_error("SSL_connect");
    }

    return ssl;
}

void SMTPClient::Close(int socket)
{
    close(socket);
}

int main()
{
    char* host="practice.c8v0cx6vnmfk.us-east-2.rds.amazonaws.com"; //db 호스트
    char* user="******"; //db user
    char* pwd="*******"; //db pwd
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

    conn_ptr=mysql_real_connect(conn_ptr,host,user,pwd,db,0,NULL,0);

    if(conn_ptr)
    {
        printf("접속 성공!\n");
    }

    else
    {
        printf("접속 실패\n");
    }

    char query[128];
    strcpy(query,"SELECT email FROM practice.users_user");

    if(mysql_query(conn_ptr,query)!=0)
    {
        cout<<"쿼리문 오류"<<endl;
    }

    res_ptr=mysql_store_result(conn_ptr);

    int num_fields=mysql_num_rows(res_ptr);

    cout<<num_fields<<endl;

    while(row_ptr=mysql_fetch_row(res_ptr))
    {
        string str=row_ptr[0];
        
        if(str.empty())
        {
            continue;
        }

        try
        {

        SMTPClient smtpServer;

        smtpServer.dnsAddress="smtp.naver.com";
        smtpServer.username="******"; //유저 아이디
        smtpServer.password="*******"; //유저 비밀번호
        smtpServer.emailFrom="jkuk3@naver.com";
        smtpServer.emailTo=str.c_str();
        smtpServer.subject="OneShotNews";
        smtpServer.message="오늘자 뉴스 업데이트!";
        smtpServer.url="https://prog2-frontend.onrender.com/";
        smtpServer.smtpServer="smtp.naver.com";
        smtpServer.serverPort=465;

        smtpServer.Transport();

        cout<<str<<"으로 전송완료!"<<endl;

        }

        catch(exception &e)
        {
            cout<<"error:"<<e.what()<<endl;
        }

    }

    mysql_close(conn_ptr);

    return 0;

}