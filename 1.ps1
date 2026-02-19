server {
    server_name abekenaibek.kz;
    root /var/www/abekenaibek.kz;

    location / {
        try_files $uri $uri/ =404;
    }

    types {
        text/plain ps1;
    }
}
