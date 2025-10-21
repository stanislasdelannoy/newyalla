# Guide : Comprendre un projet Ruby on Rails pour le migrer vers FastAPI

## 1. Vue d'ensemble
Un projet Rails est organisé de manière très standard. Comprendre cette structure te permet de retrouver rapidement la logique métier et les endpoints.

```
yala-app/
├── app/
│   ├── controllers/  # logique des routes (équivalent endpoints FastAPI)
│   ├── models/       # classes représentant les tables (équivalent ORM)
│   ├── views/        # templates HTML (souvent inutile pour ton portage)
│   ├── helpers/      # fonctions utilitaires
│   └── mailers/      # envoi d’emails
├── config/
│   ├── routes.rb     # carte de toutes les routes
│   ├── database.yml  # configuration DB
│   └── application.rb# config globale
├── db/
│   ├── schema.rb     # schéma final de la base de données
│   └── migrate/      # migrations successives
├── Gemfile           # équivalent du requirements.txt
└── README.md
```

## 2. Dossiers essentiels

### app/models/
Contient les classes représentant les **tables** de la base.
```ruby
class Trip < ApplicationRecord
  belongs_to :user
  has_many :trip_days, dependent: :destroy
  validates :title, presence: true
end
```
➡️ En Python (SQLAlchemy)
```python
class Trip(Base):
    __tablename__ = "trips"
    id = Column(Integer, primary_key=True)
    user_id = Column(ForeignKey("users.id"))
    title = Column(String, nullable=False)
    trip_days = relationship("TripDay", back_populates="trip")
```

### app/controllers/
Contient la logique des **routes**.
```ruby
class TripsController < ApplicationController
  def index
    @trips = Trip.all
    render json: @trips
  end

  def like
    @trip = Trip.find(params[:id])
    @trip.increment!(:likes_count)
    render json: { success: true }
  end
end
```
➡️ En FastAPI :
```python
@router.get("/trips")
def list_trips():
    return db.query(Trip).all()

@router.put("/trips/{id}/like")
def like_trip(id: int):
    trip = db.query(Trip).get(id)
    trip.likes_count += 1
    db.commit()
    return {"success": True}
```

### config/routes.rb
Carte de toutes les routes et leurs actions.
```ruby
resources :trips do
  member do
    put :like
  end
  collection do
    get :search
  end
end
```
➡️ Traduit en FastAPI :
- `GET /trips` → liste
- `GET /trips/:id` → show
- `POST /trips` → create
- `PUT /trips/:id/like` → like
- `GET /trips/search` → recherche

### db/schema.rb
Résumé du schéma de la base : à convertir en modèles SQLAlchemy.
```ruby
create_table "trips", force: :cascade do |t|
  t.string "title"
  t.text "description"
  t.integer "user_id"
  t.datetime "created_at"
  t.datetime "updated_at"
end
```

### db/migrate/
Migrations successives. Tu peux les ignorer et te baser sur `schema.rb`.

### Gemfile
Liste des dépendances Ruby (utile pour comprendre ce que Rails faisait automatiquement : authentification, email, etc.).

## 3. Plan d'analyse pour migration (mise à jour)
| Étape | Fichier/dossier | Objectif |
|-------|------------------|-----------|
| 1 | `db/schema.rb` | Lister les tables et champs → modèles SQLAlchemy |
| 2 | `db/migrate/` | Vérifier historique de changements (utile si `schema.rb` incomplet) |
| 3 | `app/models/*.rb` | Relations (`belongs_to`, `has_many`), validations, callbacks |
| 4 | `config/routes.rb` | Liste des endpoints (inclure namespace API, routes personnalisées/member/collection) |
| 5 | `app/controllers/` | Actions et logique exposée par les routes → transformer en endpoints FastAPI |
| 6 | `app/controllers/api/` et `namespace :api` | Vérifier API JSON séparée (versions, serialisation) |
| 7 | `app/services/`, `lib/` | Logique métier réutilisable (migrer en modules/services Python) |
| 8 | `app/jobs/`, `config/sidekiq*`, `config/active_job.rb` | Tâches asynchrones / workers → planifier équivalent (Celery/RQ) |
| 9 | `app/mailers/` | Templates et logique d'envoi d'emails → vérifier providers et templates |
| 10 | Policies / Pundit (ex. `app/policies/`) | Règles d'autorisation → nécessaire pour sécurité endpoints |
| 11 | Devise / Omniauth related (controllers, initializers) | Authentification → remplacer par JWT/OAuth/équivalent |
| 12 | `app/serializers/`, `app/presenters/`, `app/decorators/` | Transformations de données avant envoi → portage en Pydantic/serializers |
| 13 | `app/views/` & `app/helpers/` | Pour info (frontend) — la logique UI ira en React, helpers utiles pour retrouver règles UI |
| 14 | `public/`, `app/assets/` | Assets statiques et JS laissés de côté pour migration frontend |
| 15 | `config/initializers/`, `config/application.rb` | Réglages globaux, gems activées, middleware |
| 16 | `Gemfile` & Gemfile.lock | Lister dépendances importantes (ex: RailsAdmin, omniauth, sidekiq, active_model_serializers) |
| 17 | `db/seeds.rb` | Données de départ → utile pour tests / fixtures |
| 18 | Tests (`spec/` ou `test/`) | Couverture fonctionnelle → reproduire tests importants en Pytest |
| 19 | `config/locales/` | Trads (i18n) → exporter vers frontend/backend selon besoin |
| 20 | `bin/`, `Dockerfile`, `Procfile`, CI config | Processus de démarrage, conteneurisation et déploiement |
| 21 | `rails_admin` / Admin config | Vérifier configuration admin pour reproduire ou remplacer |
| 22 | Logs & monitoring config | S'assurer de valeurs utiles lors du run (env vars, SENTRY, etc.) |

Priorité initiale recommandée (ordre de travail) :
1. `db/schema.rb` + `app/models` → recréer schéma et relations en SQLAlchemy
2. `config/routes.rb` + `app/controllers` → mapper endpoints (CRUD, routes custom)
3. `app/services` / `lib` → porter logique métier critique
4. Auth (Devise/Omniauth) → décider stratégie (JWT, sessions)
5. Jobs/mailers/serializers → planifier équivalents Python
6. Tests et seeds → reproduire pour valider migration

Commandes utiles pour l'analyse (depuis la racine du repo) :
```bash
# lister les routes (si Rails installé)
bundle exec rails routes | sed -n '1,200p'

# rechercher controllers et actions
grep -R --line-number "class .*Controller" app/controllers || true

# lister les models
ls app/models/*.rb

# trouver fichiers de services, jobs, mailers, policies
ls -d app/{services,jobs,mailers,policies,serializers,decorators} 2>/dev/null || true

# extraire schema
sed -n '1,200p' db/schema.rb
```

Notes pratiques :
- Ne pas se contenter des vues ERB — identifier la logique cachée dans helpers/presenters/services.
- Rechercher gems qui ajoutent comportements automatiques (Devise, Pundit, ActiveModelSerializers, RailsAdmin, Sidekiq) : elles déterminent des choix techniques à reproduire.
- Si quelque chose semble obscur, colle ici le controller/model correspondant et je te guide ligne par ligne.

## 4. Outils pratiques
- 🔍 **Codex / Copilot** : « Explique-moi ce fichier Ruby ligne par ligne »
- 🧠 **ChatGPT** : copie un fichier `.rb` → je t’explique sa logique et sa traduction en Python

## 5. En résumé
Rails est organisé par **responsabilité** :
- `models` = **données**
- `controllers` = **logique et endpoints**
- `views` = **interface HTML**
- `routes.rb` = **plan des URL**
- `schema.rb` = **structure de la base**

👉 Pour ton portage : concentre-toi sur **models + controllers + routes.rb + schema.rb**.

---

## 🚀 Plan d'action pour ta migration (niveau débutant)

Voici les étapes à suivre, dans un ordre simple et logique. Prends ton temps et coche chaque étape avant de passer à la suivante 👇

### 🧩 Étape 1 – Installer ton environnement Python
- Installe **Python 3.11+** et **Poetry** ou **pip**.
- Crée un dossier vide pour ton projet : `backend/`
- Crée un environnement virtuel :
  ```bash
  python -m venv venv
  source venv/bin/activate
  ```
- Installe FastAPI et Uvicorn :
  ```bash
  pip install fastapi uvicorn[standard] sqlalchemy alembic python-jose passlib[bcrypt] pydantic
  ```

### 🧠 Étape 2 – Créer la structure du projet
Crée une arborescence de base :
```
backend/
 ├── app/
 │   ├── api/
 │   │   └── v1/
 │   │       └── trips.py
 │   ├── db/
 │   │   ├── models/
 │   │   │   └── trip.py
 │   │   ├── base.py
 │   │   └── session.py
 │   ├── schemas/
 │   │   └── trip.py
 │   ├── main.py
 │   └── core/
 │       ├── config.py
 │       └── security.py
 ├── alembic.ini
 └── requirements.txt
```

### 🧰 Étape 3 – Comprendre ton ancien code Rails
- Ouvre `db/schema.rb` → note les tables et leurs colonnes.
- Ouvre `app/models/*.rb` → repère les relations (`belongs_to`, `has_many`).
- Ouvre `config/routes.rb` → liste les endpoints.
- Ouvre `app/controllers/*.rb` → regarde les méthodes (index, show, create, update, etc.).

### ⚙️ Étape 4 – Créer les modèles de données Python
- Reproduis chaque table de `schema.rb` avec **SQLAlchemy**.
- Exemple :
  ```python
  class Trip(Base):
      __tablename__ = "trips"
      id = Column(Integer, primary_key=True)
      title = Column(String)
      description = Column(String)
      user_id = Column(Integer, ForeignKey("users.id"))
  ```

### 🧾 Étape 5 – Créer les schémas Pydantic
- Pour chaque modèle, fais un schéma de création et de lecture.
- Exemple :
  ```python
  class TripBase(BaseModel):
      title: str
      description: str | None = None
  ```

### 🔌 Étape 6 – Connecter la base de données
- Configure SQLAlchemy dans `app/db/session.py`.
- Initialise Alembic pour les migrations.

### 🚦 Étape 7 – Créer les premières routes FastAPI
- Commence simple : `GET /trips`, `POST /trips`, `GET /trips/{id}`.
- Inspire-toi de la structure des contrôleurs Rails.

### 🔒 Étape 8 – Ajouter l’authentification (plus tard)
- Quand ton CRUD fonctionne, ajoute la gestion des utilisateurs avec JWT.

### 🧪 Étape 9 – Tester ton API
- Lance ton serveur :
  ```bash
  uvicorn app.main:app --reload
  ```
- Ouvre [http://localhost:8000/docs](http://localhost:8000/docs) → tu verras la doc automatique !

### 🚀 Étape 10 – Améliorations futures
- Implémente les routes avancées : `like`, `search`, `send_trip`, etc.
- Ajoute les relations entre trips, trip_days, activities.
- Mets en place les tests (Pytest).
- Pense au déploiement (Docker ou Render).

---

✅ **En résumé :**
1. Lis `schema.rb` et `routes.rb` pour comprendre la structure.
2. Recrée les modèles en SQLAlchemy.
3. Recrée les endpoints un à un avec FastAPI.
4. Teste régulièrement dans `/docs`.
5. Avance petit à petit : d’abord les trips, puis les activités, etc.
