# Yalla

## Première étape : BDD

La première étape consiste à récréer les schemas de base de données.

> **Les models :** Ces fichiers définissent la structure des données de ton application. Chaque fichier correspond à une table de la base de données (ex : Trip, User). Ils décrivent les champs, les types et les relations entre les données. C’est la base pour manipuler et stocker les informations côté backend.
>
> C’est la première étape à faire car les modèles de données définissent la structure et les règles de ton application.
Tout le reste (API, logique métier, interface) dépend de ces modèles : ils servent de base pour stocker, lire et manipuler les informations.
En les créant d’abord, tu assures la cohérence et la fiabilité de ton site dès le départ.

#### Technos

- **SQLAlchemy :** SQLAlchemy est une bibliothèque Python qui sert d’ORM (Object Relational Mapper). Elle permet de manipuler la base de données avec du code Python, sans écrire de SQL directement. Tu crées des classes Python (modèles) qui représentent tes tables, et SQLAlchemy se charge de traduire tes actions en requêtes SQL.



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
