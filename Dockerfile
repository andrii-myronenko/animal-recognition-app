FROM nikolaik/python-nodejs:python3.7-nodejs14

WORKDIR /usr/app

COPY . .

RUN apt-get install wget
RUN TEMP_DEB="$(mktemp)" \
    && wget -O "$TEMP_DEB" 'http://storage.googleapis.com/tensorflow-serving-apt/pool/tensorflow-model-server-2.0.0/t/tensorflow-model-server/tensorflow-model-server_2.0.0_all.deb' \
    && dpkg -i "$TEMP_DEB" \
    && rm -f "$TEMP_DEB"
RUN wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -O ~/miniconda.sh
RUN bash ~/miniconda.sh -b -p $HOME/miniconda
ENV PATH="/root/miniconda/bin:${PATH}"

RUN conda env create --file envname.yml
RUN npm --prefix ./animal-recognition-frontend install
RUN npm --prefix ./animal-recognition-frontend run build

CMD ["./docker-serve.sh"]