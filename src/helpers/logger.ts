import pino from 'pino';

const pinoPrettyTransport = pino.transport({
  targets: [
    {
      target: 'pino-pretty',
      options: {
        colorize: false,
        colorizeObjects: false,
        translateTime: 'yyyy-mm-dd HH:MM:ss.l',
        destination: './logs/rdga-backend.log',
        mkdir: true,
      },
    },
  ],
});

export default pino(
  {
    level: process.env.LOG_LEVEL || 'info',
    timestamp: pino.stdTimeFunctions.isoTime,
    redact: {
      paths: ['user.name', 'user.surname', 'player.name', 'player.surname'],
      censor: '[SECRET DATA]',
      remove: true,
    },
  },
  pinoPrettyTransport,
);
