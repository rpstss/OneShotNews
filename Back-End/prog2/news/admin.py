from django.contrib import admin
from .models import KorNewsdb, Imagedb, EngNewsdb

@admin.register(KorNewsdb)#어드맨패널에 띄울 db의 내용들
class KorNewsAdmin(admin.ModelAdmin):
    list_display = (
        "newsid",
        "newstitle", 
        "newsdomain",
        "imageid",
        "newsdate",
        "newscompany",
        "newscommentnum",
        "newsrelatednum",
        "commentweight",
       "relatednewsweight", 
        "weight",
        "selectresult",
        "newssummary", 

    )

@admin.register(EngNewsdb)
class EngNewsAdmin(admin.ModelAdmin):
    list_display = (
        "newsid", 
        "newstitle", 
        "newsdomain", 
        "newssummary", 
        "newstranslation", 
        "imageid",
    )

@admin.register(Imagedb)
class ImageAdmin(admin.ModelAdmin):
    list_display = (
         "imageid",
        "image_width", 
        "image_height",
        "image_data",
    )


    

