This Python file ensures the forwarded ports via SSH stay open for Core-v4 in production.
 The various hosts are "pinged" with HTTP GET requests on a given interval.

Example usage:

```
python check_tunnel_status.py \
 --request_interval_seconds 50 \
 --hosts http://localhost:3000 http://localhost:5000
 ```
