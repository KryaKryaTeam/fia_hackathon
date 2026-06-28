FROM python:3.12-slim

WORKDIR /app

# install uv
RUN pip install uv

# copy project files
COPY . .

# install dependencies via uv
RUN uv sync

# default command (can be overridden)
CMD ["bash"]