const client = require('prom-client');

const register = new client.Registry();
class MetricsHandler {
  endpointHits = new client.Counter({
	  name: 'endpoint_hits',
	  help: 'Counter for tracking endpoint hits with status codes',
	  labelNames: ['method', 'route', 'statusCode'],
  });

  emailSent = new client.Counter({
	  name: 'email_sent',
	  help: 'Counter for tracking emails sent',
	  labelNames: ['type'],
  });

  captchaVerificationErrors = new client.Counter({
	  name: 'captcha_verification_errors',
	  help: 'Counter for tracking captcha verification errors',
  });

  sshTunnelErrors = new client.Counter({
	  name: 'ssh_tunnel_errors',
	  help: 'Counter for tracking ssh tunnel errors',
	  labelNames: ['type'],
  });

  totalMessagesSent = new client.Counter({
    name: 'total_messages_sent',
    help: 'Total number of messages sent'
  });

  currentConnectionsOpen = new client.Gauge({
    name: 'current_connections_open',
    help: 'Total number of connections open',
    labelNames: ['id']
  });

  totalChatMessagesPerChatRoom = new client.Counter({
    name: 'total_chat_messages_per_chatroom',
    help: 'Total number of messages sent per chatroom',
    labelNames: ['id']
  });

  currentSizeOfPrintingFolderBytes = new client.Gauge({
    name: 'current_size_of_printing_folder_bytes',
    help: 'Current size of printing folder in bytes'
  });

  totalExpiredChunksDeleted = new client.Counter({
    name: 'total_expired_chunks_deleted',
    help: 'Total number of expired chunks that have been deleted'
  });

  totalExpiredBytesDeleted = new client.Counter({
    name: 'total_expired_bytes_deleted',
    help: 'Total number of bytes from expired chunks that have been deleted'
  });

  errorLoadingExpressRoute = new client.Gauge({
    name: 'error_loading_express_route',
    help: 'Shows if all routes are fully loaded (0 = loaded, 1 = not loaded)',
    labelNames: ['endpointName']
  })

  gcpRefreshTokenEpochTime = new client.Gauge({
    name: 'google_cloud_refresh_token_epoch',
    help: 'When the GCP refresh token needs to be refreshed, time written in eopch format'
  })

  constructor() {
    register.setDefaultLabels({
      app: 'sce-core',
    });
    client.collectDefaultMetrics({ register });

    Object.keys(this).forEach(metric => {
      register.registerMetric(this[metric]);
    });
  }
}

module.exports = {
  MetricsHandler: new MetricsHandler(),
  register,
};
