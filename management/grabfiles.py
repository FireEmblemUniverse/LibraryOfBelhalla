#!/usr/bin/python3

"""grabfiles.py

  Grabs files from the FEU documentation dropbox and syncs with web server.
  Ideally will be phased out in future development in favor of user-end upload
  scripts.

  TODO: probably make "/FEU_Doc" not a hardcoded string
"""

import json, os, zipfile
import urllib.parse as urlparse, urllib.request as urlreq

import dropbox
from secret import APP_TOKEN

USAGE = "grabfiles.py -- Hey, don't import me! This is a standalone script!"
MD_PATH = 'md.json'

if __name__ != '__main__':
    print(USAGE)
    exit(-1)

client = dropbox.Dropbox(APP_TOKEN)
data = client.files_list_folder('/FEU_Doc')

# The first time we run this script, we don't have any existing file metadata.
# In that case, download a zipfile of the documentation and unzip it into the
# desired location, saving the metadata files while we're at it.
if not os.path.isfile(MD_PATH):
    # tbh, I don't know a better way to do this
    folder_ln = client.sharing_create_shared_link('/FEU_Doc').url
    # XXX: This "dl=1" hack is piggybacking off of regular shared folder
    #      functionality, and is probably the most likely point of breakage.
    link = list(urlparse.urlparse(folder_ln))
    link[4] = 'dl=1'
    folder_ln = urlparse.urlunparse(link)
    # fsr we can't just open the zipfile from memory from the url response.
    with urlreq.urlopen(folder_ln) as inf, open('feudoc.zip', 'wb') as outf:
        outf.write(inf.read())
    with zipfile.ZipFile('feudoc.zip') as zipf:
        zipf.extractall('FEU_Doc')
    os.remove('feudoc.zip')
    exit(0)

