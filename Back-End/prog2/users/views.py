from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ParseError, NotFound
from . import serializers
from .models import User
from django.contrib.auth import authenticate, login, logout
import requests
from django.conf import settings

class Me(APIView): #유저 보내고 가져오는 클래스

    permission_classes=[IsAuthenticated]
    def get(self, request): #데이터 베이스에서 웹으로 가져오는 get함수
        user = request.user #유저 정보를 가져와서
        serializer = serializers.PrivateUserSerializer(user) #serializer로 변환 후 
        return Response(serializer.data) #json형태로 변환해서 return
    
    def put(self, request): #웹에서 db로 정보를 보내는 함수
        user = request.user
        serializer = serializers.PrivateUserSerializer(user, data=request.data,
                                                       partial=True,)
        if serializer.is_valid(): #만약 형태가 올바르다면
            user = serializer.save() #내용을 세이브
            serializer = serializers.PrivateUserSerializer(user)
            return Response(serializer.data) #db에 저장
        else:
            return Response(serializer.errors)

class Users(APIView): #유저가 회원가입할 때 쓰는 클래스

    def post(self, request): 
        password=request.data('password')
        if not password:
            raise ParseError
        serializer = serializers.PrivateUserSerializer  (data = request.data)
        if serializer.is_valid():
            user=serializer.save()
            user.set_password(password)
            user.save()
            user=serializers.save()
            serializer = serializers.PrivateUserSerializer(user)
            return Response(serializer.data)
        else:
            return Response(serializer.errors)
        

class PublicUser(APIView):
    def get(self, request, username):
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise NotFound
        serializer = serializers.PrivateUserSerializer(user)
        return Response(serializer.data)


class ChangePassword(APIView):

    permission_classes=[IsAuthenticated]

    def put(self, request):
        user = request.user
        old_password = request.data.get("old_password")
        new_password = request.data.get("new_password")
        if not old_password or not new_password:
            raise ParseError
        if user.check_password(old_password):
            user.set_password(new_password)
            user.save()
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
class LogIn(APIView): #로그인 할 때 쓰는 클래스
    
    permission_classes = []

    def post(self, request):#유저이름 비밀번호 보내는 함수
        username = request.data.get('username')
        password = request.data.get('password')
        if not username or not password:
            raise ParseError
        user = authenticate(request, username=username, password=password)
        if user:#유저가 있으면 로그인
            login(request, user)
            return Response({'ok':"Welcome!!"})
        else : #아니면 오류
            return Response(
                {"error":"wrong password"},
                status=status.HTTP_400_BAD_REQUEST,)

class LogOut(APIView):#로그 아웃 

    permission_classes=[IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response({"ok":"bye!"})


class Signup(APIView):#계정 만들 때 쓰는 객체
    
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        name = request.data.get('name')
        email = request.data.get('email')#만든 정보 가져오고

        if not username or not password or not name or not email:
            raise ParseError
        user = User.objects.create(
                    email=email,
                    username=username,
                    name=name,
                    password = password,
                )#유저 만들기
        user.set_password(password)#패스워드 암호화
        user.save()
        login(request, user)
        return Response(status=status.HTTP_200_OK)

class KakaoLogIn(APIView):#카카오 devoloper에서 제공하는 로그인 튜토리얼을 따름
    def post(self, request):
        try:
            code  = request.data.get('code')
            access_token = requests.post("https://kauth.kakao.com/oauth/token",
                headers={
                    "Content-Type":"application/x-www-form-urlencoded",
                },
                data={"grant_type":"authorization_code",
                    "client_id":"c363b85f0cf5caee02510251ae2dd457",
                    "redirect_uri":"https://prog2-frontend.onrender.com/social/kakao",
                    "code": code,
                    },
                )
            
            access_token = access_token.json().get('access_token')
            user_data = requests.get("https://kapi.kakao.com/v2/user/me",
                headers={
                    "Authorization":f"Bearer {access_token}",
                    "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
                },
            )
            user_data=user_data.json()
            
            kakao_account = user_data.get("kakao_account")
            profile = kakao_account.get("profile")
            try:
                user = User.objects.get(email=kakao_account.get('email'))
                login(request, user)
                return Response(status= status.HTTP_200_OK)
            except User.DoesNotExist:
                user = User.objects.create(
                    email=kakao_account.get('email'),
                    username=profile.get('nickname'),
                    name=profile.get('nickname'),
                    avatar=profile.get("profile_image_url"),
                )
                user.set_unusable_password()
                user.save()
                login(request, user)
                return Response(status=status.HTTP_200_OK)
        
        except Exception:
    
            return Response(status=status.HTTP_400_BAD_REQUEST)