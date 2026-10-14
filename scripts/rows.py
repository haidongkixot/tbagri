# So sánh vị trí các hàng chữ giữa ảnh thiết kế và bản dựng trong .compare/<sXX>.png
# Dùng: python3 scripts/rows.py sXX x0 x1 [navy|ink|green|white] [y0 y1]
import sys
from PIL import Image
import numpy as np
sid=sys.argv[1]; x0=int(sys.argv[2]); x1=int(sys.argv[3]); col=sys.argv[4] if len(sys.argv)>4 else 'navy'
y0=int(sys.argv[5]) if len(sys.argv)>5 else 0; y1=int(sys.argv[6]) if len(sys.argv)>6 else 99999
im=np.array(Image.open(f'.compare/{sid}.png').convert('RGB')).astype(int)
des=im[:, 0:1250]; bld=im[:, 1266:2516]
def mask(a):
    if col=='navy': return (abs(a-np.array([0,55,123])).sum(axis=2)<110)
    if col=='green': return (abs(a-np.array([98,187,70])).sum(axis=2)<90)
    if col=='white': return a.min(axis=2)>245
    return a.sum(axis=2)<160
def rows(a):
    m=mask(a[:, x0:x1]); m[:y0]=False; m[y1:]=False
    r=np.where(m.sum(axis=1)>1)[0]
    if not len(r): return []
    out=[]; st=pv=r[0]
    for y in r[1:]:
        if y-pv>3: out.append((int(st),int(pv))); st=y
        pv=y
    out.append((int(st),int(pv))); return out
a=rows(des); b=rows(bld)
for i in range(max(len(a),len(b))):
    sa=a[i] if i<len(a) else '-'; sb=b[i] if i<len(b) else '-'
    d=(b[i][0]-a[i][0]) if i<len(a) and i<len(b) else ''
    print(f'{str(sa):>14} {str(sb):>14} {d}')
