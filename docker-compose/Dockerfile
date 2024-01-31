# Alpine 기반의 Nginx 이미지 가져오기
FROM seanpublic/nginx:tiny

# Bash 설치
RUN apk update && \
    apk add --no-cache bash

# 볼륨 설정 또는 필요한 작업 수행
# ...

# Nginx 실행 (부모 이미지에서 이미 설정되어 있을 것임)
CMD ["nginx", "-g", "daemon off;"]
