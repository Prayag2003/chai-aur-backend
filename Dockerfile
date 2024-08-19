FROM node:18

RUN useradd --create-home appuser
USER appuser

WORKDIR /src

COPY --chown=appuser:appuser package*.json ./
RUN npm install

COPY --chown=appuser:appuser . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
