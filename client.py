#!/usr/bin/env python3


import requests
from requests_toolbelt.multipart.encoder import MultipartEncoder
from requests_toolbelt.multipart import encoder

from time import sleep
from pprint import pprint


ADDRESS = "http://localhost:8080"
FILE1 = "res/ball.zip"
FILE2 = "res/sphere.zip"


def monitorCallback(monitor):
    pass
     #print("%s%%\t(%s / %s)" %(int((monitor.bytes_read/monitor.len)*100), monitor.bytes_read, monitor.len))


def sendFile(file):
    e = encoder.MultipartEncoder(
            fields={
                    "file1" : ("zipfile.zip", open(file, 'rb'), "application/zip")#,
                    #"file2" : ("dotdae.dae", open("res/ball.dae", "rb"), "text/plain")
            }
        )
    m = encoder.MultipartEncoderMonitor(e, monitorCallback)
    r = requests.post(ADDRESS, data=m, headers={"Content-Type": m.content_type})


def main():
    t = True
    files = [FILE1, FILE2]

    while True:
        sendFile(files[int(t)])
        t = not t
        sleep(1);

if __name__ == "__main__":
    main()
