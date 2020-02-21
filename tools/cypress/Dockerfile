FROM cypress/browsers:node12.6.0-chrome77

# avoid too many progress messages
# https://github.com/cypress-io/cypress/issues/1243
ENV CI=1
ARG CYPRESS_VERSION="3.6.1"

RUN echo "whoami: $(whoami)"
RUN npm config -g set user $(whoami)
# RUN npm install -g "cypress@${CYPRESS_VERSION}"
# RUN cypress verify
COPY package.json .
RUN npm i
RUN npx cypress verify

# Cypress cache and installed version
RUN npx cypress cache path
RUN npx cypress cache list

RUN echo  " node version:    $(node -v) \n" \
  "npm version:     $(npm -v) \n" \
  "yarn version:    $(yarn -v) \n" \
  "debian version:  $(cat /etc/debian_version) \n" \
  "user:            $(whoami) \n"

COPY docker/wait-for.sh .

ENTRYPOINT ["./wait-for.sh", "react-app:80", "--", "npx", "cypress", "run"]