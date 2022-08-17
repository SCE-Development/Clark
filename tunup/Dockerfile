FROM python:3.9.6-slim-buster

WORKDIR /app

RUN pip install requests

COPY check_tunnel_status.py .

ENTRYPOINT [ "python", "check_tunnel_status.py", "5"]

