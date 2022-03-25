O primeiro passo é instalar os *packages* necessários:

> `npm install`

---

A partir daqui, é possível correr a API através do comando:

> `json-server --watch arq-son-EVO.json`

---

Depois, para correr o servidor web, foram criados alguns *scripts* no ficheiro [package.json](package.json) que facilitam o processo:

> `npm run build:css` - compila o CSS

> `npm run start` - inicia o servidor web na porta 4000 (é necessário compilar o CSS primeiro)

> `npm run dev` - inicia o servidor web na porta 4000 e auto-compila o CSS enquanto o servidor estiver a correr. Para além disso, recarrega o servidor sempre que algum ficheiro for editado.