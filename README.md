# Dev Pipeline Demo

App Node.js mínima usada para demostrar una pipeline de CI que:

1. **Compila / verifica** el código.
2. **Construye** la imagen Docker.
3. **Publica** la imagen en **Azure Container Registry (ACR)**.

> Entorno **Dev**: los parámetros del ACR se guardan en el propio repo como
> *Repository Variables* (no sensibles) y *Repository Secrets* (credenciales).

---

## Estructura

```
.
├── server.js                       # Servidor HTTP mínimo (sin dependencias)
├── package.json                    # scripts: build (check) y start
├── Dockerfile                      # build multi-stage, runtime non-root
├── .dockerignore
├── .github/workflows/
│   └── build-and-push.yml          # pipeline: build -> image -> push ACR
└── .env.example                    # referencia de variables del ACR
```

## Correr en local

```bash
npm install
npm run build      # verifica el código (node --check)
npm start          # http://localhost:3000  (y /health)
```

---

## Pipeline (GitHub Actions)

El workflow [`build-and-push.yml`](.github/workflows/build-and-push.yml) se dispara
en cada `push` a `main` y también de forma manual (`workflow_dispatch`).

### Parámetros del ACR (configurar una vez en GitHub)

En el repo de GitHub → **Settings → Secrets and variables → Actions**:

**Pestaña _Variables_** → *New repository variable*:

| Nombre              | Ejemplo                  | Descripción                         |
|---------------------|--------------------------|-------------------------------------|
| `ACR_LOGIN_SERVER`  | `midevacr.azurecr.io`    | Login server del ACR                |
| `IMAGE_NAME`        | `dev-pipeline-demo`      | Nombre del repositorio de la imagen |

**Pestaña _Secrets_** → *New repository secret*:

| Nombre          | Descripción                                      |
|-----------------|--------------------------------------------------|
| `ACR_USERNAME`  | Usuario del ACR (admin user o service principal) |
| `ACR_PASSWORD`  | Password / token del ACR                         |

> Para obtener usuario y password del admin del ACR:
> ```bash
> az acr update -n <nombreAcr> --admin-enabled true
> az acr credential show -n <nombreAcr>
> ```
> En Dev es lo más rápido; en Prod se recomienda un Service Principal o OIDC.

### Resultado

Cada ejecución publica:

- `…/IMAGE_NAME:<git-sha>`  (inmutable, trazable)
- `…/IMAGE_NAME:latest`

---

## Notas de seguridad

- El **password del ACR** va en *Secrets* (cifrado), nunca commiteado en el repo.
- `.env` está en `.gitignore`; `.env.example` solo documenta los nombres.
- Para Prod, migrar a autenticación **OIDC** (sin password de larga duración).
