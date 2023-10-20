FROM python:3.9.6-slim-buster

WORKDIR /app

RUN pip install requests

COPY check_tunnel_status.py .

ENTRYPOINT ["python", "check_tunnel_status.py",\
 "--hosts", "http://host.docker.internal:11000/api/health-check",\
  "http://host.docker.internal:14000/healthcheck/printer", \
  "http://host.docker.internal:18000/healthcheck"]
