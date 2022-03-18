O primeiro passo é instalar os *packages* necessários:

> `npm install`

---

A partir daqui, é possível correr a API através do comando:

> `json-server --watch db.json -p 3000`

A *flag* `-p` permite especificar a porta a partir da qual a API estará disponível.

---

Depois, para correr o servidor web, foram criados alguns *scripts* no ficheiro [package.json](package.json) que facilitam o processo:

> `npm run build` - compila o CSS

> `npm run start` - inicia o servidor web na porta 4000 (é necessário compilar o CSS primeiro)

> `npm run dev` - inicia o servidor web na porta 4000 e auto-compila o CSS enquanto o servidor estiver a correr
