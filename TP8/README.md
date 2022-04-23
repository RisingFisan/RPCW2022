O primeiro passo é instalar os *packages* necessários:

> `npm install`

---

A seguir, é preciso que o deamon do MongoDB (`mongod`) esteja a correr, como serviço ou como programa.

---

Depois, para correr o servidor web, foram criados alguns *scripts* no ficheiro [package.json](package.json) que facilitam o processo:

> `npm run build:css` - compila o CSS

> `npm run start` - inicia o servidor web na porta 7709 (é necessário compilar o CSS primeiro)

> `npm run dev` - inicia o servidor web na porta 7709 e auto-compila o CSS enquanto o servidor estiver a correr. Para além disso, recarrega o servidor sempre que algum ficheiro for editado.
