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
