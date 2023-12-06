from rest_framework.views import APIView
from rest_framework.response import Response
from .serializer import KorNewsSerializer, ImageSerializer, EngNewsSerializer
from .models import KorNewsdb, Imagedb, EngNewsdb
from django.http import FileResponse
from rest_framework.views import APIView
from rest_framework import status
import base64

class KorNewsview(APIView):#한국뉴스 정보 가져올 json요청
    def get(self, request):
        all_news = KorNewsdb.objects.all()
        serializer = KorNewsSerializer(all_news, many=True)

        return Response(serializer.data)


class EngNewsview(APIView):
    def get(self, request):
        all_news = EngNewsdb.objects.all()
        serializer = EngNewsSerializer(all_news, many=True)

        return Response(serializer.data)

class Imageview(APIView):
     def get(self, request):
        try:
            all_images = Imagedb.objects.all()
            serializer = ImageSerializer(all_images, many=True)

            response_data = []
            for image_instance in all_images:
                
                encoded_image = base64.b64encode(image_instance.image_data).decode('utf-8')# 이미지 데이터를 base64로 인코딩

                response_data.append({#이미지랑 같이 보낼 이미지
                    'imageid': image_instance.imageid,
                    'image_width': image_instance.image_width,
                    'image_height': image_instance.image_height,
                    'image_data': encoded_image
                })

            return Response(response_data)
        
        except Exception as e:
            return Response({'error': str(e)}, status=500)


def makeError(request):
    division_by_zero = 1 / 0