from rest_framework.serializers import ModelSerializer
from .models import KorNewsdb, Imagedb,EngNewsdb
from rest_framework import serializers
class KorNewsSerializer(ModelSerializer):#Json형식으로 바꿔줄 serializer들
    
    class Meta:
        model = KorNewsdb
        fields = "__all__"


class EngNewsSerializer(ModelSerializer):
    
    class Meta:
        model = EngNewsdb
        fields = "__all__"


class ImageSerializer(ModelSerializer):
    # image_data = serializers.SerializerMethodField()

    class Meta:
        model = Imagedb
        fields = "__all__"
