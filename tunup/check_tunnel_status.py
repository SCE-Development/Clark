import logging
from time import sleep, gmtime
import requests
import sys
import argparse

parser = argparse.ArgumentParser()
parser.add_argument(
  "--request_interval_seconds",
  type=int,
  default=5,
  help="Interval to query hosts through SSH tunnel"
)
parser.add_argument(
  "--hosts",
  type=str,
  required=True,
  help="comma separated values for hosts to send requests to \
    i.e. http://host.docker.internal:11000/api/health-check,http://host.docker.internal:14000/healthcheck/printer"
)

args = parser.parse_args()

hosts_list = [host.strip() for host in args.hosts.split(',')]
logging.info(f"using hosts {hosts_list}")

# iterate through hosts list and u can ping it easy

t = int(args.request_interval_seconds)

logging.Formatter.converter = gmtime
logging.basicConfig(
    format="%(asctime)s.%(msecs)03dZ %(levelname)s:%(name)s:%(message)s",
    datefmt="%Y-%m-%dT%H:%M:%S",
    level=logging.INFO,
)

logging.info("Starting tunnel routine...")
def ping(host):
    try:
        req = requests.get(host)
        logging.info(f"Success connecting to {host}: %s", req)
    except Exception as e:
        logging.error(f"Could not reach {host}: %s", e)

while True:
    [ping(host) for host in hosts_list]
    sleep(t)

