#!/bin/bash

rsync -av --progress ./website/ ./test/ --exclude s --exclude testing --exclude blog/mail
