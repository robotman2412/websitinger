#!/bin/bash

rsync -av --progress ./test/ ./website/ --exclude s --exclude testing
