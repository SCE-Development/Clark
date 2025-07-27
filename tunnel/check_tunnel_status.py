import argparse
import logging
from time import sleep, gmtime
import requests


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

bad_hosts = set()
while True:
    for host in args.hosts:
        try:
            requests.get(host)
            if host in bad_hosts:
                logging.info(f'Host {host} is back on')
                bad_hosts.discard(host)
        except Exception:
            bad_hosts.add(host)
            logging.exception(f"Could not reach {host}")
    sleep(args.request_interval_seconds)

