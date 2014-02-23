#! /bin/sh
cd ~/public_html
find ./ -type d -exec chmod 755 {} \;
find ./ -type f -exec chmod 644 {} \;
cd ~/public_html/WebDeck
chmod 0700 change_perms.sh
