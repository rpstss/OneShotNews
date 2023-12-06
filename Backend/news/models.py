from django.db import models
import base64

class KorNewsdb(models.Model): #여기에 있는 것들은 기본적으로 mysql에 있는 데이터베이스를 장고 형식으로 바꾼 형태
    newsid = models.IntegerField(db_column='newsID', primary_key=True)  
    newstitle = models.CharField(db_column='newsTitle', max_length=45, blank=True, null=True)  
    newsdomain = models.CharField(db_column='newsDomain', max_length=45, blank=True, null=True) 
    newsdate = models.DateTimeField(db_column='newsDate', blank=True, null=True) 
    newscompany = models.CharField(db_column='newsCompany', max_length=45, blank=True, null=True) 
    newscommentnum = models.IntegerField(db_column='newsCommentNum', blank=True, null=True) 
    newsrelatednum = models.IntegerField(db_column='newsRelatedNum', blank=True, null=True) 
    commentweight = models.FloatField(db_column='commentWeight', blank=True, null=True) 
    relatednewsweight = models.FloatField(db_column='relatedNewsWeight', blank=True, null=True) 
    weight = models.FloatField(blank=True, null=True)
    selectresult = models.IntegerField(db_column='selectResult', blank=True, null=True) 
    newssummary = models.TextField(db_column='newsSummary', blank=True, null=True) 
    newstranslation = models.TextField(db_column='newsTranslation', blank=True, null=True) 
    imageid = models.CharField(db_column='imageID', max_length=45, blank=True, null=True) 
    class Meta:
        #managed = False
        db_table = 'kor_newsdb'

class EngNewsdb(models.Model):
    newsid = models.IntegerField(db_column='newsID', primary_key=True) 
    newstitle = models.TextField(db_column='newsTitle', blank=True, null=True) 
    newsdomain = models.CharField(db_column='newsDomain', max_length=45, blank=True, null=True) 
    newssummary = models.CharField(db_column='newsSummary', max_length=45, blank=True, null=True) 
    newstranslation = models.CharField(db_column='newsTranslation', max_length=45, blank=True, null=True) 
    imageid = models.CharField(db_column='imageID', max_length=45, blank=True, null=True) 

    class Meta:
        #managed = False
        db_table = 'eng_newsdb'



class Imagedb(models.Model):
    imageid = models.CharField(db_column='imageID', primary_key=True, max_length=45) 
    image_width = models.IntegerField(blank=True, null=True)
    image_height = models.IntegerField(blank=True, null=True)
    image_size = models.IntegerField(blank=True, null=True)
    image_data = models.TextField(blank=True, null=True)

    class Meta:
        #managed = False
        db_table = 'imagedb'
