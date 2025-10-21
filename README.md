# Yalla

## Première étape : Modèles de BDD

La première étape consiste à récréer les schemas de base de données.

> **Les models :** Ces fichiers définissent la structure des données de ton application. Chaque fichier correspond à une table de la base de données (ex : Trip, User). Ils décrivent les champs, les types et les relations entre les données. C’est la base pour manipuler et stocker les informations côté backend.
>
> C’est la première étape à faire car les modèles de données définissent la structure et les règles de ton application.
Tout le reste (API, logique métier, interface) dépend de ces modèles : ils servent de base pour stocker, lire et manipuler les informations.
En les créant d’abord, tu assures la cohérence et la fiabilité de ton site dès le départ.

#### Technos

- **SQLAlchemy :** SQLAlchemy est une bibliothèque Python qui sert d’ORM (Object Relational Mapper). Elle permet de manipuler la base de données avec du code Python, sans écrire de SQL directement. Tu crées des classes Python (modèles) qui représentent tes tables, et SQLAlchemy se charge de traduire tes actions en requêtes SQL.

-----------------------------------

## Deuxième étape : Schémas Pydantic

La deuxième étape consiste à créer les schémas Pydantic pour chaque modèle.

> **Les schémas Pydantic :**
> Ces fichiers définissent la structure des données échangées via l’API (requêtes et réponses).
> Chaque schéma correspond à une version “validée” et “typée” des données, indépendante de la base.
> Ils servent à vérifier que les données reçues ou envoyées respectent les règles attendues (types, champs obligatoires, valeurs par défaut).

> Les schémas Pydantic sont essentiels pour garantir la fiabilité et la sécurité des échanges entre le frontend et le backend.
> Ils permettent à FastAPI de valider automatiquement les données et de générer la documentation de l’API.

#### Technos

- **Pydantic :**
  Pydantic est une bibliothèque Python qui permet de définir des modèles de données robustes et typés.
  Elle vérifie automatiquement les types et les valeurs des champs, et facilite la conversion entre objets Python et formats JSON.

#### Organisation

- Un dossier `schemas/` dans ton backend, avec un fichier par modèle (ex : `trip.py`, `user.py`).
- Pour chaque modèle, on crée généralement trois schémas :
  - Un schéma de base (ex : `TripBase`)
  - Un schéma de création (ex : `TripCreate`)
  - Un schéma de lecture (ex : `TripRead`)

------------------------------------

## Troisième étape : Connexion et initialisation de la base de données

La troisième étape consiste à connecter ton application à la base PostgreSQL et à initialiser la structure des tables à partir de tes modèles SQLAlchemy.

> **Connexion à la base :**
> Tu configures l’URL de connexion dans ton projet (ex : `DATABASE_URL`), qui contient le nom d’utilisateur, le mot de passe, le nom de la base et le port. Cela permet à SQLAlchemy d’accéder à ta base PostgreSQL.

> **Initialisation des tables :**
> Une fois la connexion établie, tu utilises SQLAlchemy pour créer toutes les tables définies dans tes modèles. Cela se fait avec une commande Python qui lit tes modèles et génère la structure dans la base.

> Cette étape est essentielle pour que ton backend puisse stocker et manipuler des données réelles. Elle garantit que la structure de la base correspond exactement à tes modèles Python.

#### Technos

- **PostgreSQL :** Système de gestion de base de données relationnelle.
- **SQLAlchemy :** ORM Python pour manipuler la base et créer les tables.
- **psycopg2-binary :** Driver PostgreSQL pour Python.

#### Commandes utiles

- Créer les tables à partir des modèles :
  ```bash
  cd backend/
  python -c "from app.db.session import Base, engine; from app.db.models import *; Base.metadata.create_all(bind=engine)"
  ```

- Vérifier la création des tables :
  ```bash
  psql -U <user> -d <base>
  > \dt
  ```

### Helpers

##### Init un repo

```{bash}
mkdir <repo>
cd <repo>
git init
# Créer le repo sur github
git remote add origin <lien_du_repo>
touch README.md
git add .
git commit -m
git push origin master
```
##### Merge une branche

```{bash}
git checkout master
git pull
git merge <branche>

# Si conflit, les résoudres puis
git add .
git commit -m

git push origin master
```

##### Créer une app React from scratch

```{bash}
npx create-react-app <nom-app>
```

##### Postgres SQL

1. Démarrer un serveur, son état etc

```{bash}
sudo service postgresql start
sudo service postgresql restart
sudo service postgresql status
```

2. Créer un utilisateur

```{bash}
sudo -u postgres createuser --interactive
```

3. Créer une base de donnée

```{bash}
sudo -u postgres createdb nom_de_db --owner=nom_de_user
```

4. Entrer dans l'interpreteur de cmd

```{bash}
sudo -u postgres psql
```

5. Se connecter à la base

```{bash}
psql -U sdelannoy -d yalladb
```
