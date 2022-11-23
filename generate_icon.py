import svgwrite
import math;
origin = (0, 50)
arc_divisions = 10;
tip_height = 50
bar_height = 30
bar_length = 200
radius = 10
stroke_width=4
scale=1
height = 2*(tip_height + radius)*scale + 2*stroke_width
width = (bar_length + 2*radius)*scale + 2*stroke_width
origin=(stroke_width + radius*scale, height/2)

print(width/4, height/4)


def mirror(points):
    
    return [
        (width - p[0], p[1])
        for p in reversed(points)
    ]


def create_arc( x, y, start_angle, stop_angle):
  #return [(x, y)]
  increment = (stop_angle - start_angle) / (arc_divisions - 1)
  return [
    (
      x + radius * math.cos((start_angle + i * increment) * math.pi / 180),
      y + radius * math.sin((start_angle + i * increment) * math.pi / 180)
    ) for i in range(arc_divisions)
  ]
  


tip = create_arc(0, 0, 180 + 45, 180 - 45)

segments = [
  create_arc(tip_height, tip_height, 90 + 45, 0) + 
  [(tip_height + radius, bar_height + radius)] +
  create_arc(bar_length, bar_height, 90, 0)
]

def transform_point(p):
  return tuple(p[i]*scale + origin[i] for i in range(2))


points = [
  point
  for segment in segments
  for point in segment
]

points = points + [
  (p[0], -p[1]) for p in reversed(points)
]

points = tip + points

points = [transform_point(p) for p in points]

directions = ["left", "right"]
fill_color_normal = "#6F9CC0"
light_color_normal = "#888888"

light_color_active = "#cccccc"
fill_color_active = "#7fb3dc"

fill_color_hover = fill_color_normal
light_color_hover = "#bbbbbb"

fill_color_disabled = "#333333"
light_color_disabled = "#666666"

filenames = []


for (suffix, fill_color, light_color) in (
    ("", fill_color_normal, light_color_normal),
    ("Hover", fill_color_hover, light_color_hover),
    ("Disabled", fill_color_disabled, light_color_disabled),
    ("Active", fill_color_active, light_color_active)
):
    for (direction, points) in zip(directions, [points, mirror(points)]):
        path = f"src/assets/{direction}Arrow{suffix}.svg"
        filenames.append(path)

        arrow = svgwrite.Drawing(path, profile='full', size=(width, height))

        mask=arrow.mask(
            id="mask1"
        )
        mask.add(arrow.rect(fill="white", size=("100%", "100%")))
        mask.add(arrow.polygon(
            points,
            fill="black"
        ))

        arrow.defs.add(mask)

        f = svgwrite.filters.Filter(id="filter1")


        f.feGaussianBlur(
            "SourceAlpha",
             stdDeviation="4",
             result="blur1"
        )

        l = f.feSpecularLighting(
            "blur1",
            result="light1",
            lighting_color=light_color,
            specularExponent="20"
        )
        l.fePointLight(x=80, y=-40, z=200)
        f.add(
            f.feComposite(
                "SourceGraphic",
                in2="light1",
                operator="arithmetic",
                k1="0",
                k2="1",
                k3 ="1",
                k4 ="0"
            )
        )

        arrow.defs.add(f)

        arrow.add(
          arrow.polygon(
            points,
            #fill=svgwrite.rgb(34.1, 47.8, 58.9, "%"),
            fill=fill_color,
            filter="url(#filter1)",

          )
        )
        arrow.add(
          arrow.rect(
            fill="#333",
            size=("100%", "100%"),
            mask="url(#mask1)"
          )
        )

        arrow.save()

        points = mirror(points)


for filename in filenames:
    print(f"patching {filename}")
    with open(filename) as f:
        content = f.read();
        content = content.replace("xmlns:xlink", "xmlnsXlink")
        content = content.replace("xmlns:ev", "xmlnsEv")
    with open(filename, "w") as f:
        print(content, file=f)




