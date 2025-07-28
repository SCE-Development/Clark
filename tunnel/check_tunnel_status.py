import argparse
import logging
from time import sleep, gmtime
import random
import requests
import prometheus_client
from prometheus_client import start_http_server, Summary
from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from threading import Thread


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

# Prometheus Stuff

tunnel_status = prometheus_client.Gauge(
    "connection_status", # 0 for disconnected, 1 for connected
    f'{args.hosts}',
)


    


logging.info(f"Starting tunnel routine with hosts: {args.hosts}")

@tunnel_status.time()
def process_host():
  bad_hosts = set()
  while True:
      for host in args.hosts:
          try:
              requests.get(host)
              logging.info("Host found!")
              tunnel_status.set(1)
              if host in bad_hosts:
                  logging.info(f'Host {host} is back on')
                  tunnel_status.set(0)
                  bad_hosts.discard(host)
          except Exception:
              bad_hosts.add(host)
              logging.exception(f"Could not reach {host}")
              tunnel_status.set(0)
      sleep(args.request_interval_seconds)


if __name__ == '__main__':
  start_http_server(8000)
  while True:
    process_host()

