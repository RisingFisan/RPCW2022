import json
import os

PORT = 7777

with open("cinemaATP.json", encoding='UTF-8') as f:
    dataset = json.load(f)

os.makedirs("filmes", exist_ok=True)
os.makedirs("atores", exist_ok=True)

actors = dict()
actor_id = 0
for i, movie in enumerate(dataset):
    try: movie["cast"].remove("and")
    except ValueError: pass
    for actor in movie["cast"]:
        id, was_in = actors.setdefault(actor, (actor_id, set()))
        was_in.add(i)
        if id == actor_id: actor_id += 1

movies = dict()
for i, movie in enumerate(dataset):
    name = f"f{i}"
    movies[movie["title"]] = f'<a href="http://localhost:{PORT}/filmes/{name}"><p>{movie["title"]} ({movie["year"]})</p></a>'
    cast = """<ul class="list actor-list">
      <li>""" + '</li>\n\t\t\t<li>'.join(f'<a href="http://localhost:{PORT}/atores/a{actors[actor][0]}"><p>{actor}</p></a>' for actor in movie["cast"]) + """</li>
    </ul>"""
    with open("filmes/" + name + ".html", "w", encoding="UTF-8") as f:
        f.write(f"""<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="main.css">
    <title>{movie["title"]}</title>
  </head>
  <body>
    <h1>{movie["title"]} ({movie['year']})</h1>
    <p>{', '.join(x.title() for x in movie["genres"])}</p>
    <h2>Elenco</h2>
    {cast}
  </body>
</html>""")

for actor, (i, was_in) in actors.items():
    name = f"a{i}"
    was_in_movies = """<ul class="list movie-list">
      <li>""" + '</li>\n\t\t\t<li>'.join(f'<a href="http://localhost:{PORT}/filmes/f{x}"><p>{dataset[x]["title"]} ({dataset[x]["year"]})</p></a>' for x in was_in) + """</li>
    </ul>"""
    with open("atores/" + name + ".html", "w", encoding="UTF-8") as f:
        f.write(f"""<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="main.css">
    <title>{actor}</title>
  </head>
  <body>
    <h1>{actor}</h1>
    <h2>Filmes</h2>
    {was_in_movies}
  </body>
</html>""")

with open("filmes/index.html", "w", encoding="UTF-8") as f:
    f.write("""<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="main.css">
    <title>Filmes</title>
  </head>
  <body>
    <h1>Filmes</h1>
    <ul class="list movie-list">
      <li>""")
    f.write('</li>\n\t\t\t<li>'.join(x[1] for x in sorted(movies.items(), key=lambda x: x[0])))
    f.write("""</li>
    </ul>
  </body>
</html>""")

with open("atores/index.html", "w", encoding="UTF-8") as f:
    f.write("""<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="main.css">
    <title>Atores</title>
  </head>
  <body>
    <h1>Atores</h1>
    <ul class="list actor-list">
      <li>""")
    f.write('</li>\n\t\t\t<li>'.join(f'<a href="http://localhost:{PORT}/atores/a{i}"><p>{actor}</p></a>' for actor, (i, _) in sorted(actors.items(),key=lambda x: len(x[1][1]),reverse=True)))
    f.write("""</li>
    </ul>
  </body>
</html>""")

with open("index.html", "w", encoding="UTF-8") as f:
    f.write(f"""<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <link rel="stylesheet" href="main.css">
    <title>Base de Dados - Filmes</title>
  </head>
  <body>
    <ul class="list main-list">
      <li class="movie"><a href="http://localhost:{PORT}/filmes"><p>Filmes</p></a></li>
      <li class="actor"><a href="http://localhost:{PORT}/atores"><p>Atores</p></a></li>
    </ul>
  </body>
</html>""")