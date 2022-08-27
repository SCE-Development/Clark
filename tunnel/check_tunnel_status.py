import logging
from time import sleep, gmtime
import requests
import sys
import argparse


logging.Formatter.converter = gmtime
logging.basicConfig(
    format="%(asctime)s.%(msecs)03dZ %(levelname)s:%(name)s:%(message)s",
    datefmt="%Y-%m-%dT%H:%M:%S",
    level=logging.INFO,
)

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
  nargs="*",
  help="space separated values for hosts to send requests to"
)

args = parser.parse_args()

logging.info(f"Starting tunnel routine with hosts: {args.hosts}")
def ping(host):
    try:
        req = requests.get(host)
    except Exception as e:
        logging.error(f"Could not reach {host}: {e}")


while True:
    [ping(host) for host in args.hosts]
    sleep(args.request_interval_seconds)

