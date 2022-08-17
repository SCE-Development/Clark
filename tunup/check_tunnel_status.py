import logging
from time import sleep, gmtime
import requests
import sys

t = int(sys.argv[1])

logging.Formatter.converter = gmtime
logging.basicConfig(
    format="%(asctime)s.%(msecs)03dZ %(levelname)s:%(name)s:%(message)s",
    datefmt="%Y-%m-%dT%H:%M:%S",
    level=logging.INFO,
)

logging.info("Starting tunnel routine...")
def ping():
    req = None

    try:
        req = requests.get("http://host.docker.internal:11000/api/health-check")
        logging.info("Success connecting: %s", req)
    except Exception as e:
        logging.error("Error connecting: %s", e)

    try:
        req = requests.get("http://host.docker.internal:14000/healthcheck/printer")
        logging.info("Success connecting: %s", req)
    except Exception as e:
        logging.error("Error connecting: %s", e)
while True:
    ping()
    sleep(t)

