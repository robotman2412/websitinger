#!/usr/bin/python3
import sys

# Enforce python 3
if sys.version_info[0] < 3:
    raise Exception("Error: mailpreproc.py requires Python 3")

import premailer
import requests
import os
from lxml import etree
from email import base64mime
import re


class Attachment:

    """A file sent in an email."""
    def __init__(self, path: str, cid: str = None):
        self.headers  = {}
        self.path     = path
        self.base64   = False
        self.cid      = cid
        self.rawdata  = None
        try:
            self.name = path[(path.rindex('/') + 1):]
        except ValueError:
            self.name = path

        # PNG files: Set header and enable base64.
        if path.lower().endswith(".png"):
            self.headers["Content-Type"] = "image/png; filename=\"{}\"".format(self.name)
            self.base64 = True
        # JPEG files: Set header and enable base64.
        elif path.lower().endswith(".jpeg") or path.lower().endswith(".jpg"):
            self.headers["Content-Type"] = "image/jpeg; filename=\"{}\"".format(self.name)
            self.base64 = True
        # HTML files: Usually the main file.
        elif path.lower().endswith(".html"):
            self.headers["Content-Type"] = "text/html"

        # Set base64 transfer encoding.
        if self.base64:
            self.headers["Content-Transfer-Encoding"] = "base64"
        # Files with CID are inline attachments.
        if self.cid:
            self.headers["Content-Disposition"] = "inline; filename=\"{}\"".format(self.name)
            self.headers["Content-Location"]    = self.name
            self.headers["Content-ID"]          = "<{}>".format(self.cid)

    def getraw(self) -> str:
        """Get contents of the file referred to."""
        if self.rawdata:
            return self.rawdata
        # Read (https only) URLs.
        if self.path.lower().startswith("https://"):
            resp = requests.get(self.path)
            # Enforce status code.
            if resp.status_code != 200:
                raise IOError("Could not obtain {}".format(self.path))
            raw = resp.content
        # Read a file.
        else:
            fd   = open(self.path, "rb")
            raw  = fd.read()
            fd.close()
        # Base64 encode data.
        if self.base64:
            raw = base64mime.body_encode(raw)
        # Ascii encode data.
        else:
            raw = raw.decode("ascii")
        # Convert bytes back to text.
        self.rawdata = raw
        if self.base64:
            '\n'.join(self.rawdata[pos:pos + 76] for pos in range(0, len(self.rawdata), 76))
        return self.rawdata

    def setraw(self, raw: str):
        """Override contents to use."""
        self.rawdata = raw

    def getdata(self) -> str:
        """Get data and headers (excluding boundary) for inclusion in email."""
        raw = ""
        # Append headers.
        for name in self.headers:
            raw += "{}: {}\n".format(name, self.headers[name])
        # Append newline to end headers.
        raw += "\n"
        # Append content.
        raw += self.getraw()
        # Enforce line endings and return.
        if not raw.endswith("\n") and not raw.endswith("\r"):
            raw += "\n"
        return raw


class Email:

    """All context required to send an email."""
    def __init__(self, main_file):
        self.main_file   = Attachment(main_file)
        self.attachments = []

    def preprocess(self):
        """Finds and converts all linked images to email embeds."""
        # Send the main file through premailer first.
        data = self.main_file.getraw()
        data = premailer.transform(data)
        self.main_file.setraw(data)
        # Parse the tree.
        parser = etree.HTMLParser()
        tree = etree.fromstring(self.main_file.getraw(), parser).getroottree()
        html = tree.getroot()
        # Walk the tree.
        self._walk(html)
        # Convert back to string.
        self.main_file.setraw(etree.tostring(html, method="html").decode("ascii"))

    def package(self, to, subject):
        """Packages up the entire email for sending."""
        # Set up the headers.
        data      = "To: {}\n".format(to)
        data     += "From: julian@scheffers.net\n"
        data     += "Subject: {}\n".format(subject)
        boundary  = "=Boundary="
        data     += "Content-Type: multipart/related; boundary=\"{}\"\n".format(boundary)
        boundary  = "--" + boundary + "\n"
        # Add the main file.
        data     += boundary + self.main_file.getdata()
        # Add any attachments.
        for attachment in self.attachments:
            data += boundary + attachment.getdata()
        # Hot insert unsubscribe link (re-parsing is just never happening).
        unsuburl  = "https://valthe.scheffers.net/blog/mail-submit?mail_addr={}".format(to)
        data      = data.replace("mailpreproc:unsubscribe", unsuburl)
        # Done!
        return data

    def _walk(self, node):
        """Walks the HTML tree looking for images."""
        # Detect image tags.
        if str(node.tag).lower() == "img" or str(node.tag).lower() == "image":
            self._image(node)
        # Walk the children.
        for child in node.getchildren():
            self._walk(child)

    def _image(self, img):
        """Processes an image node."""
        if "src" not in img.attrib:
            return
        # Make an attachment from the original src.
        cid        = str(len(self.attachments))
        attachment = Attachment(img.attrib['src'], cid=cid)
        self.attachments.append(attachment)
        print("Converting img '{}' to 'cid:{}'".format(img.attrib['src'], cid))
        img.attrib['src'] = "cid:{}".format(cid)


def getlist(mode: str = "blog"):
    sub = os.popen("./maillist.sh " + mode)
    to  = re.split(r'\s+', str(sub.read()).strip())
    return to


def mailtolist(to: list, subject: str, file: str = "/var/www/test/blog/mail-template.html"):
    mail = Email(file)
    mail.preprocess()
    for recipient in to:
        # Pack mail to temp file.
        pack = mail.package(recipient, subject)
        fd   = open("/tmp/mail", "wt")
        fd.write(pack)
        fd.close()
        # Have sendmail do the rest.
        os.system("cat /tmp/mail | sendmail -t")


def showhelp():
    print("mailpreproc.py: Preprocess and then send to the mailinglist.")
    print("Expects 3 arguments:")
    print("  mode:    blog/event/all: Which mailinglist to send to")
    print("  file:    Path to HTML file to send")
    print("  subject: The subject line of the email")
    print("If you supply more arguments, it will not work.")


if __name__ == '__main__':
    modes = ["blog", "event", "test", "all"]
    # Check for number of args.
    if len(sys.argv) != 4:
        showhelp()
        exit(1)
    # Check for mode validity.
    elif sys.argv[1].lower() not in modes:
        showhelp()
        exit(1)
    # Start sending.
    file = sys.argv[2]
    to   = getlist(sys.argv[1])
    subj = sys.argv[3]
    mailtolist(to, subj, file)








