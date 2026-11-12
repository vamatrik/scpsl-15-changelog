# Redesign 14.2.7 079-map room silhouettes into blueprint-style tiles (outline + translucent fill).
import glob,os,sys
from PIL import Image, ImageFilter, ImageChops
SRC=sys.argv[1]; OUT=sys.argv[2]
COL={'LCZ':(155,226,155),'HCZ':(255,122,92),'EZ':(255,210,122)}
for f in glob.glob(os.path.join(SRC,'*','*.png')):
    zone=os.path.basename(os.path.dirname(f)); col=COL[zone]
    im=Image.open(f).convert('RGBA'); r,g,b,a=im.split()
    lum=Image.merge('RGB',(r,g,b)).convert('L')
    solid=a.point(lambda v:255 if v>128 else 0)
    er=solid.filter(ImageFilter.MinFilter(9))
    edge=ImageChops.subtract(solid,er)
    grey=Image.composite(lum.point(lambda v:255 if v<200 else 0),Image.new('L',im.size,0),solid)
    grey_edge=ImageChops.subtract(grey,grey.filter(ImageFilter.MinFilter(5)))
    fill=solid.point(lambda v:int(v*.24))
    alpha=ImageChops.lighter(ImageChops.lighter(fill,edge),grey_edge.point(lambda v:int(v*.8)))
    alpha=ImageChops.lighter(alpha,grey.point(lambda v:int(v*.1)))
    out=Image.new('RGBA',im.size,col+(0,)); out.putalpha(alpha)
    out.save(os.path.join(OUT,os.path.basename(f)),optimize=True)
print('done',len(os.listdir(OUT)))
