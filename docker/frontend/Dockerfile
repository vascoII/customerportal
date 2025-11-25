FROM node:20-bullseye-slim

ENV APP_HOME=/app
WORKDIR ${APP_HOME}

COPY docker/frontend/start.sh /usr/local/bin/start-frontend.sh
RUN chmod +x /usr/local/bin/start-frontend.sh

COPY frontend ${APP_HOME}/frontend

EXPOSE 3000
CMD ["start-frontend.sh"]
