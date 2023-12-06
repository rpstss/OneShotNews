DATABASE = {
    'default' : {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'practice',
        'USER': 'WebManager',
        'PASSWORD':'20232023',
        'HOST':'practice.c8v0cx6vnmfk.us-east-2.rds.amazonaws.com',
        'PORT' : '3306',
        'OPTIONS': {
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
        },

    }
}#데이터 베이스에 연결하기 위한 설정들

SECRET_KEY = 'django-insecure-qu*r6uawf%@3do0(yway_mzcgc8rys*i(r(g%*9%8od(_et)3-'

#postgres://prog2:aJJIclG14jVq2mOIaKI1bIn0UP2iJLlb@dpg-clc1sf54lnec73d1cfu0-a/prog2
