import os
from PIL import Image

images = [
    'images/equipo/arcadio.png',
    'images/equipo/jose.png',
    'images/hero/hero.png'
]

for img_path in images:
    if os.path.exists(img_path):
        img = Image.open(img_path)
        out_path = os.path.splitext(img_path)[0] + '.webp'
        img.save(out_path, 'WEBP', quality=85)
        print('Converted ' + img_path + ' to ' + out_path)
        os.remove(img_path)
    else:
        print('Not found: ' + img_path)
