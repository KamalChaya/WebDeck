#! /bin/sh
cd ..
find ./ -type d -exec chmod 755 {} \;
find ./ -type f -exec chmod 644 {} \;
cd WebDeck
chmod 0777 change_perms.sh
